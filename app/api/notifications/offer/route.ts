/**
 * Supabase Database Webhook receiver for mb_offers INSERT events.
 * Never call from the browser. All credentials stay in Vercel Production environment variables.
 */
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Recipient = { item: string; buyer_email: string };
type OfferEvent = {
  type?: unknown;
  table?: unknown;
  schema?: unknown;
  record?: { id?: unknown } | null;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SITE_URL = "https://www.marbleborsa.com";

function secureEqual(actual: string | null, expected: string): boolean {
  if (!actual || !expected) return false;
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] || char);
}

type Config = {
  supabaseUrl: string;
  supabaseKey: string;
  resendKey: string;
  sender: string;
  webhookSecret: string;
};

function configuration(): Config | null {
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  const resendKey = process.env.RESEND_API_KEY?.trim() || "";
  const sender = process.env.RESEND_FROM_EMAIL?.trim() || "";
  const webhookSecret = process.env.OFFER_WEBHOOK_SECRET || "";
  try {
    if (!supabaseKey || !resendKey || !sender || webhookSecret.length < 32) return null;
    const url = new URL(supabaseUrl);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co")) return null;
    return { supabaseUrl: url.origin, supabaseKey, resendKey, sender, webhookSecret };
  } catch {
    return null;
  }
}

async function supabaseRequest<T>(config: Config, path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${config.supabaseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.supabaseKey,
      // New sb_secret keys use apikey alone; legacy service_role JWTs can use Bearer.
      ...(config.supabaseKey.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${config.supabaseKey}` }),
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function failStatus(error: unknown): void {
  // Do not log private offer details, buyer addresses, API keys, or the webhook body.
  console.error("Marble Borsa offer notification failed", error instanceof Error ? error.message : "Unknown error");
}

export async function POST(request: Request): Promise<Response> {
  const config = configuration();
  if (!config) return Response.json({ error: "Notification service is not configured" }, { status: 503 });
  if (!secureEqual(request.headers.get("x-marble-hook-secret"), config.webhookSecret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (Number(request.headers.get("content-length") || 0) > 64_000) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }
  let payload: OfferEvent;
  try {
    payload = await request.json() as OfferEvent;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (payload?.type !== "INSERT" || payload.schema !== "public" || payload.table !== "mb_offers") {
    return Response.json({ error: "Unexpected event" }, { status: 400 });
  }
  const id = payload.record?.id;
  if (typeof id !== "string" || !UUID.test(id)) {
    return Response.json({ error: "Invalid offer ID" }, { status: 400 });
  }

  let claimed = false;
  try {
    // SQL resolves the verified buyer email from the actual offer, not the webhook payload.
    const recipients = await supabaseRequest<Recipient[]>(config,
      "/rest/v1/rpc/mb_offer_notification_recipient", {
        method: "POST", body: JSON.stringify({ p_offer_id: id }),
      });
    const recipient = recipients[0]?.buyer_email?.trim() || "";
    if (!recipients[0] || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      return Response.json({ error: "No verified recipient for this offer" }, { status: 422 });
    }
    const item = recipients[0].item;
    claimed = await supabaseRequest<boolean>(config,
      "/rest/v1/rpc/mb_claim_offer_email_notification", {
        method: "POST", body: JSON.stringify({ p_offer_id: id }),
      });
    if (!claimed) return Response.json({ ok: true, status: "already_processing_or_sent" });

    const safeItem = escapeHtml(item.slice(0, 90));
    const profileUrl = `${SITE_URL}/tr/profil`;
    const email = {
      from: config.sender,
      to: [recipient],
      subject: "Alım talebinize yeni teklif geldi | Marble Borsa",
      html: `<!doctype html><html lang="tr"><head><meta charset="utf-8"></head><body style="margin:0;background:#f5f5f0;padding:28px;font-family:Arial,sans-serif;color:#193c31"><main style="max-width:520px;margin:auto;background:#fff;border:1px solid #e1e8e0;border-radius:14px;padding:28px"><p style="color:#54725f;letter-spacing:2px;font-size:12px;font-weight:bold">MARBLE BORSA</p><h1 style="font-size:25px;line-height:1.3">Yeni bir teklifiniz var</h1><p>Merhaba, <strong>${safeItem}</strong> alım talebinize yeni bir teklif gönderildi.</p><p>Teklifinizi güvenli şekilde incelemek için Marble Borsa hesabınıza giriş yapın.</p><p style="margin:28px 0"><a href="${profileUrl}" style="color:#fff;background:#1f4c39;text-decoration:none;padding:13px 20px;border-radius:7px;font-weight:bold">Teklifimi görüntüle</a></p><p style="font-size:12px;color:#617467">Bu bilgilendirme otomatik gönderilmiştir. Marble Borsa ürün satmaz; ticaret taraflar arasında gerçekleşir.</p></main></body></html>`,
      text: `Marble Borsa\n\n${item.slice(0, 90)} alım talebinize yeni bir teklif geldi.\n\nTeklifinizi inceleyin: ${profileUrl}\n\nBu otomatik bir bilgilendirmedir.`,
    };
    const send = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `marbleborsa-offer-${id}`,
      },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(10_000),
    });
    if (!send.ok) throw new Error(`Email service failed (${send.status})`);
    const result = await send.json() as { id?: string };
    await supabaseRequest(config, "/rest/v1/rpc/mb_finish_offer_email_notification", {
      method: "POST", body: JSON.stringify({ p_offer_id: id, p_sent: true, p_provider_id: result.id || null }),
    });
    return Response.json({ ok: true, status: "sent" });
  } catch (error) {
    failStatus(error);
    if (claimed) {
      try {
        await supabaseRequest(config, "/rest/v1/rpc/mb_finish_offer_email_notification", {
          method: "POST", body: JSON.stringify({ p_offer_id: id, p_sent: false, p_provider_id: null }),
        });
      } catch {
        console.error("Marble Borsa: notification status update failed");
      }
    }
    return Response.json({ error: "Notification delivery failed" }, { status: 502 });
  }
}

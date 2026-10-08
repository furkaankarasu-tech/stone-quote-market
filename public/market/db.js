/* The publishable Supabase client is shared with Auth. Database policies decide access. */
(() => {
  const client = () => {
    if (!window.MarbleAuth?.client) throw new Error("Supabase connection is unavailable");
    return window.MarbleAuth.client;
  };
  const checked = ({ data, error }) => {
    if (error) throw error;
    return data;
  };
  const logoPathPattern = /^[0-9a-f-]{36}\/logo-[0-9]{13}-[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp)$/;
  const catalogPathPattern = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\/(?:photo-[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp)|catalog-[0-9a-f-]{36}\.pdf)$/;
  const api = {
    client,
    logoUrl(path) {
      if (!logoPathPattern.test(String(path || ""))) return "";
      return client().storage.from("mb-company-logos").getPublicUrl(path).data.publicUrl || "";
    },
    catalogAssetUrl(path) {
      if (!catalogPathPattern.test(String(path || ""))) return "";
      return client().storage.from("mb-catalog-assets").getPublicUrl(path).data.publicUrl || "";
    },
    adImageUrl(path) {
      if (!/^[0-9a-f-]{36}\/ad-[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp)$/.test(String(path || ""))) return "";
      return client().storage.from("mb-ad-assets").getPublicUrl(path).data.publicUrl || "";
    },
    async advertisements(section) {
      return checked(await client().rpc("mb_list_advertisements", { p_section: section })) || [];
    },
    async adminAdvertisements() {
      return checked(await client().from("mb_advertisements").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }));
    },
    async saveAdvertisement(id, values) {
      const query = id ? client().from("mb_advertisements").update(values).eq("id", id) : client().from("mb_advertisements").insert(values);
      return checked(await query.select("*").single());
    },
    async uploadAdImage(file) {
      const types = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
      if (!file || !types[file.type] || file.size <= 0 || file.size > 3145728) throw new Error("PNG, JPG veya WebP görseli seçin; en fazla 3 MB.");
      const bytes = new Uint8Array(await file.slice(0,12).arrayBuffer());
      const png = bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10;
      const jpg = bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
      const webp = bytes[0]===82&&bytes[1]===73&&bytes[2]===70&&bytes[3]===70&&bytes[8]===87&&bytes[9]===69&&bytes[10]===66&&bytes[11]===80;
      if (!(file.type==="image/png"?png:file.type==="image/jpeg"?jpg:webp)) throw new Error("Görsel dosyasının içeriği geçersiz.");
      const bitmap = await createImageBitmap(file);
      const valid = bitmap.width>=100&&bitmap.height>=100&&bitmap.width*bitmap.height<=25000000;
      bitmap.close();
      if (!valid) throw new Error("Görsel en az 100 × 100 piksel ve en fazla 25 megapiksel olmalı.");
      const { data: { user }, error } = await client().auth.getUser();
      if (error || !user) throw new Error("Yönetici hesabınızla yeniden giriş yapın.");
      const path = `${user.id}/ad-${crypto.randomUUID()}.${types[file.type]}`;
      checked(await client().storage.from("mb-ad-assets").upload(path, file, { upsert:false, contentType:file.type, cacheControl:"3600" }));
      return path;
    },
    async account(user) {
      const sb = client();
      const [profile, application, admin] = await Promise.all([
        sb.from("mb_profiles").select("*").eq("user_id", user.id).single(),
        sb.from("mb_company_applications").select("*").eq("owner_id", user.id).maybeSingle(),
        sb.rpc("mb_is_admin")
      ]);
      const data = {
        profile: checked(profile),
        application: checked(application),
        admin: checked(admin),
        verification: null,
        membership: null,
        activeSupplier: false,
        activeService: false
      };
      if (data.application) {
        const [verification, membership] = await Promise.all([
          sb.from("mb_company_verifications").select("*").eq("application_id", data.application.id).maybeSingle(),
          sb.from("mb_company_memberships").select("*").eq("application_id", data.application.id).order("ends_at", { ascending: false }).limit(1).maybeSingle()
        ]);
        data.verification = checked(verification);
        data.membership = checked(membership);
        const now = Date.now();
        data.activeSupplier = data.profile.account_role === "supplier" && data.verification?.verified === true &&
          data.membership && Date.parse(data.membership.started_at) <= now && Date.parse(data.membership.ends_at) > now;
        data.activeService = data.profile.account_role === "service" && data.verification?.verified === true &&
          data.membership && Date.parse(data.membership.started_at) <= now && Date.parse(data.membership.ends_at) > now;
      }
      return data;
    },
    async requests() {
      const sb = client();
      const requests = checked(await sb.from("mb_purchase_requests").select("*").order("created_at", { ascending: false }).limit(100));
      if (!requests.length) return [];
      const offers = checked(await sb.from("mb_offers").select("*").in("request_id", requests.map(r => r.id)));
      return requests.map(r => ({ ...r, offers: offers.filter(o => o.request_id === r.id) }));
    },
    async directory() {
      const rows = checked(await client().rpc("mb_list_directory_companies"));
      if (!Array.isArray(rows)) throw new Error("Company directory response is invalid");
      return (rows || []).filter(row => ["companies", "machines", "services"].includes(row.section) &&
        typeof row.name === "string" && row.name.trim()).map(row => ({
          id: String(row.company_id || ""),
          name: row.name.trim(),
          city: String(row.city || "").trim(),
          activity_type: String(row.activity_type || ""),
          section: row.section,
          logo_url: api.logoUrl(row.logo_path)
        }));
    },
    async catalogue() {
      const rows = checked(await client().rpc("mb_list_catalog_items"));
      if (!Array.isArray(rows)) throw new Error("Company catalogue response is invalid");
      return (rows || []).filter(row => ["stone", "machine", "supplies", "service"].includes(row.category) &&
        Array.isArray(row.image_paths) && row.image_paths.length >= 3 && typeof row.title === "string")
        .map(row => ({
          id: String(row.id), company_id: String(row.company_id),
          title: row.title.trim(), category: row.category, description: String(row.description || ""),
          image_urls: row.image_paths.map(path => api.catalogAssetUrl(path)).filter(Boolean),
          pdf_url: api.catalogAssetUrl(row.pdf_path),
          video_url: /^https:\/\/[^\s]+$/.test(row.video_url || "") ? row.video_url : ""
        })).filter(row => row.image_urls.length >= 3);
    },
    async myCatalogue(ownerId) {
      return checked(await client().from("mb_catalog_items").select("*").eq("owner_id", ownerId)
        .order("created_at", {ascending: false}));
    },
    async createCatalogItem(values) {
      return checked(await client().from("mb_catalog_items").insert(values).select("id").single());
    },
    async updateCatalogItem(id, values) {
      return checked(await client().from("mb_catalog_items").update(values).eq("id", id).select("id").single());
    },
    async createRequest(values) {
      return checked(await client().from("mb_purchase_requests").insert(values).select("id").single());
    },
    async createOffer(values) {
      return checked(await client().from("mb_offers").insert(values).select("id").single());
    },
    async setRequestStatus(id, status) {
      return checked(await client().rpc("mb_set_request_status", { p_request_id: id, p_status: status }));
    },
    async acceptOffer(id) {
      return checked(await client().rpc("mb_accept_offer", { p_offer_id: id }));
    },
    async adminApplications() {
      const sb = client();
      const [apps, profiles, verifications, payments, memberships, events] = await Promise.all([
        sb.from("mb_company_applications").select("*").order("submitted_at", { ascending: false }),
        sb.from("mb_profiles").select("user_id,full_name"),
        sb.from("mb_company_verifications").select("*"),
        sb.from("mb_payment_confirmations").select("*").order("confirmed_at", { ascending: false }),
        sb.from("mb_company_memberships").select("*").order("started_at", { ascending: false }),
        sb.from("mb_review_events").select("*").order("occurred_at", { ascending: false }).limit(500)
      ]);
      return { apps: checked(apps), profiles: checked(profiles), verifications: checked(verifications),
        payments: checked(payments), memberships: checked(memberships), events: checked(events) };
    },
    async deleteCompany(id, confirmation) {
      return checked(await client().rpc("mb_admin_delete_company", {p_application_id:id,p_confirmation:confirmation}));
    },
    async deleteAdvertisement(id, confirmation) {
      return checked(await client().rpc("mb_admin_delete_advertisement", {p_ad_id:id,p_confirmation:confirmation}));
    },
    async verificationDocument(ownerId) {
      const storage = client().storage.from("mb-company-documents-private");
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(ownerId || ""))) {
        throw new Error("Firma sahibi bilgisi geçersiz. Başvuru listesini yenileyin.");
      }
      const files = checked(await storage.list(`${ownerId}/company-document`, {
        limit: 100, sortBy: { column: "updated_at", order: "desc" }
      }));
      const file = (files || []).find(f => f.id && /\.(pdf|png|jpe?g)$/i.test(f.name || "") && !/[\/\\]/.test(f.name));
      if (!file) return null;
      const result = checked(await storage.createSignedUrl(`${ownerId}/company-document/${file.name}`, 120));
      if (!result?.signedUrl) throw new Error("Belge için geçici bağlantı oluşturulamadı. Yönetici belge erişimini kontrol edin.");
      return result.signedUrl;
    },
    async verify(applicationId, verified) {
      return checked(await client().rpc("mb_set_company_verification", { p_application_id: applicationId, p_verified: verified }));
    },
    async setApplicationContacted(applicationId, contacted) {
      return checked(await client().rpc("mb_set_application_contacted", {
        p_application_id: applicationId, p_contacted: contacted
      }));
    },
    async confirmPayment(applicationId, amount, reference, receivedAt) {
      return checked(await client().rpc("mb_confirm_bank_payment", {
        p_application_id: applicationId, p_amount_try: amount, p_bank_reference: reference, p_bank_received_at: receivedAt
      }));
    },
    async activate(applicationId, paymentId) {
      return checked(await client().rpc("mb_activate_membership", { p_application_id: applicationId, p_payment_id: paymentId }));
    }
  };
  window.MarbleDB = api;
  window.MarbleAdsUtils = {
    safe(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); },
    url(value) {
      try {
        const raw = String(value || "").trim();
        if (!raw || /\s/.test(raw)) return "";
        const u = new URL(raw);
        return u.protocol === "https:" && !u.username && !u.password && /^[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?$/.test(u.hostname) && raw.length<=2000 ? u.href : "";
      } catch { return ""; }
    },
    section(path) { return ({"/":"home","/tr":"home","/tr/dogal-tas":"stone","/tr/firmalar":"companies","/tr/makine-sarf":"machine","/tr/hizmetler":"services"})[path.replace(/\/$/,"") || "/"] || null; },
    visible(row, now=Date.now()) { return Date.parse(row.starts_at)<=now && (!row.ends_at || Date.parse(row.ends_at)>now); },
    localDate(value) {
      if (!value) return "";
      const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Istanbul",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(value));
      const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
      return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
    },
    isoDate(value) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("Yayın tarihini kontrol edin.");
      const d=new Date(`${value}:00+03:00`);
      if (!Number.isFinite(d.getTime()) || this.localDate(d.toISOString())!==value) throw new Error("Yayın tarihini kontrol edin.");
      return d.toISOString();
    },
    card(row, image, lang="tr", preview=false) {
      const e=this.safe,href=this.url(row.target_url);
      if (!image || !href) return "";
      const label=({tr:"REKLAM · SPONSORLU",en:"ADVERTISEMENT · SPONSORED",zh:"广告 · 赞助",ar:"إعلان · برعاية"})[lang]||"REKLAM · SPONSORLU";
      const action=({tr:"Firmayı incele",en:"Visit company",zh:"查看企业",ar:"زيارة الشركة"})[lang]||"Firmayı incele";
      const content=`<span class="mb-ad-disclosure">${label}</span><img src="${e(image)}" alt="${e(row.company_name)}" loading="lazy" width="600" height="450"><div class="mb-ad-copy"><small>${e(row.company_name)}</small><strong>${e(row.title)}</strong>${row.description?`<p>${e(row.description)}</p>`:""}<span class="mb-ad-action">${action} ↗</span></div>`;
      return preview ? `<div class="mb-sponsored-card">${content}</div>` : `<a class="mb-sponsored-card" href="${e(href)}" target="_blank" rel="noopener noreferrer sponsored" aria-label="${e(row.company_name)}: ${e(row.title)}">${content}</a>`;
    }
  };
  window.dispatchEvent(new Event("marble-ad-ready"));

  window.MarbleDBState = { status: "signed_out", userId: null, account: null, requests: [], error: null };
  let publicSeed = null;
  try { publicSeed = JSON.parse(document.getElementById("mb-public-directory")?.textContent || "null"); } catch {}
  window.MarbleDirectoryState = publicSeed ? { status: publicSeed.status, companies: publicSeed.companies || [] } : {status:"loading", companies:[]};
  window.MarbleCatalogState = publicSeed ? { status: publicSeed.catalogStatus, items: publicSeed.items || [] } : {status:"loading", items:[]};
  let sequence = 0;
  let expirationTimer;
  let lastLoaded = 0;
  const notify = () => window.dispatchEvent(new Event("marble-db"));
  let directorySequence = 0;
  async function refreshDirectory() {
    const ticket = ++directorySequence;
    const [directory, catalogue] = await Promise.allSettled([api.directory(), api.catalogue()]);
    if (ticket !== directorySequence) return;
    if (directory.status === "fulfilled") window.MarbleDirectoryState = { status: "ready", companies: directory.value };
    else { console.error("Company directory unavailable", directory.reason);
      window.MarbleDirectoryState = { status: "error", companies: window.MarbleDirectoryState?.companies || [] }; }
    if (catalogue.status === "fulfilled") window.MarbleCatalogState = { status: "ready", items: catalogue.value };
    else { console.error("Company catalogue unavailable", catalogue.reason);
      window.MarbleCatalogState = { status: "error", items: window.MarbleCatalogState?.items || [] }; }
    notify();
  }
  api.refreshDirectory = refreshDirectory;
  if (document.getElementById("categoryCompanies")) void refreshDirectory();
  async function refresh(user = window.MarbleAuthUser) {
    const ticket = ++sequence;
    clearTimeout(expirationTimer);
    if (!user) {
      window.MarbleDBState = { status: "signed_out", userId: null, account: null, requests: [], error: null };
      notify();
      return;
    }
    window.MarbleDBState = { status: "loading", userId: user.id, account: null, requests: [], error: null };
    notify();
    try {
      const account = await api.account(user);
      const requests = account.profile.account_role === "buyer" || account.activeSupplier || account.activeService ? await api.requests() : [];
      if (ticket !== sequence || window.MarbleAuthUser?.id !== user.id) return;
      window.MarbleDBState = { status: "ready", userId: user.id, account, requests, error: null };
      lastLoaded = Date.now();
      if (account.membership && Date.parse(account.membership.ends_at) > Date.now()) {
        expirationTimer = setTimeout(() => void refresh(window.MarbleAuthUser),
          Math.min(Date.parse(account.membership.ends_at) - Date.now() + 1000, 2147483647));
      }
    } catch (error) {
      if (ticket !== sequence || window.MarbleAuthUser?.id !== user.id) return;
      window.MarbleDBState = { status: "error", userId: user.id, account: null, requests: [], error: error.message || String(error) };
    }
    notify();
  }
  api.refresh = refresh;
  if (document.getElementById("workspaceContent")) {
    window.addEventListener("marble-auth", event => {
      const requestedId=event.detail.user?.id||null;
      const current=window.MarbleDBState;
      if((current?.userId||null)===requestedId &&
        ["loading","ready","signed_out"].includes(current?.status))return;
      void refresh(event.detail.user);
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && window.MarbleAuthUser && Date.now() - lastLoaded > 30000) void refresh(window.MarbleAuthUser);
    });
    if (window.MarbleAuthUser) void refresh(window.MarbleAuthUser);
  }
})();

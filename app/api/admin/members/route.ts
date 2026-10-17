/** Admin account removal. Storage bytes are deleted via Storage API, never SQL. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class RemovalError extends Error { constructor(public code: string, public status = 400) { super(code); } }
function reply(code: string, status: number, done = false) {
  return Response.json({code, done}, {status, headers:{"Cache-Control":"no-store", "X-Content-Type-Options":"nosniff"}});
}
export async function POST(request: Request) {
  const started = Date.now();
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin) throw new RemovalError("FORBIDDEN",403);
    const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
    if (!token) throw new RemovalError("SIGN_IN_REQUIRED",401);
    const base = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || secret;
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base) || !secret || secret.startsWith("sb_publishable_") || !key) throw new RemovalError("SERVER_SETUP_REQUIRED",503);
    const body = await request.json().catch(()=>null);
    if (!body || !uuid.test(body.user_id || "") || typeof body.confirmation !== "string" || body.confirmation.length>320) throw new RemovalError("INVALID_REQUEST");
    const actorHeaders = {apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json"};
    const serviceHeaders = {apikey:secret,...(secret.startsWith("sb_secret_")?{}:{Authorization:`Bearer ${secret}`}),"Content-Type":"application/json"};
    const call = async (path:string, headers:Record<string,string>, method:string, value?:unknown):Promise<unknown> => {
      let result: Response;
      try { result = await fetch(base+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value),cache:"no-store",signal:AbortSignal.timeout(8000)}); }
      catch { throw new RemovalError("DELETION_RETRY",503); }
      const data = await result.json().catch(()=>null);
      if (!result.ok) {
        const error = data as {code?:string;message?:string}|null;
        if (["PGRST202","42883","42P01"].includes(error?.code||"")) throw new RemovalError("SQL_SETUP_REQUIRED",503);
        if (error?.code === "42501" || [401,403].includes(result.status)) throw new RemovalError("FORBIDDEN",403);
        if (error?.message?.includes("audit records")) throw new RemovalError("AUDIT_ACCOUNT",409);
        if (error?.code === "22023") throw new RemovalError("CONFIRMATION_MISMATCH",409);
        throw new RemovalError("DELETION_RETRY",503);
      }
      return data;
    };
    const actor = await call("/auth/v1/user",actorHeaders,"GET") as {id?:string;email_confirmed_at?:string};
    if (!actor?.id || !actor.email_confirmed_at) throw new RemovalError("SIGN_IN_REQUIRED",401);
    if (actor.id === body.user_id) throw new RemovalError("SELF_DELETE",403);
    if (await call("/rest/v1/rpc/mb_is_admin",actorHeaders,"POST",{}) !== true) throw new RemovalError("FORBIDDEN",403);
    const args = {p_user_id:body.user_id,p_confirmation:body.confirmation};
    const prepared = await call("/rest/v1/rpc/mb_admin_prepare_user_deletion",actorHeaders,"POST",args) as {done?:boolean};
    if (prepared?.done) return reply("DELETED",200,true);
    for (let batch=0;batch<4 && Date.now()-started<25000;batch++) {
      const files = await call("/rest/v1/rpc/mb_admin_user_deletion_files",actorHeaders,"POST",args) as {bucket_id:string;name:string}[];
      if (!Array.isArray(files)) throw new RemovalError("DELETION_RETRY",503);
      if (!files.length) {
        await call("/rest/v1/rpc/mb_admin_finish_user_deletion",actorHeaders,"POST",args);
        return reply("DELETED",200,true);
      }
      const groups = new Map<string,string[]>();
      for (const file of files) {
        if (!file || typeof file.bucket_id!=="string" || typeof file.name!=="string" || !file.name || file.name.startsWith("/") || file.name.includes("\0") || file.name.split("/").includes("..")) throw new RemovalError("DELETION_RETRY",503);
        groups.set(file.bucket_id,[...(groups.get(file.bucket_id)||[]),file.name]);
      }
      for (const [bucket,prefixes] of groups) {
        if (Date.now()-started>=35000) return reply("CONTINUE",202);
        await call(`/storage/v1/object/${encodeURIComponent(bucket)}`,serviceHeaders,"DELETE",{prefixes});
      }
    }
    return reply("CONTINUE",202);
  } catch(error) {
    return error instanceof RemovalError ? reply(error.code,error.status) : reply("DELETION_RETRY",503);
  }
}

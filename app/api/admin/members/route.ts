/** Admin account removal. Storage bytes are deleted via Storage API, never SQL. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class RemovalError extends Error { constructor(public code: string, public status = 400, public stage = "request", public upstreamCode = "") { super(code); } }
const apiRevision = 'members-shared-config-20261024';
// Every HTTP method reads and validates the exact same runtime configuration.
function serverConfiguration(){
 const raw=(process.env.SUPABASE_URL?.trim()||process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()||'');
 const secret=process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()||'';
 const fail=(reason:string):never=>{throw new RemovalError('SERVER_SETUP_REQUIRED',503,'config',reason);};
 if(!raw)fail('URL_MISSING');
 let base='';
 try{const url=new URL(raw);if(url.protocol!=='https:'||!/[a-z0-9-]+\.supabase\.co$/.test(url.hostname)||url.hostname.split('.').length!==3||url.username||url.password||url.port||url.search||url.hash||url.pathname!=='/')fail('URL_INVALID');base=url.origin;}catch(error){if(error instanceof RemovalError)throw error;fail('URL_INVALID');}
 if(!secret)fail('SERVICE_KEY_MISSING');
 if(secret.startsWith('sb_publishable_'))fail('PUBLISHABLE_KEY_USED');
 if(/\s/.test(secret))fail('SERVICE_KEY_WHITESPACE');
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()||secret;
 return {base,secret,key};
}
function reply(code: string, status: number, done = false, stage?:string, upstreamCode?:string) {
  return Response.json({code, done, revision:apiRevision, ...(stage?{stage}:{}), ...(upstreamCode?{upstreamCode}:{})}, {status, headers:{"Cache-Control":"no-store", "X-Content-Type-Options":"nosniff", "X-Marble-Api-Revision":apiRevision}});
}
export async function POST(request: Request) {
  const started = Date.now();
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin) throw new RemovalError("FORBIDDEN",403);
    const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
    if (!token) throw new RemovalError("SIGN_IN_REQUIRED",401);
    const {base,secret,key}=serverConfiguration();
    const body = await request.json().catch(()=>null);
    if (!body || !uuid.test(body.user_id || "") || typeof body.confirmation !== "string" || body.confirmation.length>320) throw new RemovalError("INVALID_REQUEST");
    const actorHeaders = {apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json"};
    const serviceHeaders = {apikey:secret,...(secret.startsWith("sb_secret_")?{}:{Authorization:`Bearer ${secret}`}),"Content-Type":"application/json"};
    const call = async (path:string, headers:Record<string,string>, method:string, value?:unknown):Promise<unknown> => {
      const stage=path.startsWith('/storage/')?'storage':path.endsWith('mb_admin_prepare_user_deletion')?'prepare':path.endsWith('mb_admin_user_deletion_files')?'files':path.endsWith('mb_admin_finish_user_deletion')?'finish':path.startsWith('/auth/')?'session':'permission';
      const timeout=stage==='finish'?20000:15000;
      let result: Response;
      try { result = await fetch(base+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value),cache:"no-store",signal:AbortSignal.timeout(timeout)}); }
      catch { throw new RemovalError("DELETION_RETRY",503,stage,"NETWORK_TIMEOUT"); }
      const data = await result.json().catch(()=>null);
      if (!result.ok) {
        const error = data as {code?:string;message?:string}|null;
        const upstreamCode=/^[A-Z0-9_]{2,32}$/.test(error?.code||'')?error!.code!:String(result.status);
        if (["PGRST202","42883","42P01","42703"].includes(upstreamCode)) throw new RemovalError("SQL_SETUP_REQUIRED",503,stage,upstreamCode);
        if (error?.message?.includes("audit records")) throw new RemovalError("AUDIT_ACCOUNT",409,stage,upstreamCode);
        if (error?.code === "22023") throw new RemovalError("CONFIRMATION_MISMATCH",409,stage,upstreamCode);
        if (stage==='storage') throw new RemovalError([401,403].includes(result.status)?"STORAGE_ACCESS_DENIED":"STORAGE_DELETE_FAILED",503,stage,upstreamCode);
        if (stage==='session'&&[401,403].includes(result.status)) throw new RemovalError("SIGN_IN_REQUIRED",401,stage,upstreamCode);
        if (error?.code === "42501" || [401,403].includes(result.status)) throw new RemovalError("FORBIDDEN",403,stage,upstreamCode);
        if (upstreamCode==='23503') throw new RemovalError(error?.message?.includes('Storage cleanup')?"STORAGE_CLEANUP_PENDING":"RELATED_RECORDS_BLOCKED",409,stage,upstreamCode);
        if (['55P03','57014','40001','40P01'].includes(upstreamCode)||[429,502,503,504].includes(result.status)) throw new RemovalError("DELETION_RETRY",503,stage,upstreamCode);
        throw new RemovalError("DATABASE_DELETE_FAILED",503,stage,upstreamCode);
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
        // Leave enough of the 60-second request budget for final transactional cleanup.
        if(Date.now()-started>=35000)return reply("CONTINUE",202);
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
    if(error instanceof RemovalError){
      console.error("Member removal failed",{code:error.code,stage:error.stage,upstreamCode:error.upstreamCode});
      return reply(error.code,error.status,false,error.stage,error.upstreamCode);
    }
    console.error("Member removal failed",{code:"DELETION_RETRY",stage:"request"});
    return reply("DELETION_RETRY",503);
  }
}

/** Company edits are authorized independently of the account removal operation. */
export async function PATCH(request:Request){
  try{
    if(request.headers.get('origin')!==new URL(request.url).origin)return reply('FORBIDDEN',403);
    const token=request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
    if(!token)return reply('SIGN_IN_REQUIRED',401);
    const {base,secret,key}=serverConfiguration();
    const actorHeaders={apikey:key,Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
    const serviceHeaders={apikey:secret,...(secret.startsWith('sb_secret_')?{}:{Authorization:`Bearer ${secret}`})};
    const call=async(path:string,init:RequestInit,headers:Record<string,string>):Promise<unknown>=>{
      const response=await fetch(base+path,{...init,headers:{...headers,...init.headers},cache:'no-store',signal:AbortSignal.timeout(15000)});
      const data=await response.json().catch(()=>null);
      if(!response.ok)throw new RemovalError(response.status===401?'SIGN_IN_REQUIRED':response.status===403?'FORBIDDEN':'COMPANY_SAVE_FAILED',response.status===401?401:response.status===403?403:503);
      return data;
    };
    const user=await call('/auth/v1/user',{method:'GET'},actorHeaders) as {id?:string;email_confirmed_at?:string};
    if(!user?.id||!user.email_confirmed_at)return reply('SIGN_IN_REQUIRED',401);
    if(await call('/rest/v1/rpc/mb_is_admin',{method:'POST',body:'{}'},actorHeaders)!==true)return reply('FORBIDDEN',403);
    if(Number(request.headers.get('content-length')||0)>2300000)return reply('INVALID_LOGO',400);
    const data=await request.formData();
    const id=String(data.get('application_id')||'');if(!uuid.test(id))return reply('INVALID_REQUEST',400);
    const rows=await call(`/rest/v1/mb_company_applications?id=eq.${id}&select=id,owner_id,company_name,account_role,company_details`,{method:'GET'},serviceHeaders) as {id:string;owner_id:string;company_name:string;account_role:string;company_details:Record<string,unknown>|null}[];
    const app=rows?.[0];if(!app||!uuid.test(app.owner_id))return reply('COMPANY_NOT_FOUND',404);
    const changes:Record<string,string>={};
    const limits:Record<string,number>={authorized_name:120,corporate_email:254,phone:40,country:80,city:80,company_address:500,website:300,tax_no:35,tax_office:90,registry_no:50};
    let name=app.company_name;
    if(data.has('company_name')){name=String(data.get('company_name')||'').trim();if(name.length<2||name.length>160)return reply('INVALID_COMPANY',400);}
    for(const [field,limit] of Object.entries(limits))if(data.has(field)){
      const value=String(data.get(field)||'').trim();if(value.length>limit||/[\u0000-\u0008]/.test(value))return reply('INVALID_COMPANY',400);changes[field]=value;
    }
    if(changes.corporate_email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.corporate_email))return reply('INVALID_COMPANY',400);
    if(changes.website){try{if(!['http:','https:'].includes(new URL(changes.website).protocol))return reply('INVALID_COMPANY',400);}catch{return reply('INVALID_COMPANY',400);}}
    if(data.has('activity_type')){
      const activity=String(data.get('activity_type')||'');
      const allowed=app.account_role==='service'?['logistics','shipping','fumigation','customs','quality','other']:['quarry','factory','quarryFactory','trader','machine','supplies'];
      if(!allowed.includes(activity))return reply('INVALID_COMPANY',400);changes.activity_type=activity;
    }
    const file=data.get('logo');
    let logo:Uint8Array|undefined;
    if(file&&typeof file!=='string'&&file.size){
      if(file.type!=='image/png'||file.size>2097152)return reply('INVALID_LOGO',400);
      logo=new Uint8Array(await file.arrayBuffer());
      if(logo.length<33||[137,80,78,71,13,10,26,10].some((byte,index)=>logo![index]!==byte)||String.fromCharCode(...logo.slice(12,16))!=='IHDR')return reply('INVALID_LOGO',400);
      const view=new DataView(logo.buffer,logo.byteOffset,logo.byteLength),w=view.getUint32(16),h=view.getUint32(20);
      if(w<100||h<100||w>4000||h>4000||w*h>16000000)return reply('INVALID_LOGO',400);
    }
    // Update only approved fields. Account roles, membership, approvals and email login are untouched.
    if(data.has('company_name')||Object.keys(changes).length)await call(`/rest/v1/mb_company_applications?id=eq.${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({company_name:name,company_details:{...(app.company_details||{}),...changes}})},serviceHeaders);
    if(logo){
      const path=`${app.owner_id}/logo-${Date.now()}-${crypto.randomUUID()}.png`;
      try{await call(`/storage/v1/object/mb-company-logos/${path}`,{method:'POST',headers:{'Content-Type':'image/png','Cache-Control':'max-age=3600','x-upsert':'false'},body:new Blob([logo as BlobPart],{type:'image/png'})},serviceHeaders);}
      catch{return reply('LOGO_SAVE_FAILED',503);}
    }
    return reply('COMPANY_SAVED',200,true);
  }catch(error){return error instanceof RemovalError?reply(error.code,error.status,false,error.stage,error.upstreamCode):reply('COMPANY_SAVE_FAILED',503);}
}


// Measurement is public; all statistics require an owner/admin session.
async function visitRpc(request: Request, write: boolean) {
  const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex','X-Marble-Api-Revision':apiRevision}});
  try {
    if(['preview','development'].includes(process.env.VERCEL_ENV||''))return json({code:'ANALYTICS_DISABLED'},503);
    const {base,secret,key}=serverConfiguration();
    const token=request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
    const actorHeaders={apikey:key,...(token?{Authorization:`Bearer ${token}`}:{})};
    const serviceHeaders={apikey:secret,...(secret.startsWith('sb_secret_')?{}:{Authorization:`Bearer ${secret}`})};
    const rpc=async(name:string,body:unknown,headers:Record<string,string>)=>{
      const res=await fetch(`${base}/rest/v1/rpc/${name}`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(12000)});
      if(!res.ok){const detail=await res.json().catch(()=>null);throw new RemovalError(detail?.code==='42501'?'FORBIDDEN':detail?.code==='22023'?'INVALID_TOTAL':'ANALYTICS_UNAVAILABLE',detail?.code==='42501'?403:detail?.code==='22023'?400:503);}
      return res.json();
    };
    if(!write){
      const id=new URL(request.url).searchParams.get('company');
      if(!token)return json({code:'SIGN_IN_REQUIRED'},401);
      if(id&&!uuid.test(id))return json({code:'INVALID_REQUEST'},400);
      const rows=await rpc('mb_my_company_visits',{},actorHeaders);
      if(id){const row=Array.isArray(rows)?rows.find((row:{id:string})=>row.id===id):null;return row?json(row):json({code:'FORBIDDEN'},403);}
      return json(rows);
    }
    if(request.headers.get('origin')!==new URL(request.url).origin)return json({code:'FORBIDDEN'},403);
    if(Number(request.headers.get('content-length')||0)>2048)return json({code:'INVALID_REQUEST'},400);
    const body=await request.json();
    if(body.action==='set_visit_total'){
      if(!token)return json({code:'SIGN_IN_REQUIRED'},401);
      if(!uuid.test(body.company||'')||(body.total!==null&&(!Number.isSafeInteger(body.total)||body.total<0||body.total>1000000000)))return json({code:'INVALID_TOTAL'},400);
      return json(await rpc('mb_admin_set_visit_total',{p_company:body.company,p_total:body.total},actorHeaders));
    }
    if(!uuid.test(body.company||'')||!uuid.test(body.visitor||'')||body.consent!==true)return json({code:'INVALID_REQUEST'},400);
    if(/bot|crawler|spider|headless|preview/i.test(request.headers.get('user-agent')||''))return json({counted:false});
    let actor:string|null=null;
    if(token){
      const res=await fetch(`${base}/auth/v1/user`,{headers:actorHeaders,cache:'no-store',signal:AbortSignal.timeout(12000)});
      if(!res.ok)return json({code:'SIGN_IN_REQUIRED'},401);
      const user=await res.json();actor=user.id||null;
      if(!actor)return json({code:'SIGN_IN_REQUIRED'},401);
    }
    // Never retain IP addresses, raw browser identifiers or visitor names.
    const {createHmac}=await import('node:crypto');
    const visitor=createHmac('sha256',secret).update(`${body.company}:${actor||body.visitor}`).digest('hex');
    return json(await rpc('mb_record_company_visit',{p_company:body.company,p_visitor:visitor,p_actor:actor},serviceHeaders));
  } catch(error) {return error instanceof RemovalError?json({code:error.code,stage:error.stage,upstreamCode:error.upstreamCode,revision:apiRevision},error.status):json({code:'ANALYTICS_UNAVAILABLE'},503);}
}
export async function GET(request:Request){return visitRpc(request,false);}
export async function PUT(request:Request){return visitRpc(request,true);}

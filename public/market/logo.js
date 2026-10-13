/* Company logos are public catalogue assets. Verification documents stay private. */
const logoCopy = {
  tr: {field:"Firma logosu",hint:"PNG, JPG veya WebP; en fazla 2 MB. Kareye yakın bir görsel önerilir.",publicInfo:"Logo dosyası herkese açık alanda saklanır; firma listesinde yayınlanması onayınıza ve rehber tercihinize bağlıdır.",
    invalid:"Firma logosu için PNG, JPG veya WebP biçiminde, en fazla 2 MB dosya seçin.",
    await:"Logo bu tarayıcıda saklandı. E-postanızı doğrulayıp aynı tarayıcıda giriş yapınca otomatik yüklenecek. Başka cihazdan giriş yaparsanız Profil'den yeniden seçin.",
    manual:"E-posta onayından sonra Profil'den logonuzu yeniden seçip yükleyin.",
    title:"Firma logosu",missing:"Logo henüz yüklenmedi.",upload:"Logoyu yükle / değiştir",saved:"Firma logosu yüklendi.",failed:"Logo yüklenemedi. Dosyayı ve depolama ayarlarını kontrol edip yeniden deneyin."},
  en: {field:"Company logo",hint:"PNG, JPG or WebP, up to 2 MB. A square image works best.",publicInfo:"The logo file is stored publicly; listing it in the directory depends on approval and your directory preference.",
    invalid:"Choose a PNG, JPG or WebP logo up to 2 MB.",
    await:"The logo is saved in this browser. After email confirmation, sign in here to upload it automatically. On another device, upload it from My account.",
    manual:"After confirming your email, select and upload the logo from My account.",
    title:"Company logo",missing:"No logo uploaded yet.",upload:"Upload / change logo",saved:"Company logo uploaded.",failed:"Could not upload the logo. Check the file and storage settings, then retry."},
  zh: {field:"企业标志",hint:"PNG、JPG 或 WebP，最大 2 MB，建议使用方形图片。",publicInfo:"标志文件存储于公共空间；企业名录展示仍取决于审核及您的名录设置。",
    invalid:"请选择不超过 2 MB 的 PNG、JPG 或 WebP 标志。",
    await:"标志已保存在本浏览器中。验证邮箱后在此登录即可自动上传；使用其他设备时，请在账户中重新上传。",
    manual:"验证邮箱后，请在账户中重新选择并上传标志。",
    title:"企业标志",missing:"尚未上传标志。",upload:"上传或更换标志",saved:"企业标志已上传。",failed:"标志上传失败，请检查文件及存储设置后重试。"},
  ar: {field:"شعار الشركة",hint:"PNG أو JPG أو WebP، بحد أقصى 2 ميغابايت. يفضل استخدام صورة مربعة.",publicInfo:"يُحفظ ملف الشعار في مساحة عامة؛ ويتوقف ظهوره في الدليل على الموافقة وإعدادات الدليل الخاصة بك.",
    invalid:"اختر شعارًا بصيغة PNG أو JPG أو WebP بحجم لا يتجاوز 2 ميغابايت.",
    await:"حُفظ الشعار في هذا المتصفح. بعد تأكيد البريد، سجل الدخول هنا لرفعه تلقائيًا. من جهاز آخر، ارفعه من حسابي.",
    manual:"بعد تأكيد البريد، اختر الشعار وارفعه من حسابي.",
    title:"شعار الشركة",missing:"لم يتم رفع الشعار بعد.",upload:"رفع الشعار أو تغييره",saved:"تم رفع شعار الشركة.",failed:"تعذر رفع الشعار. تحقق من الملف وإعدادات التخزين ثم حاول مجددًا."}
};
(() => {
  const label = () => logoCopy[state.lang] || logoCopy.tr;
  const logoName = /^logo-[0-9]{13}-[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp)$/;
  const types = {png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp"};
  let logoState = {userId:null,status:"idle",path:""};
  let syncing = false;
  const attempted = new Set();
  const valid = file => {
    const ext=file?.name?.split(".").pop()?.toLowerCase();
    return !!types[ext] && file.size > 0 && file.size <= 2097152 && file.type === types[ext];
  };
  const ownUser = user => user?.id && window.MarbleAuthUser?.id === user.id &&
    window.MarbleDBState?.status === "ready" &&
    ["supplier","service"].includes(window.MarbleDBState.account?.profile?.account_role);
  const storage = () => window.MarbleAuth.client.storage.from("mb-company-logos");

  function openPendingDb() {
    return new Promise(resolve => {
      if (typeof indexedDB === "undefined") { resolve(null); return; }
      try {
        const request=indexedDB.open("mb-company-pending-logo",1);
        request.onupgradeneeded=()=>request.result.createObjectStore("logos");
        request.onsuccess=()=>resolve(request.result);
        request.onerror=()=>resolve(null);
      } catch { resolve(null); }
    });
  }
  async function pendingOperation(userId,mode,value) {
    const db=await openPendingDb();
    if (!db) return mode==="get"?null:false;
    return new Promise(resolve => {
      try {
        const transaction=db.transaction("logos",mode==="get"?"readonly":"readwrite");
        const store=transaction.objectStore("logos");
        const request=mode==="get"?store.get(userId):mode==="put"?store.put(value,userId):store.delete(userId);
        request.onsuccess=()=>{if(mode==="get")resolve(request.result||null)};
        transaction.oncomplete=()=>{db.close();if(mode!=="get")resolve(true)};
        transaction.onerror=()=>{db.close();resolve(mode==="get"?null:false)};
      } catch { db.close(); resolve(mode==="get"?null:false); }
    });
  }
  async function stage(userId,file) {
    if(!/^[0-9a-f-]{36}$/i.test(String(userId))||!valid(file))return false;
    return pendingOperation(userId,"put",{blob:file,name:file.name,type:file.type,createdAt:Date.now()});
  }
  async function refresh(user,force=false) {
    if(!ownUser(user)||(!force&&logoState.userId===user.id&&logoState.status!=="idle"))return;
    logoState={userId:user.id,status:"loading",path:""};
    try {
      const {data,error}=await storage().list(user.id,{limit:100,sortBy:{column:"created_at",order:"desc"}});
      if(error)throw error;
      if(window.MarbleAuthUser?.id!==user.id)return;
      const file=(data||[]).find(item=>logoName.test(item.name));
      logoState={userId:user.id,status:"ready",path:file?`${user.id}/${file.name}`:""};
    } catch(error) {
      console.error("Company logo lookup failed",error);
      if(window.MarbleAuthUser?.id!==user.id)return;
      logoState={userId:user.id,status:"error",path:""};
    }
    window.MarbleUIRefresh?.();
  }
  async function upload(file,user) {
    if(!ownUser(user)||!valid(file))throw Error("Invalid logo upload");
    const ext=file.name.split(".").pop().toLowerCase();
    const path=`${user.id}/logo-${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const previous=logoState.userId===user.id?logoState.path:"";
    const {error}=await storage().upload(path,file,{contentType:file.type,cacheControl:"3600",upsert:false});
    if(error)throw error;
    if(previous&&previous!==path){
      const removed=await storage().remove([previous]);
      if(removed.error)console.warn("Previous company logo cleanup failed",removed.error);
    }
    await refresh(user,true);
    await window.MarbleDB?.refreshDirectory?.();
  }
  async function syncPending(user) {
    if(!ownUser(user)||syncing||attempted.has(user.id))return;
    attempted.add(user.id);
    syncing=true;
    try {
      const pending=await pendingOperation(user.id,"get");
      if(!pending)return;
      if(Date.now()-pending.createdAt>30*24*60*60*1000){await pendingOperation(user.id,"delete");return}
      const file=new File([pending.blob],pending.name,{type:pending.type});
      await upload(file,user);
      await pendingOperation(user.id,"delete");
      toast(label().saved);
    } catch(error) {
      console.error("Pending company logo upload failed",error);
    } finally { syncing=false; }
  }
  function card(user) {
    const name=window.MarbleDBState?.account?.application?.company_name||"MB";
    const path=logoState.userId===user.id?logoState.path:"";
    const url=path?window.MarbleDB?.logoUrl(path):"";
    return `<div class="workspace-card"><strong>${label().title}</strong><div class="workspace-logo-preview">${url?`<img class="company-logo" src="${safe(url)}" alt="${safe(name)} logo">`:`<span class="company-logo-fallback" aria-hidden="true">${safe(name.trim().split(/\s+/).slice(0,2).map(word=>word[0]||"").join("").toUpperCase())}</span>`}</div><p>${path?label().saved:label().missing}</p><form id="companyLogoForm"><label class="field">${label().field}<input name="companyLogo" type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" required><small class="signup-help">${label().hint} ${label().publicInfo}</small></label><p class="form-error" id="companyLogoError" role="alert"></p><button type="submit" class="button dark">${label().upload}</button></form></div>`;
  }
  document.addEventListener("submit",async event=>{
    if(event.target.id!=="companyLogoForm")return;
    event.preventDefault();
    const form=event.target,button=form.querySelector('button[type="submit"]'),box=document.getElementById("companyLogoError");
    const file=new FormData(form).get("companyLogo");
    if(!valid(file)){box.textContent=label().invalid;return}
    button.disabled=true;box.textContent="";
    try {
      await upload(file,window.MarbleAuthUser);
      toast(label().saved);
    } catch(error) {
      console.error("Company logo upload failed",error);
      if(button.isConnected)box.textContent=label().failed;
    } finally {if(button.isConnected)button.disabled=false}
  });
  window.addEventListener("marble-db",()=>{
    const user=window.MarbleAuthUser;
    if(!ownUser(user))return;
    void refresh(user);
    void syncPending(user);
  });
  window.MarbleLogo={valid,stage,refresh,card,copy:label};
  if(ownUser(window.MarbleAuthUser)){
    void refresh(window.MarbleAuthUser);
    void syncPending(window.MarbleAuthUser);
  }
})();

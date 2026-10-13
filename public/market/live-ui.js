/* Member requests and offers use Supabase rows. */
function liveCopy(){
  const text={
    tr:{workspace:"Taleplerinizi, tekliflerinizi ve hesabınızı tek yerden yönetin.",realNote:"Bu işlem kayıtlı hesabınız üzerinden yapılır.",requestSaved:"Talep kaydedildi.",offerSaved:"Teklif kaydedildi.",error:"İşlem tamamlanamadı.",minTwo:"Ürün ve teslim yeri en az 2 karakter olmalı.",invalidField:"Bilgileri kontrol edin: ürün ve teslim yeri en az 2 karakter olmalı.",setupMissing:"Talep servisi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.",permission:"Bu hesapla işlem yapılamıyor. E-posta onayınızı ve hesap türünüzü kontrol edin.",emptyBuyer:"Henüz talebiniz yok. Bir ürün seçip teklif isteyin.",emptySupplier:"Görüntülenebilir açık talep bulunmuyor.",pending:"Firma ve üyelik onayı sonrası alım talepleriniz açılır.",service:"Hizmetler bölümünden hizmet talebi açabilirsiniz. Gerçek talepleriniz burada görünür.",footer:"Onaylı firmaların katalogları herkese açıktır. Talepler ve teklifler hesaplarda saklanır; ticaret doğrudan taraflar arasındadır.",offers:"Gelen teklifler",ownOffer:"Firmanızın teklifi",accepted:"Kabul edildi"},
    en:{workspace:"Manage your requests, offers and account in one place.",realNote:"This action is saved under your account.",requestSaved:"Request saved.",offerSaved:"Offer saved.",error:"The action could not be completed.",minTwo:"Product and destination must each have at least 2 characters.",invalidField:"Check the fields: product and destination must have at least 2 characters.",setupMissing:"The request database has not been installed. Contact the administrator.",permission:"This account cannot perform the action. Check your email confirmation and account type.",emptyBuyer:"No requests yet. Choose a product and request a quote.",emptySupplier:"There are no open requests available.",pending:"Requests open after company and membership approval.",service:"Request services from the Services section. Your real requests appear here.",footer:"Approved companies publish public catalogues. Account requests and offers are stored; companies transact directly.",offers:"Received offers",ownOffer:"Your company's offer",accepted:"Accepted"},
    zh:{workspace:"在这里集中管理需求、报价和账户。",realNote:"此操作将保存在您的账户中。",requestSaved:"需求已保存。",offerSaved:"报价已保存。",error:"操作未完成。",minTwo:"产品和交付地点至少需要2个字符。",invalidField:"请检查产品和交付地点，至少需要2个字符。",setupMissing:"采购需求数据库尚未安装，请联系管理员。",permission:"此账户无法操作，请检查邮箱验证和账户类型。",emptyBuyer:"暂无需求。选择产品并提交询价。",emptySupplier:"暂无可查看的开放需求。",pending:"企业与会员审核通过后可查看需求。",service:"可在服务区发布服务需求；您的需求会显示在这里。",footer:"获批企业发布的目录对公众开放。账户中的询价与报价会保存，交易由双方直接进行。",offers:"收到的报价",ownOffer:"企业报价",accepted:"已接受"},
    ar:{workspace:"أدر طلباتك وعروضك وحسابك من مكان واحد.",realNote:"يُحفظ هذا الإجراء في حسابك.",requestSaved:"تم حفظ الطلب.",offerSaved:"تم حفظ العرض.",error:"تعذر إتمام العملية.",minTwo:"يجب أن يتكون المنتج ومكان التسليم من حرفين على الأقل.",invalidField:"تحقق من المنتج ومكان التسليم؛ يلزم حرفان على الأقل.",setupMissing:"قاعدة بيانات الطلبات غير مُثبتة بعد. تواصل مع المسؤول.",permission:"لا يمكن لهذا الحساب تنفيذ العملية. تحقق من تأكيد البريد ونوع الحساب.",emptyBuyer:"لا توجد طلبات بعد. اختر منتجًا واطلب عرضًا.",emptySupplier:"لا توجد طلبات مفتوحة متاحة.",pending:"تفتح الطلبات بعد الموافقة على الشركة والعضوية.",service:"يمكنك طلب الخدمات من قسم الخدمات، وتظهر طلباتك هنا.",footer:"تنشر الشركات المعتمدة كتالوجاتها للعامة. تُحفظ الطلبات والعروض في الحسابات، ويتم التعامل مباشرة بين الأطراف.",offers:"العروض المستلمة",ownOffer:"عرض شركتك",accepted:"مقبول"}
  };
  return text[state.lang]||text.tr;
}

function requestLifecycleCopy(){
  return ({
    tr:{open:"Açık",closed:"Kapalı",close:"Talebi kapat",reopen:"Yeniden aç",confirm:"Talebi kapatmak istiyor musunuz?",info:"Yeni teklif alımı durur. Mevcut teklifler ve kayıtlar korunur; talebinizi yeniden açabilirsiniz.",saved:"Talep durumu güncellendi.",missing:"Talep yönetimi henüz etkin değil. Lütfen site yöneticisiyle iletişime geçin."},
    en:{open:"Open",closed:"Closed",close:"Close request",reopen:"Reopen request",confirm:"Close this request?",info:"New offers stop. Existing offers and records are preserved; you can reopen the request.",saved:"Request status updated.",missing:"Request management is not enabled yet. Please contact the site administrator."},
    zh:{open:"开放",closed:"已关闭",close:"关闭需求",reopen:"重新开放",confirm:"关闭此需求？",info:"停止接收新报价。现有记录保留，您可重新开放需求。",saved:"需求状态已更新。",missing:"需求管理尚未启用，请联系网站管理员。"},
    ar:{open:"مفتوح",closed:"مغلق",close:"إغلاق الطلب",reopen:"إعادة فتح الطلب",confirm:"إغلاق هذا الطلب؟",info:"يتوقف استقبال العروض الجديدة. تُحفظ السجلات ويمكن إعادة فتح الطلب.",saved:"تم تحديث حالة الطلب.",missing:"إدارة الطلبات غير مفعلة بعد. تواصل مع مسؤول الموقع."}
  })[state.lang]||({open:"Open",closed:"Closed",close:"Close request",reopen:"Reopen request",confirm:"Close this request?",info:"Records are preserved.",saved:"Request status updated.",missing:"Request management is not enabled yet."});
}

function renderRealWorkspace(){
  const box=document.getElementById("realRequests"),snapshot=window.MarbleDBState;
  if(!box||snapshot?.status!=="ready")return;
  const account=snapshot.account,role=account.profile.account_role;
  if(role==="supplier"&&!account.activeSupplier){box.innerHTML=`<div class="profile-request-empty"><p>${liveCopy().pending}</p></div>`;return}
  if(role==="service"&&!account.activeService){box.innerHTML=`<div class="profile-request-empty"><p>${liveCopy().pending}</p></div>`;return}
  const userId=window.MarbleAuthUser?.id;
  const requests=(snapshot.requests||[]).filter(r=>r.buyer_id===userId||
    r.offers.some(offer=>offer.supplier_id===userId));
  box.innerHTML=requests.length?requests.map(r=>{
    const owner=r.buyer_id===userId;
    const offerState=owner?(r.offers.length?`${r.offers.length} ${liveCopy().offers}`:tr("noOffer")):liveCopy().ownOffer;
    return `<div class="live-request-row"><strong>${safe(r.item)}</strong><p class="minor">${safe(r.quantity)} ${safe(r.unit)} · ${safe(r.destination)} · ${safe(offerState)} · ${safe(requestLifecycleCopy()[r.status==="closed"?"closed":"open"])}</p><button type="button" class="button outline" data-live-request="${safe(r.id)}">${tr("view")} →</button></div>`;
  }).join(""):`<div class="profile-request-empty"><p>${role==="buyer"?liveCopy().emptyBuyer:role==="service"?liveCopy().emptySupplier:liveCopy().service}</p><a href="/tr/${role==="supplier"?"hizmetler":role==="service"?"makine-sarf":"dogal-tas"}">${tr("nav")[role==="supplier"?3:role==="service"?2:0]} ↗</a></div>`;
}

function realRequestDetail(id){
  const r=liveRequest(id),account=realAccount();
  if(!r||!account)return;
  const owner=r.buyer_id===window.MarbleAuthUser?.id,provider=canOfferOnRequest(r);
  if(!owner&&!provider)return;
  const lifecycle=requestLifecycleCopy();
  const labels=offerActionCopy[state.lang];
  const offerRows=r.offers.length?r.offers.map(o=>`<div class="response"><span>${owner?liveCopy().offers:liveCopy().ownOffer}</span><strong>${safe(o.unit_price)} ${safe(o.currency)} / ${safe(r.unit)}</strong><p>${safe(o.notes)}</p>${o.accepted_at?`<span class="offer-accepted">${liveCopy().accepted}</span>`:""}${owner?`<div class="offer-action-buttons">${o.accepted_at||r.status!=="open"?"":`<button type="button" class="button dark" data-accept-live="${safe(r.id)}" data-offer-id="${safe(o.id)}">${labels.accept}</button>`}<button type="button" class="button outline" data-contact-live="${safe(r.id)}" data-offer-id="${safe(o.id)}">${labels.contact}</button></div>`:""}</div>`).join(""):`<p class="modal-note">${tr("noOffer")}</p>`;
  const format=r.format==="service"?serviceCopy().title:(equipmentCopy[state.lang]||equipmentCopy.tr)[r.format]||f(r.format);
  modal(tr("requestDetail"),safe(r.item),`<div class="detail-list"><span>${tr("quantity")}: <b>${safe(r.quantity)} ${safe(r.unit)}</b></span><span>${tr("format")}: <b>${safe(format)}</b></span><span>${tr("destination")}: <b>${safe(r.destination)}</b></span><span>${safe(lifecycle[r.status==="closed"?"closed":"open"])}</span><span>ID: <b>${safe(r.id)}</b></span></div><p class="detail-copy">${safe(r.notes)}</p>${offerRows}<div class="modal-actions"><button type="button" class="button outline" data-close>${tr("close")}</button>${owner?`<button type="button" class="button outline" data-request-status="${safe(r.id)}" data-status="${r.status==="closed"?"open":"closed"}">${r.status==="closed"?lifecycle.reopen:lifecycle.close}</button>`:""}${provider&&!r.offers.length?`<button type="button" class="button dark" data-offer="${safe(r.id)}">${tr("sendOffer")}</button>`:""}</div>`);
}

document.addEventListener("click",async event=>{
  let button=event.target.closest("[data-request-status]");
  if(button){
    const r=liveRequest(button.dataset.requestStatus),labels=requestLifecycleCopy();
    if(!r||r.buyer_id!==window.MarbleAuthUser?.id)return;
    const next=button.dataset.status;
    if(next==="closed"){
      modal(tr("requestDetail"),labels.confirm,`<p class="detail-copy">${safe(labels.info)}</p><div class="modal-actions"><button type="button" class="button outline" data-back-request="${safe(r.id)}">${tr("cancel")}</button><button type="button" class="button dark" data-save-request-status="${safe(r.id)}" data-status="closed">${labels.close}</button></div>`);
    }else await saveRequestStatus(button,r.id,"open");
    return;
  }
  button=event.target.closest("[data-save-request-status]");
  if(button){await saveRequestStatus(button,button.dataset.saveRequestStatus,button.dataset.status);return}
  button=event.target.closest("[data-live-request]");
  if(button){realRequestDetail(button.dataset.liveRequest);return}
  button=event.target.closest("[data-contact-live]");
  if(button){showOfferDraft(button.dataset.contactLive,false,button.dataset.offerId);return}
  button=event.target.closest("[data-accept-live]");
  if(!button)return;
  button.disabled=true;
  const requestId=button.dataset.acceptLive,offerId=button.dataset.offerId;
  try{
    await window.MarbleDB.acceptOffer(offerId);
    await window.MarbleDB.refresh();
    showOfferDraft(requestId,true,offerId);
    toast(offerActionCopy[state.lang].savedDraft);
  }catch(error){console.error(error);toast(liveCopy().error)}
  finally{if(button.isConnected)button.disabled=false}
});

async function saveRequestStatus(button,id,status){
  const r=liveRequest(id);
  if(!r||r.buyer_id!==window.MarbleAuthUser?.id||!["open","closed"].includes(status))return;
  button.disabled=true;
  try{
    await window.MarbleDB.setRequestStatus(id,status);
    await window.MarbleDB.refresh();
    realRequestDetail(id);
    toast(requestLifecycleCopy().saved);
  }catch(error){
    toast(error?.code==="PGRST202"?requestLifecycleCopy().missing:liveCopy().error);
  }finally{if(button.isConnected)button.disabled=false}
}

/* Public advertisements never expose draft campaigns or admin data. */
(() => {
  const slot=document.getElementById("mb-ad-slot");
  if(!slot)return;
  const slots={sidebar:slot,top:document.getElementById("mb-ad-top"),bottom:document.getElementById("mb-ad-bottom")};
  let cache=new Map(),generation=0,expiryTimer,refreshTimer;
  const lang=()=>document.documentElement.lang?.split("-")[0]||"tr";
  const utils=()=>window.MarbleAdsUtils;
  function hide(){clearTimeout(expiryTimer);Object.values(slots).filter(Boolean).forEach(node=>{node.hidden=true;node.innerHTML=""});}
  function display(rows){
    clearTimeout(expiryTimer);
    const u=utils();
    const visible=rows.filter(row=>u.visible(row));
    Object.entries(slots).forEach(([position,node])=>{
      if(!node)return;
      const selected=visible.filter(row=>(row.placement||"sidebar")===position).slice(0,position==="top"?1:3);
      node.innerHTML=selected.map(row=>u.card(row,window.MarbleDB.adImageUrl(row.image_path),lang())).join("");
      node.hidden=!node.innerHTML;
    });
    slot.setAttribute("aria-label",({tr:"Sponsorlu içerik",en:"Sponsored content",zh:"赞助内容",ar:"محتوى برعاية"})[lang()]||"Sponsorlu içerik");
    const deadlines=visible.map(row=>Date.parse(row.ends_at)).filter(Number.isFinite);
    if(deadlines.length)expiryTimer=setTimeout(()=>{display(rows);void refresh(true)},Math.min(2147483647,Math.max(1,Math.min(...deadlines)-Date.now()+30)));
  }
  async function refresh(force=false){
    if(!utils()||!window.MarbleDB?.advertisements)return;
    const section=utils().section(location.pathname);
    if(!section){generation++;hide();return}
    const previous=cache.get(section);
    if(!force&&previous&&Date.now()-previous.at<60000){display(previous.rows);return}
    if(previous?.pending&&!force)return;
    const ticket=++generation;
    if(previous?.rows)display(previous.rows);else hide();cache.set(section,{pending:true});
    try{
      const rows=await window.MarbleDB.advertisements(section);
      cache.set(section,{rows,at:Date.now()});
      if(ticket===generation&&utils().section(location.pathname)===section)display(rows);
    }catch{cache.delete(section);if(ticket===generation)hide()}
  }
  window.MarbleAds={refresh};
  window.addEventListener("marble-ad-ready",()=>void refresh());
  window.addEventListener("marble-navigation",()=>void refresh());
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)void refresh()});
  // Poll only while the public page is visible, so newly started campaigns appear.
  refreshTimer=setInterval(()=>{if(!document.hidden)void refresh(true)},60000);
  window.addEventListener("pagehide",()=>{clearTimeout(expiryTimer);clearInterval(refreshTimer)});
  void refresh();
})();

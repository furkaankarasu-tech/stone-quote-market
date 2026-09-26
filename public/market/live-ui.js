/* Member requests and offers use Supabase rows. */
function liveCopy(){
  const text={
    tr:{workspace:"Gerçek talepleriniz ve teklifleriniz bu alanda görünür.",realNote:"Bu işlem kayıtlı hesabınız üzerinden yapılır.",requestSaved:"Talep kaydedildi.",offerSaved:"Teklif kaydedildi.",error:"İşlem tamamlanamadı.",minTwo:"Ürün ve teslim yeri en az 2 karakter olmalı.",invalidField:"Bilgileri kontrol edin: ürün ve teslim yeri en az 2 karakter olmalı.",setupMissing:"Talep veritabanı henüz kurulmamış. Yöneticiyle iletişime geçin.",permission:"Bu hesapla işlem yapılamıyor. E-posta onayınızı ve hesap türünüzü kontrol edin.",emptyBuyer:"Henüz talebiniz yok. Bir ürün seçip teklif isteyin.",emptySupplier:"Görüntülenebilir açık talep bulunmuyor.",pending:"Firma ve ödeme onayı sonrası alım talepleriniz açılır.",service:"Firma rehberi görünürlüğünü hesabınızdan yönetebilirsiniz. Tek tek hizmet ilanı yönetimi henüz açılmadı.",footer:"Katalogdaki firma ve ürün kayıtları örnektir. Gerçek talepler ve teklifler hesaplarda saklanır; ticaret doğrudan taraflar arasındadır.",offers:"Gelen teklifler",ownOffer:"Firmanızın teklifi",accepted:"Kabul edildi"},
    en:{workspace:"Your real requests and offers appear here.",realNote:"This action is saved under your account.",requestSaved:"Request saved.",offerSaved:"Offer saved.",error:"The action could not be completed.",minTwo:"Product and destination must each have at least 2 characters.",invalidField:"Check the fields: product and destination must have at least 2 characters.",setupMissing:"The request database has not been installed. Contact the administrator.",permission:"This account cannot perform the action. Check your email confirmation and account type.",emptyBuyer:"No requests yet. Choose a product and request a quote.",emptySupplier:"There are no open requests available.",pending:"Requests open after company and payment approval.",service:"Manage company directory visibility in your account. Individual service listings are not available yet.",footer:"Catalogue listings are samples. Account requests and offers are stored; companies transact directly.",offers:"Received offers",ownOffer:"Your company's offer",accepted:"Accepted"},
    zh:{workspace:"实际采购需求及报价在此显示。",realNote:"此操作将保存在您的账户中。",requestSaved:"需求已保存。",offerSaved:"报价已保存。",error:"操作未完成。",minTwo:"产品和交付地点至少需要2个字符。",invalidField:"请检查产品和交付地点，至少需要2个字符。",setupMissing:"采购需求数据库尚未安装，请联系管理员。",permission:"此账户无法操作，请检查邮箱验证和账户类型。",emptyBuyer:"暂无需求。选择产品并提交询价。",emptySupplier:"暂无可查看的开放需求。",pending:"企业与付款审核通过后可查看需求。",service:"可在账户中管理企业目录展示；单独的服务信息发布功能尚未开放。",footer:"目录信息为示例。账户中的询价与报价会保存，交易由双方直接进行。",offers:"收到的报价",ownOffer:"企业报价",accepted:"已接受"},
    ar:{workspace:"تظهر طلباتك وعروضك الفعلية هنا.",realNote:"يُحفظ هذا الإجراء في حسابك.",requestSaved:"تم حفظ الطلب.",offerSaved:"تم حفظ العرض.",error:"تعذر إتمام العملية.",minTwo:"يجب أن يتكون المنتج ومكان التسليم من حرفين على الأقل.",invalidField:"تحقق من المنتج ومكان التسليم؛ يلزم حرفان على الأقل.",setupMissing:"قاعدة بيانات الطلبات غير مُثبتة بعد. تواصل مع المسؤول.",permission:"لا يمكن لهذا الحساب تنفيذ العملية. تحقق من تأكيد البريد ونوع الحساب.",emptyBuyer:"لا توجد طلبات بعد. اختر منتجًا واطلب عرضًا.",emptySupplier:"لا توجد طلبات مفتوحة متاحة.",pending:"تفتح الطلبات بعد الموافقة على الشركة والدفع.",service:"يمكنك إدارة ظهور شركتك في الدليل من حسابك؛ نشر الخدمات الفردية غير متاح بعد.",footer:"القوائم في الدليل أمثلة. تُحفظ الطلبات والعروض في الحسابات، ويتم التعامل مباشرة بين الأطراف.",offers:"العروض المستلمة",ownOffer:"عرض شركتك",accepted:"مقبول"}
  };
  return text[state.lang]||text.tr;
}

function renderRealWorkspace(){
  const box=document.getElementById("realRequests"),snapshot=window.MarbleDBState;
  if(!box||snapshot?.status!=="ready")return;
  const account=snapshot.account,role=account.profile.account_role;
  if(role==="supplier"&&!account.activeSupplier){box.innerHTML=`<p>${liveCopy().pending}</p>`;return}
  if(role==="service"){box.innerHTML=`<p>${liveCopy().service}</p>`;return}
  const requests=snapshot.requests;
  box.innerHTML=requests.length?requests.map(r=>{
    const count=r.offers.length;
    return `<div class="live-request-row"><strong>${safe(r.item)}</strong><p class="minor">${safe(r.quantity)} ${safe(r.unit)} · ${safe(r.destination)} · ${count} ${tr("answered")}</p><button type="button" class="button outline" data-live-request="${safe(r.id)}">${tr("view")} →</button></div>`;
  }).join(""):`<p>${role==="buyer"?liveCopy().emptyBuyer:liveCopy().emptySupplier}</p>`;
}

function realRequestDetail(id){
  const r=liveRequest(id),account=realAccount();
  if(!r||!account||!(isRealBuyer()||isActiveSupplier()))return;
  const buyer=isRealBuyer(),labels=offerActionCopy[state.lang];
  const offerRows=r.offers.length?r.offers.map(o=>`<div class="response"><span>${buyer?liveCopy().offers:liveCopy().ownOffer}</span><strong>${safe(o.unit_price)} ${safe(o.currency)} / ${safe(r.unit)}</strong><p>${safe(o.notes)}</p>${o.accepted_at?`<span class="offer-accepted">${liveCopy().accepted}</span>`:""}${buyer?`<div class="offer-action-buttons">${o.accepted_at?"":`<button type="button" class="button dark" data-accept-live="${safe(r.id)}" data-offer-id="${safe(o.id)}">${labels.accept}</button>`}<button type="button" class="button outline" data-contact-live="${safe(r.id)}" data-offer-id="${safe(o.id)}">${labels.contact}</button></div>`:""}</div>`).join(""):`<p class="modal-note">${tr("noOffer")}</p>`;
  modal(tr("requestDetail"),safe(r.item),`<div class="detail-list"><span>${tr("quantity")}: <b>${safe(r.quantity)} ${safe(r.unit)}</b></span><span>${tr("format")}: <b>${safe(f(r.format))}</b></span><span>${tr("destination")}: <b>${safe(r.destination)}</b></span><span>ID: <b>${safe(r.id)}</b></span></div><p class="detail-copy">${safe(r.notes)}</p>${offerRows}<div class="modal-actions"><button type="button" class="button outline" data-close>${tr("close")}</button>${isActiveSupplier()&&!r.offers.length?`<button type="button" class="button dark" data-offer="${safe(r.id)}">${tr("sendOffer")}</button>`:""}</div>`);
}

document.addEventListener("click",async event=>{
  let button=event.target.closest("[data-live-request]");
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

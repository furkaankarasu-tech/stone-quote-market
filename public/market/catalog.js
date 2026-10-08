/* Company-owned catalogue listings and their public marketing assets. */
(() => {
  const labels = {
    tr:{title:"Firma kataloğum",new:"Yeni ürün / hizmet ekle",intro:"En az 3, en fazla 10 gerçek fotoğraf ekleyin. Fiyat yayınlanmaz; alıcı doğrudan teklif ister.",pending:"Katalog yayınlamak için firma ve üyelik onayı gerekiyor.",empty:"Henüz katalog kaydı eklemediniz.",error:"Katalog yüklenemedi. Sayfayı yenileyip tekrar deneyin.",name:"Ürün veya hizmet adı",category:"Kategori",stone:"Doğal taş",machine:"Makine",supplies:"Sarf malzemesi",service:"Hizmet",description:"Açıklama",photos:"Fotoğraflar",photosHint:"3–10 fotoğraf, her biri en fazla 5 MB (PNG, JPG, WebP).",pdf:"PDF katalog (isteğe bağlı)",pdfHint:"En fazla 10 MB. Fotoğraf ve PDF herkese açık dosyalardır.",video:"Video bağlantısı (isteğe bağlı)",videoHint:"https:// ile başlayan bağlantı; dosya yükleme yok.",save:"Kataloğa ekle",saving:"Yükleniyor…",saved:"Katalog kaydı eklendi.",updated:"Katalog bilgileri güncellendi.",failed:"Katalog kaydedilemedi. Fotoğrafları ve bağlantınızı kontrol edip tekrar deneyin.",invalidPhotos:"3–10 adet PNG, JPG veya WebP fotoğraf seçin. Her dosya 5 MB veya daha küçük olmalı.",invalidPdf:"PDF dosyası en fazla 10 MB olmalı.",invalidVideo:"Video bağlantısı https:// ile başlamalı.",invalidText:"Başlık 3–100, açıklama 20–1500 karakter olmalı.",published:"Yayında",hidden:"Gizli",hide:"Yayından kaldır",show:"Yayınla",edit:"Bilgileri düzenle",editHint:"Fotoğrafları değiştirmek için yeni bir katalog kaydı oluşturun.",update:"Değişiklikleri kaydet",count:"fotoğraf",noCompany:"Rehberde görünmesi için Profil → Firma rehberi görünürlüğü seçeneğini açın.",own:"Firmanızın kayıtları"},
    en:{title:"My company catalogue",new:"Add product / service",intro:"Add 3–10 real photos. Prices are not published; buyers request quotes directly.",pending:"Company and membership approval is required to publish catalogue items.",empty:"No catalogue entries yet.",error:"Catalogue unavailable. Refresh and retry.",name:"Product or service name",category:"Category",stone:"Natural stone",machine:"Machine",supplies:"Supplies",service:"Service",description:"Description",photos:"Photos",photosHint:"3–10 PNG, JPG or WebP images, up to 5 MB each.",pdf:"PDF brochure (optional)",pdfHint:"Up to 10 MB. Photos and PDFs are public files.",video:"Video link (optional)",videoHint:"An https:// link; videos are linked, not uploaded.",save:"Add to catalogue",saving:"Uploading…",saved:"Catalogue entry added.",updated:"Catalogue entry updated.",failed:"Could not save entry. Check files and connection, then retry.",invalidPhotos:"Choose 3–10 PNG, JPG or WebP photos, up to 5 MB each.",invalidPdf:"PDF must be 10 MB or less.",invalidVideo:"Video link must start with https://.",invalidText:"Use 3–100 characters for the title and 20–1500 for the description.",published:"Published",hidden:"Hidden",hide:"Unpublish",show:"Publish",edit:"Edit details",editHint:"Create another entry to change photos.",update:"Save changes",count:"photos",noCompany:"Enable directory visibility in Profile to list items publicly.",own:"Your company's entries"},
    zh:{title:"企业目录",new:"添加产品或服务",intro:"上传 3–10 张真实照片。不展示价格；买家直接询价。",pending:"企业和会员资格获批后才能发布目录。",empty:"暂无目录内容。",error:"目录无法加载，请刷新后重试。",name:"产品或服务名称",category:"类别",stone:"天然石材",machine:"设备",supplies:"耗材",service:"服务",description:"说明",photos:"照片",photosHint:"3–10 张 PNG/JPG/WebP，每张不超过 5 MB。",pdf:"PDF 目录（可选）",pdfHint:"不超过 10 MB。照片与 PDF 是公开文件。",video:"视频链接（可选）",videoHint:"https:// 链接；不上传视频文件。",save:"添加到目录",saving:"上传中…",saved:"目录内容已添加。",updated:"目录内容已更新。",failed:"保存失败，请检查文件和网络后重试。",invalidPhotos:"选择 3–10 张不超过 5 MB 的 PNG/JPG/WebP。",invalidPdf:"PDF 不得超过 10 MB。",invalidVideo:"视频链接必须以 https:// 开头。",invalidText:"名称需 3–100 字符，说明需 20–1500 字符。",published:"已发布",hidden:"已隐藏",hide:"停止发布",show:"发布",edit:"编辑内容",editHint:"若要修改照片，请创建新条目。",update:"保存更改",count:"张照片",noCompany:"请在个人资料中开启名录可见性以公开展示。",own:"企业目录条目"},
    ar:{title:"كتالوج الشركة",new:"إضافة منتج أو خدمة",intro:"أضف من 3 إلى 10 صور حقيقية. لا تظهر الأسعار ويمكن للمشترين طلب عروض مباشرة.",pending:"تتطلب إضافة الكتالوج الموافقة على الشركة والعضوية.",empty:"لا توجد عناصر بعد.",error:"تعذر تحميل الكتالوج. حدّث الصفحة وأعد المحاولة.",name:"اسم المنتج أو الخدمة",category:"الفئة",stone:"حجر طبيعي",machine:"آلة",supplies:"مستلزمات",service:"خدمة",description:"الوصف",photos:"الصور",photosHint:"3–10 صور PNG/JPG/WebP، حتى 5 ميغابايت لكل صورة.",pdf:"ملف PDF (اختياري)",pdfHint:"حتى 10 ميغابايت. الصور وملفات PDF عامة.",video:"رابط فيديو (اختياري)",videoHint:"رابط يبدأ بـ https:// دون رفع الفيديو.",save:"أضف إلى الكتالوج",saving:"جارٍ الرفع…",saved:"تمت إضافة العنصر.",updated:"تم تحديث بيانات العنصر.",failed:"تعذر الحفظ، تحقق من الملفات والاتصال.",invalidPhotos:"اختر 3–10 صور PNG/JPG/WebP لا تتجاوز 5 ميغابايت لكل صورة.",invalidPdf:"يجب ألا يتجاوز PDF حجم 10 ميغابايت.",invalidVideo:"يجب أن يبدأ رابط الفيديو بـ https://.",invalidText:"العنوان 3–100 حرف، والوصف 20–1500 حرف.",published:"منشور",hidden:"مخفي",hide:"إخفاء",show:"نشر",edit:"تعديل التفاصيل",editHint:"لإبدال الصور أنشئ عنصرًا جديدًا.",update:"حفظ التغييرات",count:"صور",noCompany:"فعّل ظهور الدليل من الملف الشخصي للنشر العام.",own:"عناصر شركتك"}
  };
  const t=()=>labels[state.lang]||labels.tr;
  const types={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp"};
  let mine={userId:null,status:"idle",items:[]};
  let previewUrls=[];
  const account=()=>window.MarbleDBState?.status==="ready"?window.MarbleDBState.account:null;
  const active=()=>!!(account()?.activeSupplier||account()?.activeService);
  function allowedCategories(){
    const a=account();if(!a)return [];
    if(a.profile.account_role==="service")return ["service"];
    const activity=a.application?.company_details?.activity_type;
    return ["stone",...(["machine","supplies","trader"].includes(activity)?["machine","supplies"]:[])];
  }
  async function loadMine(force=false){
    const user=window.MarbleAuthUser;
    if(!user||!account()||!active()||!window.MarbleDB?.myCatalogue)return;
    if(!force&&mine.userId===user.id&&mine.status!=="idle")return;
    mine={userId:user.id,status:"loading",items:mine.userId===user.id?mine.items:[]};
    try{
      const rows=await window.MarbleDB.myCatalogue(user.id);
      if(window.MarbleAuthUser?.id!==user.id)return;
      mine={userId:user.id,status:"ready",items:rows||[]};
    }catch(error){
      console.error("Catalogue owner list failed",error);
      mine={userId:user.id,status:"error",items:[]};
    }
    window.MarbleUIRefresh?.();
  }
  function card(user){
    const a=account(),ready=mine.userId===user.id&&mine.status==="ready";
    const listed=user.user_metadata?.directory_consent===true;
    return `<div class="workspace-card catalog-workspace-card"><div class="catalog-card-head"><div><span class="catalog-kicker">${tr("marketEyebrow")}</span><strong>${t().title}</strong></div>${active()?`<button type="button" class="button dark" data-catalog-new>${t().new}</button>`:""}</div><p>${active()?t().intro:t().pending}</p>${active()&&!listed?`<p class="catalog-warning">${t().noCompany}</p>`:""}${active()?mine.status==="error"?`<p role="alert">${t().error}</p>`:ready?mine.items.length?`<div class="catalog-own-list">${mine.items.map(item=>`<article class="catalog-own-row"><div><b>${safe(item.title)}</b><small>${safe(t()[item.category]||item.category)} · ${safe(item.image_paths?.length||0)} ${t().count} · ${item.is_published?t().published:t().hidden}</small></div><div><button type="button" class="button outline" data-catalog-edit="${safe(item.id)}">${t().edit}</button><button type="button" class="button outline" data-catalog-toggle="${safe(item.id)}">${item.is_published?t().hide:t().show}</button></div></article>`).join("")}</div>`:`<p>${t().empty}</p>`:`<p>${t().saving}</p>`:""}</div>`;
  }
  const validImage=file=>{const ext=file?.name?.split(".").pop()?.toLowerCase();return !!types[ext]&&file.type===types[ext]&&file.size>0&&file.size<=5242880};
  const validPdf=file=>!file||!file.name||file.name.toLowerCase().endsWith(".pdf")&&file.type==="application/pdf"&&file.size>0&&file.size<=10485760;
  function cleanupPreviews(){for(const url of previewUrls)URL.revokeObjectURL(url);previewUrls=[]}
  function formFields(item){
    const edit=!!item;
    const categories=allowedCategories();
    return `<form id="${edit?"catalogEditForm":"catalogForm"}" ${edit?`data-id="${safe(item.id)}"`:""}><div class="form-grid"><label class="field full">${t().name}<input name="title" required minlength="3" maxlength="100" value="${safe(item?.title||"")}"></label><label class="field">${t().category}<select name="category" ${edit?"disabled":""}>${categories.map(category=>`<option value="${category}" ${category===item?.category?"selected":""}>${t()[category]}</option>`).join("")}</select></label><label class="field full">${t().description}<textarea name="description" required minlength="20" maxlength="1500" rows="5">${safe(item?.description||"")}</textarea></label>${edit?`<p class="catalog-info">${t().editHint}</p>`:`<label class="field full">${t().photos}<input name="photos" type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" multiple required><small>${t().photosHint}</small></label><div id="catalogSelected" class="catalog-selected"></div><label class="field full">${t().pdf}<input name="brochure" type="file" accept=".pdf,application/pdf"><small>${t().pdfHint}</small></label>`}<label class="field full">${t().video}<input name="videoUrl" type="url" placeholder="https://" maxlength="300" value="${safe(item?.video_url||"")}"><small>${t().videoHint}</small></label></div><p class="form-error" id="catalogError" role="alert"></p><div class="modal-actions"><button type="button" class="button outline" data-close>${tr("cancel")}</button><button type="submit" class="button dark">${edit?t().update:t().save}</button></div></form>`;
  }
  function openForm(item=null){if(!active())return;cleanupPreviews();modal(tr("marketEyebrow"),item?t().edit:t().new,formFields(item))}
  async function uploadAsset(storage,path,file){const {error}=await storage.upload(path,file,{contentType:file.type,cacheControl:"3600",upsert:false});if(error)throw error}
  async function save(form){
    const user=window.MarbleAuthUser,a=account(),button=form.querySelector('button[type="submit"]'),box=document.getElementById("catalogError");
    if(!active()||!user||!a?.application||button.disabled)return;
    const data=new FormData(form),title=String(data.get("title")||"").trim(),description=String(data.get("description")||"").trim();
    const category=String(data.get("category")||"");
    const video=String(data.get("videoUrl")||"").trim();
    if(title.length<3||title.length>100||description.length<20||description.length>1500){box.textContent=t().invalidText;return}
    if(video&&(!/^https:\/\/[^\s]+$/.test(video)||video.length>300)){box.textContent=t().invalidVideo;return}
    const edit=form.id==="catalogEditForm";
    let photos=[],pdf=null;
    if(!edit){
      if(!allowedCategories().includes(category)){box.textContent=t().failed;return}
      photos=Array.from(form.elements.photos.files||[]);
      pdf=form.elements.brochure.files?.[0]||null;
      if(photos.length<3||photos.length>10||photos.some(file=>!validImage(file))){box.textContent=t().invalidPhotos;return}
      if(!validPdf(pdf)){box.textContent=t().invalidPdf;return}
    }
    button.disabled=true;button.textContent=t().saving;box.textContent="";
    const uploaded=[];
    let committed=false;
    try{
      if(edit){
        await window.MarbleDB.updateCatalogItem(form.dataset.id,{title,description,video_url:video||null});
      }else{
        const id=crypto.randomUUID(),storage=window.MarbleAuth.client.storage.from("mb-catalog-assets");
        for(const file of photos){
          const ext=file.name.split(".").pop().toLowerCase();
          const path=`${user.id}/${id}/photo-${crypto.randomUUID()}.${ext}`;
          await uploadAsset(storage,path,file);uploaded.push(path);
        }
        let pdfPath=null;
        if(pdf){pdfPath=`${user.id}/${id}/catalog-${crypto.randomUUID()}.pdf`;await uploadAsset(storage,pdfPath,pdf);uploaded.push(pdfPath)}
        await window.MarbleDB.createCatalogItem({id,application_id:a.application.id,title,category,description,image_paths:uploaded.filter(path=>/\/photo-/.test(path)),pdf_path:pdfPath,video_url:video||null});
      }
      committed=true;
      cleanupPreviews();closeModal();
      await Promise.allSettled([loadMine(true),window.MarbleDB.refreshDirectory()]);
      toast(edit?t().updated:t().saved);
    }catch(error){
      console.error("Catalogue save failed",error);
      if(!committed&&uploaded.length){try{await window.MarbleAuth.client.storage.from("mb-catalog-assets").remove(uploaded)}catch(cleanupError){console.warn("Catalogue cleanup failed",cleanupError)}}
      if(button.isConnected)box.textContent=t().failed;
    }finally{if(button.isConnected){button.disabled=false;button.textContent=edit?t().update:t().save}}
  }
  document.addEventListener("click",async event=>{
    let button=event.target.closest("[data-catalog-new]");if(button){openForm();return}
    button=event.target.closest("[data-catalog-edit]");
    if(button){const item=mine.items.find(row=>row.id===button.dataset.catalogEdit);if(item)openForm(item);return}
    button=event.target.closest("[data-catalog-toggle]");if(!button||!active())return;
    const item=mine.items.find(row=>row.id===button.dataset.catalogToggle);if(!item)return;
    button.disabled=true;
    try{await window.MarbleDB.updateCatalogItem(item.id,{is_published:!item.is_published});await Promise.all([loadMine(true),window.MarbleDB.refreshDirectory()])}
    catch(error){console.error("Catalogue publish change failed",error);toast(t().failed)}
    finally{if(button.isConnected)button.disabled=false}
  });
  document.addEventListener("submit",event=>{if(!["catalogForm","catalogEditForm"].includes(event.target.id))return;event.preventDefault();void save(event.target)});
  document.addEventListener("change",event=>{
    if(event.target.name!=="photos"||!event.target.closest("#catalogForm"))return;
    cleanupPreviews();
    const files=Array.from(event.target.files||[]),box=document.getElementById("catalogSelected");
    box.innerHTML=files.map(file=>{
      if(!validImage(file))return `<span>${safe(file.name)}</span>`;
      const url=URL.createObjectURL(file);previewUrls.push(url);
      return `<img src="${safe(url)}" alt="${safe(file.name)}">`;
    }).join("");
  });
  window.addEventListener("marble-db",()=>void loadMine());
  window.MarbleCatalog={card,loadMine,labels:()=>t()};
  if(active())void loadMine();
})();

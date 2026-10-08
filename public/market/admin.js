// In-page dialogs: Escape cancels, focus returns to the initiating control.
(() => {
  let cancelActive;
  function open({title, text, expected, confirmLabel="Tamam", url}) {
    cancelActive?.();
    return new Promise(resolve => {
      const previous=document.activeElement, dialog=document.createElement("dialog");
      dialog.className="admin-dialog"; if(url)dialog.classList.add("admin-document-dialog");
      const heading=document.createElement("h2");heading.id="admin-dialog-title";heading.textContent=title;
      dialog.setAttribute("aria-labelledby",heading.id);dialog.append(heading);
      if(text){const p=document.createElement("p");p.textContent=text;dialog.append(p)}
      let input;
      if(expected!==undefined){const label=document.createElement("label");label.textContent=`Onaylamak için yazın: ${expected}`;input=document.createElement("input");input.autocomplete="off";label.append(input);dialog.append(label)}
      if(url){const frame=document.createElement("iframe");frame.title="Firma doğrulama belgesi";frame.referrerPolicy="no-referrer";frame.src=url;dialog.append(frame);const p=document.createElement("p");p.textContent="Belge görünmüyorsa dosyayı cihazınıza indirebilirsiniz.";const link=document.createElement("a");link.textContent="Belgeyi indir";link.href=url;link.download="";p.append(" ",link);dialog.append(p)}
      const actions=document.createElement("div");actions.className="admin-dialog-actions";
      const back=document.createElement("button");back.type="button";back.className="secondary";back.textContent=url?"Kapat":"Vazgeç";actions.append(back);
      const ok=document.createElement("button");ok.type="button";ok.textContent=confirmLabel;
      if(!url){ok.disabled=!!input;actions.append(ok)}
      dialog.append(actions);document.body.append(dialog);
      const finish=value=>{dialog.close();dialog.remove();if(cancelActive===cancel)cancelActive=null;previous?.isConnected&&previous.focus();resolve(value)};
      const cancel=()=>finish(null);cancelActive=cancel;
      back.addEventListener("click",cancel);dialog.addEventListener("cancel",event=>{event.preventDefault();cancel()});
      dialog.addEventListener("click",event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)cancel()}});
      input?.addEventListener("input",()=>{ok.disabled=input.value!==expected});
      ok.addEventListener("click",()=>{if(!ok.disabled)finish(input?input.value:true)});
      dialog.showModal();(input||back).focus();
    });
  }
  window.MarbleAdminUI={open, notify(text){const root=document.getElementById("mb-admin-root");root.querySelector("[data-admin-notice]")?.remove();const p=document.createElement("p");p.dataset.adminNotice="true";p.className="admin-message";p.setAttribute("role","status");p.textContent=text;root.prepend(p)}};
  window.addEventListener("marble-auth",event=>{if(!event.detail?.user)cancelActive?.()});
})();

(() => {
  const root = document.getElementById("mb-admin-root");
  const plans = JSON.parse(document.getElementById("mb-admin-plans").textContent);
  const safe = value => String(value ?? "—").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
  const date = value => value ? new Date(value).toLocaleString("tr-TR") : "—";
  const money = value => new Intl.NumberFormat("tr-TR", { style:"currency", currency:"TRY" }).format(value);
  function whatsappNumber(phone, country) {
    const raw = String(phone || "").trim(), digits = raw.replace(/\D/g, "");
    const valid = number => /^\d{8,15}$/.test(number) ? number : null;
    if (raw.startsWith("+")) return valid(digits);
    if (digits.startsWith("00")) return valid(digits.slice(2));
    if (!/^(türkiye|turkiye|turkey|tr)$/i.test(String(country || "").trim())) return null;
    if (/^0[2-5]\d{9}$/.test(digits)) return `90${digits.slice(1)}`;
    if (/^[2-5]\d{9}$/.test(digits)) return `90${digits}`;
    return /^90[2-5]\d{9}$/.test(digits) ? digits : null;
  }
  function whatsappLink(app) {
    const info = app.company_details || {}, number = whatsappNumber(info.phone, info.country);
    if (!number) return null;
    const greeting = info.authorized_name ? `Merhaba ${info.authorized_name},` : "Merhaba,";
    const message = `${greeting} Marble Borsa ekibinden yazıyorum. ${app.company_name} adına yaptığınız firma üyelik başvurusu bize ulaştı. Üyelik ve doğrulama sürecini paylaşmak için size yazıyorum. Görüşmek için uygun musunuz?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
  let current;

  async function load() {
    const { data: { user }, error } = await window.MarbleAuth.client.auth.getUser();
    if (error || !user) { window.MarbleAdminAds?.stop(); root.innerHTML='<p class="admin-message">Önce <a href="/tr">ana sayfada giriş yapın</a>, ardından yönetim ekranına dönün.</p>'; return; }
    const { data: admin, error: adminError } = await window.MarbleAuth.client.rpc("mb_is_admin");
    if (adminError) { window.MarbleAdminAds?.stop(); root.innerHTML='<p class="admin-error">Yönetim veritabanına bağlanılamadı. SQL kurulumunu kontrol edin.</p>'; return; }
    if (!admin) { window.MarbleAdminAds?.stop(); root.innerHTML='<p class="admin-error">Bu hesap için yönetici yetkisi tanımlı değil.</p>'; return; }
    window.MarbleAdminAds?.start(user.id);
    root.textContent = "Başvurular yükleniyor…";
    try { current = await window.MarbleDB.adminApplications(); render(); }
    catch (failure) { root.textContent = `Başvurular yüklenemedi: ${failure.message || failure}`; }
  }

  function render() {
    const { apps, profiles, verifications, payments, memberships, events } = current;
    const actors = Object.fromEntries(profiles.map(p => [p.user_id, p.full_name]));
    const actor = id => id ? `${safe(actors[id] || "Yönetici")} (${safe(id)})` : "—";
    if (!apps.length) { root.innerHTML='<div class="admin-lead-summary"><strong>0 yeni firma başvurusu</strong><span>Yeni başvurular e-posta onayından sonra görünür.</span><button type="button" data-refresh>Yenile</button></div><p class="admin-message">Henüz firma başvurusu yok.</p>'; return; }
    const newLead = app => !app.contacted_at && !memberships.some(m => m.application_id === app.id);
    const newCount = apps.filter(newLead).length;
    const orderedApps = apps.slice().sort((a, b) => Number(newLead(b)) - Number(newLead(a)) ||
      new Date(b.submitted_at) - new Date(a.submitted_at));
    root.innerHTML = `<div class="admin-lead-summary"><strong>${newCount} yeni firma başvurusu</strong><span>E-posta onayı tamamlanan satıcı ve hizmet başvuruları burada görünür. İlk görüşmeleri takip edin.</span><button type="button" data-refresh>Yenile</button></div>` + orderedApps.map(app => {
      const info = app.company_details || {};
      const contactLink = whatsappLink(app);
      const verification = verifications.find(v => v.application_id === app.id);
      const companyPayments = payments.filter(p => p.application_id === app.id);
      const companyMemberships = memberships.filter(m => m.application_id === app.id);
      const latest = companyMemberships[0];
      const active = !!latest && !!verification?.verified && new Date(latest.ends_at) > new Date();
      const companyEvents = events.filter(ev => ev.application_id === app.id).slice(0, 10);
      const unused = companyPayments.filter(p => !companyMemberships.some(m => m.payment_id === p.id));
      return `<section class="admin-card" data-application="${safe(app.id)}"><h2>${safe(app.company_name)} ${newLead(app) ? '<span class="admin-new">Yeni başvuru</span>' : ''}</h2>
        <p><strong>${app.account_role === "supplier" ? "Üretici / tedarikçi" : "Hizmet sağlayıcı"}</strong> · Yıllık taban bedel: ${money(plans[app.account_role].annualAmountTRY)} + KDV</p>
        ${app.account_role === "service" ? '<p class="admin-error">Hizmet ilanı yönetimi henüz hazır değil. Bu üyelik için ücret tahsil edip aktivasyon yapmadan önce ilan akışını tamamlayın.</p>' : ''}
        <div class="admin-outreach"><strong>Başvuru iletişimi</strong><p>${app.contacted_at ? `İletişime geçildi: ${date(app.contacted_at)} · ${actor(app.contacted_by)}` : "Henüz iletişime geçildi olarak işaretlenmedi."}</p>
          <div class="admin-actions">${contactLink ? `<a class="admin-whatsapp" href="${safe(contactLink)}" target="_blank" rel="noopener noreferrer">WhatsApp'ta mesaj hazırla ↗</a>` : '<span class="admin-muted">WhatsApp bağlantısı için telefon ülke koduyla yazılmalı (+90 gibi). E-posta veya telefonla ulaşabilirsiniz.</span>'}
            <button type="button" class="secondary" data-contact="${safe(app.id)}" data-value="${app.contacted_at ? "false" : "true"}">${app.contacted_at ? "Takibe geri al" : "Mesajı gönderdim / görüştüm"}</button></div>
          <small>WhatsApp mesaj ekranı açılır; gönderme işlemini siz tamamlarsınız.</small>
        </div>
        <div class="admin-grid">
          <p><span>Başvuru / kullanıcı</span>${date(app.submitted_at)} · ${safe(app.owner_id)}</p>
          <p><span>Yetkili kişi ve iletişim</span>${safe(info.authorized_name)} · ${safe(info.corporate_email)} · ${safe(info.phone)}</p>
          <p><span>Vergi / sicil</span>${safe(info.tax_no)} · ${safe(info.registry_no)}</p>
          <p><span>Şehir / adres</span>${safe(info.city)} · ${safe(info.company_address)}</p>
          <p><span>Firma doğrulaması</span>${verification?.verified ? "Doğrulandı" : "Bekliyor"} · ${date(verification?.reviewed_at)}<br>${actor(verification?.reviewed_by)}</p>
          <p><span>Üyelik</span>${active ? "Aktif" : latest ? "Süresi doldu veya doğrulaması kaldırıldı" : "Henüz etkin değil"}${latest ? `<br>${date(latest.started_at)} – ${date(latest.ends_at)}<br>${actor(latest.activated_by)}` : ""}</p>
        </div>
        <div class="admin-actions"><button type="button" data-document="${safe(app.owner_id)}" class="secondary">Firma belgesini aç</button>
          <button type="button" class="secondary" data-company-delete="${safe(app.id)}">Firmayı kalıcı sil</button>
          <button type="button" data-verify="${safe(app.id)}" data-value="${verification?.verified ? "false" : "true"}">${verification?.verified ? "Firma doğrulamasını kaldır" : "Firma doğrulandı"}</button></div>
        <h3>Banka hesabına geçen ödemeyi teyit et</h3>
        <p class="admin-muted">Dekont yerine banka hareketindeki tutar, işlem açıklaması ve hesabınıza geçiş tarihini yazın.</p>
        <form class="payment-form" data-payment-form="${safe(app.id)}">
          <label>Hesaba geçen tutar (TL)<input name="amount" type="number" min="0.01" step="0.01" required></label>
          <label>Banka işlem açıklaması<input name="reference" maxlength="180" minlength="3" required></label>
          <label>Hesaba geçiş tarihi<input name="received" type="datetime-local" required></label>
          <button type="submit">Ödemeyi kaydet</button>
        </form>
        <h3>Ödeme kayıtları ve aktivasyon</h3>
        ${companyPayments.length ? companyPayments.map(p => {
          const used = companyMemberships.find(m => m.payment_id === p.id);
          return `<div class="payment-line"><strong>${money(p.amount_try)}</strong> · ${safe(p.bank_reference)}<br>
            <span class="admin-muted">Banka: ${date(p.bank_received_at)} · Onay: ${date(p.confirmed_at)} · ${actor(p.confirmed_by)}</span><br>
            ${used ? `Bu ödemeyle üyelik açıldı: ${date(used.started_at)} – ${date(used.ends_at)}` : `<button type="button" data-activate="${safe(app.id)}" data-payment-id="${safe(p.id)}" ${verification?.verified && !active ? "" : "disabled"}>Üyeliği etkinleştir (12 ay)</button>`}</div>`;
        }).join("") : '<p class="admin-muted">Henüz teyit edilen banka ödemesi yok.</p>'}
        <details><summary>İşlem geçmişi</summary>${companyEvents.map(ev => `<p class="admin-muted">${date(ev.occurred_at)} · ${safe(({contacted:"İletişime geçildi",contact_reset:"Yeniden takibe alındı"})[ev.action] || ev.action)} · ${actor(ev.actor_id)}</p>`).join("") || '<p>Henüz işlem yok.</p>'}</details>
      </section>`;
    }).join("");
  }

  document.addEventListener("click", async event => {
    if (event.target.closest("[data-refresh]")) { await load(); return; }
    const deleteButton = event.target.closest("[data-company-delete]");
    const documentButton = event.target.closest("[data-document]");
    const verifyButton = event.target.closest("[data-verify]");
    const activateButton = event.target.closest("[data-activate]");
    const contactButton = event.target.closest("[data-contact]");
    const button = deleteButton || documentButton || verifyButton || activateButton || contactButton;
    if (!button || button.disabled) return;
    button.disabled = true;
    try {
      if (deleteButton) {
        const app = current?.apps.find(row => row.id === button.dataset.companyDelete);
        if (!app) throw new Error("Başvuru listesini yenileyin.");
        const name = await window.MarbleAdminUI.open({title:"Firmayı sil",text:"Firma, katalog, ödeme, üyelik ve ilgili talep/teklif kayıtları silinir. Bu işlem geri alınamaz. Bağlı hesabın girişi engellenir.",expected:app.company_name,confirmLabel:"Kalıcı sil"});
        if (name !== app.company_name) return;
        await window.MarbleDB.deleteCompany(app.id, name);
        await load(); window.MarbleAdminUI.notify("Firma, ödeme, üyelik ve ilişkili kayıtlar kalıcı silindi. Bağlı hesabın girişi engellendi. Yüklenen dosyalar korunur.");
      } else if (documentButton) {
        const url = await window.MarbleDB.verificationDocument(button.dataset.document);
        if (!url) throw new Error("Yüklenmiş firma doğrulama belgesi bulunamadı.");
        await window.MarbleAdminUI.open({title:"Firma belgesi",url});
      } else if (verifyButton) {
        await window.MarbleDB.verify(button.dataset.verify, button.dataset.value === "true");
        await load();
      } else if (contactButton) {
        await window.MarbleDB.setApplicationContacted(button.dataset.contact, button.dataset.value === "true");
        await load();
      } else {
        if (!await window.MarbleAdminUI.open({title:"Üyeliği etkinleştir",text:"Banka ödemesini ve firma belgesini kontrol ettiniz mi? 12 aylık üyelik şimdi başlayacak.",confirmLabel:"Etkinleştir"})) return;
        await window.MarbleDB.activate(button.dataset.activate, button.dataset.paymentId);
        await load();
      }
    } catch (failure) { await window.MarbleAdminUI.open({title:"İşlem tamamlanamadı",text:failure.message || "Lütfen tekrar deneyin."}); }
    finally { if (button.isConnected) button.disabled = false; }
  });

  document.addEventListener("submit", async event => {
    const form = event.target.closest("[data-payment-form]");
    if (!form) return;
    event.preventDefault();
    const button = form.querySelector("button[type=submit]");
    if (button.disabled) return;
    button.disabled = true;
    try {
      await window.MarbleDB.confirmPayment(form.dataset.paymentForm, Number(form.elements.amount.value),
        form.elements.reference.value.trim(), new Date(form.elements.received.value).toISOString());
      await load();
    } catch (failure) { await window.MarbleAdminUI.open({title:"Ödeme kaydedilemedi",text:failure.message || "Lütfen tekrar deneyin."}); }
    finally { if (button.isConnected) button.disabled = false; }
  });

  void load();
})();

/* Advertisement editor is separate from the membership rendering above. */
(() => {
  const root=document.getElementById("mb-admin-ad-root"),tabs=document.getElementById("mb-admin-tabs");
  if(!root||!tabs)return;
  const u=()=>window.MarbleAdsUtils;
  const sections={home:"Ana sayfa",stone:"Doğal taş",companies:"Firmalar",machine:"Makine ve sarf",services:"Hizmetler"};
  let adminUser=null,authorized=false,rows=[],editId=null,previewUrl=null,busy=false,loading=false,editing=false,loadSequence=0;
  const safe=value=>u().safe(value);
  function releasePreview(){if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}}
  function message(text,error=false){const node=document.getElementById("mb-ad-message");if(node){node.textContent=text;node.className=error?"admin-error":"admin-message";node.setAttribute("role",error?"alert":"status")}}
  function failure(error){return ["PGRST202","42P01"].includes(error?.code)?"Reklam kurulumu henüz tamamlanmamış. Yeni sürümün SQL dosyasını Supabase SQL Editor’da çalıştırın.":error?.code==="42501"?"Bu işlem için yönetici yetkisi gerekiyor. Hesabınızı kontrol edin.":"Reklam işlemi tamamlanamadı. Bağlantınızı kontrol edip yeniden deneyin."}
  function status(row){
    if(row.archived_at)return "Arşivde";
    if(!row.is_active)return "Kapalı / taslak";
    if(Date.parse(row.starts_at)>Date.now())return "Planlandı";
    if(row.ends_at&&Date.parse(row.ends_at)<=Date.now())return "Süresi doldu";
    return "Yayında";
  }
  function shell(){
    root.innerHTML=`<div class="admin-ad-header"><div><span class="admin-ad-kicker">REKLAM YÖNETİMİ</span><h2>Reklamlar ve sponsorlar</h2><p>Reklamları buradan ekleyin, planlayın ve yayını yönetin. Siteyi yeniden yayınlamanız gerekmez.</p></div><button type="button" data-ad-new>Yeni reklam</button></div><p id="mb-ad-message" role="status" aria-live="polite"></p><div id="mb-ad-editor" hidden></div><div class="admin-ad-toolbar"><strong>Kampanyalar</strong><button type="button" class="secondary" data-ad-refresh>Yenile</button></div><p class="admin-muted">Her bölümde sırası en küçük olan en fazla 3 uygun reklam gösterilir. Tarihler Türkiye saatidir. Arşivleme kayıtları silmez.</p><div id="mb-ad-list">Reklamlar yükleniyor…</div>`;
  }
  function list(){
    const target=document.getElementById("mb-ad-list");if(!target)return;
    target.innerHTML=rows.length?rows.map(row=>`<article class="admin-ad-row"><img src="${safe(window.MarbleDB.adImageUrl(row.image_path))}" alt="${safe(row.company_name)}" width="160" height="120"><div><span class="admin-ad-status">${status(row)}</span><h3>${safe(row.title)}</h3><p>${safe(row.company_name)} · ${({top:"Üst banner",sidebar:"Sağ sütun",bottom:"Liste altı"})[row.placement||"sidebar"]} · Sıra: ${safe(row.sort_order)}</p><small>${row.sections.map(x=>sections[x]).join(" · ")}<br>${safe(u().localDate(row.starts_at).replace("T"," "))} — ${row.ends_at?safe(u().localDate(row.ends_at).replace("T"," ")):"Bitiş yok"}</small></div><div class="admin-ad-row-actions"><button type="button" class="secondary" data-ad-edit="${row.id}">Düzenle / önizle</button>${!row.archived_at?`<button type="button" data-ad-toggle="${row.id}">${row.is_active?"Yayını kapat":"Yayını aç"}</button>`:""}<button type="button" class="secondary" data-ad-archive="${row.id}">${row.archived_at?"Arşivden çıkar":"Arşivle"}</button><button type="button" class="secondary" data-ad-delete="${row.id}">Kalıcı sil</button></div></article>`).join(""):'<div class="admin-ad-empty"><h3>Henüz reklam yok</h3><p>İlk sponsorunuzun görselini ve bağlantısını ekleyerek başlayın. Yayında reklam yoksa ziyaretçiye reklam alanı gösterilmez.</p><button type="button" data-ad-new>İlk reklamı ekle</button></div>';
  }
  async function load(){
    if(!authorized||loading)return;
    loading=true;const ticket=++loadSequence;
    try{const data=await window.MarbleDB.adminAdvertisements();if(ticket!==loadSequence||!authorized)return;rows=data||[];list()}
    catch(error){if(ticket===loadSequence){message(failure(error),true);const target=document.getElementById("mb-ad-list");if(target)target.textContent="Reklam listesi alınamadı."}}
    finally{if(ticket===loadSequence)loading=false}
  }
  function editor(id=null){
    if(busy||!authorized)return;
    const row=id?rows.find(x=>x.id===id):null;if(id&&!row)return;
    releasePreview();editId=id;editing=true;
    const box=document.getElementById("mb-ad-editor");box.hidden=false;
    const starts=row?.starts_at||new Date().toISOString();
    box.innerHTML=`<div class="admin-ad-editor-heading"><h3>${id?"Reklamı düzenle":"Yeni reklam"}</h3><button type="button" class="secondary" data-ad-cancel>Vazgeç</button></div><div class="admin-ad-edit-layout"><form id="mb-ad-form"><fieldset><div class="admin-ad-fields"><label>Firma / sponsor adı<input name="company_name" minlength="2" maxlength="100" value="${safe(row?.company_name||"")}" required></label><label>Reklam başlığı<input name="title" minlength="2" maxlength="100" value="${safe(row?.title||"")}" required></label><label class="wide">Kısa açıklama<textarea name="description" maxlength="220" rows="3">${safe(row?.description||"")}</textarea></label><label class="wide">Tıklanınca açılacak bağlantı<input name="target_url" type="url" maxlength="2000" placeholder="https://firma.com" value="${safe(row?.target_url||"")}" required></label><label class="wide">Reklam görseli<input name="image" type="file" accept="image/png,image/jpeg,image/webp" ${row?"":"required"}><small>PNG, JPG veya WebP; en fazla 3 MB. Önerilen oran 4:3. Yüklenen görseller herkese açık olarak saklanır.</small></label></div><fieldset class="admin-ad-sections"><legend>Gösterilecek bölümler</legend>${Object.entries(sections).map(([key,label])=>`<label><input name="sections" type="checkbox" value="${key}" ${(row?.sections||["home"]).includes(key)?"checked":""}>${label}</label>`).join("")}</fieldset><div class="admin-ad-fields"><label>Başlangıç (Türkiye saati)<input name="starts_at" type="datetime-local" required value="${safe(u().localDate(starts))}"></label><label>Bitiş (isteğe bağlı)<input name="ends_at" type="datetime-local" value="${safe(u().localDate(row?.ends_at))}"></label><label>Reklam alanı<select name="placement"><option value="sidebar" ${(row?.placement||"sidebar")==="sidebar"?"selected":""}>Sağ sütun</option><option value="top" ${row?.placement==="top"?"selected":""}>Üst banner</option><option value="bottom" ${row?.placement==="bottom"?"selected":""}>Liste altı</option></select></label><label>Sıralama<input name="sort_order" type="number" min="0" max="9999" step="1" value="${row?.sort_order??10}" required><small>Küçük sayı önce gösterilir.</small></label><label class="admin-ad-publish"><input name="is_active" type="checkbox" ${row?.is_active?"checked":""} ${row?.archived_at?"disabled":""}>Yayın açık<small>Kapalı bırakırsanız taslak olarak kaydedilir.</small></label></div><p id="mb-ad-form-error" class="admin-error" role="alert" hidden></p><div class="admin-actions"><button type="submit">${id?"Değişiklikleri kaydet":"Reklamı kaydet"}</button><button type="button" class="secondary" data-ad-cancel>Vazgeç</button></div></fieldset></form><aside class="admin-ad-preview"><span class="admin-ad-kicker">ZİYARETÇİ ÖNİZLEMESİ</span><div id="mb-ad-preview-card"></div><p class="admin-muted">Önizleme yayına alınmaz. Bağlantı yeni sekmede açılır.</p></aside></div>`;
    updatePreview();box.scrollIntoView({behavior:"smooth",block:"start"});box.querySelector('input[name="company_name"]').focus();
  }
  function updatePreview(){
    const form=document.getElementById("mb-ad-form"),target=document.getElementById("mb-ad-preview-card");if(!form||!target)return;
    const row=rows.find(x=>x.id===editId),file=form.elements.image.files[0];
    if(file&&["image/png","image/jpeg","image/webp"].includes(file.type)&&file.size<=3145728){if(!previewUrl){previewUrl=URL.createObjectURL(file)}}
    const image=previewUrl||window.MarbleDB.adImageUrl(row?.image_path);
    const values={placement:fields.placement.value,company_name:form.elements.company_name.value||"Firma adı",title:form.elements.title.value||"Reklam başlığı",description:form.elements.description.value,target_url:u().url(form.elements.target_url.value)||"https://www.marbleborsa.com/"};
    target.innerHTML=image?u().card(values,image,"tr",true):'<div class="admin-ad-placeholder">Görsel seçtiğinizde reklamınız burada görünür.</div>';
  }
  function closeEditor(){if(busy)return;releasePreview();editing=false;editId=null;document.getElementById("mb-ad-editor").hidden=true;document.querySelector("[data-ad-new]")?.focus()}
  function formError(text){const node=document.getElementById("mb-ad-form-error");if(node){node.hidden=!text;node.textContent=text}}
  async function save(form){
    if(!authorized||busy)return;
    const fields=form.elements,row=rows.find(x=>x.id===editId),id=editId;
    const selected=Array.from(form.querySelectorAll('input[name="sections"]:checked')).map(x=>x.value);
    let values;
    try{
      const url=u().url(fields.target_url.value);
      if(!url)throw new Error("Bağlantı https:// ile başlamalı; kullanıcı adı veya şifre içermemeli.");
      if(!selected.length)throw new Error("En az bir bölüm seçin.");
      const start=u().isoDate(fields.starts_at.value),end=fields.ends_at.value?u().isoDate(fields.ends_at.value):null;
      if(end&&Date.parse(end)<=Date.parse(start))throw new Error("Bitiş tarihi başlangıçtan sonra olmalı.");
      const order=Number(fields.sort_order.value);
      if(!Number.isInteger(order)||order<0||order>9999)throw new Error("Sıralama 0–9999 arasında tam sayı olmalı.");
      values={placement:fields.placement.value,company_name:fields.company_name.value.trim(),title:fields.title.value.trim(),description:fields.description.value.trim(),target_url:url,sections:selected,starts_at:start,ends_at:end,sort_order:order,is_active:!row?.archived_at&&fields.is_active.checked};
      if(values.company_name.length<2||values.title.length<2)throw new Error("Firma adı ve başlık en az 2 karakter olmalı.");
    }catch(error){formError(error.message);return}
    const file=fields.image.files[0];
    if(!file&&!row?.image_path){formError("Bir reklam görseli seçin.");return}
    busy=true;formError("");form.querySelector('fieldset').disabled=true;
    try{
      values.image_path=file?await window.MarbleDB.uploadAdImage(file):row.image_path;
      await window.MarbleDB.saveAdvertisement(id,values);
      busy=false;closeEditor();await load();message(values.is_active?"Reklam kaydedildi. Yayın tarihleri ve seçtiğiniz bölümlere göre gösterilecek.":"Reklam taslak olarak kaydedildi.");
    }catch(error){formError(/görsel|piksel|PNG|megapiksel/i.test(error?.message||"")?error.message:failure(error))}
    finally{busy=false;if(form.isConnected)form.querySelector('fieldset').disabled=false}
  }
  async function change(id,action,button){
    if(busy||!authorized)return;
    const row=rows.find(x=>x.id===id);if(!row)return;
    if(editing){message("Önce açık düzenlemeyi kaydedin veya Vazgeç’i seçin.",true);return}
    if(action==="delete"){
      const title=await window.MarbleAdminUI.open({title:"Reklamı sil",text:"Reklam kalıcı silinir. Bu işlem geri alınamaz.",expected:row.title,confirmLabel:"Kalıcı sil"});
      if(title!==row.title)return;
    }
    busy=true;button.disabled=true;
    try{
      if(action==="delete"){
        await window.MarbleDB.deleteAdvertisement(id,row.title);await load();message("Reklam kalıcı silindi. Yüklenen görsel dosyası korunur.");return;
      }
      const values=action==="archive"?{archived_at:row.archived_at?null:new Date().toISOString(),is_active:false}:{is_active:!row.is_active};
      await window.MarbleDB.saveAdvertisement(id,values);await load();message(action==="archive"?(row.archived_at?"Reklam arşivden çıkarıldı; yayını kapalı.":"Reklam arşivlendi. Kayıtlar korunuyor."):(row.is_active?"Reklam yayını kapatıldı.":"Reklam yayını açıldı. Yayın tarihleri geçerlidir."));
    }catch(error){message(failure(error),true)}finally{busy=false;if(button.isConnected)button.disabled=false}
  }
  function showTab(name){
    if(!authorized)return;
    for(const key of ["members","ads"]){const selected=key===name;document.getElementById(`mb-admin-${key}`).hidden=!selected;const tab=document.querySelector(`[data-admin-tab="${key}"]`);tab.setAttribute("aria-selected",String(selected));tab.tabIndex=selected?0:-1;}
  }
  function stop(){authorized=false;adminUser=null;loadSequence++;loading=false;rows=[];editing=false;editId=null;releasePreview();root.innerHTML="";tabs.hidden=true;document.getElementById("mb-admin-ads").hidden=true;document.getElementById("mb-admin-members").hidden=false}
  window.MarbleAdminAds={start(userId){if(authorized&&adminUser===userId)return;stop();authorized=true;adminUser=userId;tabs.hidden=false;shell();void load()},stop};
  tabs.addEventListener("click",event=>{const tab=event.target.closest("[data-admin-tab]");if(tab)showTab(tab.dataset.adminTab)});
  tabs.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const active=event.target.closest("[data-admin-tab]");const name=event.key==="Home"?"members":event.key==="End"?"ads":active?.dataset.adminTab==="ads"?"members":"ads";showTab(name);document.querySelector(`[data-admin-tab="${name}"]`).focus()});
  root.addEventListener("click",event=>{
    const button=event.target.closest("button");if(!button||button.disabled||busy)return;
    if(button.hasAttribute("data-ad-new"))editor();
    else if(button.hasAttribute("data-ad-cancel"))closeEditor();
    else if(button.hasAttribute("data-ad-refresh"))void load();
    else if(button.dataset.adEdit)editor(button.dataset.adEdit);
    else if(button.dataset.adToggle)void change(button.dataset.adToggle,"toggle",button);
    else if(button.dataset.adArchive)void change(button.dataset.adArchive,"archive",button);
    else if(button.dataset.adDelete)void change(button.dataset.adDelete,"delete",button);
  });
  root.addEventListener("input",event=>{if(event.target.closest("#mb-ad-form"))updatePreview()});
  root.addEventListener("change",event=>{if(event.target.name==="image"){releasePreview();updatePreview()}});
  root.addEventListener("submit",event=>{if(event.target.id==="mb-ad-form"){event.preventDefault();void save(event.target)}});
  window.addEventListener("marble-auth",event=>{if(!event.detail?.user||event.detail.user.id!==adminUser)stop()});
})();

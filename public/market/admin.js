(() => {
  const root = document.getElementById("mb-admin-root");
  const plans = JSON.parse(document.getElementById("mb-admin-plans").textContent);
  const safe = value => String(value ?? "—").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
  const date = value => value ? new Date(value).toLocaleString("tr-TR") : "—";
  const money = value => new Intl.NumberFormat("tr-TR", { style:"currency", currency:"TRY" }).format(value);
  let current;

  async function load() {
    const { data: { user }, error } = await window.MarbleAuth.client.auth.getUser();
    if (error || !user) { root.innerHTML='<p class="admin-message">Önce <a href="/tr">ana sayfada giriş yapın</a>, ardından yönetim ekranına dönün.</p>'; return; }
    const { data: admin, error: adminError } = await window.MarbleAuth.client.rpc("mb_is_admin");
    if (adminError) { root.innerHTML='<p class="admin-error">Yönetim veritabanına bağlanılamadı. SQL kurulumunu kontrol edin.</p>'; return; }
    if (!admin) { root.innerHTML='<p class="admin-error">Bu hesap için yönetici yetkisi tanımlı değil.</p>'; return; }
    root.textContent = "Başvurular yükleniyor…";
    try { current = await window.MarbleDB.adminApplications(); render(); }
    catch (failure) { root.textContent = `Başvurular yüklenemedi: ${failure.message || failure}`; }
  }

  function render() {
    const { apps, profiles, verifications, payments, memberships, events } = current;
    const actors = Object.fromEntries(profiles.map(p => [p.user_id, p.full_name]));
    const actor = id => id ? `${safe(actors[id] || "Yönetici")} (${safe(id)})` : "—";
    if (!apps.length) { root.innerHTML='<p class="admin-message">Henüz firma başvurusu yok.</p>'; return; }
    root.innerHTML = apps.map(app => {
      const info = app.company_details || {};
      const verification = verifications.find(v => v.application_id === app.id);
      const companyPayments = payments.filter(p => p.application_id === app.id);
      const companyMemberships = memberships.filter(m => m.application_id === app.id);
      const latest = companyMemberships[0];
      const active = !!latest && !!verification?.verified && new Date(latest.ends_at) > new Date();
      const companyEvents = events.filter(ev => ev.application_id === app.id).slice(0, 10);
      const unused = companyPayments.filter(p => !companyMemberships.some(m => m.payment_id === p.id));
      return `<section class="admin-card" data-application="${safe(app.id)}"><h2>${safe(app.company_name)}</h2>
        <p><strong>${app.account_role === "supplier" ? "Üretici / tedarikçi" : "Hizmet sağlayıcı"}</strong> · Yıllık taban bedel: ${money(plans[app.account_role].annualAmountTRY)} + KDV</p>
        ${app.account_role === "service" ? '<p class="admin-error">Hizmet ilanı yönetimi henüz hazır değil. Bu üyelik için ücret tahsil edip aktivasyon yapmadan önce ilan akışını tamamlayın.</p>' : ''}
        <div class="admin-grid">
          <p><span>Başvuru / kullanıcı</span>${date(app.submitted_at)} · ${safe(app.owner_id)}</p>
          <p><span>Yetkili kişi ve iletişim</span>${safe(info.authorized_name)} · ${safe(info.corporate_email)} · ${safe(info.phone)}</p>
          <p><span>Vergi / sicil</span>${safe(info.tax_no)} · ${safe(info.registry_no)}</p>
          <p><span>Şehir / adres</span>${safe(info.city)} · ${safe(info.company_address)}</p>
          <p><span>Firma doğrulaması</span>${verification?.verified ? "Doğrulandı" : "Bekliyor"} · ${date(verification?.reviewed_at)}<br>${actor(verification?.reviewed_by)}</p>
          <p><span>Üyelik</span>${active ? "Aktif" : latest ? "Süresi doldu veya doğrulaması kaldırıldı" : "Henüz etkin değil"}${latest ? `<br>${date(latest.started_at)} – ${date(latest.ends_at)}<br>${actor(latest.activated_by)}` : ""}</p>
        </div>
        <div class="admin-actions"><button type="button" data-document="${safe(app.owner_id)}" class="secondary">Firma belgesini aç</button>
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
        <details><summary>İşlem geçmişi</summary>${companyEvents.map(ev => `<p class="admin-muted">${date(ev.occurred_at)} · ${safe(ev.action)} · ${actor(ev.actor_id)}</p>`).join("") || '<p>Henüz işlem yok.</p>'}</details>
      </section>`;
    }).join("");
  }

  document.addEventListener("click", async event => {
    const documentButton = event.target.closest("[data-document]");
    const verifyButton = event.target.closest("[data-verify]");
    const activateButton = event.target.closest("[data-activate]");
    const button = documentButton || verifyButton || activateButton;
    if (!button || button.disabled) return;
    button.disabled = true;
    const preview = documentButton ? window.open("about:blank", "_blank") : null;
    if (preview) preview.opener = null;
    try {
      if (documentButton) {
        const url = await window.MarbleDB.verificationDocument(button.dataset.document);
        if (!url) throw new Error("Yüklenmiş firma doğrulama belgesi bulunamadı.");
        if (!preview) throw new Error("Tarayıcı belge penceresini engelledi.");
        preview.location.replace(url);
      } else if (verifyButton) {
        await window.MarbleDB.verify(button.dataset.verify, button.dataset.value === "true");
        await load();
      } else {
        if (!window.confirm("Banka ödemesi ve firma belgesini kontrol ettiniz mi? 12 aylık süre şimdi başlayacak.")) return;
        await window.MarbleDB.activate(button.dataset.activate, button.dataset.paymentId);
        await load();
      }
    } catch (failure) { preview?.close(); window.alert(failure.message || "İşlem tamamlanamadı."); }
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
    } catch (failure) { window.alert(failure.message || "Ödeme kaydı oluşturulamadı."); }
    finally { if (button.isConnected) button.disabled = false; }
  });

  void load();
})();

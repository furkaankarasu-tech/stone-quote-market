(() => {
  const status = document.getElementById("mb-reset-status");
  const form = document.getElementById("mb-reset-form");
  const errorBox = document.getElementById("mb-reset-error");
  const hash = window.MarbleRecoveryHash || location.hash;
  delete window.MarbleRecoveryHash;
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  const query = new URLSearchParams(location.search);
  const invalid = "Bağlantı geçersiz veya süresi dolmuş. Ana sayfadaki Şifremi unuttum seçeneğinden yeni bağlantı isteyin.";
  const token = fragment.get("access_token");
  const auth = window.MarbleAuth?.client?.auth;
  if (fragment.has("error") || query.has("error") || fragment.get("type") !== "recovery" || !token || !auth) {
    status.textContent = fragment.has("error") || query.has("error") ? invalid :
      !auth ? "Hesap bağlantısı yüklenemedi. Lütfen tekrar deneyin." : invalid;
    return;
  }

  // Verify the link token against Supabase, and check that the client actually
  // installed a session for the same user. A normal sign-in alone is not enough.
  void (async () => {
    try {
      const link = await auth.getUser(token);
      const current = await auth.getUser();
      if (link.error || current.error || !link.data.user || link.data.user.id !== current.data.user?.id) {
        status.textContent = invalid;
        return;
      }
      history.replaceState(null, "", location.pathname + location.search);
      status.textContent = "E-posta bağlantısı doğrulandı. Yeni şifrenizi belirleyin.";
      form.hidden = false;
      form.elements.password.focus();
    } catch {
      status.textContent = "Bağlantı doğrulanamadı. Lütfen tekrar deneyin.";
    }
  })();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = form.elements.password.value;
    const confirm = form.elements.confirm.value;
    if (password.length < 10 || password.length > 128) {
      errorBox.textContent = "Şifre 10 ile 128 karakter arasında olmalı.";
      return;
    }
    if (password !== confirm) {
      errorBox.textContent = "Şifreler eşleşmiyor.";
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    errorBox.textContent = "";
    try {
      const { error } = await auth.updateUser({ password });
      if (error) throw error;
      form.hidden = true;
      status.textContent = "Şifreniz güncellendi. Ana sayfadan yeni şifrenizle giriş yapabilirsiniz.";
      const signedOut = await auth.signOut();
      if (signedOut.error) status.textContent += " Açık oturumunuz varsa çıkış yapın.";
    } catch {
      errorBox.textContent = "Şifre güncellenemedi. Yeni bağlantı isteyip tekrar deneyin.";
    } finally {
      button.disabled = false;
    }
  });
})();

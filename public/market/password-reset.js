const resetTranslations={"Şifre yenileme": {"en": "Reset password", "zh": "重置密码", "ar": "إعادة تعيين كلمة المرور"}, "HESAP GÜVENLİĞİ": {"en": "ACCOUNT SECURITY", "zh": "账户安全", "ar": "أمان الحساب"}, "Şifrenizi yenileyin": {"en": "Reset your password", "zh": "重置您的密码", "ar": "أعد تعيين كلمة المرور"}, "Bağlantı kontrol ediliyor…": {"en": "Checking link…", "zh": "正在检查链接…", "ar": "جار فحص الرابط…"}, "Yeni şifre": {"en": "New password", "zh": "新密码", "ar": "كلمة المرور الجديدة"}, "Yeni şifre tekrar": {"en": "Confirm new password", "zh": "确认新密码", "ar": "تأكيد كلمة المرور الجديدة"}, "Şifremi güncelle": {"en": "Update password", "zh": "更新密码", "ar": "تحديث كلمة المرور"}, "Ana sayfaya dön →": {"en": "Back to home →", "zh": "返回首页 →", "ar": "العودة للرئيسية →"}, "Bağlantı geçersiz veya süresi dolmuş. Ana sayfadaki Şifremi unuttum seçeneğinden yeni bağlantı isteyin.": {"en": "This link is invalid or expired. Request a new link using Forgot password on the home page.", "zh": "链接无效或已过期。请在首页通过“忘记密码”申请新链接。", "ar": "الرابط غير صالح أو منتهي. اطلب رابطاً جديداً من خيار نسيت كلمة المرور في الرئيسية."}, "Hesap bağlantısı yüklenemedi. Lütfen tekrar deneyin.": {"en": "Could not connect to your account. Please retry.", "zh": "无法连接账户，请重试。", "ar": "تعذر الاتصال بالحساب. حاول مجدداً."}, "E-posta bağlantısı doğrulandı. Yeni şifrenizi belirleyin.": {"en": "Email link verified. Set your new password.", "zh": "邮箱链接已验证，请设置新密码。", "ar": "تم التحقق من رابط البريد. حدد كلمة المرور الجديدة."}, "Bağlantı doğrulanamadı. Lütfen tekrar deneyin.": {"en": "Could not verify the link. Please retry.", "zh": "无法验证链接，请重试。", "ar": "تعذر التحقق من الرابط. حاول مجدداً."}, "Şifre 10 ile 128 karakter arasında olmalı.": {"en": "Use a password between 10 and 128 characters.", "zh": "密码需为10至128个字符。", "ar": "يجب أن تكون كلمة المرور بين 10 و128 حرفاً."}, "Şifreler eşleşmiyor.": {"en": "Passwords do not match.", "zh": "两次密码不一致。", "ar": "كلمتا المرور غير متطابقتين."}, "Şifreniz güncellendi. Ana sayfadan yeni şifrenizle giriş yapabilirsiniz.": {"en": "Your password was updated. Sign in with your new password on the home page.", "zh": "密码已更新，您可在首页使用新密码登录。", "ar": "تم تحديث كلمة المرور. يمكنك الدخول بكلمة المرور الجديدة في الرئيسية."}, " Açık oturumunuz varsa çıkış yapın.": {"en": " Sign out of any existing session.", "zh": " 请退出已有会话。", "ar": " سجّل الخروج من أي جلسة مفتوحة."}, "Şifre güncellenemedi. Yeni bağlantı isteyip tekrar deneyin.": {"en": "Could not update the password. Request a new link and retry.", "zh": "无法更新密码，请申请新链接后重试。", "ar": "تعذر تحديث كلمة المرور. اطلب رابطاً جديداً وحاول مجدداً."}, "Şifre yenileme ekranı yüklenemedi. Lütfen tekrar deneyin.": {"en": "Could not load password reset. Please retry.", "zh": "无法加载密码重置页面，请重试。", "ar": "تعذر تحميل إعادة تعيين كلمة المرور. حاول مجدداً."}};
function resetText(text){const locale=location.pathname.split("/")[1];return resetTranslations[text]?.[locale]||text}
(() => {
  const status = document.getElementById("mb-reset-status");
  const form = document.getElementById("mb-reset-form");
  const errorBox = document.getElementById("mb-reset-error");
  const hash = window.MarbleRecoveryHash || location.hash;
  delete window.MarbleRecoveryHash;
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  const query = new URLSearchParams(location.search);
  const invalid = resetText("Bağlantı geçersiz veya süresi dolmuş. Ana sayfadaki Şifremi unuttum seçeneğinden yeni bağlantı isteyin.");
  const token = fragment.get("access_token");
  const auth = window.MarbleAuth?.client?.auth;
  if (fragment.has("error") || query.has("error") || fragment.get("type") !== "recovery" || !token || !auth) {
    status.textContent = fragment.has("error") || query.has("error") ? invalid :
      !auth ? resetText("Hesap bağlantısı yüklenemedi. Lütfen tekrar deneyin.") : invalid;
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
      status.textContent = resetText("E-posta bağlantısı doğrulandı. Yeni şifrenizi belirleyin.");
      form.hidden = false;
      form.elements.password.focus();
    } catch {
      status.textContent = resetText("Bağlantı doğrulanamadı. Lütfen tekrar deneyin.");
    }
  })();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = form.elements.password.value;
    const confirm = form.elements.confirm.value;
    if (password.length < 10 || password.length > 128) {
      errorBox.textContent = resetText("Şifre 10 ile 128 karakter arasında olmalı.");
      return;
    }
    if (password !== confirm) {
      errorBox.textContent = resetText("Şifreler eşleşmiyor.");
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    errorBox.textContent = "";
    try {
      const { error } = await auth.updateUser({ password });
      if (error) throw error;
      form.hidden = true;
      status.textContent = resetText("Şifreniz güncellendi. Ana sayfadan yeni şifrenizle giriş yapabilirsiniz.");
      const signedOut = await auth.signOut();
      if (signedOut.error) status.textContent += resetText(" Açık oturumunuz varsa çıkış yapın.");
    } catch {
      errorBox.textContent = resetText("Şifre güncellenemedi. Yeni bağlantı isteyip tekrar deneyin.");
    } finally {
      button.disabled = false;
    }
  });
})();

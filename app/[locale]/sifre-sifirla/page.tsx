import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PasswordResetScripts from "@/components/PasswordResetScripts";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const {locale}=await params; return {title:({tr:"Şifre yenileme",en:"Reset password",zh:"重置密码",ar:"إعادة تعيين كلمة المرور"} as Record<string,string>)[locale]+" | Marble Borsa",robots:{index:false,follow:false}};
}
export function generateStaticParams(){return ["tr","en","zh","ar"].map(locale=>({locale}))}
export default async function PasswordResetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) notFound();
  const translations={"Şifre yenileme": {"en": "Reset password", "zh": "重置密码", "ar": "إعادة تعيين كلمة المرور"}, "HESAP GÜVENLİĞİ": {"en": "ACCOUNT SECURITY", "zh": "账户安全", "ar": "أمان الحساب"}, "Şifrenizi yenileyin": {"en": "Reset your password", "zh": "重置您的密码", "ar": "أعد تعيين كلمة المرور"}, "Bağlantı kontrol ediliyor…": {"en": "Checking link…", "zh": "正在检查链接…", "ar": "جار فحص الرابط…"}, "Yeni şifre": {"en": "New password", "zh": "新密码", "ar": "كلمة المرور الجديدة"}, "Yeni şifre tekrar": {"en": "Confirm new password", "zh": "确认新密码", "ar": "تأكيد كلمة المرور الجديدة"}, "Şifremi güncelle": {"en": "Update password", "zh": "更新密码", "ar": "تحديث كلمة المرور"}, "Ana sayfaya dön →": {"en": "Back to home →", "zh": "返回首页 →", "ar": "العودة للرئيسية →"}, "Bağlantı geçersiz veya süresi dolmuş. Ana sayfadaki Şifremi unuttum seçeneğinden yeni bağlantı isteyin.": {"en": "This link is invalid or expired. Request a new link using Forgot password on the home page.", "zh": "链接无效或已过期。请在首页通过“忘记密码”申请新链接。", "ar": "الرابط غير صالح أو منتهي. اطلب رابطاً جديداً من خيار نسيت كلمة المرور في الرئيسية."}, "Hesap bağlantısı yüklenemedi. Lütfen tekrar deneyin.": {"en": "Could not connect to your account. Please retry.", "zh": "无法连接账户，请重试。", "ar": "تعذر الاتصال بالحساب. حاول مجدداً."}, "E-posta bağlantısı doğrulandı. Yeni şifrenizi belirleyin.": {"en": "Email link verified. Set your new password.", "zh": "邮箱链接已验证，请设置新密码。", "ar": "تم التحقق من رابط البريد. حدد كلمة المرور الجديدة."}, "Bağlantı doğrulanamadı. Lütfen tekrar deneyin.": {"en": "Could not verify the link. Please retry.", "zh": "无法验证链接，请重试。", "ar": "تعذر التحقق من الرابط. حاول مجدداً."}, "Şifre 10 ile 128 karakter arasında olmalı.": {"en": "Use a password between 10 and 128 characters.", "zh": "密码需为10至128个字符。", "ar": "يجب أن تكون كلمة المرور بين 10 و128 حرفاً."}, "Şifreler eşleşmiyor.": {"en": "Passwords do not match.", "zh": "两次密码不一致。", "ar": "كلمتا المرور غير متطابقتين."}, "Şifreniz güncellendi. Ana sayfadan yeni şifrenizle giriş yapabilirsiniz.": {"en": "Your password was updated. Sign in with your new password on the home page.", "zh": "密码已更新，您可在首页使用新密码登录。", "ar": "تم تحديث كلمة المرور. يمكنك الدخول بكلمة المرور الجديدة في الرئيسية."}, " Açık oturumunuz varsa çıkış yapın.": {"en": " Sign out of any existing session.", "zh": " 请退出已有会话。", "ar": " سجّل الخروج من أي جلسة مفتوحة."}, "Şifre güncellenemedi. Yeni bağlantı isteyip tekrar deneyin.": {"en": "Could not update the password. Request a new link and retry.", "zh": "无法更新密码，请申请新链接后重试。", "ar": "تعذر تحديث كلمة المرور. اطلب رابطاً جديداً وحاول مجدداً."}, "Şifre yenileme ekranı yüklenemedi. Lütfen tekrar deneyin.": {"en": "Could not load password reset. Please retry.", "zh": "无法加载密码重置页面，请重试。", "ar": "تعذر تحميل إعادة تعيين كلمة المرور. حاول مجدداً."}} as Record<string,Record<string,string>>;
  const t=(text:string)=>translations[text]?.[locale]||text;
  return <main id="main-content" tabIndex={-1} className="mb-reset-shell" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
    <link rel="stylesheet" href="/market/password-reset.css" />
    <section className="mb-reset-card">
      <a className="mb-reset-brand" href={`/${locale}`}>Marble Borsa</a>
      <span className="mb-reset-eyebrow">{t("HESAP GÜVENLİĞİ")}</span>
      <h1>{t("Şifrenizi yenileyin")}</h1>
      <p id="mb-reset-status" role="status">{t("Bağlantı kontrol ediliyor…")}</p>
      <form id="mb-reset-form" hidden>
        <label>{t("Yeni şifre")}<input name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
        <label>{t("Yeni şifre tekrar")}<input name="confirm" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
        <p id="mb-reset-error" role="alert" aria-live="polite" />
        <button type="submit">{t("Şifremi güncelle")}</button>
      </form>
      <a className="mb-reset-return" href={`/${locale}`}>{t("Ana sayfaya dön →")}</a>
    </section>
    <PasswordResetScripts />
  </main>;
}

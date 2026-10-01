# Marble Borsa doğrulama e-postası

Bu dosya, `edndfgxkbfatmfemiayj` Supabase projesindeki **Confirm signup** e-postasının görünen gönderenini ve içeriğini Marble Borsa adına ayarlamak içindir. Site kodu Supabase Auth ile kayıt yapmaya ve güvenli doğrulama bağlantısını kullanmaya devam eder. Bu ayar için SQL Editor'de komut çalıştırılmaz.

## 1. Kendi adresinizden gönderim

`marbleborsa.com` alan adı size ait ve e-posta gönderimi için doğrulanmışsa önerilen görünüm:

| Alan | Değer |
| --- | --- |
| Görünen gönderen adı | `Marble Borsa` |
| Gönderen e-posta | `uyelik@marbleborsa.com` |

Bir SMTP sağlayıcısında alan adını doğrulayın; sağlayıcının verdiği DNS kayıtlarını (SPF/DKIM, önerilen DMARC) alan adınızın DNS yönetiminde ekleyin. Sağlayıcının SMTP **host, port, kullanıcı adı ve şifresini** alın. Supabase Dashboard'da bu projede **Authentication → SMTP Settings** (bazı arayüzlerde **Authentication → Settings → SMTP Settings**) bölümünden **Custom SMTP** seçeneğini açın. Sender name, Sender email, host, port, username ve password alanlarını sağlayıcının yönergesine göre doldurup kaydedin. SMTP kullanıcı adı, gönderen e-posta adresinden farklı olabilir; sağlayıcı hangi bilgileri verdiyse onları kullanın. SMTP şifresini site koduna, `NEXT_PUBLIC_` değişkenlerine veya GitHub'a koymayın.

**28 Eylül görüntüsündeki gönderim sorununun nedeni:** Supabase'de host `sandbox.smtp.mailtrap.io` seçilmiş. Bu Mailtrap'in test SMTP sunucusudur; mesajlar gerçek Gmail kutusuna değil **Mailtrap → Sandboxes → ilgili test kutusuna** düşer. Yalnızca kendi test hesabınız için gelen onay bağlantısını oradan açabilirsiniz. Gerçek kullanıcılara mail göndermek için Mailtrap'te **Email API/SMTP → Sending Domains** bölümünde sahibi olduğunuz gönderim alanını ekleyin, verilen DNS kayıtlarını uygulayın ve alanın **Verified** durumuna geçmesini bekleyin. Daha sonra aynı alanın **Integration → SMTP** bölümünden **canlı gönderim** host, port, kullanıcı adı ve şifresini alıp Supabase'deki dört SMTP alanının tümünü değiştirin. Sandbox kullanıcı adı/şifresi canlı gönderimde kullanılmaz. Gönderen `marbleborsa@marbleborsa.com` ise gönderim alanı `marbleborsa.com` için doğrulama tamamlanmış olmalıdır. Ayarı kaydedip sitede **Giriş Yap → Onay e-postasını tekrar gönder** bağlantısıyla bekleyen hesabı yeniden deneyin; 60 saniyelik kullanıcı başına gönderim aralığını bekleyin. Hâlâ gelmezse Supabase **Auth Logs**, Mailtrap **Email Logs** ve spam klasörünü kontrol edin.

`marbleborsa.com` henüz sizde değilse veya SMTP sağlayıcısında doğrulanmadıysa o adresi gönderen olarak kullanamazsınız. Önce kendi alan adınızı ve e-posta gönderim hesabınızı hazırlayın. Yalnızca şablonu değiştirmek, gelen kutusundaki `Supabase Auth <noreply@mail.app.supabase.io>` gönderenini değiştirmez.

## 2. Türkçe onay şablonu

Supabase Dashboard → **Authentication → Email Templates → Confirm signup** bölümünde:

- **Subject:** `Marble Borsa | E-posta adresinizi doğrulayın`
- **Body / HTML:** [`supabase/email-templates/confirm-signup.html`](supabase/email-templates/confirm-signup.html) dosyasının **tam içeriği**.

HTML'deki `{{ .ConfirmationURL }}` değerini aynen bırakın. Bu Supabase'in e-posta için ürettiği doğrulama bağlantısıdır; mevcut kayıt kodu üretim sitesindeki `/tr` sayfasına dönüş adresi gönderir. Buton için yalnızca `{{ .SiteURL }}` veya sabit bir `localhost` adresi kullanmayın.

## 3. Dönüş adresi ve deneme

Supabase **Authentication → URL Configuration** bölümünde **Site URL** `https://stone-quote-market.vercel.app` ve **Redirect URLs** içinde hem `https://stone-quote-market.vercel.app/tr` hem de **şifre yenileme için** `https://stone-quote-market.vercel.app/tr/sifre-sifirla` kayıtlı olmalı. Vercel Production ayarı `NEXT_PUBLIC_SITE_URL=https://stone-quote-market.vercel.app` olmalı. Üretim alan adı değişirse site adresini, dönüş adreslerini ve Vercel değişkenini birlikte güncelleyin.

Supabase **Authentication → Sign In / Providers → Email → Confirm Email** açık kalsın. Ayarları kaydettikten sonra yeni bir e-posta adresiyle kayıt oluşturun (veya doğrulama e-postasını yeniden gönderin). Gelen kutusunda gönderen adı/adresi, Türkçe konu, butonun çalışması ve onay sonrası `/tr` dönüşünü kontrol edin. Eski e-postalar ayar değişikliğinden etkilenmez.

**Not:** SMTP ayarı gönderici alan adını ve mesajın teslimini değiştirir. Doğrulama bağlantısının ilk açtığı Supabase Auth adresini kendi alan adınız altında göstermek ayrıca bir özel Auth alan adı yapılandırması gerektirir; mevcut akış için gerekli değildir.

## 4. Şifre yenileme

Sitede **Giriş Yap → Şifremi unuttum** bölümüne kayıtlı e-postayı girin. Supabase e-posta bağlantısı gönderir; bağlantı `/tr/sifre-sifirla` sayfasını açar ve yeni şifreyi orada belirletir. Bu işlem aynı hesabı günceller, yeni hesap açmaz. Supabase **Authentication → Email Templates → Reset Password** şablonunu Marble Borsa görünümüne almak isterseniz konu için `Marble Borsa | Şifrenizi yenileyin`, HTML için [`supabase/email-templates/reset-password.html`](supabase/email-templates/reset-password.html) dosyasını kullanın. Şablondaki `{{ .ConfirmationURL }}` bağlantısını değiştirmeyin.

Kayıtlı bir e-postayla yeniden **Üye Ol** denendiğinde Supabase güvenlik gereği bazen yeni hesap açılmış gibi yanıt verebilir. Veritabanında ikinci Auth hesabı oluşmaz. Site artık kesin bir 'başvuru oluşturuldu' iddiası yerine, yeni kullanıcıya onay linkini, mevcut kullanıcıya giriş veya şifre yenilemeyi anlatan ortak bir bilgilendirme gösterir. **Confirm Email** ayarını kapatmayın; kapatılması üyelik güvenliğini bozar.

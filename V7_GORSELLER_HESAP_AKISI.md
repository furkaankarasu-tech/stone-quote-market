# Marble Borsa V7: kategori görselleri ve hesap işlemleri

Bu sürüm V6 tam proje üzerine hazırlanmıştır. ÖNCE Vercel Preview'da test edin; başarılı kontrol olmadan canlıya göndermeyin.

## Neler değişti
- Makine & Sarf ve Sektörel Hizmetler için toplam 12 yeni WebP temsili sektör fotoğrafı (orijinal SVG'ler yalnızca yedek olarak korunur).
- Görselleri hem ilk sunucu HTML'sinde hem JavaScript ile oluşturulan kartlarda yeni dosyalara bağladık.
- Giriş başarılı olunca kullanıcı menüsü hemen güncellenir; giriş ekranında onaylanmamış e-posta için anlaşılır mesaj gösterilir.
- Rehber, kaynak bulma ve ürün detay sayfalarının üst menüsüne Giriş Yap / Üye Ol bağlantıları eklendi (TR/EN/ZH/AR). Bağlantılar mevcut güvenli hesap formlarına gider, ikinci bir hesap sistemi açmaz.
- Giriş/üyelik formuna yönlendirmeler ancak gerekli istemci modülleri yüklendiğinde açılır; bağlantı yüklenemezse kullanıcıya hata bildirimi gösterilir.
- Önceki KVKK onayları, ücret gizleme, satıcı onayı ve mevcut Supabase şeması değiştirilmedi.

## GitHub ve Vercel
1. **V6 projesi GitHub'daysa** V7 yalnızca değişen dosyalar ZIP'ini, klasör yapısını koruyarak yeni bir dala yükleyin.
2. Farklı veya yerel kopya konusunda emin değilseniz V7 tam proje ZIP'i esas alın.
3. Vercel Preview dağıtımında önce `/tr/makine-sarf` ve `/tr/hizmetler`, ardından `/tr/rehber` ve `/tr/profil` sayfalarını açın. Tarayıcı konsolunda script yükleme hatası olmadığını kontrol edin.
4. Gerçek **test e-postasıyla** bir alıcı hesabı açın, doğrulama postasını onaylayın, giriş yapın, Profil ve Çıkış Yap butonlarını kontrol edin. Firma hesabı testinde belgeler ve yönetici onayı ayrıca gerekir.
5. Supabase Authentication > URL Configuration için Site URL ve doğrulama / şifre sıfırlama Redirect URL'lerinin canlı domaini gösterdiğini kontrol edin. E-posta doğrulaması ve e-posta gönderimi açık olmalı.
6. Preview başarılı olduktan sonra canlıya geçin. Google'la ilgili `noindex` önizleme korumasına dokunulmadı.

## Test edilenler ve sınır
- Node tabanlı mevcut smoke testler ve yeni V7 testi geçti.
- Yerel tarayıcı simülasyonunda kayıt formu açma, alıcı kayıt formu gönderme, doğrulanmış oturumla giriş, profil/çıkış menüsü ve çıkış akışı kontrol edildi.
- Bu testler **sahte (mock) Supabase yanıtları** kullandı; gerçek veritabanına yeni bir hesap açılmadı ve canlı e-posta gönderimi doğrulanmadı.
- npm bağımlılıkları bu ortamda indirilemediği için **tam Next.js build testi yapılamadı**. Vercel'in önizleme derlemesini kontrol edin.
- Yeni görseller açıklayıcı yapay üretim görselleridir; gerçek şirket stoğu veya belirli makine modelinin ürün fotoğrafı değildir.

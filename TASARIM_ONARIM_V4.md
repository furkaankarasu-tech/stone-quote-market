# Marble Borsa V4 — tasarım dosyasının güvenli yüklenmesi

Önceki V3 paketinde ana tasarım yalnızca `<link href="/market/style.css">` bağlantısına dayanıyordu. Bu dosya dağıtımda 404 verdiğinde veya statik kaynak servisi dosyayı sunamadığında bütün ana sayfa tarayıcının varsayılan görünümüne dönüyordu. Ekran görüntüsünden gerçek HTTP durum kodu doğrulanamadığı için bu, gözlenen belirtiyi açıklayan olası kök nedendir.

**Düzeltme:** `app/market.css` ana tasarımın tam kopyasını, Next.js'in global CSS derlemesine dahil eder. `app/layout.tsx` bunu rehber tasarımından önce import eder; tek harici CSS bağlantısına bağımlılık kaldırılmıştır. Taş görsellerinin CSS yolları `public/market/images/` için kök adresli olacak şekilde güncellenmiştir. Eski `public/market/style.css` diğer eski bağlantılar için korunur. Çeviriler ve ücret gizleme işlemleri V3'teki haliyle kalır.

## Güncelleme

- Önce güvenlik için GitHub'da yeni dal açın ve bu sürümü o dala yükleyin.
- İlk seçenek: **V4 tam proje** arşivini kullanın (mevcut yerel projedeki kişisel veya gizli `.env` dosyalarını değiştirmeyin).
- V3 zaten GitHub'da eksiksizse **V4 değişen dosyalar** arşivini klasörleri koruyarak aynı köke uygulayın. V2 veya daha eski sürümdeyseniz değişen dosyalar arşivini tek başına uygulamayın.
- Vercel Preview'da ana sayfayı açın. Tarayıcı geliştirici araçları Network sekmesinde `/_next/static/css/` ile başlayan CSS dosyalarının `200` döndüğünü doğrulayın; görselleri de kontrol edin.
- Chrome gizli pencereyle `/`, `/tr/rehber`, `/en/guide`, `/zh/guide`, `/ar/guide`, üyelik ekranı ve giriş/çıkış butonunu test edin. Çince görünmesi tek başına hata değildir; dil seçici geçmişte Çinceye ayarlanmış olabilir.
- **Vercel Preview** adresinin `noindex` olması normaldir. Üretim SEO testini gerçek özel alan adında yapın. Her şey doğruysa Vercel Production'a alın.

## Teknik testler

`node tests/styles-distribution-smoke.cjs` ve mevcut `node tests/*.cjs` dosyaları çalıştırılabilir. Bağımlılıklar indirilip kurulabildiği bir ortamda ayrıca `npm ci && npm run build` çalıştırın; burada tam Next.js derlemesi ayrıca garanti edilmez. Bu paket, canlı Vercel yanıtına erişim olmadan statik kod ve yerel render mantığı üzerinden hazırlanmıştır.

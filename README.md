# Marble Borsa · Taş görselleri ve kompakt yeni görünüm

Bu sürüm, önceki 100 dosyalık çalışan yapının üzerine hazırlanmıştır.

## Değişenler
- Ana sayfanın yeşil üst alanı, daha kompakt ve açık tonlu bir düzene geçti. Mevcut çalışan teklif alanı ve kaydırılabilir taş sunumu korundu.
- Doğal taş kartları ve taş detay sayfaları artık birbiriyle uyumlu, fotoğrafik **temsili plaka sunumları** kullanıyor.
- 9 doğal taş için görsel güncellendi. Detay sayfasında ayrıca temsili yakın doku atlası bulunuyor.
- Üyelik, teklif, Supabase ve dil sistemi mantığı değiştirilmedi.
- Önceki 6 makine/sarf görseli de tam paketin içinde korunuyor.

## Önemli görsel açıklaması
Yeni fotoğrafik plakalar, taş dokularından üretilmiş temsili görselleştirmelerdir. Gerçek stok, numune ya da belirli bir üreticinin taş partisi olarak tanıtılmamalıdır. Üyelerin yükleyeceği gerçek fotoğraflar katalog içinde aynen gösterilmeye devam eder.

## GitHub / Vercel
`Marble_Borsa_V10_Yeni_Tas_Tasarimi_100_Dosya.zip` arşivini açarak kök dizin yapısını koruyup yeni bir GitHub dalına yükleyin. Tam paket tam 100 dosyadır; mevcut dosyalarla **birleştirirken** eski `bilecik-beige.svg`, `mugla-white.svg`, `marmara-white.svg` ve `app/apple-icon.png` dosyalarını silerseniz toplam 100 kalır. Önizleme dağıtımında görselleri ve hesap akışını kontrol ettikten sonra canlıya alın.

Yalnızca değişiklik paketini uygularken `SILINECEK_DOSYALAR.txt` belgesine bakın. Mevcut Vercel ortam değişkenlerini koruyun. Vercel preview adreslerinin `noindex` davranışı normaldir, canlı domain üzerindeki SEO testlerini ayrı yapın.

Testler: 41 TS/TSX dosyası dönüştürme/sözdizimi kontrolünden, 7 CSS dosyası sözdizimi kontrolünden ve görsel/bağlantı statik testleri başarıyla geçmiştir. Gerçek Supabase işlemleri ve tam Next.js build henüz bu ortamda test edilmemiştir.

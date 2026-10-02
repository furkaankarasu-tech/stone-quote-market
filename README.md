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


# Marble Borsa V11

- Ana sayfa (`/`, `/tr`) dört kategorinin keşif sayfasıdır. `/tr/dogal-tas` ayrı kategoridir.
- Üst şeritte yüksek kontrast metin, tüm sayfalarda ortak menü, açık renk Mermer Rehberi.
- Kayıt / teklif / veritabanı modülleri değiştirilmedi.
- Vercel production: NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com ve NEXT_PUBLIC_ALLOW_INDEXING=true. Önizleme adresleri bilinçli olarak indekslenmez.
- GitHub: ZIP içindeki dosyaları proje köküne klasör yapısıyla yükleyin. ZIP dosyasını doğrudan yüklemeyin.
- Gerçek giriş ve Next.js production build işlemlerini Vercel önizlemesinde ayrıca kontrol edin.


## V12: Derleme ve SEO düzenlemeleri

- `components/DetailChrome.tsx`: Rehber/taş sayfalarının alt bilgisindeki tanımsız `activeSection` değişkeni kaldırıldı.
- `lib/seo.ts`: Ana sayfa başlığı ve açıklaması, mermer satış sitesi değil B2B keşif/teklif modeli olarak güncellendi.
- `components/Marketplace.tsx`: Ana sayfanın dört gerçek kategori bağlantısını tanımlayan CollectionPage/ItemList verisi eklendi.
- `lib/marketMarkup.ts` ve `public/market/app.js`: Ana sayfa görünen tanıtım metni eşleştirildi.
- Diğer sayfaların tasarımı, giriş/üyelik ve dört dilin rotaları değiştirilmedi.

### Vercel üretim ayarları

Production ortamında `NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com` ve `NEXT_PUBLIC_ALLOW_INDEXING=true` tanımlı olmalıdır.
Preview dağıtımları bilerek `noindex` olarak kalır. Bunları değiştirerek SEO puanı yükseltmeye çalışmayın.

**Dağıtım:** `home` branch'ini izleyen Vercel projesine yeni commit gönderin. Derleme başarısızsa günlükte `next build` satırının **altında** görünen ilk `Error:` satırını alın.

**Not:** Kod düzeltmesi yapılmıştır ancak bu ortamda npm bağımlılıkları çevrimdışı bulunmadığı için tam Next.js derlemesi çalıştırılamamıştır.

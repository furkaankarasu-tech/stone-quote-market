# Marble Borsa

Next.js 15 ve Supabase ile doğal taş, makine/sarf ve hizmet firmaları için B2B katalog ve teklif platformu.

## Yeni V3: Rehber çevirisi ve ücret gösterimi

Rehberlerin 6 konusu TR/EN/ZH/AR dillerinde ayrı URL ve içeriklerle sunulur. Ana sayfadaki rehber bağlantısı dil değiştirir. Firma üyeliği kayıt ve profil ekranlarında sabit ücretler artık gösterilmez; üyelik sözleşmesinde geçerli ücretin ödeme öncesinde yazılı bildirileceği belirtilir. Yönetici ücret kayıtları aynen korunur. **Güncel kurulum ve kontrol:** [SURUM_V3_KURULUM.md](SURUM_V3_KURULUM.md).

## Kurulum ve yayın

1. `npm ci` ve `npm run build` çalıştırın. Üretim ortamında proje kökünü Vercel'e dağıtın. `NEXT_PUBLIC_SITE_URL` değerini gerçek yayın adresinizle, `NEXT_PUBLIC_ALLOW_INDEXING` değerini yayın kararınızla eşleştirin. Supabase `service_role` anahtarını istemci değişkenlerine koymayın.
2. Supabase SQL dosyalarını [VERITABANI_KURULUMU.md](VERITABANI_KURULUMU.md) içindeki sırayla çalıştırın. Önceki sürüm ve logo migrasyonu kuruluysa **yalnızca** `supabase/migrations/20260930_equipment_catalog_profile.sql` dosyasını en son uygulayın. Kodun yüklenmesi SQL'i otomatik çalıştırmaz.
3. Supabase Auth e-posta doğrulamasını ve üretim adresine dönüş URL'lerini ayarlayın. SMTP gönderen alanı için [EPOSTA_GONDERICI_AYARI.md](EPOSTA_GONDERICI_AYARI.md) dosyasını izleyin.
4. `lib/dataController.ts` içindeki gerçek veri sorumlusu unvanını ve tebligat adresini sağlayıp yasal metinleri kontrol ettirin. Şu an köşeli parantezli alanlar bilerek boş bırakılmıştır.
5. Mevcut `stone-quote-market.vercel.app/tr` adresi kontrol edildiğinde Vercel `DEPLOYMENT_NOT_FOUND` yanıtı verdi. Vercel'de gerçek Production dağıtımı ve bağlı alan adını kontrol edip onunla uçtan uca test yapın. Bu paketin canlı sitede çalıştığı henüz doğrulanmadı.

## Hesaplar ve içerik

- E-postasını doğrulayan alıcı taş ve makine/sarf talebi açar. Firma ve üyeliği onaylı tedarikçi hizmet ve makine/sarf talebi açar. Onaylı hizmet firması makine/sarf talebi açar. Satıcılar uygun ürün taleplerine, hizmet firmaları hizmet taleplerine teklif verebilir; hiçbiri kendi talebine teklif veremez. Supabase RLS bu ayrımı zorlar.
- `Profil` (`/tr/profil`) üyelik, özel firma belgesi, logo, rehber görünürlüğü, katalog ve kendi talep/tekliflerini bir araya getirir. Giriş yapan kullanıcı bulunduğu sayfada kalır; üst menüdeki **Profil** düğmesiyle panele gider. Katalog sayfası altında hesap kartları görünmez. Yönetici `/tr/yonetim` üzerinden başvuruyu, ödemeyi ve üyeliği inceler.
- Onaylı tedarikçi taş/makine/sarf, onaylı hizmet firması hizmet katalog kaydı ekleyebilir. Her kayıt 3–10 fotoğraf, açıklama, isteğe bağlı PDF ve HTTPS video bağlantısı içerir. Kayıt düzenlenebilir veya yayından kaldırılabilir. Fotoğrafları değiştirmek için yeni kayıt oluşturulur. Rehber ve katalogda yalnızca e-posta ve firma doğrulaması tamamlanmış, üyeliği aktif, rehber görünürlüğü açık firmalar gösterilir.
- Logolar `mb-company-logos`, katalog görselleri/PDF `mb-catalog-assets` adlı herkese açık Storage alanındadır. Firma doğrulama dosyaları `mb-company-documents-private` özel alanındadır. Yayınlanan katalog dosyalarını gizlilik gerektiren belge olarak kullanmayın.
- Daha önceki temsili firma listesi kaldırıldı. Taş türleri, makine ve hizmet çizimleri kategori rehberi olarak yerinde durur; gerçek şirket tarafından sunulduğunu ileri sürmez. Gerçek firma ürünleri ve logoları Supabase'den gelir. Ayrılmış tanıtım alanları marka veya kurum iş birliği iddiası taşımaz.

## Kontrol

`node tests/market-ui-smoke.cjs`, `node tests/directory-data-smoke.cjs`, `node tests/admin-outreach-smoke.cjs` ve `node tests/auth-recovery-smoke.cjs` istemci akışlarını yerel taklit veriyle kontrol eder. Gerçek Supabase ve Production ortamı için kurulum belgesindeki iki hesaplı test ayrıca gereklidir.

## SEO rehberi güncellemesi (1 Ekim 2026)

Üç yeni Türkçe rehber, İngilizce alıcı rehberi, site haritası ve favicon güncellemesi eklendi.
Yayın öncesi ayrıntılı kontrol listesi: [SEO_YENI_SURUM_KURULUM.md](SEO_YENI_SURUM_KURULUM.md).


### SEO V2 değişiklikleri

Preview URL'ler `noindex` kalır; canlı domain ayrı kontrol edilir. Mermer alımına yönelik üç yeni genel bilgi yazısı ve katalogdan bağımsız rehber arayüzü eklendi. Giriş yapıldığında ana üst menüde çıkış butonu görünür. Ayrıntılı adımlar: `SEO_YENI_SURUM_KURULUM.md`.

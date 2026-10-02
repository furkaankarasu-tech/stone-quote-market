# Marble Borsa V6: satış yapmadan B2B tedarik SEO'su

Bu sürüm **V5 Canlı Metinler** üzerinden hazırlanmıştır. Tasarım, kayıt ve teklif işlemleri yeniden yazılmamıştır. Platform doğrudan mermer satıcısı veya ticari aracı olarak gösterilmez.

## Yeni indekslenebilir sayfalar

| Konu | TR | EN | ZH | AR |
|---|---|---|---|---|
| Alıcıların teklif alma süreci | `/tr/mermer-teklifi-al` | `/en/request-marble-quotes` | `/zh/request-marble-quotes` | `/ar/request-marble-quotes` |
| B2B tedarik platformu | `/tr/b2b-mermer` | `/en/b2b-marble` | `/zh/b2b-marble` | `/ar/b2b-marble` |

Her sayfanın kendine ait başlığı ve açıklaması, canonical URL'si, karşılıklı dört dil `hreflang` eşleştirmesi ve breadcrumb yapılandırılmış verisi vardır. İçerikler satış/stok iddiası taşımadan, teklif talebi ve doğrudan alıcı–tedarikçi ilişkisini açıklar.

Ana sayfa ve doğal taş dizininde iki yeni bağlantı kartı yer alır; ana sayfa dil değiştirme işlemi bu kartları da çevirir. Mevcut mermer rehberi ve yazılarından bu sayfalara dahili bağlantılar bulunur. Sitemap 8 yeni URL'yi ve karşılıklı dil alternatiflerini listeler. Eski sayfa adresleri korunmuştur.

## Yayına almadan önce

1. GitHub'da ana daldan ayrı bir dal açın. **Sadece Değişen Dosyalar** ZIP'indeki kök klasör yapısını koruyarak dosyaları ekleyin; V5 üzerine kurulmalıdır. Ana dal V4 veya daha eskiyse *Tam Proje* paketini inceleyip eksik V5 değişikliklerinin de taşındığını doğrulayın.
2. `npm ci`, `npm run build` ve `node tests/b2b-sourcing-smoke.cjs` dahil `tests/*.cjs` testlerini çalıştırın. Mevcut üyelik, profil ve teklif akışını iki gerçek test hesabıyla kontrol edin.
3. Vercel Preview'da masaüstü/mobil tasarım, dört dilde içerik ve aynı sayfada dil değiştirme işlevini test edin. Preview ortamı `noindex` kalmalıdır.
4. Production ortamında `NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com` ve yayımlamak istiyorsanız `NEXT_PUBLIC_ALLOW_INDEXING=true` ayarlarını doğrulayın. Production dışındaki Preview adreslerini Google'a göndermeyin.
5. Canlıya alındıktan sonra iki Türkçe sayfayı ve uygun yabancı dil sayfalarını Search Console URL Denetimi'nde kontrol edin; güncellenen `/sitemap.xml` haritasının alındığını doğrulayın.

**İş modeli:** Mermer veya doğal taş satışları, fiyatlar, sözleşmeler, ödeme ve nakliye ilgili alıcı ve satıcılar tarafından doğrudan kararlaştırılır. Marble Borsa bu sayfalarda kendi stokunun bulunduğunu veya komisyoncu olarak işlem yaptığını iddia etmez.

**Önemli:** Bu ortamda npm paket sunucusuna DNS erişimi olmadığı için tam Next.js build çalıştırılamadı. Kaynak kod sözdizimi, eski testler ve sekiz sayfanın veri/rota kontrolleri çalıştırıldı. Bu nedenle Vercel önizleme derlemesi başarısız olursa canlıya dağıtmayın. Google sıralaması ve belirli anahtar kelimelerde ilk sayfada görünmek garanti değildir.

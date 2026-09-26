# Marble Borsa – SEO kontrolü (indeksleme açık sürüm)

Bu kontrol GitHub'a yüklenmeye hazır kaynak kodu içindir. 25 Eylül 2026 tarihinde canlı ana sayfa PageSpeed'de mobil ve masaüstünde 69 SEO puanı aldı: tek başarısız denetim `noindex` idi. Bu paket henüz yüklenmediği için yeni sürümün puanı ölçülmedi.

## Düzeltilenler

| Konu | Sonuç |
| --- | --- |
| Kategori seçince sayfanın aşağı inmesi | Kategori bağlantılarından `#market` kaldırıldı; gezinme aynı sayfada konum korunarak yapılıyor. Yalnızca vitrindeki “Taşları keşfet” düğmesi, açıkça seçilen eylem olduğu için pazara kaydırır. |
| Tarayıcıda yanlış H1 | İlk HTML'deki kategori H1'i sayfa yüklendikten sonra genel başlıkla değişmiyor. |
| Kategori geçişi sonrası eski metadata | Sayfa başlığı, açıklama, canonical, OG ve Twitter başlıkları seçilen URL ile aynı tutuluyor. Doğrudan URL açılınca Next.js bunları sunucudan oluşturuyor. |
| Ana sayfa tekrarı | `/` ve `/tr` aynı içeriği gösterdiğinden canonical `/` olarak birleştirildi. |
| Kategori dahili bağlantıları | Üst ve yan kategori menüleri ilk HTML'de gerçek bağlantı olarak bulunuyor; tarayıcı betiği artık `?lang=tr` eklemiyor. |
| Taş detaylarına giden bağlantılar | Dokuz taş kartının başlıkları ilk HTML'de temiz detay adresine gidiyor; detay sayfaları diğer taşlara bağlanıyor. |
| Hizmetler sayfası | Altı hizmet kartının adı, açıklaması ve görseli artık ilk HTML'de geliyor; tarayıcıda arama ve teklif akışı korunuyor. |
| Çıkış | Demo ve gerçek hesaplar aynı üst menü / çalışma alanı çıkış eylemini kullanıyor. Gerçek hesapta servis hatası varsa oturum açık kalıp kullanıcıya tekrar deneme mesajı gösteriliyor. |
| Liste şeması | `ItemList` dokuz taşı ortak veriden okuyor ve sadece canonical `/tr/dogal-tas` ve temiz detay URL'lerini kullanıyor. |
| Görsel boyutu | Birleşik 5,48 MB PNG kaynaklarının yerine toplam 0,40 MB olan altı ayrı WebP doku kullanılıyor. Bunlar doğrulanmış ürün fotoğrafları değildir. |
| İndeksleme bayrağı | `.env.production` artık `NEXT_PUBLIC_ALLOW_INDEXING=true`; tüm rotalarda `index,follow` ve `robots.txt` içinde `Allow: /` üretilir. Vercel'deki Production ortam değişkeni `false` ise onu da `true` yapıp yeniden dağıtın. Bayrak `true` değilse güvenli varsayılan `noindex,nofollow` ve `Disallow: /` korunur. |

## Kontrol edilen mevcut SEO altyapısı

- App Router rotaları: beş Türkçe kategori, dokuz taş detayı, ana sayfa.
- Sayfaların Türkçe ve benzersiz title/description alanları, canonical ve Open Graph URL'leri `NEXT_PUBLIC_SITE_URL` ile üretiliyor.
- `sitemap.xml` ana sayfa, beş kategori ve `lib/stoneData.ts` kaynağından dokuz taş detayı olmak üzere 15 URL yayınlıyor.
- Organization, kategori ve taş detaylarında BreadcrumbList; taş listesinde ItemList mevcut. Fiyat, değerlendirme veya gerçekte bulunmayan Product/Offer verisi yok.
- Çevrilmiş sunucu sayfaları olmadığı için hreflang üretilmiyor.

## Açık kalan teknik sınır

Dokuz taş ve altı hizmet kartı artık ilk HTML'de var. Firma listesinin sayfalanması ve makine kartları hâlen `public/market/app.js` tarafından tarayıcıda oluşturuluyor. Bu kartları sunucuda da üretmek için verinin ortak kaynağa taşınması gerekir. Gerçek ürün fotoğrafları için tedarikçilerden doğrulanmış dosyalar gereklidir. İndeksleme açıldığında örnek firma ve ilan kayıtları da arama motorlarına açık olur; canlı SEO puanı ancak yeniden dağıtımdan sonra ölçülebilir.

## Yükleme sonrası bakılacaklar

1. `/tr/hizmetler?lang=tr` sayfasında kategoriye tıklayın: yeni URL `/tr/dogal-tas` gibi parametresiz olmalı, sayfa kendiliğinden aşağı kaymamalı ve yeniden yüklenmemeli.
2. Ana sayfanın ve kategori sayfasının kaynağında tek H1, dokuz taş kartı, parametresiz canonical ve `index, follow` arayın; `noindex` bulunmamalı.
3. `/robots.txt` içinde `Allow: /` ve sitemap adresini; `/sitemap.xml` içinde `/`, beş kategori ve dokuz taş adresi olmak üzere 15 URL'yi kontrol edin.
4. Canlı ana sayfayı PageSpeed Insights ile mobil ve masaüstünde yeniden ölçün. `noindex` hâlâ görünüyorsa Vercel Production ortam değişkenini `true` yapıp yeniden dağıtın.

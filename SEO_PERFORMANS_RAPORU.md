# Marble Borsa – doğal taş sayfası SEO ve performans incelemesi

**Tarih:** 25 Eylül 2026. İncelenen canlı adres: `https://stone-quote-market.vercel.app/tr/dogal-tas?lang=tr`. Aşağıdaki Google PageSpeed sonuçları **eski yayındaki sürümün** başlangıç değerleridir; bu kod paketi henüz Vercel'e yüklenmediği için yeni sürüme puan atanmamıştır.

| Sayfa / cihaz | Performans | SEO | LCP | Bulgular |
| --- | ---: | ---: | ---: | --- |
| Mobil | 66 | 66 | 22,1 sn | Yaklaşık 4.839 KiB görsel tasarrufu; dizine ekleme engelli. |
| Masaüstü | 86 | 66 | 2,6 sn | Yaklaşık 4.839 KiB görsel tasarrufu; dizine ekleme engelli. |

Raporlar: [mobil](https://pagespeed.web.dev/analysis/https-stone-quote-market-vercel-app-tr-dogal-tas/om0qo6113x?form_factor=mobile) · [masaüstü](https://pagespeed.web.dev/analysis/https-stone-quote-market-vercel-app-tr-dogal-tas/om0qo6113x?form_factor=desktop).

## Bu pakette uygulananlar

1. Üst ve yan menülerdeki `?lang=tr` eki kaldırıldı; Türkçe dil seçimi eski parametreyi de URL'den temizliyor. Diğer dil seçimleri mevcut demo davranışıyla çalışmaya devam ediyor.
2. Doğal taş sayfasının `ItemList` şeması dokuz taşı `lib/stoneData.ts` listesinden okuyor. Liste ve detay URL'lerinde parametre veya sayfa içi işaretçi bulunmuyor.
3. Taş kataloğunda dokuz ad, detay bağlantısı ve görsel ilk HTML'de bulunuyor. İlk HTML için sunucuda kart üretimi ve tarayıcıda arama/teklif etkileşimi korunuyor.
4. Eski birleşik PNG görselleri (5.479.146 bayt) altı ayrı WebP'ye (398.962 bayt) dönüştürüldü: dosya boyutunda yaklaşık %92,7 düşüş. Büyük kaynaklar paketten çıkarıldı. İlk vitrin görseline ön yükleme ve yüksek indirme önceliği eklendi; diğer kart görselleri ihtiyaca göre yükleniyor.
5. Katalog betiği üyelik paketinden önce yükleniyor; kataloğun görünmesi üyelik paketinin indirilmesini beklemiyor. Üyelik ve teklif akışlarının kodu korunuyor.
6. Alıcının kaydettiği talep kendi çalışma alanında görünür. Alım Talepleri kategorisi yalnızca tedarikçi girişinde gösterilir; demo talepleri aynı tarayıcıda listelenir. Kategori sitemap dışında ve `noindex` olarak kalır.

## Lansman için açık gereklilikler

- Görseller mevcut gösterim dokularından hazırlanmıştır; **doğrulanmış, taş bazında tedarikçi ürün fotoğrafları değildir**. Bilecik, Muğla ve Marmara taşlarında benzer renkteki doku yeniden kullanılır. Tedarikçilerden özgün ve kullanım izni bulunan fotoğraflar gelmeden bunları gerçek ürün fotoğrafı diye sunmayın.
- Önceki demo `NEXT_PUBLIC_ALLOW_INDEXING=false` iken meta etiketi `noindex,nofollow`, `robots.txt` ise `Disallow: /` olarak üretiliyordu. Bu paketin `.env.production` dosyasında bayrak `true` yapıldı. Vercel Production değişkeni farklı bir değer taşıyorsa orada da `true` yapılmalı; indeksleme açıldığında örnek firma/ilanlar ve temsili görseller de arama sonuçlarında görülebilir.
- Güncellenen paket GitHub'a yüklenip Vercel'de dağıtıldıktan sonra yeni mobil ve masaüstü PageSpeed raporları alınmalı. Başlangıç puanları yeni sürümün sonucu gibi sunulmamalıdır. Görsel iyileştirmesinin gerçek LCP etkisi ancak yeni dağıtımda ölçülebilir.
- Bu ortamda yerel siteyi mobil tarayıcıyla açmak mümkün olmadığından, yeni sürümün mobil düzeni dağıtımdan sonra görsel olarak kontrol edilmelidir. CSS mobil kuralları korunmuştur.

## Dağıtımdan sonra kontrol

1. `/tr/dogal-tas?lang=tr` adresini açın; Türkçe seçiliyken URL'nin `/tr/dogal-tas` olarak temizlendiğini görün.
2. Üst menüden kategori seçin: adres parametresiz değişsin ve otomatik aşağı kaymasın.
3. Sayfa kaynağında `ItemList`, `https://stone-quote-market.vercel.app/tr/dogal-tas`, dokuz kart başlığı ve `.webp` görselleri kontrol edin.
4. Kaynakta `index, follow`, `/robots.txt` içinde `Allow: /` ve `/sitemap.xml` içinde ana sayfa dâhil 15 URL bulunduğunu doğrulayın.
5. Yeni dağıtımdan sonra PageSpeed Insights üzerinden aynı adresi mobil ve masaüstünde yeniden ölçün.

## Hizmetler sayfası – 25 Eylül 2026 güncel ölçümü

İncelenen canlı adres: `https://stone-quote-market.vercel.app/tr/hizmetler`. Bu tablo, **çıkış düğmesi ve ilk HTML hizmet kartları düzeltmesinden önce yayındaki sürüme** aittir.

| Cihaz | Performans | SEO | Lighthouse SEO bulgusu |
| --- | ---: | ---: | --- |
| [Mobil raporu](https://pagespeed.web.dev/analysis/https-stone-quote-market-vercel-app-tr-hizmetler/1bve3drt42?form_factor=mobile) | 96 | 69 | `noindex` nedeniyle dizine ekleme engelleniyor. |
| [Masaüstü raporu](https://pagespeed.web.dev/analysis/https-stone-quote-market-vercel-app-tr-hizmetler/1bve3drt42?form_factor=desktop) | 100 | 69 | Aynı tek başarısız SEO denetimi. |

Sayfada tek H1, Türkçe açıklama ve parametresiz canonical doğru. Hizmetler sayfasının ilk HTML'sinde kart içerikleri yoktu; altı örnek hizmet kartı sunucuda üretilecek şekilde eklendi. Çıkış düğmesi demo ve gerçek oturumda üst menüde ve çalışma alanında kullanılabilir; hata hâlinde oturum yanlışlıkla kapatılmış gibi gösterilmez.

Hizmetler sayfasındaki eski ölçüm `noindex` nedeniyle 69 SEO puanı vermişti. Bu yeni paket indekslemeyi açık olarak derlenecek, ancak dosyalar Vercel'e yüklenmeden herhangi bir yeni puan iddia edilmez. Örnek firma ve teklif verileri arama motorlarına görünür hâle gelir.

## Ana sayfa – 25 Eylül 2026 canlı ölçümü

Yayında olan **önceki** sürümün adresi: `https://stone-quote-market.vercel.app/`. Bu paket Vercel'e yüklenmeden yeni puan ölçülemez.

| Cihaz | Performans | SEO | Lighthouse SEO bulgusu |
| --- | ---: | ---: | --- |
| [Mobil raporu](https://pagespeed.web.dev/analysis/https-stone-quote-market-vercel-app/xmnuu6omur?form_factor=mobile) | 95 | 69 | `noindex`: tek başarısız SEO denetimi, diğer dokuz denetim geçti. |
| [Masaüstü raporu](https://pagespeed.web.dev/analysis/https-stone-quote-market-vercel-app/xmnuu6omur?form_factor=desktop) | 100 | 69 | Aynı indeksleme denetimi başarısız. |

Kodda `lib/seo.ts` zaten `NEXT_PUBLIC_ALLOW_INDEXING` bayrağından tüm sayfalar için robots meta üretiyor ve `app/robots.ts` aynı bayrağı kullanıyor. Bu sürüm `.env.production` bayrağını `true` yapıyor; `app/sitemap.ts` ana sayfayı da XML listesine ekliyor. Vercel Production ortam değişkeni `false` olarak tanımlıysa önceliklidir: dağıtımdan önce onu da `true` yapın. 90 üzeri skor beklentisi yalnızca **yeniden ölçülünce** doğrulanabilir; bir Lighthouse puanı Google'da sıralama garantisi değildir.

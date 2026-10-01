# Marble Borsa V3: Dört dilli rehber ve üyelik ücret gösterimi

Bu paket V2'nin üzerine uygulanır. Mevcut Supabase tabloları, üyelik-onay iş akışı ve yönetici tarafındaki ücret tanımları değiştirilmez. **Yeni SQL migrasyonu yoktur.**

## Düzeltmeler

- Rehber merkezleri ve **altı konunun her biri** Türkçe, İngilizce, Basitleştirilmiş Çince ve Arapça için ayrı içerik ve URL olarak sunulur. Rehberdeki dil seçici konuyu korur; ana sayfadaki dil seçiminin rehber bağlantısı ve alt tanıtım alanı da seçilen dile geçer.
- Metinler, başlıklar, özetler ve SEO meta açıklamaları ilgili dilde yazılmıştır. Yeni sayfalar için self-canonical ve dört karşılıklı `hreflang` bağlantısı üretilir; sitemap yeni URL'leri listeler.
- Önceki `/en/guide/turkish-marble-types` URL'si kalıcı olarak `/en/guide/turkiye-mermer-cesitleri` adresine yönlendirilir. Dış bağlantılar boşa düşmez.
- Üyelikteki firma fiyatı **kayıt ekranındaki hesap kartlarından, form özetinden ve profil kartından** kaldırılmıştır. Yerine dört dilde “Üyelik koşulları için iletişime geçin” ifadesi görünür. Alıcı hesabı “Ücretsiz” olarak kalır.
- Ücret değerleri herkese açık üyelik JSON'una artık konulmaz. Yönetici panelinin mevcut ücret verileri korunur. Kullanım koşullarındaki sabit fiyatlar da kaldırılmıştır; geçerli teklif ve koşulların ödeme öncesinde yazılı bildirilmesi gerektiği belirtilir.

## URL örnekleri

- Türkçe: `/tr/rehber` ve `/tr/rehber/mermer-satin-alma`
- İngilizce: `/en/guide` ve `/en/guide/mermer-satin-alma`
- Çince: `/zh/guide` ve `/zh/guide/mermer-satin-alma`
- Arapça: `/ar/guide` ve `/ar/guide/mermer-satin-alma`

**Not:** Rehberlerin tamamı dört dilde. Pazaryerinin daha önceden yalnız Türkçe bulunan hukuki belgeleri hâlâ Türkçe; diğer dillerde bu bağlantılar `TR` olarak işaretleniyor. Bunları yerel hukuk uzmanıyla ayrıca hazırlamak gerekir. SEO açısından ana pazaryeri `/tr/...` adreslerinde çalışan önceki istemci içi dil değişimi korunmuştur; mevcut veritabanı ve URL yapısı yeniden tasarlanmamıştır.

## GitHub / Vercel yayın akışı

1. GitHub'da ayrı bir dal açın. **Sadece değişenler ZIP** paketinin klasör yapısını projenin köküne kopyalayın ve mevcut dosyaların üzerine yazın. Eski İngilizce sayfalar bu pakette güncellenmiştir; ayrıca silinmesi gereken dosya yoktur.
2. Vercel Preview derlemesinin başarılı olduğunu doğrulayın. Rehber merkezini, dört dilde aynı yazı üzerinde dil değiştirmeyi, ana sayfa rehber bağlantısını, kayıt ekranı ve profil ücret yazısını mobil/masaüstünde kontrol edin.
3. Production dağıtımınızda `NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com` ve `NEXT_PUBLIC_ALLOW_INDEXING=true` ayarları çalışmaya devam etmeli. Vercel Preview `noindex` kalmalıdır.
4. Yayında `/sitemap.xml` içine yeni dillerin eklendiğini doğrulayın; Search Console yeni sayfaları zamanla tarar. Sadece çeviri eklemek sıralama garantisi vermez.
5. **Üyelik ücretini saklamak ile fiyat anlaşması yapmamak farklı şeylerdir:** Kullanıcı ödeme yapmak zorunda kalmadan önce gerçek ücret ve koşullar yazılı olarak açıkça bildirilmeli. Canlı kullanıcı kaydına açmadan önce yasal metinler gerçek işletme bilgileriyle gözden geçirilmeli.

## Test

`npm ci && npm run build` komutunu Vercel Preview üzerinde çalıştırın. Ayrıca `for t in tests/*.cjs; do node "$t" || exit 1; done` ile yerel temel testleri çalıştırın.

Bu hazırlık ortamında 7 temel test geçti; 37 TS/TSX kaynağı sözdizimi kontrolünden geçti. Tam Next.js derlemesi, npm paketlerinin bu ortamda önbellekte bulunmaması nedeniyle çalıştırılamadı. Yayın öncesinde **Vercel build sonucu mutlaka kontrol edilmelidir.**

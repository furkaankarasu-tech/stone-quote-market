# Marble Borsa V8 – yayın ve SEO kontrol notları

## Tasarım
- `app/premium.css` ana CSS dosyalarının sonrasında yüklenir. Mevcut form ve oturum kodunu değiştirmez.
- Daha geniş, fotoğraf ağırlıklı kartlar, belirgin teklif bağlantıları, tutarlı boşluklar, mobil düzen ve yenilenmiş rehber kahraman alanı.
- `public/og-marbleborsa.png` 1200 × 630 özgün marka paylaşım görselidir.
- Sağ sütundaki yanıltıcı örnek reklam ibareleri dört dilde platform tanıtımıyla değiştirildi.

## İçerik ve arama görünürlüğü
- Makine ve sarf kategorisinin altı kartı artık ilk HTML çıktısında yer alır; böylece JS geç açıldığında içerik boş değildir. Kart görselleri kategorileri temsil eder; stok ya da satıcı garantisi vermez.
- Ana sayfa ve kategorilere sunucudan görünen, ziyaretçinin gerçekten faydalanabileceği bir B2B tedarik bilgi alanı eklendi.
- Bu alanın bağlantı ve açıklamaları Türkçe, İngilizce, Çince, Arapça seçimlerinde güncellenir.
- Ana sayfa ve kategori meta başlıkları, açıklamalar ve sosyal görselin alternatif metni iş modeliyle uyumlu hale getirildi.
- Genel WebSite ve kategori sayfaları için BreadcrumbList yapılandırılmış verisi eklendi. Gerçekte bulunmayan stok, firma, fiyat, puan veya yorum için işaretleme üretilmez.
- Mevcut dil sürümlerinin ayrı rehber/teklif URL'leri ve site haritası korundu; önizleme sürümleri noindex olmaya devam eder.

## V7 üzerine kurulum
1. Yeni GitHub dalı açın. `Marble_Borsa_V8_Sadece_Degisen_Dosyalar.zip` içeriğini repo köküne, klasör yapısını koruyarak kopyalayın.
2. Vercel Preview'da derlemeyi kontrol edin. Ana sayfa, `/tr/makine-sarf`, `/tr/hizmetler`, `/tr/mermer-teklifi-al`, `/en/request-marble-quotes` adresleri ve dört dilde bilgi alanının bağlantılarını açın.
3. Gerçek Supabase hesabıyla kayıt, e-posta onayı, giriş, profil ve çıkış testini yapın. Bu ortamda canlı veritabanı erişimiyle uçtan uca test yapılamadı.
4. Mobil ve masaüstü ekranlarda kartların, fotoğrafların ve üst menünün görünümünü kontrol edin.
5. Önizleme uygun olduğunda production'a birleştirin. Lighthouse SEO puanını yalnızca `https://www.marbleborsa.com` üzerinden ölçün; preview noindex olması beklenir.
6. Search Console'da canlı URL denetimi ve yeni sayfaları içeren `/sitemap.xml` kontrolü yapın. Performans → Sorgular bölümünde “mermer teklifi”, “mermer b2b”, “natural stone sourcing” gibi sorguları takip edin.

## Doğrulama sınırları
Yerel JavaScript sözdizimi, CSS ayrıştırması ve proje smoke testleri yapıldı. Bu ortamın bağımlılık indirme bağlantısı sonuçlanmadığı için tam Next.js build ve canlı Supabase akışı doğrulanamadı. Gerçek Chromium ekran görüntüsü alma denemesi zaman aşımına uğradı. Üst sıralar ya da Lighthouse 100 puan garantisi yoktur.

## Sonraki içerik çalışması
Search Console sorgularına göre alıcının gerçek sorularına yanıt veren özgün içerikler hazırlayın. Üretici veya işletme kimliğini doğrulamadan uydurma profiller, stok veya referans eklemeyin. Hukuki belgelerde gerçek veri sorumlusu bilgileri doğrulanmalıdır.

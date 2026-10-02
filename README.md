# Marble Borsa · V8 (100 dosyalık GitHub yükleme paketi)

Bu paket, V8'in **çalışma zamanı ve veritabanı dosyalarını** korur. GitHub'ın web arayüzündeki tek seferde en fazla 100 dosya yükleme sınırına uygundur. Geçmiş sürüm belgeleri, yerel smoke testleri, artık kullanılmayan 12 SVG çizimi ve otomatik üretilen / ortam dosyaları ayrı `Marble_Borsa_V8_Cikarilan_Dosyalar.zip` arşivindedir.

## Kurulum

1. GitHub'da projene dosyaları **kök dizin yapısını koruyarak** yükle; ZIP dosyasını tek parça halinde GitHub'a yükleme. Mevcut bir depoya yüklüyorsan, aynı isimdeki dosyaları günceller; eski dosyaları otomatik **silmez**.
2. Vercel > Project > Settings > Environment Variables'da Production için `NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com` ve `NEXT_PUBLIC_ALLOW_INDEXING=true` değerlerini denetle. Preview dağıtımları arama motorlarında indekslenmemelidir. Ortam değişkenini değiştirdiysen tekrar dağıtım yap. Yerel .env dosyalarını GitHub'a yükleme.
3. Next.js 15 projesi için `npm ci` ve `npm run build` kullan. `next-env.d.ts` dosyasını Next.js derleme esnasında otomatik oluşturur.
4. Supabase e-posta doğrulama, SMTP, RLS ve migrasyonlar, bu ZIP'te korunan `supabase/` klasörüne bağlıdır. Migrasyonları mevcut veritabanına gelişigüzel yeniden uygulama; eksik şemaları kontrol et.
5. `lib/dataController.ts` içindeki gerçek veri sorumlusu unvanı ve adresi tamamlanmadan kullanıcı kaydı başlatma; KVKK ve kullanım koşullarını hukuki olarak denetlet.

## Geliştirme ve test

12 mevcut otomatik test ayrı yardımcı arşivde **orijinal yollarıyla** tutulur. Geliştirmeye devam edeceksen `tests/` klasörünü buraya geri kopyalayıp `node tests/<dosya>.cjs` biçiminde çalıştırabilir veya dosya sınırına takılmadan `git push` ile testleri de depoya gönderebilirsin. Tam Next.js derlemesi canlı Supabase uçtan uca işlemlerini tek başına doğrulamaz.

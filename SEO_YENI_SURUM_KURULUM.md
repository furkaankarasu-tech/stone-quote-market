# SEO V2 NOTU — 2 Ekim 2026

**Önce şunu bilin:** Lighthouse ekranınız Vercel Preview (`stone-quote-market-git-...vercel.app`) üzerinde alınmış. Vercel Preview yanıtlarına `X-Robots-Tag: noindex` ekler. Önizlemeyi sırf Lighthouse SEO puanı için Google dizinine açmayın. **Canlı www.marbleborsa.com** adresini denetleyin.

1. GitHub üzerinde yeni dal oluşturup bu paketi yayınlayın, Vercel Preview derlemesinin başarılı olduğunu doğrulayın.
2. Vercel Production ortamında `NEXT_PUBLIC_ALLOW_INDEXING=true`, `NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com` değerlerini koruyun. Üretime geçtikten sonra yeniden dağıtım yapın.
3. `https://www.marbleborsa.com/robots.txt` dosyasında `Allow: /`, `https://www.marbleborsa.com/sitemap.xml` içinde yeni rehber rotaları ve canlı kaynak kodunda `index,follow` olduğundan emin olun. Yanıtta `X-Robots-Tag: noindex` bulunmamalı.
4. **Google Lighthouse/PageSpeed testini yalnızca canlı özel domain** üzerinden tekrar çalıştırın. Preview üzerinde 69 puanın görülmesi tek başına üretim SEO hatası değildir.
5. Rehberler: `/tr/rehber`, `/tr/rehber/mermer-satin-alma`, `/tr/rehber/mermer-fiyatlari`, `/tr/rehber/mermer-cesitleri-kullanim-alanlari` ve eski taş rehberleri. Metinler katalog veya stok vaat etmez. Gerçek sektörel deneyimi ve kaynakları zamanla eklemeniz içerik kalitesini geliştirebilir.
6. Giriş yaptıktan sonra üst menüde Profil yanında **Çıkış yap** butonunu kontrol edin. Mobilde de test edin.
7. Search Console site haritanız daha önce gönderildi; güncel sitemap Google tarafından tekrar ziyaret edildiğinde yeni URL'ler keşfedilebilir. Gereksiz yere her gün tekrar göndermeyin.

**Testler:** `npm ci`, `npm run build` ve `node tests/*.cjs` (testleri tek tek döngüyle çalıştırın). İndeksleme testi `typescript` paketini kullanır. Son inceleme ortamında npm indirme servisine erişilemediği için tam Next.js build doğrulanamadı.

**Not:** Ana sayfa metaverisi mermer satın alma aramalarına göre geliştirildi, ancak belirli aramalarda üst sıra garantisi yoktur. Search Console Performans verisiyle sorgu bazında iyileştirin.

---

# Marble Borsa – SEO içerik ve marka güncellemesi

Bu paket, mevcut Next.js 15 / Supabase üyelik ve teklif kodu korunarak oluşturulmuştur.
**Canlı siteye veya GitHub'a otomatik olarak gönderilmemiştir.** Yayın için GitHub'a yükleyip Vercel'de yeni dağıtımı kontrol edin.

## Neler eklendi?

- `/tr/rehber` merkez sayfası ve üç özgün Türkçe satın alma rehberi:
  - `/tr/rehber/afyon-mermeri`
  - `/tr/rehber/mermer-blok-plaka`
  - `/tr/rehber/turkiye-mermer-cesitleri`
- `/en/guide` merkezi ve `/en/guide/turkish-marble-types` uluslararası alıcı rehberi. **Bu sürüm tüm pazaryerinin İngilizce çevirisi değildir.** İngilizce rehber içeriği `lang="en"` ile işaretlenmiştir.
- Pazaryeri üst menüsünde, ana sayfa/doğal taş kataloğu tanıtım alanında ve taş detaylarında ilgili rehber bağlantıları.
- Güncellenmiş ana sayfa marka başlığı, benzersiz rehber metadata bilgileri, doğrulanabilir TR/EN eşleştirmesi için `hreflang`, makale şeması, site haritasına yeni gerçek sayfalar.
- Site renkleriyle tutarlı favicon, uygulama simgesi ve 1200×630 sosyal medya paylaşım görseli.

## Yayın

1. Arşivi açın. Mevcut repo ile birleştirirken bu paketin dosyalarını güncelleyin; önce değişiklikleri ayrı bir Git dalında test etmek daha güvenlidir.
2. Mevcut Vercel Production ortamındaki `NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com` ve `NEXT_PUBLIC_ALLOW_INDEXING=true` ayarlarını koruyun. Ortam değerlerini değiştirdiyseniz yeniden deploy edin.
3. `npm ci`, `npm run build`, mevcut testler ve `node tests/seo-guides-smoke.cjs` komutlarıyla kontrol edin.
4. Yayından sonra `/tr/rehber`, üç Türkçe makale, `/en/guide`, İngilizce makale, `/sitemap.xml`, favicon ve mobil menüyü açarak gözle test edin. Kullanıcıyla alım talebi ve üyelik akışlarını gerçek ortamda ayrıca doğrulayın.
5. Google Search Console'da mevcut mülke bağlı sitemap yeni sürümü yansıttığında rehber URL'lerini URL Denetimi ile kontrol edin. Aynı haritayı tekrar tekrar göndermeyin.

## İçerik ve SEO notları

- Rehber, taş özellikleri ve alım süreci konusunda genel bilgi sunar; gerçek stok, fiyat, kalite veya performans garantisi iddia etmez.
- Sadece **gerçekten oluşturulmuş** İngilizce ve Türkçe içerik sayfaları `hreflang` ile eşleştirildi. Demo dil menüsü İngilizceyi geçici olarak aynı `/tr` URL'sinde istemci tarafında görüntüleyebilir; bu dil seçenekleri için yanıltıcı alternatif URL üretilmedi.
- Favicon'un Google sonuçlarına yansıması önbellek ve yeniden tarama nedeniyle gecikebilir. Lighthouse SEO puanı veya Google sıralaması garanti edilmez.
- `<html>` etiketi mevcut ortak şablon gereği Türkçe kalır. İngilizce rehberde ana içerik `lang="en"` ile işaretlidir. İleride tamamen çok dilli pazaryeri yapılacaksa sunucu tarafı locale bazlı kök layout oluşturulmalıdır.
- `lastmod` sahte güncelleme tarihi oluşturmamak için eklenmedi. Gerçek güncelleme zamanlarını CMS/versiyon verisine bağlayınca ekleyin.
- `.env.production` dağıtım arşivine özellikle konulmadı. Vercel ortam değişkenleri ayrı olarak yönetilmeye devam etmeli.

## Bu çalışma ortamında yapılan kontroller

`tests/` altındaki mevcut Node smoke testleri ile yeni SEO smoke testini çalıştırın. Yeni rehber TS/TSX dosyaları ayrıca sözdizimi açısından kontrol edilebilir. Tam Next.js derleme ve mobil ekran testi üretim yayını öncesi önemlidir.

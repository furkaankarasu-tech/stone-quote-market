# Marble Borsa V19 — Yönetim panelinden reklam yönetimi

6 Ekim 2026 tarihinde canlı sitedeki app.js ve live-ui.js ile eşleşen V18 kaynak paketi üzerine hazırlanmıştır. Bu paketi yayınlamak canlı siteyi günceller; dosyayı indirmek tek başına yayınlama değildir.

## Kurulum ve yayınlama

ZIP içindeki dosyaları açıp mevcut GitHub projenizin köküne aktarın. `package.json`, `package-lock.json` ve `vercel.json` kökte kalmalıdır. Vercel Root Directory kök dizin, framework Next.js olmalıdır. Ek bir üst klasörü depo köküne yüklemeyin.

```sh
npm ci
node tests/consent.cjs
node tests/market-smoke.cjs
npm run build
```

`.env.example` ortam değişkenlerinin adlarını gösterir. Canlıda site adresini `https://www.marbleborsa.com`, indeksleme iznini `true` olarak koruyun. Supabase ayarlarını mevcut Production projenizden kullanın. Gerçek veri sorumlusu unvanı ve adresi için LEGAL_OPERATOR alanlarını doldurun. Kimlik, adres veya ölçüm bilgisi uydurulmamıştır.

## Google Analytics kurulumu

Ölçüm varsayılan olarak kapalıdır. Kendi GA4 web veri akışınızın `G-...` kimliğini Vercel Production ortamında `NEXT_PUBLIC_GA_MEASUREMENT_ID` olarak ekleyip yeniden yayınlayın. Google Analytics web veri akışında **Enhanced Measurement / Geliştirilmiş Ölçüm'ü kapatın**. Kod sayfa görüntülemelerini elle gönderir; otomatik geçmiş, form, arama ve tıklama ölçümlerinin ikinci kez veya parametrelerle gönderilmesini istemiyoruz.

Ziyaretçi analitik izni vermeden Google ölçüm betiği yüklenmez. Ret ve kabul kalıcı olarak kaydedilir. Tercih geri alınınca ölçüm durdurulur ve Google Analytics çerezleri temizlenir; Supabase oturumu korunur. Kod sorgu parametreleri ve URL parçalarını göndermez. Profil, yönetim, şifre sıfırlama ve özel talep ekranları ölçüm dışında tutulur. Preview ortamlarında Analytics kapalıdır.

## 20 maddelik kontrolün durumu

| Madde | Durum |
| --- | --- |
| Gizlilik politikası | Mevcut; isteğe bağlı ölçüm için ayrı çerez açıklaması eklendi. |
| Kullanım şartları | Mevcut. Gerçek işletme bilgileri ortam değişkenlerinden alınır. |
| Çerez onayı | Gerekli / isteğe bağlı analitik ayrımı, ret ve yeniden tercih ekranı eklendi. |
| Net CTA | Keşfet ve teklif butonlarının ilk HTML metni dolduruldu; hesap türü kuralları korundu. |
| Mobil görünüm | Mevcut duyarlı düzen korundu; çerez paneli ve yeni bölümler küçük ekranlara uyarlandı. Gerçek telefon testi yapılmadı. |
| Formların çalışması | Canlıda rol seçimi ve alıcı formu açıldı. Kayıt, SMTP ve teklif gönderimi gerçek test hesaplarıyla ayrıca doğrulanmalı. |
| Kırık linkler | Yerel üretim sunucusunda ana kategoriler, rehber, yasal ve teklif sayfaları HTTP 200 döndü. |
| Site hızı | WebP ve mevcut ön yükleme korundu; Analytics ilk yüklemeye eklenmedi. Lighthouse skoru ölçülmedi. |
| Erişilebilirlik | İçeriğe geç, arama alanı adı, modal odak sınırı ve dönüşü, arka planın inert olması ve azaltılmış hareket desteği eklendi. |
| Analytics | İzinle çalışan GA4 altyapısı ve ret/kabul/geri alma testleri eklendi; kendi ölçüm kimliğiniz gerekiyor. |
| Meta başlık ve açıklama | Mevcut sayfaya özel metadata korundu. |
| sitemap.xml | Canlıda HTTP 200 ve doğru alan adı doğrulandı. |
| robots.txt | Canlıda taramaya izin ve sitemap adresi doğrulandı. |
| Canonical URL'ler | Kontrol edilen canlı kategoriler www alan adına işaret ediyor. |
| Görsel alt metinleri | Mevcut alt/aria açıklamaları korundu. |
| Sık sorulan sorular | Türkçe ana sayfaya 12 açılır SSS eklendi. Başka kategorilere geçince gizlenir. |
| Özel 404 | Markalı sayfa, alternatif bağlantılar ve gerçek HTTP 404 yanıtı doğrulandı. |
| Sosyal paylaşım | Mevcut Open Graph/Twitter etiketleri ve görsel korundu. |
| Favicon | Uygulama simgesi korundu; 100 dosyalık pakette eksik olan markalı favicon geri eklendi. |
| llms.txt | Herkese açık içerik ve platform rolünü açıklayan dosya eklendi; Google sıralama garantisi değildir. |

## Veritabanı

Bu sürümde talep ve reklam yönetimi için paketteki güncel `20261006_request_lifecycle.sql` çalıştırılmalıdır. GitHub’a en fazla 100 dosya yükleyebilmeniz için eski Supabase migration arşivi pakete konulmadı. Mevcut deponuzdaki migration dosyalarını ve canlı veritabanını koruyun. Yeni veritabanı kurulum paketi değildir.

## Kontrol sınırları

Derleme, TypeScript kontrolü, katalog smoke testi, ölçüm rızası testleri ve yerel HTTP kontrolleri tamamlandı. Yerel önizleme bulut tarayıcıda açılmadığı için yeni sürümün görsel telefon testi yapılmadı. Gerçek kullanıcı oluşturulmadı, e-posta gönderilmedi, üyelik veya teklif verisi değiştirilmedi. Yasal metinlerin işletmeye uygunluğu işletme tarafından kontrol edilmelidir.

Hesap kontrolü: canlı sitede alıcı/yönetici ve aktif tedarikçi girişleri, profil, mevcut teklif detayı ve yönetim erişimi kontrol edildi. Yeni talep veya teklif kaydedilmedi. Üst talep düğmesi kategoriye uygun forma yönlendirilir; profil etkinlik sayısı açılan talepleri ve teklif verilen talepleri kapsar.

Yerleşim güncellemesi: SSS katalogdan hemen sonra, rehber içeriklerinden önce yer alır. Masaüstünde iki sütun, mobilde tek sütun açılır kartlar kullanılır. Çerez kartı sağ altta kompakt görünür; kart açıkken tekrar açma düğmesi gizlidir.

İletişim adresi info@marbleborsa.com olarak güncellendi. Örnek senaryolar yerine üç adımlı Nasıl çalışır alanı kullanılır. GA yapılandırılmadığında otomatik çerez bildirimi açılmaz; tercih düğmesi erişilebilir kalır. Bu değişiklik SMTP gönderici ayarını değiştirmez.

Ana sayfa süreç bileşeninin CSS adı rehberdeki sourcing-steps sınıfından ayrıldı; dar sütunlara sıkışma düzeltildi.

Açık zeminli B2B ve alım rehberi üst alanlarında ikincil düğmelerin beyaz yazı sorunu düzeltildi; hover ve klavye odak durumları eklendi.

## 6 Ekim: gerçek kayıt testi ve talep kapatma

Canlıda tedarikçi hesabıyla bir TEST makine talebi ve alıcı hesabıyla bir TEST taş talebi kaydedildi. Makine talebinin yenilemeden sonra kalması ve kendi talebine teklif verilememesi doğrulandı. Yeni teklif zinciri, güvenli giriş iptal edildiği için tamamlanmadı. E-posta teslimi, yeni dosya yüklemesi ve gerçek telefon performansı doğrulanmış sayılmaz.

Bu sürümde talep sahibi **Talebi kapat** ve **Yeniden aç** işlemlerini kullanabilir. Kayıt ve mevcut teklifler silinmez; kapalı talebe yeni teklif veya teklif kabulü yapılamaz. Kapatma, taraflar arasındaki mevcut ticari anlaşmayı iptal etmez.

**Yayınlamadan önce** ZIP'teki `supabase/migrations/20261006_request_lifecycle.sql` dosyasının tamamını Supabase → SQL Editor içinde çalıştırın. Sadece bu yeni SQL'i çalıştırın; eski migration dosyalarını tekrar çalıştırmayın. SQL tekrar çalıştırılabilir. Mevcut Supabase klasörünüzü koruyun. Yeni SQL canlı veritabanında uygulanmadan kapatma işlevi etkinleşmez; kullanıcıya anlaşılır hata gösterilir.

Paket 100 dosyadır. SQL veritabanına otomatik uygulanmaz. Yeni işlevin canlı doğrulaması, SQL ve uygulama yayını tamamlandıktan sonra gereklidir.

## Yönetim panelinden reklam ekleme

Bu sürümde `/tr/yonetim` ekranında **Firma başvuruları** ve **Reklamlar** sekmeleri bulunur. Reklam ekleme, düzenleme ve önizleme; görsel yükleme; kategori seçimi; Türkiye saatine göre başlangıç/bitiş planlama; sıralama; yayını kapatma/açma ve arşivleme/geri alma desteklenir. İlk kurulumdan sonra reklam değişiklikleri için kod veya Vercel yayını gerekmez. Açık ziyaretçi sayfasındaki değişiklikler en geç yaklaşık bir dakika sonra veya sayfa yenilenince görünür.

### Bir defalık kurulum

1. Bu paketteki `supabase/migrations/20261006_request_lifecycle.sql` dosyasının **tamamını** Supabase → SQL Editor’da çalıştırın. Dosyanın reklam bölümü bu sürümde eklendi. Önceki sürümde aynı adlı dosyayı çalıştırmış olsanız bile **bu güncel dosyayı** çalıştırın. Kurulum tekrar çalıştırılabilir; eski reklam ve talep kayıtlarını silmez. Diğer eski migration dosyalarını yeniden çalıştırmayın.
2. Paketteki dosyaları mevcut GitHub projenizin köküne aktarın ve Vercel yayınını tamamlayın. Mevcut Production ortam değişkenlerini ve eski Supabase migration dosyalarınızı koruyun.
3. Yönetici hesabınızla giriş yapıp `/tr/yonetim` → **Reklamlar** → **Yeni reklam** yolunu açın. Görsel, firma adı, başlık, https bağlantı, bölümler ve yayın tarihlerini doldurun. Önizleyip **Yayın açık** seçeneğini işaretleyin ve kaydedin. Kapalı bırakılan reklam taslaktır.

### Davranış ve sınırlar

- Her seçili bölümde, sıralama değeri küçük olan en fazla üç uygun reklam gösterilir. Başlangıcı gelmeyen, bitişi geçen, kapalı ve arşivdeki reklamlar ziyaretçiye gönderilmez. Sadece ana sayfa ve kategori listeleri reklam gösterir; özel hesap ekranları göstermez.
- Mobilde reklamlar katalogdan sonra, içerikleri kapatmayan kartlar olarak görünür. Uygun reklam yoksa reklam alanı gizlenir. Reklamlar açıkça sponsorlu olarak etiketlenir.
- Görseller PNG/JPG/WebP, en fazla 3 MB; en az 100×100 piksel, en fazla 25 megapikseldir. 4:3 oran önerilir. Yüklenen reklam görselleri herkese açıktır; gizli evrak yüklemeyin. Görsel değiştirilirken yeni dosya oluşturulur; eski görseller korunur.
- Bağlantılar https olmalı; bağlantı içine kullanıcı adı/şifre konulamaz. Harici bağlantılar yeni sekmede açılır. Reklam tıklamalarına yeni izleme veya üçüncü taraf reklam betiği eklenmemiştir.
- Veritabanı ve görsel yükleme politikaları, e-postası onaylı yönetici hesabı gerektirir. Yönetici listesi/taslaklar ziyaretçiye açılmaz. Yayın açma/kapatma ve arşivleme kayıt silmez. Kurulu `mb_is_admin` / `mb_is_email_confirmed` işlevleri kullanılır.
- Kurulum uygulanmadan reklam listesi anlaşılır hata gösterir; mevcut firma başvuruları ekranı kullanılmaya devam eder. Ziyaretçi reklam servisi hatasında boş reklam alanı görmez.

### Kontrol sonucu

Next.js üretim derlemesi, mevcut pazar/çerez testleri ve reklam yardımcı testleri geçti. Ayrı DOM testinde gerçek yönetim betiğiyle oluşturma/düzenleme, görseli yeniden yüklemeden düzenleme, önizleme, hatalı URL/tarih, aç/kapat, arşiv/geri alma, çıkış temizliği ve ziyaretçi kategori/tarih filtreleri doğrulandı. Ayrı PostgreSQL test ortamında yeni reklam SQL'i iki kez çalıştırıldı; yönetici olmayan ve e-postası onaysız hesapların kayıt değiştirememesi, depolama yolu kontrolü, tarihler, kategoriler, sıralama ve taslak gizliliği doğrulandı. Bu testler canlı Supabase projesinde yapılmadı; kurulum ve yayın sonrası gerçek reklam yüklemesi kontrol edilmelidir.


## Reklam alanları ve oturum düzeltmesi
Üst banner (1), sağ sütun (3), liste altı (3) ayrı alanlardır. Yönetim → Reklamlar formunda alan seçilir. Eski reklamlar sağ sütunda kalır. Güncel 20261006_request_lifecycle.sql dosyasının tamamını yeniden çalıştırın; kayıtlar korunur. Yayında reklam olmayan alan gizlenir. Oturum sonucu gelmeden Üye Ol gösterilmez; katalog/görsel yüklenmesi oturumun çözüldüğü anlamına gelmez.

Oturum kontrolünde erişilebilir, sabit genişlikli yüklenme göstergesi kullanılır. Bu görsel güncelleme için yeni SQL gerekmez.

MB marka simgesi: tüm ortak başlıklar, alt bilgi, 404, PNG simgesi, favicon ve Apple simgesi güncellendi. Ek SQL gerektirmez.

Firma profil düzeltmesi: sunucu Supabase public anahtarı tarayıcıyla eşitlendi, firma/katalog sorgularında eski önbellek kaldırıldı. Bağlantı kesintisi artık sahte 404 veya boş katalog olarak gösterilmez. Paralel rehber yenilemelerinde eski yanıt yeni logo/veriyi ezmez. Ana sayfadaki Firmalar kutusu kategori bağlantısıdır; firma logosu firma rehberi ve firma profilinde gösterilir. Ek SQL gerekmez.

## 8 Ekim 2026: firma görünürlüğü ve üretim denetimi

Bu paket, önceki sürümün yerine yüklenir; toplam 100 dosyadır. Bu güncelleme için yeni SQL çalıştırmak gerekmez.

- Firmalar rehberi onaylı doğal taş, makine/sarf ve hizmet firmalarını birlikte listeler.
- Doğal taş sayfasında doğal taş üreticileri; makine/sarf ve hizmet sayfalarında ilgili firmalar ayrı bölümlerde görünür.
- Firma ve katalog verileri ilk HTML içinde sunucuda üretilir. Tarayıcı aynı herkese açık verileri kullanır ve sonrasında yeniler. Yenileme bağlantı hatası mevcut listeyi silmez.
- Ana sayfanın Firmalar kartı gerçek firma logolarını gösterir; kayıt yoksa açık bir rehber görseli sunar.
- Alım Talepleri menüde görünür; misafir kullanıcı taş sayfasına zorla yönlendirilmez. Taleplere erişim ve teklif yetkisi veritabanı kurallarına bağlıdır.
- /tr/firmalar-icin, /tr/hakkimizda ve /tr/iletisim eklendi. Profil, yönetim, şifre yenileme ve tedarikçi talepleri noindex olarak korunur.

Doğrulama: production build, TypeScript, katalog/firma SSR ve HTML kaçış testleri, dört dilde istemci arayüzü/RTL, talep rol kontrolü, talep yaşam döngüsü ve çerez testleri. Canlı firma detay bağlantısı ve logosu tarayıcıda açıldı. Anonim REST okumalarında mb_profiles, mb_purchase_requests, mb_offers, mb_catalog_items erişimleri 401 ile engellendi. Bu yalnız anonim erişim kontrolüdür; iki farklı oturumun birbirinin özel kayıtlarını okuyamadığını kanıtlamaz.

### Yayın öncesinde erişim veya gerçek bilgi gerektiren kalan işler

1. Paketi GitHub/Vercel üretim sürümüne yükleyin. Yerel build başarısı canlıya yükleme anlamına gelmez.
2. Ayrı test alıcı, aktif tedarikçi ve aktif hizmet hesaplarıyla talep oluşturma, doğru rolün teklif vermesi, yanlış rolün engellenmesi, alıcının teklifi görmesi ve kapatılan talebin tekrar teklif almaması canlıda doğrulanmalı. Farklı hesapların talep/teklif/profil okumaları da test edilmeli. Hesap şifrelerini sohbet içinde paylaşmayın.
3. Auth onay/sıfırlama e-postaları için Supabase SMTP, doğrulanmış gönderici ve URL Configuration gerçek üretim alan adında doğrulanmalı. Gerçek gelen kutusuna teslim testi henüz yapılmadı.
4. Teklif bildirim uç noktası canlıda yapılandırılmamış durumda. .env.example içindeki sunucu anahtarlarını Vercel Production ortamında tanımlayın; Resend gönderici alan adını doğrulayın ve mb_offers INSERT webhook'unu OFFER_WEBHOOK_SECRET ile bağlayın. Bu ayar, Supabase Auth SMTP ayarından ayrıdır. Anahtarları koda veya istemciye koymayın.
5. NEXT_PUBLIC_LEGAL_OPERATOR_NAME ve NEXT_PUBLIC_LEGAL_OPERATOR_ADDRESS alanlarını gerçek veri sorumlusu unvanı/adresi ile doldurun; ardından yeniden yayınlayın. Uydurma hukuki bilgiler eklenmedi.
6. Daha önce bildirilen ERR_CERT_AUTHORITY_INVALID bu tarayıcıda tekrar oluşmadı. Farklı cihaz/ağda TLS doğrulaması ve Vercel alan adı/sertifika durumu ayrıca kapanmalı; güvenlik uyarısını atlatmayın.
7. EN/ZH/AR arayüz dili ve Arapça RTL test edildi. Ana sayfa ve kategori listeleri için /en, /zh, /ar ve ayrı SSR kategori adresleri eklendi. Taş ve firma detaylarının içerikleri ile hukuki/kurumsal metinlerin tamamı henüz dört dile çevrilmiş değildir. Rehber sayfalarının ayrı dil adresleri vardır.

Taş tür rehberleri stok ilanı değildir. Bir firmanın belirli taş türünü sattığını yalnız yayınladığı katalog gösterir; katalog → firma → talep bağlantısı gerçek katalog kayıtlarına dayanır. Firmanın doğal taş bölümünde görünmesi, her taş türünü stokladığı anlamına gelmez.

## Ortak gezinme ve erişim ekranları güncellemesi

- Header.tsx ve Footer.tsx yalnız RootLayout tarafından bir kez üretilir. Marketplace HTML şablonundaki eski header/footer kaldırıldı. Firma, taş, rehber, profil, yönetim ve şifre ekranları bu ortak yapıyı kullanır.
- /tr/alim-talepleri ana talep adresidir. /tr/tedarikci-talepleri gerçek HTTP 301 ile yeni adrese yönlenir.
- Girişsiz profil ve talep çıktısına firma veri hatası yazılmaz. Talep ekranı misafir, onaysız firma, pasif üyelik ve alıcı rolünü ayırır.
- Doğal taş üreticileri, makine/sarf firmaları ve hizmet firmaları kartların üstünde görünür. Firma kaydı bir katalog ürünü değildir; katalog sayısının sıfır olması firmanın kayıtlı olmadığı anlamına gelmez.
- Ana sayfa Firmalar kartı artık tek küçük logo yerine kategori görseli ve firma sayısıyla sunulur. Firma rehberi ve kategori listelerinde gerçek logolar korunur.
- Taş detayında yalnız taş adıyla eşleşen yayınlanmış katalogları olan firmalar sunucuda listelenir. Şehir veya ocak türü üzerinden stok varsayımı yapılmaz. Şimdilik eşleşme katalog başlığındaki taş adına dayanır; yapılandırılmış stone_slug alanı mevcut değildir.
- /en, /zh, /ar ana sayfaları; /en/natural-stone, /en/companies, /en/machinery-supplies, /en/services, /en/buying-requests adresleri ve zh/ar karşılıkları eklendi. Kategori listelerinde çevrilmiş başlıklar, metadata, canonical ve hreflang vardır; public sayfalar sitemap içinde, talep sayfaları noindex olarak tutulur.
- Taş/firma ayrıntı sayfaları ve kurumsal/hukuki sayfalar henüz ayrı EN/ZH/AR içerikle tamamlanmadı. Yabancı dilde listeler bu gerçek ayrıntı sayfalarına bağlantı verir; bu metinleri tümüyle çevrilmiş diye sunmayın.
- SEO ortamı: Vercel Production'da NEXT_PUBLIC_SITE_URL=https://www.marbleborsa.com ve NEXT_PUBLIC_ALLOW_INDEXING=true tanımlanmalıdır. Ön izleme sürümleri noindex kalır.
- KVKK için gerçek unvan ve tebligat adresi halen kullanıcıdan alınmalıdır. İletişim sayfasına doğrulanmış şehir/ülke (Afyonkarahisar, Türkiye) ve destek kapsamı eklendi; şirket kaydı/telefon/adres uydurulmadı.


### Doğal taş sayfası denetimi — 8 Ekim 2026
Başlık ve liste dili taş türlerini gerçek firma ürünlerinden ayırır. Ara ekran genişliklerinde menü ayrı tek satırda gösterilir. Mobil kart yazıları ve dokunma alanları büyütüldü. Firma bulunan sunucu çıktısında boş mesaj metni üretilmez; yeni sayfanın başlangıç verisi eski tarayıcı listesini yeniler. Geçersiz RPC yanıtları boş liste olarak kabul edilmez. Üretimde firma yoksa admin onayı, üyelik, rehber görünürlüğü ve kategori gerçek hesapla incelenmelidir; bu değişiklik erişim politikalarını gevşetmez.

Genel site denetimi: Ana sayfa, firma rehberi, makine/sarf, hizmetler, alım talepleri, profil, bilgilendirme, rehber ve yasal sayfalar incelendi. Alım taleplerindeki yanlış katalog/tür başlıkları ve 9 sonuç sayacı kaldırıldı. Sunucu çıktısındaki boş filtre/süreç düğmeleri dolduruldu veya oturum çözülene kadar gizlendi. Kategori başlıkları sadeleştirildi; kategoriye ait liste düğmesi artık doğal taş sekmesine atmaz. Yabancı dil ana sayfasındaki karışık kart çevirileri ve Türkçe süreç bölümleri temizlendi. Tam yabancı dil taş/firma detayları, gerçek iki hesaplı teklif/RLS akışı ve e-posta teslimatı bu denetimde doğrulanmadı. Canlıda mevcut halka açık firma verisi sıfır; bunun nedeni yönetici/account incelemesi olmadan belirlenemez.

#### Denetim sonucu ve yayın sınırı
Canlı tarayıcı kontrolünde ana menüde Alım Talepleri ve footer bilgi sayfaları mevcut. Doğal taş araması Afyon sorgusunu 4 rehber kartına indiriyor; detay penceresi ve girişsiz Teklif iste → giriş akışı çalışıyor. Afyon White gerçek detay bağlantısı açıldı, canonical ve tek görünür H1 doğrulandı, kırık görsel görülmedi. Diğer sekiz taş detay adresi web üzerinden erişilebilir çıktı verdi; bu çıktıların önbellek farkları olabileceği görüldü. Firma listesi güncel tarayıcı verisinde sıfır; eski arama çıktısındaki dsasd kaydı güncel durumun kanıtı değildir. Profil girişsiz durumda hata yerine giriş kartına yerleşiyor. Çerez tercihleri açılıyor; analitik yapılandırılmadığında zorunlu depolama açıklaması ve Anladım düğmesi geliyor. Bilgi sayfalarının metadata alanları mevcut. KVKK gerçek işletmeci adı ve adresi eksik. EN/ZH/AR URL ve metadata alanları mevcut ancak tüm detay/hesap içeriklerinin çevirisi tamamlanmış değildir.
Bu paket canlıya otomatik yüklenmedi. Gerçek iki hesaplı teklif/RLS izolasyonu, SMTP doğrulama/sıfırlama e-postalarının teslimatı, teklif bildirimi sunucu ayarları ve yönetici hesabıyla firma görünürlüğü tanısı bekliyor. Gerçek mobil tarayıcı ve ölçülmüş Lighthouse/Core Web Vitals çalışması yapılmadı; mobil iyileştirmeler CSS düzeyinde doğrulandı. Bu nedenle sistemin tamamen sorunsuz olduğuna dair garanti verilmez.

## 8 Ekim 2026 — kayıt ve canlı hesap denetimi

- Ülke ve şehir alanları boş başlar; yer adı yerine ne yazılacağını anlatan yardımcı metin gösterilir (TR/EN/ZH/AR).
- Kayıt gönderilmeden “inceleme bekliyor” diye gerçek başvuru durumu gösterilmez.
- Auth 500 hatası yanlış parola veya bağlantı yokmuş gibi anlatılmaz; sunucu hatası ayrı gösterilir.
- Firma detayında gemi acentesi, konteyner fumigasyonu ve ocak + fabrika faaliyet adları korunur.
- Taş: alıcı talebi → tedarikçi teklifi → kabul → kapatma canlıda doğrulandı.
- Hizmet: tedarikçi talebi → hizmet sağlayıcı teklifi → kabul → kapatma canlıda doğrulandı. TEST kayıtları kapalı bırakıldı.
- Tedarikçi ve hizmet sağlayıcı makine talebi kaydı/kapaması doğrulandı.
- Rehber görünürlüğü açık firma kategori ve detayda görünür; gizli firma görünmez. Logo mevcut tedarikçiyle doğrulandı.
- İlk hizmet girişinden sonraki geçişte bir kez oturum kaybı gözlendi; sonraki hesap geçişlerinde tekrarlanmadı. Kök neden doğrulanmadı, giderildi sayılmamalı.
- Gerçek e-posta teslimatı, katalog dosyası yükleme/yayınlama, hesaplar arası doğrudan RLS izolasyonu ve gerçek telefon/performance testi henüz tam doğrulanmadı.

Supabase kayıt trigger'ının beklediği belge sürümü ile site sürümü 2026-10-06 olmalı. request_lifecycle SQL dosyasının sonundaki sürüm senkronizasyonu eski 2026-09-25 kontrolünü günceller; zaten güncelse değiştirmez. Bu dosya önceki yaşam döngüsü işlemlerini de içerir; sadece belge sürümü için sohbetten verilen hedefli SQL yeterlidir. Confirm email açık tutulmalıdır. Belge sürümünü değiştirirken SQL kontrolünü aynı yayında güncelleyin.

Bu ZIP'i GitHub'a aktarıp Vercel Production yayını tamamlamadan buradaki arayüz değişiklikleri canlıya geçmez.


## 8 Ekim: yönetimde firma belgesi açma
Belge listesi en son güncellenen dosya önce gelecek şekilde sıralanır; klasörler ve desteklenmeyen dosyalar belge olarak seçilmez. Eksik imzalı bağlantı açık hata verir. Tarayıcı yeni sekmeyi engellerse yönetim ekranında iki dakika geçerli açma bağlantısı gösterilir. Belge deposu özel kalır; RLS ve yönetici yetkileri değiştirilmedi. Belge seçimi, liste/imza hataları ve geçersiz firma sahibi için otomatik kontroller yapıldı. Canlı yönetici belge açma testi tarayıcı erişimi nedeniyle tamamlanmadı; bu paket GitHub/Vercel'e otomatik yayınlanmadı.

## 8 Ekim: firma ve reklam kalıcı silme
Firma kartında Firmayı kalıcı sil, reklam satırında Kalıcı sil düğmesi eklendi. Adı/başlığı yazmak ve son onayı vermek zorunludur. Sunucu aynı adı, yönetici yetkisini ve e-posta doğrulamasını yeniden denetler. Ödeme kaydı olan firma da silinebilir; ödeme ve üyelik kayıtları da silinir. Firma silme, katalogları, firma tekliflerini ve firma hesabının kendi talepleri/tekliflerini, ödeme/üyelik/doğrulama/inceleme kayıtlarını ve başvuruyu kaldırır. Diğer alıcıların talepleri korunur; silinen hizmet firmasına özel hedef bağlantısı kaldırılır. Auth giriş hesabı, profil ve yüklenen Storage dosyaları silinmez. Reklam silme reklam satırını kaldırır; görsel dosyası korunur.
Kurulum: supabase/migrations/20261006_request_lifecycle.sql dosyasının en altındaki `-- ADMIN PERMANENT DELETION` satırından son `commit;` satırına kadar olan bölümü Supabase SQL Editor'de çalıştırın. Önceki migration bölümlerini tekrar çalıştırmanız gerekmez. Sonra GitHub/Vercel'e bu paketi yayınlayın. Yeni RPC'ler kurulmadan düğmeler çalışmaz. SQL canlıda veya ayrı PostgreSQL'de yürütülmedi; bilinmeyen FK ilişkileri silmeyi engellerse transaction geri alınır. Canlıda hiçbir kayıt silinmedi. Kalıcı silmenin geri alma düğmesi yoktur.

Ödeme kayıtlı firma silme güncellemesi: onay metinleri ödeme ve üyelik kayıtlarını açıkça sayar. Otomatik arayüz testinde ödeme kaydı olan firmaya da onay sonrası tek RPC gönderildiği doğrulandı. SQL silme işlemi canlı veritabanında henüz test edilmedi.


## 8 Ekim: yönetimde site içi pencereler
Silme ve üyelik onayları tarayıcı prompt/confirm yerine odak kontrollü site içi dialog ile açılır. Firma adı/reklam başlığı eşleşmeden silme düğmesi etkinleşmez; Escape veya Vazgeç iptal eder. İşlem sonuçları panel içinde gösterilir. Firma belgesi yeni sekme yerine panel üzerindeki geniş belge penceresinde açılır; tarayıcı gömmeyi desteklemiyorsa indirme bağlantısı bulunur. Çıkışta açık pencere kapanır. Beyaz zemin, sade tipografi ve mevcut yeşil tonları kullanılır. Canlı görsel ve belge iframe testi tarayıcı erişimi nedeniyle yapılmadı. Bu değişiklik için yeni SQL gerekmez; kalıcı silme SQL'i önceden kurulmuş olmalıdır.


## Firma silindikten sonra giriş engeli
Güncel ADMIN PERMANENT DELETION bölümü, firma silme transaction'ında bağlı Auth kullanıcısının banned_until alanını uzak geleceğe ayarlar ve auth.sessions kayıtlarını kaldırır. Auth satırı referanslar için kalır, yeni giriş engellenir. Kendi yönetici hesabını bu yolla kapatma engellenir. Bu önceki silme işlemine göre davranış değişikliğidir; eski silinen hesaplara geriye dönük uygulanmaz. Daha önce silinen hesabı Supabase Authentication Users ekranında ayrıca Ban user ile engelleyin. Mevcut access token'lar süreleri dolana kadar geçerli kalabilir; oturum silme anlık JWT iptali değildir. Canlı Auth ban ve SQL yürütme testi yapılmadı. Yeni davranışı etkinleştirmek için son SQL bölümünü tekrar kurun ve paketi yayınlayın.

## 8 Ekim: çok dilde yasal metinler ve profil bağlantısı
KVKK, gizlilik, çerez ve kullanım koşulları EN/ZH/AR için tüm bölümleriyle çevrildi. Aynı dilde yasal URL, dialog başlığı, sekmeleri, tarih etiketi, footer ve kayıt bağlantıları kullanılır; Arapçada RTL uygulanır. Profil dört dilde sunulur; header, hesap düğmesi ve talep sonrası profil yönlendirmesi dili korur. Profilde dil değiştirmek ilgili dilde profil URL'sini açar. Firmalar için, Hakkımızda ve İletişim içerikleri ile metadata dört dilde eklendi. Mevcut yasal sürüm değeri değişmedi; Türkçe yükümlülükleri değiştiren yeni koşul eklenmedi.
Doğrulama: production build (112 sayfa), TypeScript, bütün yasal bölüm sayılarının dört dilde eşleşmesi, çeviri/bağlantı ve dört profil yolu regression kontrolleri, mevcut pazar ve yönetim testleri geçti. Yeni sürüm canlıya otomatik yayınlanmadı ve girişli canlı tarayıcı testi yapılmadı. Kullanıcıların kendi firma/katalog metinleri otomatik çevrilmez. Firma/taş detaylarının tüm etiketleri, şifre sıfırlama sayfası ve yönetici paneli bu değişiklikle tamamen çevrilmiş sayılmaz; bunlarda kalan Türkçe metinler ayrıca ele alınmalı.

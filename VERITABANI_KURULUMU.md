# Marble Borsa: Supabase ve yayın kurulumu

GitHub/Vercel'e kod yüklemek SQL'i Supabase'e uygulamaz. Anahtar veya şifreyi paylaşmayın. Her dosyanın **tam içeriğini** Supabase projesinde **SQL Editor → New query → Run** ile ayrı ayrı çalıştırın; hata aldığınız dosyanın ardından sıradakine geçmeyin.

## 1. SQL sırası

Yeni proje için sıra:

1. `supabase/migrations/20260925_company_verification.sql`
2. `supabase/migrations/20260925_market_membership.sql`
3. `supabase/migrations/20260925_email_confirmation_gate.sql`
4. `supabase/migrations/20260926_category_company_directory.sql`
5. `supabase/migrations/20260928_seller_outreach.sql`
6. `supabase/migrations/20260930_supplier_directory_service_requests.sql`
7. `supabase/migrations/20260930_company_logos.sql`
8. **En son:** `supabase/migrations/20260930_equipment_catalog_profile.sql`

Önceki sürümün logo dosyasına kadar olan SQL'i başarıyla çalıştıysa **sadece 8. dosyayı** çalıştırın. Logo dosyası henüz çalışmadıysa önce 7, sonra 8 gerekir. Eski talep/rehber SQL'ini bu son dosyadan sonra çalıştırmayın; eski kurallar yeni yetkileri geri alabilir. Yeni dosya `begin` / `commit` içinde çalışır; hata varsa işlem geri alınır. Tekrar çalıştırmaya uygun politika ve fonksiyon yenilemeleri kullanır. `mb_private` şemasını Supabase API'de Exposed schemas listesine eklemeyin.

Yeni SQL `machine` ve `supplies` talep türlerini, yetki kurallarını, `mb_catalog_items` tablosunu, herkese açık `mb-catalog-assets` Storage alanını ve katalog/rehber listeleme işlevlerini oluşturur. Katalog fotoğrafları 3–10 adet, her biri arayüzde en fazla 5 MB; PDF isteğe bağlı ve en fazla 10 MB. Firma doğrulama belgeleri **özel** `mb-company-documents-private` alanında kalır; onu Public yapmayın.

Daha önce belirli bir hizmet firmasını hedefleyen eski hizmet talebi SQL'i uygulanmışsa yeni dosya o sütunları ve mevcut talepleri korur; hedefli eski talepler yalnızca seçilen hizmet firmasına görünür. Yeni hizmet talebi akışı ise uygun hizmet firmalarına açıktır.

## 2. E-posta onayı ve adres

Supabase **Authentication → Sign In / Providers → Email → Confirm Email** ayarını açın. Kullanıcı e-postasını onaylamadan uygulama profili ve işlem yetkisi açılmaz. Supabase **Authentication → URL Configuration** içindeki **Site URL** değerini gerçek Production adresinize ayarlayın; **Redirect URLs** listesine aynı adreste `/tr` ve `/tr/sifre-sifirla` yollarını ekleyin. E-posta şablonunda sabit localhost bırakmayın; standart doğrulama bağlantısı `{{ .ConfirmationURL }}` olmalıdır. Vercel'deki `NEXT_PUBLIC_SITE_URL` aynı adres olmalı. Eski e-postadaki bağlantı eski adresi taşıyabileceğinden yeni bir bağlantıyla sınayın.

SMTP, gönderen adı/alanı ve Türkçe şablon için [EPOSTA_GONDERICI_AYARI.md](EPOSTA_GONDERICI_AYARI.md) dosyasını izleyin. Test amaçlı `sandbox.smtp.mailtrap.io` gerçek üyelerin gelen kutusuna gönderim yapmaz.

## 3. İlk yöneticiyi atama

Yönetici normal üyelik oluşturup e-postasını doğrulasın. Supabase **Authentication → Users** bölümünden hesabın **User UID** değerini alın. SQL Editor'de sadece UID'yi değiştirip çalıştırın:

```sql
insert into public.mb_admin_accounts(user_id)
values ('BURAYA_USER_UID'::uuid)
on conflict (user_id) do nothing;
```

Ardından yönetici hesabıyla `/tr/yonetim` sayfasına girin. Satıcı başvurusu e-posta doğrulamasından sonra burada görünür. Yöneticinin firma belgesini incelemesi, banka tahsilatını gerçek kayıtla karşılaştırması, ödemeyi kaydetmesi ve 12 aylık üyeliği etkinleştirmesi gerekir. WhatsApp düğmesi yalnızca mesaj taslağını açar; otomatik göndermez. Ücretler arayüzde tedarikçi için 25.000 TL + KDV/yıl, hizmet firması için 15.000 TL + KDV/yıl olarak gösterilir; sistem ödeme yapmaz ve banka hareketini otomatik sorgulamaz.

## 4. Rol ve görünürlük kuralları

| İşlem | Alıcı | Aktif tedarikçi | Aktif hizmet firması |
| --- | --- | --- | --- |
| Taş/ürün alım talebi açma | Evet | Hayır | Hayır |
| Makine/sarf talebi açma | Evet | Evet | Evet |
| Hizmet talebi açma | Hayır | Evet | Hayır |
| Ürün ve makine/sarf talebine teklif | Hayır | Evet | Hayır |
| Hizmet talebine teklif | Hayır | Hayır | Evet |
| Kendi firma kataloğunu yayınlama | Hayır | Taş/makine/sarf | Hizmet |

Firma sahibi kendi talebine teklif veremez. Firma, aktif üyelik ve doğrulama olmadan satıcı işlemleri yapamaz. `Profil → Firma rehberi görünürlüğü` kapalıysa katalog ve firma herkese açık listelerde görünmez. Açık olsa bile yalnızca e-postası doğrulanmış, belgesi onaylanmış ve üyeliği geçerli firma listelenir. Firma adı, şehir, faaliyet, logo, yayımladığı açıklama, fotoğraflar, PDF ve video bağlantısı görünür; vergi ve yetkili kişi bilgileri ve resmi belgeler yayınlanmaz.

`Profil` (`/tr/profil`) üyelik, resmi belge, logo, katalog, kendi talepleri ve teklifleri yönetir. Satıcı fotoğraf/PDF ile katalog kaydı ekleyebilir, metin ve video bağlantısını düzenleyebilir, kaydı yayından kaldırıp yeniden yayınlayabilir. Fotoğraf değişimi için yeni kayıt oluşturulur. Firma dizinindeki örnek/sahte şirketler kaldırıldı; taş, makine ve hizmet çizimleri yalnızca kategori örnekleridir, belirli firmaların ürünü gibi gösterilmez.

## 5. Gerçek hesaplarla son kontrol

1. Alıcı hesabı açın; e-postayı doğrulayıp taş ve makine/sarf talebi oluşturun. Yeni talepleri Profil'de görün.
2. Ayrı bir tedarikçi hesabı açın; e-postayı doğrulayın, Profil'de firma belgesi ve logo yükleyin. Yönetim ekranında belge/ödeme/üyelik onayını tamamlayın ve rehber görünürlüğünü açın.
3. Tedarikçi hesabıyla makine/sarf ve hizmet talebi açın; 3 fotoğraflı bir katalog ürünü yayınlayın. Firma Firmalar'da, ürünü ilgili kategoride gerçek fotoğrafıyla görün. Tedarikçi başka alıcının taş veya makine/sarf talebine teklif verebilmeli.
4. Ayrı ve onaylı hizmet firması hesabıyla hizmet kataloğu yayınlayın; satıcının hizmet talebine teklif verin. Bu firma kendi makine/sarf ihtiyacına talep açabilmeli. Kendi talebine teklif verememeli.
5. Rehber görünürlüğünü veya katalog yayın anahtarını kapatın; ziyaretçi görünümünde kaldırıldığını doğrulayın. Üyelik bitişi veya doğrulama geri alma halinde satıcı yetkileri düşmeli.

## 6. Yayın öncesi kalanlar

- `lib/dataController.ts` içinde gerçek veri sorumlusu **unvanı ve tebligat adresi** köşeli parantezli yer tutucu durumundadır. Yasal metinleri gerçek işletme ve kullandığınız sağlayıcılarla gözden geçirip son halini verin.
- Son kontrol edilen `https://stone-quote-market.vercel.app/tr` adresi `DEPLOYMENT_NOT_FOUND` dönüyordu. Gerçek Production dağıtımını ve alan adını Vercel'de doğrulayıp yukarıdaki hesap testlerini o adreste yapın.
- Bu çalışma alanı canlı Supabase projesine erişmedi. SQL ve gerçek üyelik/Storage testi, proje sahibi tarafından kendi panelinde tamamlanmalıdır.

# Marble Borsa: veritabanı ve yönetici kurulumu

Bu paket mevcut Supabase projesindeki Auth ve özel firma belgesi alanını kullanır. Depoya dosya yüklemek SQL'i Supabase'e uygulamaz. Anahtar ve şifre paylaşmanız gerekmez.

## 1. SQL'i çalıştırın

Üç dosyayı **aynı Supabase projesinde**, sırayla ve her birini ayrı **SQL Editor → New query** ekranında çalıştırın: önce `supabase/migrations/20260925_company_verification.sql`, sonra `supabase/migrations/20260925_market_membership.sql`, en son `supabase/migrations/20260925_email_confirmation_gate.sql`. Dosya adını değil, **tam içeriğini** yapıştırıp **Run** deyin. Her sorguda başarı sonucunu görün; hata olursa sıradaki dosyaya geçmeyin. Yeni tablolar `mb_` ön ekiyle görünür.

Üyelik SQL'i daha önce uygulanmışsa eski sürümü tekrar çalıştırmak `policy ... already exists` hatası verebilir. **Bu güncel paketteki** üyelik SQL'i kendi RLS kurallarını tek bir işlem içinde yeniden oluşturur; mevcut kullanıcı, talep ve teklif satırlarını silmez. Eski paketteki aynı adlı dosyayı kullanmayın. Son dosya olan onay SQL'i, yeni kullanıcıların uygulama profilini ve firma başvurusunu e-posta onayına kadar bekletir; önceden oluşturulmuş onaysız profillerin talep/teklif yazmasını engeller.

SQL mevcut Auth kullanıcılarını bekleyen başvuru olarak içeri alır; eski metadata hiçbir üyeliği etkinleştirmez. Kayıt sonrası rol veritabanında sabitlenir. Yeni kayıtlarda başvuru ve yasal kutuların işlem zamanı veritabanında kayda alınır. Eski metadata kayıtları `legacy_signup_metadata` kaynağıyla ayrılır.

`mb_private` şemasını Supabase **API → Exposed schemas** listesine eklemeyin. Yönetici işlemlerinin yüksek yetkili kısmı burada durur; uygulamanın kullandığı açık işlevler kullanıcı yetkisini içeride doğrular.

Supabase'de **Authentication → Sign In / Providers → Email** bölümünden **Confirm Email** seçeneğini **açıp kaydedin**. Yeni kayıt önce doğrulama e-postası alır; onaylanmadan giriş ve işlem yapamaz. Supabase, bağlantıyı doğrulamak için bekleyen bir Auth kaydı tutar; uygulama profili onaydan sonra açılır. Panelde Confirm Email kapalıysa site yeni kayıt oturumunu kapatıp ayar uyarısı gösterir.

## 2. İlk yöneticiyi atayın

Yönetici olacak kişi sitede normal hesap açsın ve e-posta doğrulamasını tamamlasın. Supabase **Authentication → Users** bölümünde bu hesabın **User UID** değerini kopyalayın. SQL Editor'de aşağıdaki sorgunun yalnızca `BURAYA_USER_UID` kısmını bu UUID ile değiştirerek çalıştırın:

```sql
insert into public.mb_admin_accounts(user_id)
values ('BURAYA_USER_UID'::uuid)
on conflict (user_id) do nothing;
```

Yöneticiyi üyelik formundaki `role` değeriyle atamayın. İlk yönetici kaydı yalnızca SQL Editor üzerinden oluşturulur. Yönetici hesabıyla giriş yaptıktan sonra **Hesabım → Yönetim paneli** veya `/tr/yonetim` adresini kullanın. Panel bağlantısını saklamak tek başına güvenlik sağlamaz; okuma kuralları ve üç yönetici işleminin tamamı veritabanında yetki kontrolü yapar.

## 3. Güncel projeyi yayınlayın

Tam proje içeriğini GitHub depo köküne koyup Vercel'de yeniden dağıtın. Var olan `NEXT_PUBLIC_SITE_URL` ve indeksleme ayarlarını önceki kararlara göre koruyun. Supabase'in **service role** veya **secret** anahtarını Vercel'in `NEXT_PUBLIC_` değişkenlerine ya da tarayıcı dosyalarına koymayın. Uygulama mevcut, herkese açık Supabase istemcisini kullanır; özel tablolar için yetki RLS ile sağlanır.

### E-posta onayı localhost'a dönüyorsa

Supabase projesi `edndfgxkbfatmfemiayj` içinde **Authentication → URL Configuration** bölümünü açın:

1. **Site URL:** `https://stone-quote-market.vercel.app`
2. **Redirect URLs:** `https://stone-quote-market.vercel.app/tr` adresini ekleyin ve kaydedin. Tam URL'nin, sondaki `/tr` dahil, aynı olması gerekir.
3. **Authentication → Email Templates → Confirm signup** şablonunu özelleştirdiyseniz onay düğmesinin `href` değerini kontrol edin. Standart akış için `{{ .ConfirmationURL }}` kullanın; şablonda sabit `localhost` veya yalnızca `{{ .SiteURL }}` ile oluşturulmuş onay bağlantısı bırakmayın.
4. Vercel Production ortamında `NEXT_PUBLIC_SITE_URL=https://stone-quote-market.vercel.app` değerini doğrulayın ve bu paketteki kod değişikliğini yeniden yayınlayın. Kayıt kodu bu adrese bağlı `/tr` sayfasını e-posta dönüş adresi olarak gönderir.

URL ayarları için SQL Editor'de komut çalıştırılmaz. Eski onay e-postasındaki bağlantı eski yönlendirmeyi taşıyabilir; yeni bir onay e-postasıyla deneyin. İlk bağlantıya tıklandığında e-posta doğrulanmış olabilir: önce yayındaki sitede **Giriş Yap** ile deneyin. Gerçek yayın adresini daha sonra değiştirirseniz Vercel değişkenini, Supabase Site URL'sini ve Redirect URLs kaydını birlikte güncelleyin.

Bu sürümde demo hesap girişi ve tarayıcıya kaydedilen demo talep/teklif akışı kaldırıldı. Gerçek talepler için alıcı hesabıyla giriş yapın. Ürün ve teslim yeri **en az iki karakter** olmalıdır; önceki ekrandaki tek harflik teslim yeri veritabanı tarafından reddediliyordu. Katalogdaki örnek firma/ürün kartları henüz gerçek ilan modülüne bağlı değildir; yayından önce gerçek içerikle değiştirilmelidir.

## Makine, sarf ve hizmet firmalarını listeleme

Yukarıdaki üç SQL dosyası başarıyla kurulduktan sonra `supabase/migrations/20260926_category_company_directory.sql` dosyasının **tam içeriğini** SQL Editor'de yeni bir sorguya yapıştırıp **Run** deyin. Üç eski dosya zaten çalıştırılmışsa tekrar çalıştırmanız gerekmez. Ardından güncel site kodunu yayınlayın.

Makine üreticisi ve sarf tedarikçisi başvuruları Makine & Sarf bölümüne; hizmet sağlayıcı başvuruları Hizmetler bölümüne ayrılır. Karttaki uygun ürün/hizmet yanında firma adı, ayrıca bölüm altında ilgili firma listesi görünür. Bir firmanın yayınlanması için e-postası ve firma belgesi doğrulanmış, ücretli üyeliği aktif olmalı ve firma rehberde görünmeyi isteğe bağlı olarak açmış olmalıdır. Firma bu tercihi hesabından kapatabilir. Sayfada sadece firma adı, şehir ve faaliyet türü gösterilir; vergi, yetkili, telefon, adres ve belge bilgileri yayınlanmaz.

Henüz bu koşulları sağlayan makine/hizmet firması yoksa alan boş durum gösterir; taş rehberindeki örnek firmalar başka bir kategoriye taşınmaz. Bu adım firma adlarını listelemeyi sağlar; tek tek ürün ilanı, firma profil sayfası ve firmaya doğrudan özel mesaj özelliği henüz yoktur.

## 4. Bir başvuruyla doğrulayın

1. Farklı e-posta adresiyle **tedarikçi** hesabı açın, e-postayı doğrulayın ve Hesabım'dan firma belgesini yükleyin. Başvuru beklemede olmalı; alım talebi listesi kapalı kalmalı.
2. Yönetici hesabıyla `/tr/yonetim` sayfasını açıp firma belgesini inceleyin ve **Firma doğrulandı** işlemini yapın.
3. Gerçek banka hesabında ödeme göründükten sonra hesaba geçen **tutarı, banka işlem açıklamasını ve hesabınıza geçiş tarihini** kaydedin. Dekont tek başına yeterli sayılmaz. SQL, tedarikçide en az 25.000 TL, hizmet sağlayıcıda en az 15.000 TL taban bedelini zorunlu tutar; KDV dahil doğru tahsilatı yönetici kontrol eder.
4. İlgili ödeme kaydında **Üyeliği etkinleştir (12 ay)** düğmesine basın. Yönetici, ödeme ve aktivasyon kaydı ayrı tutulur. Kullanıcı Hesabım'da bitiş tarihini görür.
5. Ayrı bir **alıcı** hesabıyla talep açın. Onaylı tedarikçi başka tarayıcıda Alım Talepleri'ni görüp teklif verebilir; alıcı teklifi kendi hesabında görür. Hizmet sağlayıcı ve onaysız tedarikçi tedarikçi taleplerini göremez.

## Erişim ve sınırlar

- İlan katalogları hâlâ örnek içerik. Bu kurulum gerçek alım talebi ile teklif veritabanını açar; firma veya hizmet ilanı oluşturma paneli, otomatik banka entegrasyonu, otomatik fatura ve e-posta gönderimi içermez. Özellikle hizmet sağlayıcı üyeliğinden ücret almadan önce hizmet ilanı yayınlama akışının tamamlanması gerekir.
- İlk sürümde her kullanıcı hesabına bir firma başvurusu bağlıdır. Onay kaldırılırsa veya 12 ay dolarsa yeni talep görüntüleme/teklif işlemleri RLS tarafından durdurulur; eski talepler ve teklifler silinmez. Yenileme için yeni bir banka ödeme kaydı ve yeni aktivasyon gerekir.
- Yönetici ödeme tutarını, banka açıklamasını, tarihini, belgeyi ve şirket bilgisini kontrol eder. Sistem banka hareketini otomatik sorgulamaz.
- Canlı Supabase projesine bu ortamdan erişim sağlanmadı; SQL'i orada sizin çalıştırmanız ve iki ayrı gerçek hesapla son adımı denemeniz gerekir.

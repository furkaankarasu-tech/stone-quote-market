# Marble Borsa V5: canlı kayıt ekranı ve görünür metinler

## Bu sürümde değişenler

- Dört dildeki Üye Ol hesap kartlarından ücretsiz/ücret ve “iletişime geçin” ifadeleri kaldırıldı.
- Firma başvurusu üzerinde duran ücret/ödeme açıklama kutusu ve e-posta bağlantısı kaldırıldı.
- Profildeki üyelik ücret/contact satırı ve ziyaretçiye yönelik ödeme durumu metinleri sadeleştirildi.
- Rehberlerin üst bandı ve alt bilgisindeki demo ibareleri Türkçe, İngilizce, Çince ve Arapçadan temizlendi.
- KVKK metninin başındaki “Taslak metindir” yazısı kaldırıldı; KVKK/Gizlilik/Kullanım Koşulları bağlantıları ile onay kutuları **korundu**.
- Yöneticinin üyelik planları, ödemeyi doğrulama süreci, erişim yetkileri, Supabase tabloları ve gerçek talep/teklif mantığı değiştirilmedi.
- Hukuken önemli ücretli üyelik bilgisi **Kullanım Koşulları içinde** bedel belirtilmeden açık şekilde korundu. Ücret doğmadan önce başvuru sahibinin koşulları açıkça öğrenip kabul etmesi gerekir.

## Gerçek kullanıcı kaydı açmadan önce zorunlu

`lib/dataController.ts` dosyasındaki **[GERÇEK VERİ SORUMLUSU UNVANI]** ve **[TEBLİGAT ADRESİ]** alanları gerçek işletme/kişi bilgileriyle değiştirilmeli. Bu bilgiler sağlanmadığı için hukuki metinleri tamamlanmış veya incelenmiş kabul etmeyin. Mevcut KVKK, gizlilik ve kullanım koşullarını gerçek veri işleme ve hizmet akışınıza göre hukuki kontrolden geçirin. KVKK ve gizlilik metinlerini tamamen kaldırmayın; gerçek kullanıcı verileri işleniyor.

## Dağıtım

1. Önce V4 üzerine yalnızca değişen dosyaları (veya tam proje arşivini ayrı GitHub dalında) uygulayın. Klasör yapısını koruyun.
2. Vercel Preview: tasarım CSS'si, dört dilde Üye Ol ve rehberleri, KVKK bağlantılarını kontrol edin.
3. Terminal: `node tests/market-ui-smoke.cjs` ve diğer `tests/*smoke.cjs` kontrol dosyalarını çalıştırın.
4. Gerçek firma ile uçtan uca Supabase giriş, e-posta doğrulama, firma onayı ve yetkilendirmeyi ayrıca test edin; yerel testler gerçek hizmetin çalıştığını kanıtlamaz.
5. Tam Next.js derlemesi için `npm ci && npm run build` çalıştırın; başarılı preview sonrası Production'a geçin.

import { dataController } from "./dataController";
import { membershipContactEmail, membershipPlans } from "./membershipPlans";

export const legalVersion = "2026-09-25";

type Section = { heading: string; body: string };
type LegalDocument = { title: string; intro?: string; sections: Section[] };

export const legalDocuments: Record<"kvkk" | "gizlilik" | "kullanim-kosullari", LegalDocument> = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    intro: "Taslak metindir. Canlıya geçmeden önce veri sorumlusunun gerçek bilgileri ve kullanılan altyapı sağlayıcıları dikkate alınarak son kontrolü yapılmalıdır.",
    sections: [
      { heading: "Veri sorumlusu", body: `${dataController.unvan} veri sorumlusudur.` },
      { heading: "İşlenen veriler", body: "Kimlik ve iletişim, üyelik ve firma, işlem güvenliği, ürün/katalog, teklif talebi ve kullanıcı tarafından sağlanan içerik verileri işlenebilir." },
      { heading: "İşleme amaçları", body: "Üyelik oluşturulması ve yönetimi, B2B eşleştirme hizmeti, taleplerin ilgili firmalara yönlendirilmesi, destek, güvenlik, uyuşmazlık yönetimi ve hukuki yükümlülüklerin yerine getirilmesi." },
      { heading: "Hukuki sebepler", body: "Somut faaliyete göre sözleşmenin kurulması veya ifası, hukuki yükümlülük, bir hakkın tesisi, kullanılması veya korunması, meşru menfaat ve yalnız gerekli olduğu hâllerde açık rıza." },
      { heading: "Aktarım", body: "Hizmetin yürütülmesi için gerekli ölçüde barındırma, depolama, e-posta ve güvenlik sağlayıcılarına; talep/teklif akışında ilgili kullanıcı gruplarına ve hukuken yetkili kurumlara aktarım yapılabilir." },
      { heading: "Toplama yöntemi", body: "Kayıt ve iletişim formları, kullanıcı paneli, dosya yüklemeleri, teklif işlemleri ve teknik kayıtlar üzerinden otomatik veya kısmen otomatik yollarla." },
      { heading: "Haklar", body: `KVKK'nın 11. maddesindeki haklar veri sorumlusuna başvuru yoluyla kullanılabilir. Başvurularınızı ${dataController.kvkkBasvuruEmail} adresine iletebilirsiniz.` },
    ],
  },
  gizlilik: {
    title: "Gizlilik Sözleşmesi",
    sections: [
      { heading: "Toplanan bilgiler", body: "Ad-soyad, e-posta, telefon, firma adı, ülke/şehir, üyelik ve firma profili, ürün/katalog bilgileri, teklif talepleri, yüklenen medya/doküman bilgileri ile teknik ve güvenlik kayıtları işlenebilir." },
      { heading: "Amaçlar", body: "Hesap ve firma yönetimi, alıcı-tedarikçi eşleştirmesi, teklif süreçleri, güvenlik, destek, kötüye kullanımın önlenmesi ve yasal yükümlülüklerin yerine getirilmesi." },
      { heading: "Paylaşım", body: "Kullanıcının yayınlamayı seçtiği firma, ürün ve talep bilgileri platform kullanıcılarıyla paylaşılabilir. Teknik hizmet sağlayıcılarla hizmet için gerekli ölçüde paylaşım yapılabilir." },
      { heading: "Saklama", body: "Veriler işleme amacı ve uygulanabilir yasal saklama süreleri boyunca tutulur." },
      { heading: "İletişim", body: `${dataController.unvan}, ${dataController.adres}. KVKK başvuruları için ${dataController.kvkkBasvuruEmail} adresine ulaşabilirsiniz.` },
    ],
  },
  "kullanim-kosullari": {
    title: "Kullanım Koşulları",
    intro: "Marble Borsa doğal taş sektöründeki alıcı, üretici ve hizmet sağlayıcıları bir araya getiren B2B keşif ve teklif talebi platformudur.",
    sections: [
      { heading: "Platformun rolü", body: "Marble Borsa satıcı, alıcı, ödeme kuruluşu, taşıyıcı, gemi acentesi, gümrük müşaviri veya taraflar arasındaki sözleşmenin tarafı değildir. Satış, ödeme, sevkiyat, sigorta, gümrük ve diğer ticari işlemler kullanıcılar arasında doğrudan yürütülür." },
      { heading: "Hesap ve içerik", body: "Kullanıcı verdiği firma, ürün, stok, kapasite, görsel, video, test sonucu ve belge bilgilerinin doğru ve hukuka uygun olmasından sorumludur." },
      { heading: "Teklifler", body: "Fiyat, kalite, termin, teslim ve teknik bilgiler ilgili kullanıcı tarafından sağlanır; platform bunların doğruluğunu garanti etmez." },
      { heading: "Yasak kullanım", body: "Sahte firma, sahte talep/teklif, yanıltıcı ürün bilgisi, yetkisiz belge veya görsel kullanımı ve hukuka aykırı içerik yasaktır." },
      { heading: "Ücretli firma üyeliği", body: `Alıcı hesabı ücretsizdir. Tedarikçi üyeliği yıllık ${membershipPlans.supplier.annualAmountTRY.toLocaleString("tr-TR")} TL + KDV; hizmet sağlayıcı üyeliği yıllık ${membershipPlans.service.annualAmountTRY.toLocaleString("tr-TR")} TL + KDV'dir. Başvuru tek başına satış yetkisi sağlamaz. Ödeme site üzerinden alınmaz; firma ve ödeme doğrulandıktan sonra üyelik yönetici tarafından etkinleştirilir ve 12 ay sürer. Otomatik yenileme yapılmaz. Üyelik ayrıntıları için ${membershipContactEmail} adresine ulaşın.` },
      { heading: "İletişim", body: `${dataController.unvan}, ${dataController.adres}.` },
    ],
  },
};

export const legalLinks = [
  { href: "/tr/yasal/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/tr/yasal/gizlilik", label: "Gizlilik Sözleşmesi" },
  { href: "/tr/yasal/kullanim-kosullari", label: "Kullanım Koşulları" },
] as const;

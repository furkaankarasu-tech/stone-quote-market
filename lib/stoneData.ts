
export type Stone = {
  slug:string; name:string; turkishName?:string; aliases?:string[]; type:string; city:string; color:string; forms:string[]; image:string;
  thickness?:string[]; surfaces:string[]; stock:string;
  blockDimensions?:string; blockVolume?:string;
  description:string; tests:{label:string;value:string}[];
};
export const stones:Stone[] = [
 // Kalınlık ve blok ölçüleri tedarikçi tarafından doğrulanana kadar kayıtlara eklenmez.
 {turkishName:"Afyon Beyaz Mermer",aliases:["Afyon beyazı", "Afyon beyaz mermeri"],slug:"afyon-white",name:"Afyon White",type:"Mermer",city:"Afyonkarahisar",color:"Beyaz",forms:["Blok","Plaka","Ebatlı"],image:"white.webp",surfaces:["Cilalı","Honlu","Fırçalı"],stock:"Tedarikçiye göre",description:"Afyonkarahisar çıkışlı beyaz mermer. Bloktan ebatlı ürüne uzanan formatları için seçenekleri, güncel ölçüleri ve yüzeyleri firmalarla görüşerek karşılaştırabilirsiniz.",tests:[]},
 {turkishName:"Afyon Şeker Mermer",aliases:["Afyon şeker", "Afyon şeker mermeri"],slug:"afyon-sugar",name:"Afyon Sugar",type:"Mermer",city:"Afyonkarahisar",color:"Krem / Beyaz",forms:["Blok","Plaka"],image:"sugar.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Krem ile beyaz arasında kalan açık tonu, Afyon Sugar'ı açık renk mermer aramalarında öne çıkarıyor. Katalogda blok ve plaka formatları yer alıyor.",tests:[]},
 {turkishName:"Afyon Menekşe Mermer",aliases:["Afyon menekşe", "Afyon mor damarlı mermer"],slug:"afyon-violet",name:"Afyon Violet",type:"Mermer",city:"Afyonkarahisar",color:"Beyaz / Mor damarlı",forms:["Blok","Plaka"],image:"violet.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Beyaz zemin üzerindeki mor damarlar Afyon Violet'in ayırt edici görünümünü oluşturur. Plaka seçerken damar yönü ve parti görsellerini firmadan isteyin.",tests:[]},
 {turkishName:"Afyon Gri Mermer",aliases:["Afyon gri", "Afyon gri mermeri"],slug:"afyon-grey",name:"Afyon Grey",type:"Mermer",city:"Afyonkarahisar",color:"Gri",forms:["Blok","Plaka","Ebatlı"],image:"grey.webp",surfaces:["Cilalı","Honlu","Fırçalı"],stock:"Tedarikçiye göre",description:"Afyonkarahisar menşeli gri mermer; blok, plaka ve ebatlı formatları dizinde listeleniyor. Projenizdeki gri tonu seçmeden önce güncel numuneyi inceleyin.",tests:[]},
 {turkishName:"Burdur Bej Mermer",aliases:["Burdur bej", "Burdur bej mermeri"],slug:"burdur-beige",name:"Burdur Beige",type:"Mermer",city:"Burdur",color:"Bej",forms:["Plaka","Ebatlı"],image:"beige.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Burdur'dan bej mermer arayanlar için plaka ve ebatlı ürün kaydı. Yüzey seçeneği, ölçü ve teslim edilebilir miktarı ilgili firmaya sorabilirsiniz.",tests:[]},
 {turkishName:"Bilecik Bej Mermer",aliases:["Bilecik bej", "Bilecik bej mermeri"],slug:"bilecik-beige",name:"Bilecik Beige",type:"Mermer",city:"Bilecik",color:"Bej",forms:["Blok","Plaka","Ebatlı"],image:"bilecik-beige.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Bilecik menşeli bej mermer, bloktan ebatlı parçaya kadar farklı ihtiyaçlar için katalogda bulunuyor. Partiler arasında renk ve damar farklılığı olabileceğinden numune isteyin.",tests:[]},
 {turkishName:"Muğla Beyaz Mermer",aliases:["Muğla beyazı", "Muğla beyaz mermeri"],slug:"mugla-white",name:"Muğla White",type:"Mermer",city:"Muğla",color:"Beyaz",forms:["Blok","Plaka"],image:"mugla-white.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Muğla'dan beyaz mermer. Dizindeki kayıtta blok ve plaka formatları bulunuyor; plaka seçimi yaparken istediğiniz tonun mevcut partideki fotoğraflarını inceleyin.",tests:[]},
 {turkishName:"Marmara Beyaz Mermer",aliases:["Marmara Adası mermeri", "Marmara çizgili mermer"],slug:"marmara-white",name:"Marmara White",type:"Mermer",city:"Balıkesir",color:"Beyaz / Gri çizgili",forms:["Blok","Plaka","Ebatlı"],image:"marmara-white.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Marmara Adası'nın gri çizgili beyaz mermeri. Çizgilerin yönü ve yoğunluğu seçimde belirleyicidir; blok, plaka veya ebatlı ürün için firma profilinden iletişime geçin.",tests:[]},
 {turkishName:"Denizli Traverten",aliases:["Denizli traverteni", "Denizli krem traverten"],slug:"denizli-travertine",name:"Denizli Travertine",type:"Traverten",city:"Denizli",color:"Krem",forms:["Blok","Plaka","Ebatlı"],image:"travertine.webp",surfaces:["Honlu","Dolgulu","Eskitme"],stock:"Tedarikçiye göre",description:"Denizli traverteninin krem tonlu seçeneği. Dolgulu, honlu veya eskitme yüzey tercihinizi belirtip mevcut blok, plaka ve ebatlı ürünleri firmalara sorabilirsiniz.",tests:[]},
];
export const stoneTypes = ["Tümü","Mermer","Traverten"] as const;

export function stoneDisplayName(stone:Stone,locale='tr'){return locale==='tr'&&stone.turkishName?`${stone.turkishName} (${stone.name})`:stone.name;}
export const stoneReviewDate='2026-10-24';
export const stoneEditorial:Record<string,{selection:string;application:string;check:string}>=
{
  "afyon-white": {
    "selection": "Afyon beyaz mermer seçerken açık zeminin tonu, gri damarların dağılımı ve farklı plakalar arasındaki geçiş birlikte değerlendirilir. Küçük bir numune, büyük plakanın damar yoğunluğunu tek başına göstermez. Aynı ışıkta çekilmiş tam plaka fotoğraflarını ve plaka numaralarını isteyin; geniş bir yüzeyde yan yana gelecek parçaları kesimden önce eşleştirin.",
    "application": "İç mekan zemin, duvar, basamak veya dekoratif eleman araştırmalarında beyaz görünüm değerlendirilebilir. Kullanım kararı sadece renkle verilmez: zeminde aşınma ve kayma, duvarda sabitleme sistemi, basamakta kenar detayı ve taşıyıcı altlık proje ekibince kontrol edilmelidir. Dış mekan veya ıslak alan için uygunluk ayrıca rapor ve uygulama tasarımıyla doğrulanır.",
    "check": "Teklifte beyaz tonunun kabul aralığını ve damar yoğunluğunu örnekle tarif edin. Reçine, file, tamir ve yüzey işlemi bulunup bulunmadığını sorun. Parti veya ocak değişirse eski numune onayının yeni ürüne otomatik olarak taşınmadığını yazılı hale getirin."
  },
  "afyon-sugar": {
    "selection": "Afyon şeker mermer adı altında karşılaştırılan açık krem-beyaz görünümlerde sıcaklık ve şeffaflık algısı aydınlatmaya göre değişebilir. Fotoğraftaki beyaz ayarı yerine aynı üretim partisinden numuneleri, kullanılacak ışıkta karşılaştırın. Islak çekilmiş taşın görünümü ile kuru ve tamamlanmış yüzeyin görünümünü aynı kabul etmeyin.",
    "application": "Açık ve sıcak ton istenen iç mekan kaplamaları, duvar yüzeyleri ve proje bazlı ebatlı parçalar için araştırılabilir. Honlu veya cilalı yüzey, ışık yansımasını ve bakım beklentisini değiştirir. Nihai seçimi numune, yüzey işçiliği ve uygulama detayını birlikte değerlendirerek yapın.",
    "check": "Siparişe konu plaka listesini, kullanılabilir net alanı ve kabul edilen renk çeşitliliğini teyit edin. Köşe ve kenarların fotoğrafları; çatlak, tamir ve yüzey bitişi kontrolünü kolaylaştırır. Ölçüler ve teslim edilebilir miktar için güncel teyit alın."
  },
  "afyon-violet": {
    "selection": "Afyon menekşe mermer araştırmasında mor damarların kalınlığı, yönü ve beyaz zemindeki dağılımı tasarımın ana belirleyicisidir. Aynı ticari ad altında sakin veya çok hareketli plakalar bulunabilir. Tek bir doku görseli yerine seçilecek her plakanın tamamını ve ardışık plaka sırasını görün.",
    "application": "Odak duvarı, dekoratif kaplama ve damar kompozisyonu isteyen projelerde kesim planı özellikle önemlidir. Ayna damar eşleme isteniyorsa plaka sıralaması, kesim payları ve yerleşim çizimi siparişe eklenmelidir. Bu çalışma görünüşü planlar; taşın teknik yeterliliği için ayrıca test ve uygulama hesabı gerekir.",
    "check": "Damarın hangi yönde ilerleyeceğini, kaç plakanın birlikte kullanılacağını ve kesimde korunacak bölümleri işaretleyin. Numune onayıyla birlikte tam plaka planını onaylayın. Doğal damar ile onarılmış çatlakların ayrımını tedarikçiden belge ve yakın fotoğrafla açıklamasını isteyin."
  },
  "afyon-grey": {
    "selection": "Afyon gri mermerde açık-koyu geçişleri ve damarların kontrastı, geniş yüzeylerde küçük numuneye göre daha belirgin hale gelebilir. Birkaç plakayı aynı karede, kuru yüzey ve benzer ışık altında karşılaştırın. Farklı üretim partilerinin aynı gri tonu vereceğini varsaymayın.",
    "application": "Gri tonlu iç mekan zemin, duvar ve ebatlı proje parçaları araştırılabilir. Yoğun kullanımda görünüşün yanı sıra aşınma, kayma, kir ve bakım beklentisi değerlendirilmelidir. Cilalı ve honlu numuneleri gerçek kullanım ışığında yan yana inceleyin.",
    "check": "Gri tonu için kabul edilen aralığı, yüzey bitişini ve plaka kalınlığı toleransını yazın. Yedek parça veya ileride ek sipariş gerekecekse aynı partiden ayrılabilecek miktarı görüşün. Aynı isimle daha sonra gelen ürünün birebir eşleşeceği garanti değildir."
  },
  "burdur-beige": {
    "selection": "Burdur bej mermer seçiminde sıcak bej tonu, ince damar yapısı ve plaka içindeki renk hareketi birlikte incelenir. Bej adı bir kalite sınıfı değildir; görsel eşleştirme gerçek parti üzerinden yapılır. Tam plaka, kenar ve yüzey yakın çekimlerini talep edin.",
    "application": "Bej tasarım paletine sahip iç mekan zeminleri, duvarlar ve ebatlı kaplamalar için seçenek olarak değerlendirilebilir. Parça ölçüsünü uygulama alanıyla birlikte planlayın; uzun veya dar parçaların kesim ve ambalaj gereksinimleri farklı olabilir. Uygunluğu uygulama ekibinin teknik şartnamesi belirler.",
    "check": "Fiyatı karşılaştırırken plaka net alanı ile ebatlı parça alanını karıştırmayın. Kenar işlemi, pah, kalibrasyon, yüzey, kesim kaybı ve etiketleme işlerini teklifte ayrı netleştirin. Teslimde kullanılacak parça kontrol çizelgesini önceden hazırlayın."
  },
  "bilecik-beige": {
    "selection": "Bilecik bej mermer adıyla sunulan partilerde bej tonunun açıklığı ve damar yoğunluğu karşılaştırılmalıdır. Renk uyumu gerektiren işlerde yalnız tek bir örnek değil, ayrılacak bütün partiyi temsil eden fotoğraf ve numune grubu kullanın. Ticari ad, her ocaktan aynı görünüm alınacağı anlamına gelmez.",
    "application": "Blok işleyebilen işletmeler, geniş plaka isteyen atölyeler ve proje ölçüsünde parça arayan alıcılar farklı ürün aşamalarını karşılaştırabilir. Blok alımında kesim kapasitesi ve tahmini verim; plaka alımında kullanılabilir alan; ebatlı üründe çizim ve tolerans önceliklidir.",
    "check": "Ürünün blok, plaka veya ebatlı teslim edileceğini açık yazın. Blokta net ölçüler, yüzey fotoğrafları ve yükleme bilgisi; plakada numaralı liste ve yüzey işçiliği; ebatlı üründe kesim planı ve kasa içerik listesi isteyin."
  },
  "mugla-white": {
    "selection": "Muğla beyaz mermerde zemin tonu, gri damar dağılımı ve yüzey boyunca renk geçişi incelenir. Başka bir beyaz mermerin numunesiyle benzer görünmesi, aynı teknik performans veya aynı üretim partisi anlamına gelmez. Seçilen taşın tam ticari adını ve kaynak bilgisini yazılı teyit edin.",
    "application": "Açık renkli iç mekan kaplamaları ve dekoratif proje parçaları için araştırılabilir. Islak alan, dış mekan veya cephe gibi uygulamalarda su, don, kayma ve sabitleme koşulları ayrı değerlendirilir. Kullanım kararını yalnızca katalogdaki renk fotoğrafına bağlamayın.",
    "check": "Tedarikçiden ocak veya kaynak tanımını, üretim partisini, plaka numaralarını ve teknik raporların hangi numuneyi temsil ettiğini isteyin. Aynı kalınlık ve yüzeydeki teklifler arasında karşılaştırma yapın; paketleme ve taşıma kapsamını ayrıca yazdırın."
  },
  "marmara-white": {
    "selection": "Marmara Adası mermeri için beyaz-gri çizgilerin yönü, aralığı ve sürekliliği seçimde önemlidir. Çizgisel karakteri korumak için plaka ve parçaların yönü kesimden önce işaretlenebilir. Fotoğraftaki çizgilerin gerçek sipariş partisini temsil ettiğini doğrulayın.",
    "application": "Çizgisel bir kompozisyon istenen duvar, zemin veya dekoratif parçalarda yönlü yerleşim planı hazırlanabilir. Köşe dönüşleri ve komşu parçaların damar devamlılığı görsel olarak değerlendirilmelidir. Montaj, ıslak alan ve bakım koşulları kullanım yerine göre ayrıca belirlenir.",
    "check": "Damar yönünü, parça numaralarını, karşılıklı yüzleri ve köşe birleşimlerini çizimde belirtin. Kasa etiketleri ile yerleşim planının aynı numaraları kullanmasını isteyin. Parçaların yön değiştirmesine yol açacak son dakika kesimlerini azaltmak için planı üretimden önce onaylayın."
  },
  "denizli-travertine": {
    "selection": "Denizli traverteninde gözenek yapısı, dolgu rengi ve kesim yönü birlikte değerlendirilir. Damar yönünde ve damara çapraz kesim farklı görünümler verebilir; sadece ticari ada bakarak kesim biçimini varsaymayın. Dolgulu ve dolgusuz numuneleri ayrı karşılaştırın.",
    "application": "Zemin, duvar veya dış alan araştırmalarında yüzey dokusu ve proje koşulları belirleyicidir. Dış mekan veya ıslak alanda kayma, don etkisi, suyla temas ve dolgunun uygunluğu için teknik rapor ve uygulama önerisi isteyin. Honlu, eskitme ya da başka bir bitişin tek başına her koşula uygunluk sağladığını kabul etmeyin.",
    "check": "Talepte kesim yönü, dolgu tercihi, yüzey işlemi, ölçü ve kalınlığı birlikte yazın. Yüzeyde istenmeyen açıklıkların kabul sınırını, numune grubunu ve paket içi renk dağılımını teyit edin. Dolgu ve tamir işlemlerinin tedarikçi tarafından açıklanmasını isteyin."
  }
};

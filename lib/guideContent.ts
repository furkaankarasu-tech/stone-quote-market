/** Editorial content. Keep claims verifiable: example textures are not live supplier stock. */
export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: {headers:string[];rows:string[][]};
};
export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  readingTime: string;
  sections: GuideSection[];
  relatedStones: string[];
  updatedAt?:string;
  author?:string;
  image?:string;
  sources?:{title:string;url:string}[];
};

export const trGuides: GuideArticle[] = [
  {
    slug: 'afyon-mermeri',
    title: 'Afyon Mermeri: Çeşitleri, Renkleri ve Seçim Rehberi',
    description: 'Afyon White, Afyon Sugar, Afyon Violet ve Afyon Grey mermerlerini tanıyın. Renk, damar, blok ve plaka seçerken hangi bilgileri istemeniz gerektiğini öğrenin.',
    summary: 'Afyonkarahisar mermerini renk tutarlılığı, format, yüzey ve proje gerekliliklerine göre değerlendirmek için genel bilgiler.',
    readingTime: '6 dk',
    relatedStones: ['afyon-white','afyon-sugar','afyon-violet','afyon-grey'],
    sections: [
      { heading: 'Afyon mermeri neden farklı seçeneklerle sunulur?', paragraphs: [
        'Afyonkarahisar, Türkiye’nin bilinen doğal taş üretim bölgelerinden biridir. Ancak “Afyon mermeri” tek bir renk veya ticari isim anlamına gelmez. Aynı bölgeden çıkan taşlar bile ocak, katman ve üretim partisine göre farklı görünebilir.',
        'Alıcı açısından önemli ayrım şudur: ticari taş adı bir başlangıç noktasıdır; siparişe konu olacak plakanın veya bloğun gerçekten nasıl göründüğü, güncel parti fotoğrafları ve gerekirse numunelerle anlaşılır.'
      ] },
      { heading: 'Afyon mermerinde bilinen ticari görünümler', paragraphs: [
        'Afyon White açık renkli bir görünüm arayan projeler için, Afyon Sugar ise krem-beyaz geçişlerini tercih edenler için incelenebilir. Beyaz zemin üzerinde belirgin mor damar arayanlar Afyon Violet’e; gri ton isteyenler Afyon Grey’e bakabilir.',
        'Ticari adlar tek başına sabit renk, kalite sınıfı, stok veya fiyat garantisi değildir. İstenen tonun mevcut üretim partisiyle uyuştuğunu satıcıyla doğrulayın.'
      ] },
      { heading: 'Blok, plaka ve ebatlı ürün nasıl seçilir?', paragraphs: [
        'Blok, taşın işleme öncesindeki büyük ham formudur; ölçülendirme ve kesim süreci gerektirir. Plaka ise bir veya daha fazla kesim aşamasından geçmiş geniş yüzeyli formdur. Ebatlı ürün, proje ölçülerine göre hazırlanmış parçaları ifade eder.',
        'Kendi kesim hattı bulunan alıcı blok tercih edebilir; belirli desenleri yan yana görerek seçim yapmak isteyen bir proje ise plaka fotoğrafları ve yerleşim planıyla ilerleyebilir. Ebatlı üründe ise tolerans, köşe işçiliği ve paketleme daha fazla önem kazanır.'
      ] },
      { heading: 'Teklif almadan önce sorulacaklar', paragraphs: [
        'Aynı isimle sunulan iki ürünün tekliflerini yalnızca birim fiyat üzerinden karşılaştırmak sağlıklı değildir. Teslim koşulları ve üretim ayrıntıları teklife açıkça yazılmalıdır.'
      ], bullets: [
        'Güncel parti, blok veya plaka fotoğrafları ve mümkünse onaylı numune',
        'Net miktar, ölçüler, kalınlık ve ölçü toleransı',
        'Cilalı, honlu veya istenen diğer yüzey işlemi',
        'Proje gerektiriyorsa bağımsız laboratuvar test sonuçları',
        'Ambalaj, fire, teslim zamanı, yükleme ve taşıma koşulları'
      ] },
      { heading: 'Afyon mermeri alırken son kontrol', paragraphs: [
        'Satıcıdan gerçek üretim partisi fotoğraflarını, istenen formatı, miktarı, hedef teslim yerini ve teknik şartnameye uygun belgeleri isteyin. Üreticinin güncel parti fotoğraflarını ve ticari bilgileri yazılı sipariş koşullarıyla teyit edin.'
      ] }
    ]
  },
  {
    slug: 'mermer-blok-plaka',
    title: 'Mermer Blok mu Plaka mı? Satın Alma Rehberi',
    description: 'Mermer blok, plaka ve ebatlı ürün arasındaki farkları; ölçü, yüzey, lojistik ve teklif aşamasında sorulacak soruları öğrenin.',
    summary: 'Blok, plaka veya hazır ölçülü mermer arasında karar verirken maliyetin ötesinde işleme, kalite kontrol ve lojistiği de hesaba katın.',
    readingTime: '5 dk',
    relatedStones: ['afyon-white','afyon-grey','marmara-white','denizli-travertine'],
    sections: [
      { heading: 'Mermer blok nedir?', paragraphs: [
        'Mermer blok, ocaktan çıkarılan ve henüz nihai ürün ölçülerine kesilmemiş taş kütlesidir. Bir bloğun gerçek kullanım değeri boyutundan ibaret değildir; çatlaklar, damar yönü, iç yapı ve hedef kesim planı sonucu etkiler.',
        'Blok alırken net boyut, ağırlık veya hacim, güncel dört yüz fotoğrafı, görünür kusurlar ve sevkiyat koşullarını sorun. Proje ihtiyacınız için hangi plaka veriminin sağlanabileceğini kesim yapacak ekiple değerlendirin; tahmini verim garanti değildir.'
      ] },
      { heading: 'Mermer plaka ne zaman tercih edilir?', paragraphs: [
        'Plaka, büyük taş bloğunun dilimlenmesiyle elde edilen geniş yüzeyli üründür. Taşın damar karakterini görerek seçim yapma imkanı sunar. Özellikle duvar kaplamaları, geniş yüzeyler ve ardışık plakaların desen devamlılığı gerektiren projelerde parti bütünlüğü önemlidir.',
        'Siparişte kalınlık, net plaka ebatları, kullanılabilir alan, yüzey işlemi ve gerekiyorsa damar eşleştirmesi açık olmalıdır. Farklı partilerde renk ve damar uyumu değişebileceği için seçimi yalnızca örnek katalog görseliyle tamamlamayın.'
      ] },
      { heading: 'Ebatlı ürün hangi durumlarda uygun?', paragraphs: [
        'Ebatlı ürün, belirli ölçülerde hazırlanmış taş parçalardır. Proje sahasında kesimi azaltabilir ancak üretim öncesi uygulama çizimi, derz ve tolerans bilgilerinin netleşmesi gerekir.',
        'Kesim bitmeden sipariş değişikliği gerekip gerekmediğini kontrol edin. Kalınlık, yüzey, kenar işçiliği, etiketleme ve paketleme planını teklifin bir parçası yapın.'
      ] },
      { heading: 'Üç formatın karşılaştırılması', paragraphs: [
        'Blok daha fazla üretim planlaması ve ekipman gerektirir. Plaka desen seçimine ve sonradan ebatlamaya alan bırakır. Ebatlı ürün ise doğru çizimle sahaya uygun teslimata yaklaşır. Tek bir format herkes için daha avantajlı değildir; üretim altyapısı ve proje takvimi belirleyicidir.'
      ], bullets: [
        'Blok: kesim kapasitesi, blok kusurları ve taşıma planı kontrolü',
        'Plaka: parti tutarlılığı, damar eşleşmesi ve kullanılabilir alan kontrolü',
        'Ebatlı: uygulama çizimi, ölçü toleransı ve parça bazlı paketleme kontrolü'
      ] },
      { heading: 'Teklifleri eşit şartlarda karşılaştırın', paragraphs: [
        'Bir teklif metrekare, diğeri ton veya metreküp esaslı olabilir. Format, ölçü ve hesaplama yöntemleri eşitlenmeden birim fiyat karşılaştırması yapmayın. Taşıma, sigorta, paketleme ve teslim şeklinin fiyata dahil olup olmadığını da yazılı olarak sorun.',
        'Doğal taşta performans gereklilikleri kullanım yerine göre değişebilir. Projenizin teknik şartnamesini satıcıya iletin ve gerekli test belgelerini talep edin.'
      ] }
    ]
  },
  {
    slug: 'turkiye-mermer-cesitleri',
    title: 'Türkiye Mermer Çeşitleri: Bölgelere ve Renklere Göre Rehber',
    description: 'Afyon, Burdur, Bilecik, Muğla, Marmara ve Denizli doğal taşlarını keşfedin. Mermer ve traverten farkını ve proje için seçim adımlarını öğrenin.',
    summary: 'Türkiye’de farklı bölgelerden gelen doğal taşları renk, taş türü ve proje ihtiyaçları açısından karşılaştıran başlangıç rehberi.',
    readingTime: '7 dk',
    relatedStones: ['afyon-white','burdur-beige','bilecik-beige','mugla-white','marmara-white','denizli-travertine'],
    sections: [
      { heading: 'Türkiye doğal taşları tek bir görünüme sahip değil', paragraphs: [
        'Türkiye’de çıkarılan doğal taşlar beyazdan beje, griden belirgin damarlı görünümlere kadar çeşitlilik gösterir. Ticari isimler bölgeyi veya görünümü anlatabilir fakat taşı teknik olarak tanımlamak için tek başına yeterli değildir.',
        'Seçime önce kullanım yerini, istenen tonu ve formatı belirleyerek başlayın. Görsel beğeni kadar ölçü, yüzey işlemi, temizlik ve bakım koşullarını da değerlendirin.'
      ] },
      { heading: 'Afyon ve açık renkli taşlar', paragraphs: [
        'Afyon White ve Afyon Sugar açık renk araştıran projelerde, Afyon Violet ise belirgin damar karakteri arayan tasarımlarda karşılaştırılabilir. Afyon Grey, gri ton araştırmalarında değerlendirilebilir.',
        'Muğla White da açık renk seçenekleri arasında değerlendirilebilir. Ancak benzer renk adları, taşların aynı performansı göstereceği anlamına gelmez.'
      ] },
      { heading: 'Burdur, Bilecik ve Marmara seçenekleri', paragraphs: [
        'Burdur Beige ve Bilecik Beige, bej tonlarını karşılaştırmak isteyenler için araştırılabilecek ticari adlardır. Bölge ve ticari isim tek başına homojenlik garantisi vermez; gerçek üretim partisini incelemek gerekir.',
        'Marmara White, açık zemin ve belirgin çizgisel damar karakteriyle tanınan ticari görünümlerden biridir. Projede damar yönü önemliyse plaka yerleşimini ve gerekli miktarı önceden değerlendirin.'
      ] },
      { heading: 'Traverten mermerden farklıdır', paragraphs: [
        'Denizli traverteni doğal taş pazarında sıklıkla mermerle birlikte listelense de jeolojik oluşumu ve gözenekli görünümü bakımından ayrı bir taş türüdür. Kullanım yeri ve yüzey işlemine göre dolgu, bakım ve kayma direnci gibi konuları değerlendirmek gerekebilir.',
        'İç mekan, dış cephe veya ıslak hacim gibi farklı uygulamalarda gerekli performans değerlerini proje şartnamesinden alın. Satıcıdan uygun test sonuçları isteyin.'
      ] },
      { heading: 'Doğru taş için kısa kontrol listesi', paragraphs: [
        'Farklı bölgelerden taş tekliflerini değerlendirirken yalnızca ticari ada bakmayın; ihtiyaçlarınızı karşılaştırma ölçütü yapın. Nihai uygunluk ve tedarik bilgileri satıcı tarafından doğrulanmalıdır.'
      ], bullets: [
        'Kullanım alanını ve varsa ilgili teknik şartnameyi belirleyin.',
        'Gerçek taş numunesi ve siparişe konu partinin fotoğraflarını isteyin.',
        'Taş türü, yüzey, kalınlık, ölçü ve toleransı yazılı hale getirin.',
        'Gerekli test belgelerini, paketleme ve teslim koşullarını değerlendirin.',
        'Benzer görsel kullanan farklı ticari isimleri aynı ürün kabul etmeyin.'
      ] }
    ]
  },

  {
    slug: 'mermer-satin-alma',
    title: 'Mermer Satın Alma Rehberi: Mermer Nasıl ve Nereden Alınır?',
    description: 'Mermer satın almak isteyenler için adım adım rehber: Mermer nereden alınır, metrekare nasıl hesaplanır, numune nasıl seçilir, teklif alırken nelere dikkat edilir?',
    summary: 'Ev, proje veya ticari alım için mermer ararken taş türünden numuneye, ölçüden teslim şartlarına kadar satın alma adımlarını öğrenin.',
    readingTime: '8 dk',
    relatedStones: [],
    sections: [
      { heading: 'Mermer almadan önce ihtiyacı netleştirin', paragraphs: [
        'Mermer satın alma sürecinde ilk adım, yalnızca beğenilen rengi seçmek değildir. Taşın iç mekanda mı, dış mekanda mı kullanılacağını, zeminde mi yoksa duvar kaplamasında mı değerlendirileceğini ve beklenen kullanım yoğunluğunu belirleyin. Teknik performans gereklilikleri kullanım yerine göre değişir.',
        'Mimari proje veya uygulama çizimi varsa planlanan yüzey alanını, parçaların ölçülerini, damar yönünü ve kenar detaylarını hazırlayın. Yalnızca yaklaşık metrekareyle istenen fiyatlar farklı kapsamları içerebileceği için doğrudan karşılaştırılamayabilir.'
      ] },
      { heading: 'Mermer nereden alınır?', paragraphs: [
        'Mermer, ocak işleten üreticilerden, işleme yapan fabrikalardan, proje bazlı çalışan tedarikçilerden veya perakende doğal taş satıcılarından alınabilir. Doğru kanal, ihtiyacın miktarına, istenen işlem seviyesine, teslim adresine ve satın alan tarafın işleme kapasitesine bağlıdır.',
        'Büyük miktarda ham blok alımında kesim altyapısı ve lojistik olanakları belirleyici olabilir. Konut uygulamasında ise ebatlanmış, yüzeyi işlenmiş ve uygulamaya uygun ürün daha kullanışlıdır. Satıcının gerçek faaliyetini, üretim imkanını ve istenen formatı sağlayabildiğini teyit edin.'
      ] },
      { heading: 'Metrekare ve ihtiyaç miktarını hesaplama', paragraphs: [
        'Dikdörtgen bir alan için en x boy hesabıyla metrekare bulunur. Birden fazla yüzey için her alanı ayrı ölçüp toplayın. Basamaklar, süpürgelikler, dönüşler ve damara göre desen eşleme gerektiren tasarımlar ek hesap gerektirebilir.',
        'Kesim fire oranı taşın ebatlarına, damar yönüne ve uygulama çizimine göre değişir. Her projeye uygulanabilecek tek bir güvenilir fire yüzdesi yoktur. Uygulamayı yapacak uzmanla kesim planını ve sipariş miktarını onaylayın.'
      ] },
      { heading: 'Numune, yüzey ve teknik belgeler', paragraphs: [
        'Mermer doğal bir malzeme olduğu için aynı ticari adla satılan farklı plakalar arasında ton, damar ve dokuda fark bulunabilir. Mümkünse güncel üretim partisinden numune ve tam plaka fotoğrafı isteyin. Özellikle geniş yüzeylerde arka arkaya kullanılacak plakaları birlikte değerlendirin.',
        'Cilalı, honlu veya farklı yüzey işlemleri görünümü ve kullanım özelliklerini değiştirebilir. Islak alan, dış mekan veya yüksek trafik gibi uygulamalarda ilgili teknik şartnamenin gerektirdiği test değerlerini ayrıca doğrulayın.'
      ] },
      { heading: 'Fiyat teklifi alırken aynı koşulları isteyin', paragraphs: [
        'İki satıcının aynı isimli mermer için verdiği fiyat, kalınlık, yüzey işçiliği, seçilen parti, teslim şekli ve paketleme farklıysa eşdeğer olmayabilir. Teklifte para birimini, ölçü birimini, miktarı, teslim adresini ve varsa vergileri açıkça belirtin.',
        'İhracat alımlarında teslim terimleri, yükleme noktası, sigorta ve gümrük sorumlulukları ayrıca netleştirilmelidir. Yazılı teklif, onaylı numune ve gerektiğinde teknik sözleşme olmadan yalnızca fotoğrafa bakarak siparişi tamamlamayın.'
      ], bullets: [
        'Kullanım yeri ve gerekli teknik şartname',
        'Malzeme türü, kalınlık, ebat, yüzey ve miktar',
        'Güncel parti fotoğrafları ve mümkünse onaylı numune',
        'Kesim planı, tolerans, fire ve damar eşleme koşulları',
        'Paketleme, sevkiyat, teslim tarihi ve toplam maliyet'
      ] }
    ]
  },
  {
    slug: 'mermer-fiyatlari',
    title: 'Mermer Fiyatları Nasıl Belirlenir? Metrekare ve Teklif Rehberi',
    description: 'Mermer metrekare fiyatlarını etkileyen taş türü, kalınlık, yüzey, işçilik ve nakliye farklarını öğrenin. Fiyat teklifi karşılaştırma rehberi.',
    summary: 'Mermerin birim fiyatından önce hangi ürünün, ölçünün ve teslim koşullarının fiyatlandırıldığını öğrenin.',
    readingTime: '6 dk', relatedStones: [],
    sections: [
      { heading: 'Mermer fiyatında neden tek bir rakam yok?', paragraphs: [
        'Mermer fiyatı taşın türüne, kaynağına, görünümüne, seçilen üretim partisine, kalınlığına, yüzey işlemine, işçilik kapsamına ve sipariş miktarına göre değişebilir. Aynı ticari taş adı, farklı ebat ve kalite seçimleriyle farklı maliyetlere sahip olabilir.',
        'İnternette görülen güncel olmayan genel fiyat aralıkları, proje bazlı satın alma kararı için yeterli değildir. Geçerli bir fiyat karşılaştırması yapabilmek için satıcılardan aynı teknik tanımla ve aynı teslim koşullarında yazılı teklif alın.'
      ] },
      { heading: 'Metrekare, ton ve metreküp birimleri', paragraphs: [
        'İşlenmiş plaka ve ebatlı ürün sıklıkla metrekare, ham blok ise metreküp veya ton üzerinden fiyatlandırılabilir. Bu birimler farklı ürünleri ve işçilik aşamalarını temsil edebildiği için doğrudan birbirine çevrilerek fiyat karşılaştırması yapılmamalıdır.',
        'Metrekare fiyatını değerlendirirken gerçek plaka ölçüsünü, sipariş alanını ve kesim sonrası kullanılabilir alanı sorun. Ton ve metreküp tekliflerinde ölçüm yöntemi, yaklaşık yoğunluk ve tartım veya hacim esasının sözleşmede netleştiğinden emin olun.'
      ] },
      { heading: 'Kalınlık, yüzey ve kesimin etkisi', paragraphs: [
        'Taşın kalınlığı malzeme ihtiyacını, ağırlığı ve bazen işleme maliyetini etkiler. Cilalama, honlama, kumlama ve diğer işlemler farklı ekipman ve işçilik gerektirir. Özel kenar işçiliği veya birbirini takip eden damarlı plaka seçimi de teklifi değiştirebilir.',
        'Bu nedenle yalnızca mermer adıyla fiyat istemek yerine kalınlık, yüzey, kenar işlemi ve kesin ölçüleri aynı dosyada paylaşın.'
      ] },
      { heading: 'Nakliye ve toplam teslim maliyeti', paragraphs: [
        'Fabrika çıkışı ile alıcının şantiyesine teslim edilen fiyat aynı değildir. Sandık, palet, koruma malzemeleri, yükleme, iç nakliye, uluslararası taşıma, gümrük ve sigorta gibi maliyetler teklif kapsamına göre değişir.',
        'Özellikle ağır plakalar ve bloklar için toplam maliyeti hesaplamadan yalnızca ürün birim fiyatına göre karar vermeyin. Teslim yeri ve teslim şekli belirtilmiş, karşılaştırılabilir yazılı teklifler alın.'
      ] },
      { heading: 'Fiyat karşılaştırması için kontrol listesi', paragraphs: [
        'Tekliflerin içeriğini aynı tabloya yerleştirmek hata riskini azaltabilir. Ayrıca ödeme planı, teslim süresi, iade veya kusur değerlendirme koşulları gibi ticari hükümleri açıkça karşılaştırın.'
      ], bullets: ['Ticari taş adı ve onaylanan üretim partisi', 'Ölçü birimi, ebat, kalınlık ve kullanılabilir miktar', 'Yüzey ve kenar işçiliği', 'Paketleme ve teslim şekli', 'Para birimi, vergi, ödeme ve teslim zamanı'] }
    ]
  },
  {
    slug: 'mermer-cesitleri-kullanim-alanlari',
    title: 'Mermer Çeşitleri ve Kullanım Alanları: Beyaz, Bej ve Gri Taşlar',
    description: 'Beyaz, bej, gri ve damarlı mermer çeşitleri nerede kullanılır? Doğal taş seçerken görünüm, yüzey işlemi, bakım ve teknik kriterleri öğrenin.',
    summary: 'Mermer çeşitlerinin görünümünü ve farklı kullanım alanlarında dikkat edilmesi gereken temel seçim kriterlerini inceleyin.',
    readingTime: '6 dk', relatedStones: [],
    sections: [
      { heading: 'Renge göre mermer seçimi', paragraphs: [
        'Beyaz, krem, bej, gri ve damarlı mermer seçenekleri farklı tasarım hedeflerine hizmet edebilir. Ancak renk, taşın performansını tek başına açıklamaz. Aynı renk grubunda farklı taş türleri ve farklı teknik özellikler bulunabilir.',
        'Geniş yüzey için seçim yaparken küçük numunenin yanı sıra üretim partisinin büyük plaka fotoğraflarını da isteyin. Damar devamlılığı, desen yönü ve ton değişimi özellikle bitişik döşenen plakaları etkiler.'
      ] },
      { heading: 'Zemin ve duvar kaplamasında nelere dikkat edilir?', paragraphs: [
        'İç mekan duvar kaplaması ile yoğun kullanılan zemin kaplaması aynı koşullara maruz kalmaz. Zemin için beklenen kullanım yoğunluğu, kayma koşulları ve bakım gereklilikleri; duvar için ise alt yapı, sabitleme ve plaka ölçüleri önemlidir.',
        'Projeye göre gerekli taş özelliklerini mimar veya teknik uzmanla belirleyin. Taşın ticari adından yola çıkarak tüm uygulamalar için uygun olduğunu varsaymayın.'
      ] },
      { heading: 'Mutfak, banyo ve ıslak alanlar', paragraphs: [
        'Doğal mermer asitli maddelere ve bazı lekelenme koşullarına duyarlı olabilir. Mutfakta temizlik alışkanlığı, yüzey koruma uygulamaları ve bakım beklentisi dikkate alınmalıdır.',
        'Banyo ve dış mekan gibi ıslak yüzeylerde kayma ve suyla temas koşulları proje açısından ayrıca değerlendirilmelidir. Yüzey işçiliği ve bakım önerileri için satıcıdan yazılı bilgi alın.'
      ] },
      { heading: 'Cilalı, honlu ve diğer yüzeyler', paragraphs: [
        'Cilalı yüzeyler genellikle daha parlak bir görünüm sunarken honlu yüzeyler daha mat bir etki verir. Farklı mekanik yüzey işlemleri de estetik ve temas özelliklerini değiştirebilir; hiçbir işlem tüm kullanım alanları için tek başına doğru seçim değildir.',
        'Mümkünse örnekleri kullanılacak mekandaki ışıkta ve gerçek numune üzerinde karşılaştırın. Temizlik, yüzey yenileme ve koruma ihtiyacını satın alma kararına dahil edin.'
      ] },
      { heading: 'Doğru taş seçimi için beş soru', paragraphs: [
        'Görsel beğeniyle teknik uygunluk birlikte değerlendirilmelidir. Taş seçiminde aşağıdaki sorular alıcı ve uygulayıcı arasındaki iletişimi netleştirir.'
      ], bullets: ['Taş hangi mekanda ve hangi yüzeyde kullanılacak?', 'İstenen renk ve damar aralığı gerçek partiyle uyumlu mu?', 'Hangi ölçü, kalınlık ve yüzey gerekli?', 'Projenin istediği teknik belgeler var mı?', 'Temizlik, kullanım ve uzun dönem bakım beklentileri neler?'] }
    ]
  }
];

export const enGuide = {
  slug: 'turkish-marble-types',
  title: 'Turkish Marble: Types, Finishes and Buyer Checklist',
  description: 'Explore Turkish marble from Afyon, Burdur, Bilecik, Muğla and Marmara, plus Denizli travertine. Learn what to check before requesting a stone quote.',
  summary: 'An introductory guide for international buyers comparing Turkish natural stones, formats and supplier documentation.',
  sections: [
    { heading: 'Understanding Turkish natural stone', paragraphs: [
      'Turkey offers natural stone in a wide range of colours, vein patterns and commercial formats. A trade name can suggest a region or appearance, but it cannot replace current lot photographs, technical documentation or an approved sample.',
      'Before comparing suppliers, establish the intended application, required dimensions, finish, quantity and destination. These details make quotations more meaningful than a price request based on a photograph alone.'
    ] },
    { heading: 'A short regional overview', paragraphs: [
      'Afyon White and Afyon Sugar are options to research when looking for light-coloured marble. Afyon Violet is associated with a white background and pronounced violet veining, while Afyon Grey offers a grey-toned direction. Actual appearance varies by quarry and production lot.',
      'Buyers exploring beige stones may compare Burdur Beige and Bilecik Beige. Muğla White and Marmara White offer further light-coloured options; the visual pattern and availability should always be verified against the specific lot.'
    ] },
    { heading: 'Travertine is a separate stone category', paragraphs: [
      'Denizli travertine is often included alongside marble in commercial catalogues, but it is a distinct natural stone with its own characteristic porous appearance. Its suitability depends on the installation and required treatment.',
      'For floors, exterior applications and wet areas, obtain the project-specific performance requirements and ask for the relevant test documentation. Do not infer performance from a trade name.'
    ] },
    { heading: 'Blocks, slabs and cut-to-size stone', paragraphs: [
      'Blocks require cutting capability and a production plan. Slabs allow buyers to evaluate veining and plan layouts before cutting. Cut-to-size products require confirmed drawings, dimensional tolerances and packaging instructions.',
      'A quote per cubic metre, tonne or square metre may describe different products and scopes. Check the measurement basis, finish, included processing and agreed delivery terms before comparing prices.'
    ] },
    { heading: 'A practical request-for-quote checklist', paragraphs: [
      'Provide complete specifications and seek written confirmation. A stone trade name or catalogue category does not confirm current stock. Ask for confirmation of the production lot before ordering.'
    ], bullets: [
      'Exact material, application and acceptable colour or veining range',
      'Quantity, format, dimensions, thickness and tolerance',
      'Finish, edge work and any required matching or sequential slabs',
      'Current production-lot images, samples and relevant laboratory reports',
      'Packing method, Incoterms where applicable, delivery schedule and destination'
    ] }
  ]
} as const;

export const additionalGuides:Record<"tr"|"en"|"zh"|"ar",GuideArticle[]>={
  "tr": [
    {
      "slug": "traverten-secim-rehberi",
      "title": "Traverten Seçim Rehberi: Kesim, Dolgu ve Yüzey",
      "description": "Denizli traverteninde kesim yönünü, dolguyu, yüzeyi ve gerçek üretim partisini birlikte karşılaştırın.",
      "summary": "Denizli traverteninde kesim yönünü, dolguyu, yüzeyi ve gerçek üretim partisini birlikte karşılaştırın.",
      "readingTime": "",
      "relatedStones": [
        "denizli-travertine"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Kesim yönünü görerek seçin",
          "paragraphs": [
            "Traverten talebinde yalnızca krem veya bej renk yazmak yeterli değildir. Plaka yüzeyinde çizgili ya da daha bulutlu bir görünüm isteniyorsa tedarikçiyle kesim yönünü ve hangi numunenin esas alınacağını belirleyin. Tam plaka fotoğraflarını küçük numuneyle birlikte inceleyin.",
            "Aynı ticari adla sunulan iki partinin gözenek dağılımı, tonu ve damar karakteri farklı olabilir. Kullanılacak yüzey büyüdükçe bu fark daha görünür hale gelebilir; siparişe ayrılan partiyi gösteren fotoğraf listesi ve plaka numaraları isteyin."
          ]
        },
        {
          "heading": "Dolgu ve yüzey işlemini birlikte tarif edin",
          "paragraphs": [
            "Dolgulu ve dolgusuz seçenekleri aynı teklif satırında karşılaştırmayın. Dolgunun rengi, kullanılan işlem ve yüzeyin honlu, eskitme veya başka bir bitişte olması beklenen görünümü etkiler. Ürünü kuru ve tamamlanmış yüzey haliyle görmeyi isteyin.",
            "Numune kabulünde hangi açıklıkların, ton geçişlerinin ve tamirlerin uygun bulunduğunu kayıt altına alın. Dolgu tercihinin proje ve bakım koşullarıyla uyumunu uygulayıcıyla görüşün; yalnızca pazarlama adına göre uygunluk kararı vermeyin."
          ]
        },
        {
          "heading": "Uygulama ve sevkiyat kontrolü",
          "paragraphs": [
            "Zemin, duvar, dış mekan ve ıslak alan aynı teknik gerekliliklere sahip değildir. Proje ekibinden kayma, don, suyla temas ve sabitleme gereksinimlerini öğrenin. Test raporunun seçilen malzemeyi temsil ettiğini teyit edin.",
            "Kasaların içeriği, parçaların yönü, ölçü toleransları ve teslimde kontrol yöntemi yazılı olmalıdır. Hasarlı veya beklenen görünüm dışında parçalar için kabul ve bildirim sürecini siparişten önce netleştirin."
          ]
        }
      ]
    },
    {
      "slug": "mermer-ebat-kalinlik",
      "title": "Mermer Ebat ve Kalınlık Rehberi: Sipariş Tablosu",
      "description": "Mermer siparişinde ebat, kalınlık, tolerans, kenar işçiliği ve net miktar nasıl tarif edilir?",
      "summary": "Mermer siparişinde ebat, kalınlık, tolerans, kenar işçiliği ve net miktar nasıl tarif edilir?",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "burdur-beige"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Tek ölçü herkes için doğru değildir",
          "paragraphs": [
            "Taşın uygun kalınlığı yalnızca malzemenin ticari adına bakılarak seçilmez. Parçanın eni ve boyu, açıklığı, altlık ve sabitleme sistemi, yükler ve kullanım yeri birlikte değerlendirilir. Proje ekibinin uygun gördüğü ölçüyü tedarikçiye yazılı verin.",
            "Örneğin 60 × 60 cm ve 20 mm gibi bir tanım, sipariş kaleminin nasıl yazılacağını gösterir. Bu değerler standart stok veya her zemin için uygun tasarım anlamına gelmez. Plaka ve ebatlı ürünün net kullanılabilir ölçülerini ayrı sorun."
          ]
        },
        {
          "heading": "Kalınlık ve toleransı karıştırmayın",
          "paragraphs": [
            "Hedef kalınlık, ölçüm yöntemi ve kabul edilen tolerans ayrı konulardır. Teklif satırında yalnızca 2 cm yazılması, bütün parçaların hangi sapmayla kabul edileceğini açıklamaz. Kenar, pah, arka yüz ve yüzey işlemlerinin kapsamını da yazdırın.",
            "Basamak, süpürgelik, köşe dönüşü ve uzun dar parçalar için ayrı çizim gerekebilir. Çizimin sürümünü ve hangi parçaların birlikte kullanılacağını belirtin. Kesim tamamlandıktan sonra yapılacak değişikliklerin maliyet ve termin etkisini önceden sorun."
          ]
        },
        {
          "heading": "Miktar ve kasa kontrol listesi",
          "paragraphs": [
            "Dikdörtgen parçanın alanı metre cinsinden en × boy ile bulunur. Adetleri ekleyip net alanı hesaplayın; kesim kaybı ve yedek miktarı için uygulayıcıdan plan alın. Her projeye uygulanacak sabit fire yüzdesi vermek doğru değildir.",
            "Parça numarası, ölçü, adet ve kasa numarasını aynı listede tutun. Teslimde bu liste üzerinden kontrol yapın; sipariş miktarıyla plakanın brüt alanını aynı değer gibi karşılaştırmayın."
          ]
        }
      ]
    },
    {
      "slug": "mermer-bakim-temizlik",
      "title": "Mermer Bakımı ve Temizlik: Numuneden Kullanıma",
      "description": "Mermer yüzeyi için bakım planı hazırlayın; teslimde yüzey kontrolü ve uygun ürün seçimini öğrenin.",
      "summary": "Mermer yüzeyi için bakım planı hazırlayın; teslimde yüzey kontrolü ve uygun ürün seçimini öğrenin.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "marmara-white"
      ],
      "sources": [
        {
          "title": "Natural Stone Institute · Stone care",
          "url": "https://www.naturalstoneinstitute.org/consumers/care/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Bakım beklentisini satın almadan konuşun",
          "paragraphs": [
            "Cilalı ve honlu numuneyi, kullanılacak mekandaki aydınlatmada inceleyin. Günlük kullanımın türünü, temizliği kimin yapacağını ve bakım ürünlerini tedarikçiyle paylaşın. Görünüşün zaman içindeki değişimi hakkında uygulayıcıdan yazılı öneri alın.",
            "Numune seçimini yalnız ilk günkü parlaklığa göre yapmayın. Kenarların, derzlerin ve farklı yüzeylerin bakım gereksinimi değişebilir. Uygulama sonrası ilk temizlik ve koruyucu ürün kullanımını uygulama ekibiyle planlayın."
          ]
        },
        {
          "heading": "Uygun temizleyiciyi seçin",
          "paragraphs": [
            "Natural Stone Institute, asit içeren ürünlerin kireç esaslı taşları matlaştırabildiğini belirtir. Taşa uygun ürünün talimatını izleyin ve önce küçük, görünmeyen bir alanda deneyin.",
            "Bir ürünün bütün mermerlere, dolgulara veya yüzey işlemlerine uygun olduğunu varsaymayın. Temizleyici, koruyucu ve dolgu ürününün uyumluluğunu üreticilerinden teyit edin. Temizlik kimyasallarını gelişigüzel karıştırmayın."
          ]
        },
        {
          "heading": "Teslim ve kullanım kayıtlarını saklayın",
          "paragraphs": [
            "Teslimden önce numune ve parti fotoğraflarıyla yüzey durumunu karşılaştırın. Var olan tamirleri, lekeleri, mat alanları veya kenar kusurlarını kayıt altına alın. Sorunu aşındırıcı işlemle gidermeye çalışmadan önce tedarikçi ve uygulayıcıyla görüşün.",
            "Kullanılan ürünün adı, uygulama tarihi ve bakım talimatını saklamak sonraki bakım kararını kolaylaştırır. Yüzey görünümünde kalıcı değişiklik olduğunda uzman incelemesi isteyin; her lekenin aynı yöntemle çıkarılacağını varsaymayın."
          ]
        }
      ]
    },
    {
      "slug": "dogal-tas-test-raporlari",
      "title": "Doğal Taş Test Raporu Nasıl Okunur?",
      "description": "Yoğunluk, su emme ve eğilme raporlarında numune, yöntem ve proje şartnamesini birlikte kontrol edin.",
      "summary": "Yoğunluk, su emme ve eğilme raporlarında numune, yöntem ve proje şartnamesini birlikte kontrol edin.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "denizli-travertine"
      ],
      "sources": [
        {
          "title": "BSI · EN 13755",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-water-absorption-at-atmospheric-pressure"
        },
        {
          "title": "BSI · EN 12372",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-flexural-strength-under-concentrated-load-2"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Ticari ad ile numune kimliğini eşleştirin",
          "paragraphs": [
            "Bir raporda taşın ticari adının yazması tek başına yeterli değildir. Numunenin kaynağı, alınma tarihi, tanımı ve hangi üretim partisini temsil ettiği açıklanmalıdır. Siparişe ayrılan malzemenin başka bir ocağa veya partiye ait olması halinde eski raporun temsil gücünü sorgulayın.",
            "Raporun düzenleyicisini ve rapor numarasını doğrulayın. İhtiyaç varsa laboratuvarın ilgili deneydeki yetkinliğini ve kapsamını kontrol edin. Belgenin tamamını görün; tek bir sonuç ekran görüntüsünü bütün performansın kanıtı gibi değerlendirmeyin."
          ]
        },
        {
          "heading": "Yöntem ve uygulama koşulları",
          "paragraphs": [
            "EN 1936 yoğunluk ve gözeneklilik, EN 13755 atmosfer basıncında su emme, EN 12372 ise eğilme dayanımı için başvurulabilen deney yöntemleridir. Hangi yöntem ve sürümün gerektiğini projenin teknik şartnamesinden öğrenin.",
            "Numune boyutu, yüzey, yön ve deney koşulları sonuçların yorumunu etkileyebilir. Farklı yöntemlerle elde edilen iki sayıyı otomatik olarak eşdeğer kabul etmeyin. Bir deney sonucu her uygulama için uygunluk sertifikası anlamına gelmez."
          ]
        },
        {
          "heading": "Sonucu proje ekibi değerlendirsin",
          "paragraphs": [
            "Rapordaki birim, numune sayısı ve sonuçların nasıl özetlendiğini inceleyin. Projenin aradığı sınır değer ve performans sınıfıyla karşılaştırmayı teknik sorumluya yaptırın; internetten bulunan genel bir sayı üzerinden kabul kararı vermeyin.",
            "Teklif dosyasında numune onayı, rapor ve sipariş tanımı birbirini tamamlamalıdır. Tedarikçiden raporun sipariş edilen malzemeyle ilişkisini yazılı olarak açıklamasını isteyin."
          ]
        }
      ]
    },
    {
      "slug": "mermer-lojistik-paketleme",
      "title": "Mermer Lojistiği: Kasa, Yükleme ve Teslim Kontrolü",
      "description": "Mermer plaka ve ebatlı taşta paketleme listesi, yükleme bilgisi ve teslim kontrolünü planlayın.",
      "summary": "Mermer plaka ve ebatlı taşta paketleme listesi, yükleme bilgisi ve teslim kontrolünü planlayın.",
      "readingTime": "",
      "relatedStones": [
        "marmara-white",
        "burdur-beige"
      ],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Taşıma planını ürünle birlikte hazırlayın",
          "paragraphs": [
            "Blok, plaka ve ebatlı ürün aynı paketleme ve elleçleme planına sahip değildir. Ürünün net/brüt ağırlığı, kasa ölçüsü, parça adedi ve yükleme ekipmanı bilgilerini tedarikçiden alın. Araç ve kaldırma ekipmanının uygunluğu yetkili operasyon ekibi tarafından belirlenmelidir.",
            "Siparişi yalnız toplam metrekareyle taşıyıcıya bildirmeyin. Teslim yerinin erişimi, boşaltma ekipmanı, randevu ve saha koşulları taşıma planının parçasıdır. Yükleme ve boşaltma sorumluluğunu yazılı netleştirin."
          ]
        },
        {
          "heading": "Kasa ve parça listesini eşleştirin",
          "paragraphs": [
            "Her kasanın numarası, içindeki parçalar, ölçüler ve miktarlar aynı listede yer almalıdır. Taşın yönü veya damar eşlemesi önemliyse parça işaretleri yerleşim çizimiyle uyumlu olmalıdır. Ambalajın hangi ürünü koruduğu teslimde anlaşılabilir olmalıdır.",
            "Yükleme öncesi kasa ve parça fotoğrafları isteyin; ambalaj içeriğini, görünen hasarları ve sevk belgelerini kayıt altına alın. Fotoğraflar teknik yük emniyeti planının yerine geçmez. Sabitleme ve kaldırma işlerini uzman operasyon ekibi yürütmelidir."
          ]
        },
        {
          "heading": "Teslim kapsamını fiyatla birlikte karşılaştırın",
          "paragraphs": [
            "Taşıma, ambalaj, sigorta ve boşaltmanın fiyata dahil olup olmadığını sorun. Teslim terimi kullanılıyorsa belirtilen yer ve sürümle birlikte yazılmalı; masraf ve risk paylaşımı taraflarca anlaşılmalıdır.",
            "Teslimde kasa sayısını, ambalaj durumunu ve parça listesini kontrol edin. Hasar tespiti ve bildirim sürecini taşıyıcı, sigortacı ve satıcıyla siparişten önce belirleyin. Fotoğraf ve teslim belgelerini saklayın."
          ]
        }
      ]
    },
    {
      "slug": "mermer-ihracat-teklif-kontrolu",
      "title": "Mermer İhracat Teklifi: Belge ve Teslim Kontrol Listesi",
      "description": "İhracat teklifinde ürün tanımı, teslim yeri, ödeme ve belge kapsamını nasıl netleştireceğinizi öğrenin.",
      "summary": "İhracat teklifinde ürün tanımı, teslim yeri, ödeme ve belge kapsamını nasıl netleştireceğinizi öğrenin.",
      "readingTime": "",
      "relatedStones": [],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Ürünü ve tarafları açık tanımlayın",
          "paragraphs": [
            "İhracat görüşmesinin ilk aşamasında alıcı ve satıcının ticari unvanı ile ürünün formatı, işlenme seviyesi, ölçüsü, yüzeyi ve miktarı net olmalıdır. Teklifin hangi üretim partisine veya numuneye dayandığını kaydedin.",
            "Gümrük sınıflandırmasını yalnızca ticari taş adına göre yapmayın. Ham veya işlenmiş olma durumu ve ürünün ayrıntıları sınıflandırmayı etkileyebilir. Geçerli GTİP, vergi, kısıtlama ve belge yükümlülüklerini işlem ülkeleri ve tarihine göre gümrük müşaviriyle teyit edin. Bu rehber bir tarife veya vergi kararı vermez."
          ]
        },
        {
          "heading": "Teslim terimini tek başına yeterli saymayın",
          "paragraphs": [
            "ICC Incoterms® kuralları masraf, risk ve belirli teslim sorumluluklarını açıklamak için kullanılır. Kullanılan terimi, sürümünü ve adlandırılan yeri açık yazın; taşıma ve sigorta teklifinin bu kapsamla uyumunu kontrol edin.",
            "Ödeme yöntemi, kalite kabulü, uyuşmazlık çözümü ve sözleşmenin diğer koşulları ayrıca düzenlenmelidir. Bir teslim terimi bütün satış sözleşmesinin yerine geçmez. İki teklif farklı teslim kapsamına sahipse birim fiyatları doğrudan sıralamayın."
          ]
        },
        {
          "heading": "Belge ve kabul planını önceden oluşturun",
          "paragraphs": [
            "Taraflar gerekli fatura, paketleme listesi, taşıma ve kaynak belgelerinin hangilerini kimin hazırlayacağını belirlemelidir. İşleme özgü gereklilikleri yetkili müşavir ve lojistik ekibiyle doğrulayın; her sevkiyat için aynı belge listesini varsaymayın.",
            "Numune, teknik rapor, sevk öncesi kontrol ve teslimde hasar bildirim adımlarını yazılı hale getirin. Belge numaralarının ürün, parti ve kasa listesiyle ilişkisini koruyun. Nihai ticari ve hukuki koşullar ilgili tarafların uzmanları tarafından değerlendirilmelidir."
          ]
        }
      ]
    }
  ],
  "en": [
    {
      "slug": "traverten-secim-rehberi",
      "title": "Choosing Travertine: Cut, Filling and Finish",
      "description": "Compare cut direction, filling, finish and the actual production lot before ordering travertine.",
      "summary": "Compare cut direction, filling, finish and the actual production lot before ordering travertine.",
      "readingTime": "",
      "relatedStones": [
        "denizli-travertine"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Specify the intended appearance",
          "paragraphs": [
            "Compare full slabs as well as small samples. Agree the cut direction, colour range and accepted pore pattern with the supplier. A trade name alone does not define a consistent batch."
          ]
        },
        {
          "heading": "Compare equivalent finishing work",
          "paragraphs": [
            "Filled and unfilled material are different specifications. Record filling preference, finish, tolerances and the appearance of dry, completed surfaces in the quotation. Approve a sample that represents the offered lot."
          ]
        },
        {
          "heading": "Verify the application and packing",
          "paragraphs": [
            "Obtain project requirements for floors, walls, exterior use or wet areas. Check relevant test reports and fixing requirements with your project team. Agree numbered pieces, crate contents, delivery inspection and the process for reporting damage."
          ]
        }
      ]
    },
    {
      "slug": "mermer-ebat-kalinlik",
      "title": "Marble Sizes and Thickness: An Order Specification Guide",
      "description": "Define dimensions, thickness, tolerances, edges and net quantity in a comparable stone order.",
      "summary": "Define dimensions, thickness, tolerances, edges and net quantity in a comparable stone order.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "burdur-beige"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Start with the application",
          "paragraphs": [
            "Thickness depends on piece dimensions, support, fixing and project loads. Example specifications such as 60 × 60 cm and 20 mm illustrate how to describe an item, not universal stock or design recommendations."
          ]
        },
        {
          "heading": "Record tolerances separately",
          "paragraphs": [
            "Agree target thickness, acceptable deviation, measurement method, finish and edge work. Give steps, skirting and corners separate drawing references where necessary. Confirm changes before cutting starts."
          ]
        },
        {
          "heading": "Calculate and identify each piece",
          "paragraphs": [
            "Calculate rectangular area using length × width in metres, then multiply by quantity. Agree cutting waste and spare material from the actual plan. Link piece numbers, dimensions, quantities and crate references in the packing list."
          ]
        }
      ]
    },
    {
      "slug": "mermer-bakim-temizlik",
      "title": "Marble Care: Planning Cleaning Before Installation",
      "description": "Plan surface care, suitable products and handover checks before using marble.",
      "summary": "Plan surface care, suitable products and handover checks before using marble.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "marmara-white"
      ],
      "sources": [
        {
          "title": "Natural Stone Institute · Stone care",
          "url": "https://www.naturalstoneinstitute.org/consumers/care/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Discuss maintenance before ordering",
          "paragraphs": [
            "Inspect polished and honed samples in the intended lighting. Tell the supplier how the surface will be used and cleaned. Agree initial cleaning, joints, edges and maintenance responsibilities with the installer."
          ]
        },
        {
          "heading": "Use a material-specific product",
          "paragraphs": [
            "Follow the stone and cleaning-product manufacturers’ instructions. Test a suitable product on a small, inconspicuous area and confirm compatibility with fillers and finishes. Do not mix cleaning chemicals."
          ]
        },
        {
          "heading": "Keep a handover record",
          "paragraphs": [
            "Compare the delivered surface with the approved sample and batch images. Record repairs and visible defects before use. Keep product names, application dates and maintenance instructions; seek specialist advice before abrasive treatment."
          ]
        }
      ]
    },
    {
      "slug": "dogal-tas-test-raporlari",
      "title": "How to Read a Natural Stone Test Report",
      "description": "Match specimen identity, test method and project requirements before comparing laboratory results.",
      "summary": "Match specimen identity, test method and project requirements before comparing laboratory results.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "denizli-travertine"
      ],
      "sources": [
        {
          "title": "BSI · EN 13755",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-water-absorption-at-atmospheric-pressure"
        },
        {
          "title": "BSI · EN 12372",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-flexural-strength-under-concentrated-load-2"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Identify the specimen",
          "paragraphs": [
            "Check source, date, specimen description and the lot represented by the report. Verify the issuing laboratory and report number, and obtain the complete document rather than a cropped result."
          ]
        },
        {
          "heading": "Check the method and conditions",
          "paragraphs": [
            "Density, water absorption and flexural strength are different properties. Confirm the required test method, edition, units, orientation and specimen conditions with your project specification. Results from different methods are not automatically interchangeable."
          ]
        },
        {
          "heading": "Have the project specialist assess suitability",
          "paragraphs": [
            "Ask the technical lead to compare results with the application requirements. A trade name or one test value does not establish suitability for every project. Keep the report, approved sample and order specification together."
          ]
        }
      ]
    },
    {
      "slug": "mermer-lojistik-paketleme",
      "title": "Marble Logistics: Packing, Loading and Delivery Checks",
      "description": "Plan crate identification, loading information and delivery inspection for stone orders.",
      "summary": "Plan crate identification, loading information and delivery inspection for stone orders.",
      "readingTime": "",
      "relatedStones": [
        "marmara-white",
        "burdur-beige"
      ],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Plan handling with the product",
          "paragraphs": [
            "Blocks, slabs and cut-to-size pieces need different handling plans. Obtain net and gross weight, crate dimensions, piece quantities and equipment requirements. Have qualified operators plan lifting, access and unloading."
          ]
        },
        {
          "heading": "Match crates and piece lists",
          "paragraphs": [
            "Use consistent crate and piece numbers, dimensions and quantities. If vein direction matters, match labels with the layout. Record pre-loading photographs and visible packaging condition."
          ]
        },
        {
          "heading": "Agree delivery scope",
          "paragraphs": [
            "Confirm transport, packing, insurance and unloading responsibilities before comparing prices. Record the named delivery place and applicable term. Agree damage reporting and keep delivery documents and photographs."
          ]
        }
      ]
    },
    {
      "slug": "mermer-ihracat-teklif-kontrolu",
      "title": "Marble Export Quotations: Documents and Delivery Checklist",
      "description": "Clarify material description, delivery scope, payment and documentation before comparing export offers.",
      "summary": "Clarify material description, delivery scope, payment and documentation before comparing export offers.",
      "readingTime": "",
      "relatedStones": [],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "Identify the goods and parties",
          "paragraphs": [
            "Record legal trading names, product format, processing, finish, dimensions, lot and quantity. Ask a customs broker to confirm current classification and transaction-specific requirements; a trade name alone is insufficient."
          ]
        },
        {
          "heading": "Specify the delivery scope",
          "paragraphs": [
            "State the selected delivery term, edition and named place. Confirm how transport and insurance fit that scope. Payment, quality acceptance and other contract conditions must be agreed separately."
          ]
        },
        {
          "heading": "Plan documents and acceptance",
          "paragraphs": [
            "Agree who prepares the invoice, packing and transport documentation and any transaction-specific certificates. Link lot and crate identifiers with inspection records. Obtain appropriate customs and contractual advice for the countries involved."
          ]
        }
      ]
    }
  ],
  "zh": [
    {
      "slug": "traverten-secim-rehberi",
      "title": "如何选择洞石：切割、填孔与表面",
      "description": "采购洞石时同时比较切割方向、填孔、表面及实际生产批次。",
      "summary": "采购洞石时同时比较切割方向、填孔、表面及实际生产批次。",
      "readingTime": "",
      "relatedStones": [
        "denizli-travertine"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "确认完整板面",
          "paragraphs": [
            "小样无法完整代表纹理和孔隙分布。请索取整板照片，确认切割方向、可接受色差及批次编号。"
          ]
        },
        {
          "heading": "明确填孔和表面要求",
          "paragraphs": [
            "填孔与不填孔应分别报价。确认填料外观、完成后的干燥表面、公差及样品，避免仅按商业名称采购。"
          ]
        },
        {
          "heading": "核对应用和装箱",
          "paragraphs": [
            "地面、墙面、室外和湿区的要求不同。请与项目人员核实检测及固定方式，并确认部件编号、装箱单及到货验收。"
          ]
        }
      ]
    },
    {
      "slug": "mermer-ebat-kalinlik",
      "title": "大理石尺寸与厚度：订单规格指南",
      "description": "明确尺寸、厚度、公差、边缘加工和净数量。",
      "summary": "明确尺寸、厚度、公差、边缘加工和净数量。",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "burdur-beige"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "从应用条件出发",
          "paragraphs": [
            "厚度须结合部件尺寸、支撑、固定方式和项目荷载确定。60×60厘米、20毫米仅是规格写法示例，并非通用设计建议或库存。"
          ]
        },
        {
          "heading": "分别约定目标值与公差",
          "paragraphs": [
            "写明目标厚度、允许偏差、测量方法、表面及边缘加工。台阶、踢脚线和转角应对应图纸编号。"
          ]
        },
        {
          "heading": "计算面积并标识部件",
          "paragraphs": [
            "长宽以米相乘后再乘数量。损耗和备料按实际排版商定，并关联部件编号、尺寸、数量和箱号。"
          ]
        }
      ]
    },
    {
      "slug": "mermer-bakim-temizlik",
      "title": "大理石养护：安装前规划清洁",
      "description": "采购时明确表面养护、适用产品和交付检查。",
      "summary": "采购时明确表面养护、适用产品和交付检查。",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "marmara-white"
      ],
      "sources": [
        {
          "title": "Natural Stone Institute · Stone care",
          "url": "https://www.naturalstoneinstitute.org/consumers/care/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "采购前讨论养护",
          "paragraphs": [
            "在实际照明下比较抛光与哑光样品，并告知供应商使用和清洁方式。与安装方约定初次清洁、接缝及边缘养护。"
          ]
        },
        {
          "heading": "遵循材料专用说明",
          "paragraphs": [
            "确认清洁产品与填料及表面兼容，先在小而隐蔽的位置测试。不要混合清洁化学品。"
          ]
        },
        {
          "heading": "保留交付记录",
          "paragraphs": [
            "将到货表面与批准样品及批次照片对照，记录修补和缺陷，并保存产品名称、使用日期和养护说明。"
          ]
        }
      ]
    },
    {
      "slug": "dogal-tas-test-raporlari",
      "title": "如何阅读天然石材检测报告",
      "description": "比较结果前核对试样、方法及项目要求。",
      "summary": "比较结果前核对试样、方法及项目要求。",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "denizli-travertine"
      ],
      "sources": [
        {
          "title": "BSI · EN 13755",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-water-absorption-at-atmospheric-pressure"
        },
        {
          "title": "BSI · EN 12372",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-flexural-strength-under-concentrated-load-2"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "确认试样身份",
          "paragraphs": [
            "核对来源、日期、描述及代表批次，验证实验室和报告编号，并索取完整文件。"
          ]
        },
        {
          "heading": "核对方法与条件",
          "paragraphs": [
            "密度、吸水率和抗弯强度是不同性能。按项目要求确认方法版本、单位、方向及试样条件，不可直接等同不同方法的结果。"
          ]
        },
        {
          "heading": "由项目专业人员判断",
          "paragraphs": [
            "由技术负责人按应用要求评估结果。商业名称或单个数值不能证明所有用途的适用性，应同时保存报告、样品及订单规格。"
          ]
        }
      ]
    },
    {
      "slug": "mermer-lojistik-paketleme",
      "title": "石材物流：装箱、装载与交付检查",
      "description": "规划箱号、装载资料及石材到货验收。",
      "summary": "规划箱号、装载资料及石材到货验收。",
      "readingTime": "",
      "relatedStones": [
        "marmara-white",
        "burdur-beige"
      ],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "根据产品制定搬运计划",
          "paragraphs": [
            "荒料、板材及定尺件的搬运方式不同。索取净重、毛重、箱尺寸及件数，由合格人员确认吊装、场地及卸货方案。"
          ]
        },
        {
          "heading": "关联箱号与部件清单",
          "paragraphs": [
            "统一箱号、部件编号、尺寸和数量。纹理方向应与排版图对应，并保存装载前照片和包装状态。"
          ]
        },
        {
          "heading": "约定交付范围",
          "paragraphs": [
            "比较报价前确认运输、包装、保险和卸货责任，写明交付地点及条款，并商定损坏申报和文件保存。"
          ]
        }
      ]
    },
    {
      "slug": "mermer-ihracat-teklif-kontrolu",
      "title": "大理石出口报价：文件及交付核对清单",
      "description": "比较出口报价前明确产品、交付、付款及文件范围。",
      "summary": "比较出口报价前明确产品、交付、付款及文件范围。",
      "readingTime": "",
      "relatedStones": [],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "明确货物与交易主体",
          "paragraphs": [
            "记录企业法定名称、产品形式、加工、表面、尺寸、批次及数量。由报关专业人员确认当前分类和交易要求，不可仅依商业名称判断。"
          ]
        },
        {
          "heading": "明确交付范围",
          "paragraphs": [
            "写明交付条款、版本及指定地点，核对运输和保险范围。付款、质量验收和其他合同条件须另行商定。"
          ]
        },
        {
          "heading": "规划文件与验收",
          "paragraphs": [
            "约定发票、装箱单、运输文件及特定证书的责任方，并关联批次、箱号及检验记录。按涉及国家取得专业意见。"
          ]
        }
      ]
    }
  ],
  "ar": [
    {
      "slug": "traverten-secim-rehberi",
      "title": "اختيار الترافرتين: القطع والتعبئة والتشطيب",
      "description": "قارن اتجاه القطع والتعبئة والتشطيب ودفعة الإنتاج الحقيقية قبل الطلب.",
      "summary": "قارن اتجاه القطع والتعبئة والتشطيب ودفعة الإنتاج الحقيقية قبل الطلب.",
      "readingTime": "",
      "relatedStones": [
        "denizli-travertine"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "حدد المظهر المطلوب",
          "paragraphs": [
            "افحص صور الألواح كاملة إلى جانب العينات، واتفق على اتجاه القطع ونطاق اللون والمسام المقبول. الاسم التجاري وحده لا يحدد الدفعة."
          ]
        },
        {
          "heading": "قارن مواصفات متكافئة",
          "paragraphs": [
            "افصل عروض الحجر المملوء عن غير المملوء. أكد التشطيب والتفاوتات ومظهر السطح الجاف والعينة المعتمدة."
          ]
        },
        {
          "heading": "راجع الاستخدام والتعبئة",
          "paragraphs": [
            "تختلف متطلبات الأرضيات والجدران والخارج والمناطق الرطبة. راجع التقارير ونظام التثبيت وقائمة الصناديق وفحص التسليم مع المختصين."
          ]
        }
      ]
    },
    {
      "slug": "mermer-ebat-kalinlik",
      "title": "أبعاد الرخام وسماكته: دليل مواصفات الطلب",
      "description": "حدد الأبعاد والسماكة والتفاوتات والحواف والكمية الصافية.",
      "summary": "حدد الأبعاد والسماكة والتفاوتات والحواف والكمية الصافية.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "burdur-beige"
      ],
      "sources": [],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "ابدأ بظروف الاستخدام",
          "paragraphs": [
            "تتحدد السماكة وفق أبعاد القطعة والدعم والتثبيت والأحمال. قياس 60 × 60 سم وسماكة 20 مم مثال لوصف البند وليس توصية عامة أو مخزوناً."
          ]
        },
        {
          "heading": "افصل السماكة عن التفاوت",
          "paragraphs": [
            "حدد السماكة المستهدفة والانحراف المقبول وطريقة القياس والتشطيب والحواف. اربط الدرج والزوايا والوزرات برسوم محددة."
          ]
        },
        {
          "heading": "احسب المساحة ورقّم القطع",
          "paragraphs": [
            "اضرب الطول بالعرض بالمتر ثم بعدد القطع. اتفق على الهدر والاحتياطي وفق مخطط القطع واربط رقم القطعة بأبعادها وصندوقها."
          ]
        }
      ]
    },
    {
      "slug": "mermer-bakim-temizlik",
      "title": "العناية بالرخام: التخطيط للتنظيف قبل التركيب",
      "description": "اتفق على العناية بالسطح والمنتجات المناسبة وفحص التسليم.",
      "summary": "اتفق على العناية بالسطح والمنتجات المناسبة وفحص التسليم.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "marmara-white"
      ],
      "sources": [
        {
          "title": "Natural Stone Institute · Stone care",
          "url": "https://www.naturalstoneinstitute.org/consumers/care/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "ناقش الصيانة قبل الطلب",
          "paragraphs": [
            "قارن العينات المصقولة والمطفية في الإضاءة المقصودة، واشرح الاستخدام والتنظيف. اتفق مع المركّب على التنظيف الأول والحواف والفواصل."
          ]
        },
        {
          "heading": "اتبع تعليمات المادة والمنتج",
          "paragraphs": [
            "أكد توافق المنظف مع الحشو والتشطيب وجربه على مساحة صغيرة مخفية. لا تخلط مواد التنظيف."
          ]
        },
        {
          "heading": "احتفظ بسجل التسليم",
          "paragraphs": [
            "طابق السطح مع العينة وصور الدفعة وسجّل الإصلاحات والعيوب. احتفظ بأسماء المنتجات وتواريخ استخدامها وتعليمات الصيانة."
          ]
        }
      ]
    },
    {
      "slug": "dogal-tas-test-raporlari",
      "title": "كيف تقرأ تقرير اختبار الحجر الطبيعي؟",
      "description": "طابق هوية العينة والطريقة ومتطلبات المشروع قبل مقارنة النتائج.",
      "summary": "طابق هوية العينة والطريقة ومتطلبات المشروع قبل مقارنة النتائج.",
      "readingTime": "",
      "relatedStones": [
        "afyon-white",
        "denizli-travertine"
      ],
      "sources": [
        {
          "title": "BSI · EN 13755",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-water-absorption-at-atmospheric-pressure"
        },
        {
          "title": "BSI · EN 12372",
          "url": "https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-flexural-strength-under-concentrated-load-2"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "حدد هوية العينة",
          "paragraphs": [
            "راجع المصدر والتاريخ والوصف والدفعة التي يمثلها التقرير. تحقق من المختبر ورقم التقرير واطلب الوثيقة كاملة."
          ]
        },
        {
          "heading": "راجع الطريقة والظروف",
          "paragraphs": [
            "الكثافة وامتصاص الماء والانحناء خصائص مختلفة. أكد الإصدار والوحدات واتجاه العينة وظروفها وفق المشروع، ولا تساوِ تلقائياً بين طرق مختلفة."
          ]
        },
        {
          "heading": "اطلب تقييم المختص",
          "paragraphs": [
            "يقارن المسؤول الفني النتائج بمتطلبات الاستخدام. الاسم التجاري أو قيمة واحدة لا يثبتان كل التطبيقات؛ احتفظ بالتقرير والعينة ومواصفات الطلب معاً."
          ]
        }
      ]
    },
    {
      "slug": "mermer-lojistik-paketleme",
      "title": "لوجستيات الرخام: التعبئة والتحميل والتسليم",
      "description": "خطط لأرقام الصناديق وبيانات التحميل وفحص التسليم.",
      "summary": "خطط لأرقام الصناديق وبيانات التحميل وفحص التسليم.",
      "readingTime": "",
      "relatedStones": [
        "marmara-white",
        "burdur-beige"
      ],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "خطط للمناولة وفق المنتج",
          "paragraphs": [
            "تختلف الكتل عن الألواح والقطع الجاهزة. اطلب الوزن الصافي والإجمالي وأبعاد الصناديق وعدد القطع، وليخطط مختصون للرفع والوصول والتفريغ."
          ]
        },
        {
          "heading": "طابق القوائم والعلامات",
          "paragraphs": [
            "وحّد أرقام الصناديق والقطع وأبعادها وكمياتها. طابق اتجاه العروق مع المخطط واحتفظ بصور ما قبل التحميل وحالة التغليف."
          ]
        },
        {
          "heading": "حدد نطاق التسليم",
          "paragraphs": [
            "أكد مسؤوليات النقل والتعبئة والتأمين والتفريغ والمكان المسمى قبل مقارنة الأسعار. اتفق على الإبلاغ عن الضرر وحفظ المستندات."
          ]
        }
      ]
    },
    {
      "slug": "mermer-ihracat-teklif-kontrolu",
      "title": "عروض تصدير الرخام: قائمة الوثائق والتسليم",
      "description": "حدد وصف المادة والتسليم والدفع والوثائق قبل مقارنة عروض التصدير.",
      "summary": "حدد وصف المادة والتسليم والدفع والوثائق قبل مقارنة عروض التصدير.",
      "readingTime": "",
      "relatedStones": [],
      "sources": [
        {
          "title": "ICC · Incoterms® rules",
          "url": "https://iccwbo.org/business-solutions/incoterms-rules/"
        }
      ],
      "updatedAt": "2026-10-24",
      "author": "Marble Borsa",
      "sections": [
        {
          "heading": "عرّف البضاعة والأطراف",
          "paragraphs": [
            "سجّل الأسماء التجارية القانونية والشكل والتجهيز والتشطيب والأبعاد والدفعة والكمية. أكد التصنيف والمتطلبات الحالية مع مخلص مختص ولا تعتمد على الاسم التجاري وحده."
          ]
        },
        {
          "heading": "حدد نطاق التسليم",
          "paragraphs": [
            "اكتب مصطلح التسليم وإصداره والمكان المسمى وطابق النقل والتأمين معه. اتفق على الدفع وقبول الجودة وبقية شروط العقد بشكل منفصل."
          ]
        },
        {
          "heading": "خطط للوثائق والقبول",
          "paragraphs": [
            "حدد مسؤول إعداد الفاتورة وقائمة التعبئة ووثائق النقل والشهادات الخاصة بالعملية. اربط الدفعات والصناديق بسجلات الفحص واطلب المشورة المناسبة للدول المعنية."
          ]
        }
      ]
    }
  ]
};
trGuides.push(...additionalGuides.tr);

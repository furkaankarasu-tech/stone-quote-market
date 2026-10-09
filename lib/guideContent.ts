/** Editorial content. Keep claims verifiable: example textures are not live supplier stock. */
export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};
export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  readingTime: string;
  sections: GuideSection[];
  relatedStones: string[];
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

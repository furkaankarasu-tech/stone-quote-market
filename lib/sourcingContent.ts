/** Transaction-neutral B2B sourcing content. Marble Borsa is a directory/RFQ platform, not a stone seller or broker. */
import type { GuideLocale } from './guideRoutes';

export type SourcingTopic = 'quote' | 'b2b';
export const sourcingTopics: SourcingTopic[] = ['quote', 'b2b'];
export const sourcingLocales: GuideLocale[] = ['tr', 'en', 'zh', 'ar'];

const slugs: Record<SourcingTopic, Record<GuideLocale, string>> = {
  quote: { tr: 'mermer-teklifi-al', en: 'request-marble-quotes', zh: 'request-marble-quotes', ar: 'request-marble-quotes' },
  b2b: { tr: 'b2b-mermer', en: 'b2b-marble', zh: 'b2b-marble', ar: 'b2b-marble' },
};
export const sourcingPath = (topic: SourcingTopic, locale: GuideLocale) => `/${locale}/${slugs[topic][locale]}`;
export function sourcingRoute(locale: string, slug: string): SourcingTopic | undefined {
  if (!sourcingLocales.some(code => code === locale)) return undefined;
  return sourcingTopics.find(topic => slugs[topic][locale as GuideLocale] === slug);
}
export function sourcingAlternates(topic: SourcingTopic): Record<string, string> {
  return { 'tr-TR': sourcingPath(topic, 'tr'), 'en-US': sourcingPath(topic, 'en'), 'zh-CN': sourcingPath(topic, 'zh'), 'ar': sourcingPath(topic, 'ar') };
}
export type SourcingCopy = {
  title: string; description: string; eyebrow: string; intro: string;
  firstCta: string; secondCta: string; sectionTitle: string;
  steps: { heading: string; body: string }[];
  details: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedLabel: string; relatedTitle: string; otherTopicLabel: string;
  homeLabel: string; guideLabel: string; notice: string;
};

const content: Record<GuideLocale, Record<SourcingTopic, SourcingCopy>> = {
  tr: {
    quote: {
      title: 'Mermer Teklifi Al: Blok ve Plaka Tedarik Talepleri',
      description: 'Mermer alımı için blok, plaka ve işlenmiş taş ihtiyaçlarınızı belirleyin; Marble Borsa üzerinden uygun üretici ve tedarikçilerden doğrudan teklif isteyin.',
      eyebrow: 'MERMER ALIMI / TEKLİF TALEBİ', intro: 'Mermer almak isteyen alıcılarla taş üreticilerinin doğrudan görüşebilmesi için teklif talebi sürecini keşfedin. Marble Borsa mermer satmaz, stok tutmaz ve taraflar adına ticaret yapmaz.',
      firstCta: 'Doğal taşları incele', secondCta: 'Teklif öncesi rehberi oku', sectionTitle: 'Mermer teklif talebi nasıl hazırlanır?',
      steps: [
        {heading: 'İhtiyacı netleştirin', body: 'Mermer türü, blok veya plaka formatı, kalınlık, ebat, yüzey işlemi, yaklaşık miktar ve teslim yerini belirtin.'},
        {heading: 'Teklif talebinizi oluşturun', body: 'Doğal taşları inceleyin ve hesabınızdan talebinizi açıklayın. Uygun firmalar kendi koşullarıyla yanıt verebilir.'},
        {heading: 'Teklifleri doğrudan değerlendirin', body: 'Birden fazla yanıt alırsanız fiyatın yanı sıra kalite, numune, paketleme, teslim süresi ve taşıma koşullarını karşılaştırın.'}
      ],
      details: [
        {heading: 'Mermer almak için hangi bilgiler gerekir?', paragraphs: ['Blok, plaka ve ebatlı ürünlerin teklif birimleri ve işleme ihtiyaçları farklıdır. Yalnızca “beyaz mermer istiyorum” demek, karşılaştırılabilir bir teklif almak için yeterli olmayabilir.'], bullets: ['Taşın ticari adı veya örnek görseli ve kullanım alanı', 'Blok, plaka ya da özel kesim; ölçü, kalınlık ve tolerans', 'Miktar, teslimat yeri, hedef tarih ve varsa teknik test beklentileri']},
        {heading: 'Teklifleri hangi koşullarda karşılaştırmalısınız?', paragraphs: ['Birim fiyatın hangi ölçü birimiyle verildiğini ve hangi işlemleri kapsadığını kontrol edin. Taşın gerçek parti fotoğrafları, numune onayı, paketleme ve teslim şartları toplam maliyeti etkiler.', 'Platformda talep oluşturmak bir satın alma sözleşmesi değildir. Sipariş, ödeme ve sevkiyat koşulları alıcı ile satıcı arasında belirlenir.']}
      ],
      faqs: [
        {question: 'Marble Borsa mermer satıyor mu?', answer: 'Hayır. Marble Borsa, alıcıların mermer ve doğal taş taleplerini üretici ve tedarikçilerle buluşturmasına yardımcı olan bir platformdur; satıcı ya da komisyoncu olarak işlem yapmaz.'},
        {question: 'Mermer teklifi için fiyat listesi var mı?', answer: 'Tek bir fiyat listesi doğru karşılaştırma sağlamaz. Fiyat; tür, parti, kalınlık, işleme, miktar ve teslim koşullarına göre ilgili firma tarafından belirlenir.'}
      ],
      relatedLabel: 'B2B ALIM SÜRECİ', relatedTitle: 'İşletmeler arası mermer tedariki nasıl işler?', otherTopicLabel: 'B2B mermer platformunu keşfet',
      homeLabel: 'Ana sayfa', guideLabel: 'Mermer alım rehberi', notice: 'Marble Borsa alıcı ve satıcıları buluşturur; ürün sahibi değildir, stok ve fiyat garantisi vermez.'
    },
    b2b: {
      title: 'B2B Mermer ve Doğal Taş Teklif Platformu',
      description: 'Mermer B2B tedarik süreçleri için alıcıları, üreticileri ve doğal taş firmalarını buluşturan Marble Borsa ile ticari teklif taleplerini keşfedin.',
      eyebrow: 'B2B / DOĞAL TAŞ TEDARİKİ', intro: 'Marble Borsa; mermer, traverten ve diğer doğal taşlarda kurumsal alıcıların taleplerini ilgili firmalarla buluşturmayı amaçlar. Ticaret, platformun aracılığı veya stok satışı olmadan doğrudan taraflar arasında gerçekleşir.',
      firstCta: 'Doğal taş dizinine git', secondCta: 'Alım rehberlerini incele', sectionTitle: 'B2B mermer tedarik süreci',
      steps: [
        {heading: 'Alıcı ihtiyacını tanımlar', body: 'Proje, toptan alım veya ihracat için taş türünü, işleme gereksinimlerini, miktarı ve hedef teslim noktasını paylaşır.'},
        {heading: 'İlgili firmalar yanıt verir', body: 'Uygun üretici veya tedarikçiler, kendi kapasitelerine ve ticari koşullarına göre teklif sunabilir.'},
        {heading: 'Taraflar doğrudan anlaşır', body: 'Numune, nihai sözleşme, ödeme, sigorta ve lojistik gibi işlemleri alıcı ve satıcı kendi aralarında sonuçlandırır.'}
      ],
      details: [
        {heading: 'Kimler için tasarlandı?', paragraphs: ['Platform; mimari proje alıcıları, doğal taş ithalatçıları, toptancılar, uygulama firmaları ve üreticiler arasında ticari bilgi akışını kolaylaştırmayı hedefler. Her talebin uygun bir yanıt alacağı garanti edilmez.'], bullets: ['Blok mermer ve traverten tedarik talepleri', 'Plaka ve ölçüye göre işlenmiş doğal taş alımları', 'Farklı şehir veya ülkelerden kurumsal teklif karşılaştırması']},
        {heading: 'B2B tekliflerde neler önemli?', paragraphs: ['Tekliflerin aynı teknik şartnameyi karşılaması karşılaştırmayı kolaylaştırır. Para birimi, fiyat birimi, teslim şekli, üretim kapasitesi ve parti bazlı kalite teyidi açıkça yazılmalıdır.', 'Marble Borsa bir e-ticaret satıcısı ya da komisyoncu değildir. Satış sözleşmesinin tarafı olmaz; alıcı ve tedarikçiler işlemleri doğrudan yürütür.']}
      ],
      faqs: [
        {question: 'B2B mermer platformunda kim satış yapar?', answer: 'Satış ve teklif koşullarını platforma katılan ilgili üretici veya tedarikçi firma belirler. Marble Borsa kendi adına mermer satmaz.'},
        {question: 'Yurt dışından alım talebi oluşturulabilir mi?', answer: 'Alıcılar teslim ülkesi ve gereksinimlerini belirterek talep hazırlayabilir. Uluslararası satış koşulları ve sevkiyat uygunluğu ilgili firmalarla görüşülmelidir.'}
      ],
      relatedLabel: 'ALICI REHBERİ', relatedTitle: 'Mermer teklifi almadan önce neleri hazırlamalısınız?', otherTopicLabel: 'Mermer teklifi alma sürecini öğren',
      homeLabel: 'Ana sayfa', guideLabel: 'Mermer alım rehberi', notice: 'Bu platform tarafları buluşturur; kendi adına mal satmaz, taşıma veya ödeme hizmeti sunmaz.'
    }
  },
  en: {
    quote: {
      title: 'Request Marble Quotes: Blocks and Slabs Sourcing',
      description: 'Need marble blocks or slabs? Learn how to prepare an RFQ and request quotes directly from suppliers through the Marble Borsa B2B platform.',
      eyebrow: 'MARBLE SOURCING / REQUEST FOR QUOTATION', intro: 'Explore a structured way to connect marble buyers with stone producers and suppliers. Marble Borsa does not own or sell stone, guarantee stock or act as a broker in the transaction.',
      firstCta: 'Explore natural stones', secondCta: 'Read the buyer guides', sectionTitle: 'How to prepare a marble RFQ',
      steps: [
        {heading: 'Specify what you need',body: 'Define the stone, block or slab format, thickness, dimensions, finish, estimated quantity and delivery destination.'},
        {heading: 'Submit a sourcing request',body: 'Browse natural stone categories and describe your requirement from your buyer account. Relevant companies may respond on their own terms.'},
        {heading: 'Compare direct supplier offers',body: 'Assess samples, actual lot photos, technical documents, packing, lead times and delivery terms as well as price.'}
      ],
      details: [
        {heading: 'What should a marble enquiry include?', paragraphs: ['A request for blocks is different from a request for polished slabs or finished pieces. Detailed specifications help companies provide comparable offers.'], bullets: ['Stone trade name or reference sample and intended use', 'Block, slab or cut-to-size dimensions, thickness and tolerance', 'Quantity, destination, expected delivery date and necessary test documentation']},
        {heading: 'How should you compare marble offers?', paragraphs: ['Check the currency, pricing unit, production lot, included processing and delivery scope. Packaging, freight and sample approval can materially change the total cost.', 'Submitting an RFQ is not a purchase contract. Orders, payment, transport and acceptance are agreed directly between the buyer and the supplier.']}
      ],
      faqs: [{question:'Does Marble Borsa sell marble?',answer:'No. Marble Borsa helps buyers reach independent natural stone producers and suppliers. It does not sell products or broker contracts.'},{question:'Are marble prices fixed on the platform?',answer:'No. Each supplier determines its own offer based on the stone, lot, processing, volume and delivery requirements.'}],
      relatedLabel: 'B2B SOURCING',relatedTitle:'How does a B2B marble marketplace work?',otherTopicLabel:'Explore the B2B marble platform',homeLabel:'Home',guideLabel:'Buyer guides',notice:'Marble Borsa connects independent buyers and sellers; it does not guarantee stock, quotations or transactions.'
    },
    b2b: {
      title:'B2B Marble and Natural Stone Sourcing Platform',description:'Explore B2B marble sourcing, wholesale natural stone RFQs and direct supplier quotations through the Marble Borsa platform.',
      eyebrow:'B2B / NATURAL STONE SOURCING',intro:'Marble Borsa is designed to connect professional marble and natural stone buyers with independent suppliers. It is not a stone merchant, payment intermediary or party to supply contracts.',firstCta:'Browse natural stones',secondCta:'See buyer guides',sectionTitle:'How B2B marble sourcing works',
      steps:[{heading:'Buyers describe requirements',body:'Specify material, grade or approved sample, dimensions, quantity and destination for a project or wholesale purchase.'},{heading:'Companies respond directly',body:'Relevant producers and suppliers may submit their own commercial quotations and lead times.'},{heading:'Businesses negotiate and fulfil',body:'Buyers and sellers agree on samples, contract terms, payment, quality checks and shipping independently.'}],
      details:[{heading:'Who is it for?',paragraphs:['The sourcing workflow is intended for project buyers, importers, wholesalers, fabricators and natural stone producers. Listings and response availability depend on participating firms.'],bullets:['Marble and travertine block enquiries','Slab and cut-to-size stone requirements','International and domestic B2B quote comparisons']},{heading:'What makes B2B quotes comparable?',paragraphs:['A shared technical brief makes it easier to compare offers. Confirm currency, units, lot photographs, production capacity, packing and agreed delivery responsibilities.','Marble Borsa connects businesses. The supplier, not the platform, is responsible for its own products, prices and contractual obligations.']}],
      faqs:[{question:'Who sells stone on Marble Borsa?',answer:'Independent producers and suppliers negotiate and sell on their own account. Marble Borsa does not purchase or resell stone.'},{question:'Can international buyers submit enquiries?',answer:'Buyers can describe their destination and requirements. Export availability and shipping terms should be agreed with responding suppliers.'}],relatedLabel:'FOR BUYERS',relatedTitle:'Prepare a clear marble quotation request',otherTopicLabel:'Learn how to request marble quotes',homeLabel:'Home',guideLabel:'Buyer guides',notice:'Marble Borsa facilitates contact only; independent businesses handle sales, payments and delivery.'
    }
  },
  zh: {
    quote: {
      title:'大理石询价平台：荒料与板材采购需求',description:'通过 Marble Borsa 了解大理石荒料、板材的询价流程，向独立生产商和供应商提出采购需求并直接比较报价。',eyebrow:'大理石采购 / 询价',intro:'Marble Borsa 帮助大理石买家与独立石材生产商和供应商建立联系。平台不销售或持有石材，也不以中介身份参与交易。',firstCta:'浏览天然石材',secondCta:'阅读采购指南',sectionTitle:'如何准备大理石询价需求？',
      steps:[{heading:'明确采购规格',body:'说明石材品种、荒料或板材、厚度、尺寸、表面处理、预计数量和目的地。'},{heading:'提交询价需求',body:'浏览石材类别，通过买家账户描述需求；相关企业可根据自身条件直接回复。'},{heading:'比较供应商报价',body:'除了价格，还应核对样品、实际批次照片、技术资料、包装、交期及交货条款。'}],
      details:[{heading:'询价时应提供哪些信息？',paragraphs:['荒料、大板和定尺产品的加工要求及计价方式不同。明确规格有助于收到可以比较的报价。'],bullets:['石材商业名称、参考样品及用途','形式、尺寸、厚度和允许公差','数量、交货地点、目标日期及技术检测要求']},{heading:'如何合理比较报价？',paragraphs:['核对币种、计价单位、生产批次及报价所包含的加工和运输项目。样品确认、包装和运费会影响总成本。','发布询价不等于签订采购合同。订单、付款和物流条款由买卖双方直接协商。']}],
      faqs:[{question:'Marble Borsa 是否直接销售大理石？',answer:'不。平台仅为买家与独立生产商、供应商建立联系，不销售石材，也不代理双方签约。'},{question:'平台提供统一大理石价格表吗？',answer:'不提供。报价由供应商根据批次、规格、加工、数量及交付条件自行决定。'}],relatedLabel:'企业采购',relatedTitle:'了解 B2B 大理石采购流程',otherTopicLabel:'查看 B2B 大理石平台',homeLabel:'首页',guideLabel:'石材采购指南',notice:'平台仅帮助独立买卖双方建立联系，不保证库存、报价或交易结果。'
    },
    b2b: {
      title:'B2B 大理石与天然石材采购平台',description:'了解 Marble Borsa 的 B2B 大理石采购需求与供应商直接报价模式，覆盖荒料、板材及天然石材贸易。',eyebrow:'B2B / 天然石材采购',intro:'Marble Borsa 旨在连接专业采购方与独立大理石及天然石材供应商。平台不是石材销售商或交易合同当事方。',firstCta:'浏览天然石材',secondCta:'查看采购指南',sectionTitle:'B2B 石材采购流程',
      steps:[{heading:'买家描述需求',body:'明确项目或批量采购所需的石材、技术规格、数量与目的地。'},{heading:'企业直接回复',body:'相关生产商和供应商可以根据自身产能与商业条件提供报价。'},{heading:'双方自行完成交易',body:'买卖双方直接商定样品、合同、付款、验货和运输条款。'}],
      details:[{heading:'适合哪些企业？',paragraphs:['面向工程采购方、进口商、批发商、石材加工企业及生产商。可获得的报价取决于实际参与企业。'],bullets:['大理石和洞石荒料采购','大板及定尺天然石材需求','国内外企业采购报价比较']},{heading:'如何比较 B2B 报价？',paragraphs:['统一技术要求后，核对币种、计价单位、批次图片、包装、产能及交货责任。','Marble Borsa 负责提供信息交流渠道；独立供应商承担自身产品与交易责任。']}],
      faqs:[{question:'谁在平台上销售石材？',answer:'独立生产商及供应商以自己的名义提供报价和销售。Marble Borsa 不转售石材。'},{question:'海外买家可以询价吗？',answer:'买家可以填写目的地及需求；出口能力与运输条件需与实际供应商直接确认。'}],relatedLabel:'采购方指南',relatedTitle:'如何准备大理石询价？',otherTopicLabel:'查看大理石询价流程',homeLabel:'首页',guideLabel:'石材采购指南',notice:'平台仅提供企业联系渠道；买卖双方自行负责销售、付款和交付。'
    }
  },
  ar: {
    quote: {
      title:'طلب عروض أسعار الرخام: توريد الكتل والألواح',description:'تعرف على كيفية إعداد طلب شراء الرخام وطلب عروض مباشرة من المنتجين والموردين المستقلين عبر منصة Marble Borsa.',eyebrow:'توريد الرخام / طلب عرض سعر',intro:'تساعد Marble Borsa المشترين على التواصل المباشر مع منتجي وموردي الحجر الطبيعي. المنصة لا تبيع الرخام ولا تمتلك مخزونًا ولا تتوسط في العقود.',firstCta:'تصفح الحجر الطبيعي',secondCta:'اقرأ أدلة الشراء',sectionTitle:'كيف تعد طلب عرض سعر للرخام؟',
      steps:[{heading:'حدد احتياجاتك',body:'اذكر نوع الحجر والكتل أو الألواح والسماكة والمقاسات والتشطيب والكمية التقريبية ووجهة التسليم.'},{heading:'قدّم طلبك',body:'تصفح أصناف الحجر الطبيعي وقدم متطلباتك عبر حساب المشتري. يمكن للشركات المناسبة الرد بشروطها الخاصة.'},{heading:'قارن عروض الموردين',body:'راجع العينات وصور الدفعات الفعلية والوثائق الفنية والتغليف وموعد التسليم والشروط إلى جانب السعر.'}],
      details:[{heading:'ما المعلومات المطلوبة قبل الاستفسار؟',paragraphs:['تختلف الكتل عن الألواح والمنتجات المقطعة في طريقة المعالجة والتسعير. تتيح المواصفات الواضحة مقارنة العروض.'],bullets:['الاسم التجاري للحجر أو العينة المرجعية والاستخدام','الأبعاد والسماكة والتفاوتات المطلوبة','الكمية وبلد التسليم والموعد والاختبارات اللازمة']},{heading:'كيف تقارن عروض الرخام؟',paragraphs:['تحقق من العملة ووحدة التسعير ودفعة الإنتاج والخدمات المشمولة وتكاليف التعبئة والنقل.','إن تقديم الاستفسار لا يمثل عقد شراء؛ يتفق المشتري والبائع مباشرة على الطلب والدفع والشحن.']}],
      faqs:[{question:'هل تبيع Marble Borsa الرخام؟',answer:'لا. تربط المنصة المشترين بالمنتجين والموردين المستقلين، ولا تبيع الحجر ولا تتوسط في إبرام العقود.'},{question:'هل الأسعار ثابتة على المنصة؟',answer:'لا. يحدد كل مورد عرضه بحسب الحجر والمواصفات والكمية وشروط التسليم.'}],relatedLabel:'توريد الأعمال',relatedTitle:'كيف تعمل منصة الرخام B2B؟',otherTopicLabel:'استكشف منصة الرخام B2B',homeLabel:'الرئيسية',guideLabel:'أدلة شراء الرخام',notice:'تربط المنصة بين البائع والمشتري ولا تضمن المخزون أو الأسعار أو نتائج المعاملات.'
    },
    b2b: {
      title:'منصة B2B لتوريد الرخام والحجر الطبيعي',description:'اكتشف طلبات توريد الرخام بالجملة وعروض الموردين المباشرة عبر منصة Marble Borsa للأعمال.',eyebrow:'B2B / توريد الحجر الطبيعي',intro:'تربط Marble Borsa المشترين المهنيين بموردي ومنتجي الرخام والحجر الطبيعي المستقلين. ليست المنصة تاجرًا للحجر أو طرفًا في عقود البيع.',firstCta:'استكشف الأحجار',secondCta:'اقرأ أدلة الشراء',sectionTitle:'كيف تتم عملية توريد الرخام بين الشركات؟',
      steps:[{heading:'يحدد المشتري متطلباته',body:'يقدم مواصفات المشروع أو الشراء بالجملة، ونوع المادة والمقاسات والكمية والوجهة.'},{heading:'ترد الشركات مباشرة',body:'يمكن للمنتجين والموردين المناسبين تقديم عروضهم وفق طاقاتهم وشروطهم.'},{heading:'يتفق الطرفان بصورة مستقلة',body:'يتفاوض المشتري والبائع مباشرة على العينات والعقد والدفع والفحص والشحن.'}],
      details:[{heading:'لمن صممت المنصة؟',paragraphs:['للشركات المشترية والمستوردين وتجار الجملة والمصانع ومنتجي الحجر الطبيعي. يعتمد توفر الردود على مشاركة الشركات الفعلية.'],bullets:['طلبات كتل الرخام والترافرتين','الألواح والأحجار المقطعة حسب المقاس','مقارنة عروض التوريد المحلية والدولية']},{heading:'ما الذي يجعل العروض قابلة للمقارنة؟',paragraphs:['احرص على توحيد المواصفات وتأكيد العملة ووحدة القياس وصور الدفعة والتغليف وقدرة الإنتاج وشروط التسليم.','تقدم Marble Borsa قناة للتواصل فقط؛ تقع مسؤوليات البيع والدفع والتسليم على الشركات المتعاقدة.']}],
      faqs:[{question:'من يبيع الرخام عبر المنصة؟',answer:'يقدم المنتجون والموردون المستقلون عروضهم ويبيعون باسمهم. لا تعيد Marble Borsa بيع أي حجر.'},{question:'هل يمكن لمشتري من الخارج إرسال استفسار؟',answer:'يمكن تحديد وجهة التسليم والمتطلبات؛ يجب الاتفاق على شروط التصدير والشحن مباشرة مع المورد. '}],relatedLabel:'للمشترين',relatedTitle:'إعداد طلب عرض سعر واضح للرخام',otherTopicLabel:'تعرف على طلب عروض الرخام',homeLabel:'الرئيسية',guideLabel:'أدلة الشراء',notice:'تسهل المنصة الاتصال فقط؛ تدير الشركات عمليات البيع والدفع والتسليم بنفسها.'
    }
  }
};

export function getSourcingCopy(locale: GuideLocale, topic: SourcingTopic): SourcingCopy {
  return content[locale][topic];
}

/** Transaction-neutral B2B sourcing content. Marble Borsa is a directory/RFQ platform, not a stone seller or broker. */
import type { GuideLocale } from './guideRoutes';

export type SourcingTopic = 'quote' | 'b2b' | 'buy';
export const sourcingTopics: SourcingTopic[] = ['quote', 'b2b', 'buy'];
export const sourcingLocales: GuideLocale[] = ['tr', 'en', 'zh', 'ar'];

const slugs: Record<SourcingTopic, Record<GuideLocale, string>> = {
  buy: { tr: 'mermer-al', en: 'buy-marble-from-turkey', zh: 'buy-marble-from-turkey', ar: 'buy-marble-from-turkey' },
  quote: { tr: 'mermer-teklifi-al', en: 'request-marble-quotes', zh: 'request-marble-quotes', ar: 'request-marble-quotes' },
  b2b: { tr: 'b2b-mermer', en: 'b2b-marble', zh: 'b2b-marble', ar: 'b2b-marble' },
};
export const sourcingPath = (topic: SourcingTopic, locale: GuideLocale) => `/${locale}/${slugs[topic][locale]}`;
export function sourcingRoute(locale: string, slug: string): SourcingTopic | undefined {
  if (!sourcingLocales.some(code => code === locale)) return undefined;
  return sourcingTopics.find(topic => slugs[topic][locale as GuideLocale] === slug);
}
export function sourcingAlternates(topic: SourcingTopic): Record<string, string> {
  return { 'tr-TR': sourcingPath(topic, 'tr'), 'en-US': sourcingPath(topic, 'en'), 'zh-CN': sourcingPath(topic, 'zh'), 'ar': sourcingPath(topic, 'ar'), 'x-default': sourcingPath(topic, 'en') };
}
export type SourcingCopy = {
  title: string; seoTitle?: string; description: string; eyebrow: string; intro: string;
  firstCta: string; secondCta: string; sectionTitle: string;
  steps: { heading: string; body: string }[];
  details: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedLabel: string; relatedTitle: string; otherTopicLabel: string;
  homeLabel: string; guideLabel: string; notice: string;
};

const content: Record<GuideLocale, Record<Exclude<SourcingTopic, 'buy'>, SourcingCopy>> = {
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
  const base = topic === 'buy' ? buyingContent[locale] : content[locale][topic];
  return topic === 'buy' ? {...base, faqs:[...buyerQuestions[locale], ...base.faqs]} : base;
}

const buyingContent: Record<GuideLocale, SourcingCopy> = {
 tr: {
 title:'Mermer Al: Blok, Plaka ve Toptan Mermer İçin Teklif İste',
 description:'Türkiye’den mermer almak için taş çeşitlerini inceleyin; blok, plaka ve ebatlı mermer ihtiyacınıza göre bağımsız üretici ve tedarikçilerden doğrudan teklif isteyin.',
 eyebrow:'TÜRKİYE’DEN MERMER SATIN ALMA',
 intro:'Mermer almak istiyorum diyorsanız önce ürün formunu ve ihtiyacınızı netleştirin. Projeniz için Afyon mermeri, traverten ve diğer doğal taşları inceleyin. Blok, plaka veya ebatlı ürün ihtiyacınızı belirleyerek Türkiye’deki bağımsız firmalardan doğrudan teklif isteyin.',
 firstCta:'Mermer çeşitlerini incele',secondCta:'Satın alma rehberlerini oku',sectionTitle:'Türkiye’den mermer nasıl alınır?',
 steps:[{heading:'Taşı ve formatı seçin',body:'Afyon White, Afyon Sugar, bej mermer veya traverten gibi seçenekleri kullanım alanınıza göre inceleyin. Blok, plaka ve ebatlı ürün ihtiyaçlarını ayırın.'},{heading:'Alım talebini hazırlayın',body:'Miktar, kalınlık, yüzey, ölçü, teslim şehri veya ülkesi ile beklenen tarihi yazın. Hesabınızdan teklif talebi oluşturun.'},{heading:'Firmayla koşulları netleştirin',body:'Yanıt veren firmadan parti fotoğrafı, numune, fiyat birimi, paketleme ve teslim koşullarını isteyin; siparişinizi doğrudan firmayla görüşün.'}],
 details:[{heading:'Blok, plaka veya ebatlı mermer?',paragraphs:['Blok mermer, kendi kesim ve işleme kapasitesi bulunan alıcılar için değerlendirilebilir. Plaka alımlarında kalınlık, yüzey işlemi ve damar uyumu; ebatlı ürünlerde ise net ölçüler ve toleranslar önemlidir.'],bullets:['Blok: ton veya metreküp bazlı teklif ve kesim verimi','Plaka: metrekare, kalınlık, yüzey ve parti uyumu','Ebatlı ürün: ölçü listesi, kenar işlemi ve paketleme']},{heading:'Türkiye’de mermer tedarikçisi seçimi',paragraphs:['Firma profilini ve yayımlanmış kataloglarını inceleyin. Üretim veya stok bilgisini ilgili firmadan doğrulayın. Afyonkarahisar, Denizli, Burdur ve diğer üretim bölgelerinden tedarikte nakliye mesafesi toplam maliyeti etkileyebilir.','İhracat için teslim şekli, taşıma, gümrük belgeleri ve yükleme kontrollerini önceden görüşün. Marble Borsa ödeme almaz veya siparişin tarafı olmaz.']}],
 faqs:[{question:'Marble Borsa üzerinden mermer satın alabilir miyim?',answer:'Platform üzerinden ihtiyacınızı paylaşabilir ve katılan firmalardan teklif isteyebilirsiniz. Satış sözleşmesi, ödeme ve teslimat doğrudan alıcıyla firma arasında gerçekleşir.'},{question:'Mermer fiyatı nasıl belirlenir?',answer:'Taş türü, kalite, parti, ölçü, kalınlık, yüzey, miktar ve teslim koşulları fiyatı etkiler. Güncel fiyatı ilgili firmadan isteyin.'},{question:'Henüz firma veya katalog bulunmuyorsa ne yapmalıyım?',answer:'Yayımlanan firma ve katalog sayısı katılım durumuna bağlıdır. Taş rehberlerini inceleyebilir, alıcı hesabınızdan talebinizi hazırlayabilirsiniz; teklif gelmesi garanti edilmez.'}],
 relatedLabel:'DOĞRUDAN TEKLİF',relatedTitle:'İhtiyacınıza göre mermer teklifi isteyin',otherTopicLabel:'Mermer teklif sürecini incele',homeLabel:'Ana sayfa',guideLabel:'Mermer alım rehberi',notice:'Marble Borsa mermer satıcısı değildir. Stok, ürün kalitesi, fiyat ve teslim koşulları bağımsız firmalar tarafından belirlenir.'
 },
 en: {
 title:'Buy Marble from Turkey: Blocks, Slabs and Supplier Quotes',description:'Source Turkish marble blocks, slabs and cut-to-size stone. Explore materials and request direct quotations from independent producers and suppliers on Marble Borsa.',eyebrow:'BUYING TURKISH MARBLE',intro:'Looking to buy marble from Turkey? Explore Afyon marble, travertine and other natural stones, specify your block, slab or cut-to-size requirements and request quotes from independent companies.',firstCta:'Explore marble varieties',secondCta:'Read buying guides',sectionTitle:'How to source marble from Turkey',
 steps:[{heading:'Choose material and format',body:'Compare Afyon White, Afyon Sugar, beige marble and travertine for your intended use. Decide whether you need blocks, slabs or finished pieces.'},{heading:'Prepare a buying request',body:'Specify quantity, thickness, finish, dimensions, destination and target delivery date. Submit your quotation request from your account.'},{heading:'Agree terms with the supplier',body:'Ask responding firms for actual lot photographs, samples, price units, packing details and delivery responsibilities. Discuss the order directly with the company.'}],
 details:[{heading:'Marble blocks, slabs or cut-to-size?',paragraphs:['Blocks may suit buyers with their own processing capacity. For slabs, confirm thickness, finish and matching. Finished pieces require a dimension schedule and agreed tolerances.'],bullets:['Blocks: pricing units and expected cutting yield','Slabs: square metres, thickness, finish and lot matching','Cut-to-size: dimensions, edge details and packing']},{heading:'Selecting Turkish marble suppliers',paragraphs:['Review published company profiles and catalogues. Verify production capacity and available stock directly with the company. Distance from regions such as Afyonkarahisar, Denizli and Burdur can affect freight costs.','For exports, agree delivery terms, customs documentation, loading checks and transport before ordering. Marble Borsa does not collect payments or become a party to orders.']}],
 faqs:[{question:'Can I buy Turkish marble through Marble Borsa?',answer:'You can describe your requirements and request quotes from participating firms. The purchase contract, payment and delivery are agreed directly with the supplier.'},{question:'What determines marble prices?',answer:'Material, quality, lot, dimensions, thickness, finish, quantity and delivery scope affect prices. Ask the supplier for a current quotation.'},{question:'What if no suppliers or catalogues are listed yet?',answer:'Availability depends on participating firms. You can browse stone guides and prepare a buying request from your buyer account; a response is not guaranteed.'}],relatedLabel:'DIRECT QUOTATIONS',relatedTitle:'Request a quote for your marble requirement',otherTopicLabel:'Explore marble quotation requests',homeLabel:'Home',guideLabel:'Marble buying guides',notice:'Marble Borsa is not a marble seller. Independent suppliers determine stock, quality, prices and delivery terms.'
 },
 zh: {
 title:'采购土耳其大理石：荒料、板材与供应商报价',description:'了解土耳其大理石、阿菲永大理石与洞石采购，通过 Marble Borsa 向独立生产商和供应商询价，比较荒料、板材与定尺产品。',eyebrow:'土耳其大理石采购',intro:'想采购土耳其大理石？浏览阿菲永大理石、洞石及其他天然石材，确定荒料、板材或定尺加工需求，再直接向独立企业询价。',firstCta:'浏览大理石品种',secondCta:'阅读采购指南',sectionTitle:'如何采购土耳其大理石',
 steps:[{heading:'选择石材与产品形式',body:'根据用途比较 Afyon White、Afyon Sugar、米黄大理石和洞石，明确荒料、板材或成品需求。'},{heading:'准备采购需求',body:'填写数量、厚度、表面处理、尺寸、交付地点与期望日期，通过账户提交询价。'},{heading:'与供应商确认条件',body:'向回应企业索取实际批次照片、样品、计价单位、包装和交付条件，直接洽谈订单。'}],
 details:[{heading:'荒料、板材还是定尺产品？',paragraphs:['有加工能力的买家可考虑荒料。板材采购应确认厚度、表面和纹理匹配；定尺成品需提供尺寸清单及公差。'],bullets:['荒料：计价单位与预计出材率','板材：平方米、厚度、表面及批次匹配','定尺产品：尺寸、边缘加工与包装']},{heading:'选择土耳其大理石供应商',paragraphs:['查看已发布企业资料和目录，并向企业核实产能及库存。阿菲永、代尼兹利、布尔杜尔等产区的运输距离可能影响成本。','进口前确认交货条款、报关文件、装运检查与运输安排。Marble Borsa 不收取货款，也不成为订单交易方。']}],
 faqs:[{question:'可以通过 Marble Borsa 购买土耳其大理石吗？',answer:'您可以提交需求并向参与企业询价。采购合同、付款与交付由买卖双方直接约定。'},{question:'大理石价格由什么决定？',answer:'品种、品质、批次、尺寸、厚度、表面、数量及交付范围影响价格，请向供应商索取最新报价。'},{question:'暂时没有供应商或目录怎么办？',answer:'展示内容取决于参与企业。您可以浏览石材指南并通过买家账户准备采购需求，但不保证收到报价。'}],relatedLabel:'直接询价',relatedTitle:'根据您的大理石需求询价',otherTopicLabel:'了解大理石询价流程',homeLabel:'首页',guideLabel:'大理石采购指南',notice:'Marble Borsa 不是石材卖家。库存、品质、价格及交付条件由独立供应商确定。'
 },
 ar: {
 title:'شراء الرخام من تركيا: كتل وألواح وعروض الموردين',description:'استكشف شراء الرخام التركي ورخام أفيون والترافرتين. حدد احتياجات الكتل والألواح والرخام المقطع واطلب عروض أسعار مباشرة من الموردين المستقلين.',eyebrow:'شراء الرخام التركي',intro:'هل تريد شراء الرخام من تركيا؟ استكشف رخام أفيون والترافرتين والأحجار الطبيعية، وحدد احتياجاتك من الكتل أو الألواح أو القطع حسب المقاس، ثم اطلب عروضًا من شركات مستقلة.',firstCta:'استكشف أنواع الرخام',secondCta:'اقرأ أدلة الشراء',sectionTitle:'كيفية شراء الرخام من تركيا',
 steps:[{heading:'اختر الحجر وشكل المنتج',body:'قارن رخام أفيون الأبيض وAfyon Sugar والرخام البيج والترافرتين حسب الاستخدام، وحدد الكتل أو الألواح أو المنتجات النهائية.'},{heading:'جهز طلب الشراء',body:'حدد الكمية والسماكة والتشطيب والأبعاد ووجهة التسليم والموعد المطلوب، ثم أرسل طلب عرض السعر من حسابك.'},{heading:'اتفق مع المورد مباشرة',body:'اطلب من الشركات المستجيبة صور الدفعة الفعلية والعينات ووحدة التسعير والتغليف ومسؤوليات التسليم، وناقش الطلب معها مباشرة.'}],
 details:[{heading:'كتل أم ألواح أم رخام مقطع؟',paragraphs:['قد تناسب الكتل المشترين الذين لديهم قدرة معالجة. للألواح تأكد من السماكة والتشطيب وتناسق العروق، وللقطع النهائية قدم قائمة الأبعاد والتفاوتات المقبولة.'],bullets:['الكتل: وحدة السعر ومردود القطع المتوقع','الألواح: المتر المربع والسماكة والتشطيب وتناسق الدفعة','القطع حسب المقاس: الأبعاد ومعالجة الحواف والتغليف']},{heading:'اختيار موردي الرخام التركي',paragraphs:['راجع ملفات الشركات والكتالوجات المنشورة، وتحقق من المخزون والطاقة الإنتاجية مع الشركة مباشرة. قد تؤثر المسافة من أفيون أو دنيزلي أو بوردور على تكلفة النقل.','قبل الاستيراد اتفق على شروط التسليم ووثائق الجمارك وفحص التحميل والنقل. لا تتلقى Marble Borsa المدفوعات ولا تكون طرفًا في الطلب.']}],
 faqs:[{question:'هل يمكن شراء الرخام التركي عبر Marble Borsa؟',answer:'يمكنك وصف احتياجاتك وطلب عروض من الشركات المشاركة. يتفق المشتري والمورد مباشرة على عقد الشراء والدفع والتسليم.'},{question:'ما الذي يحدد أسعار الرخام؟',answer:'النوع والجودة والدفعة والأبعاد والسماكة والتشطيب والكمية وشروط التسليم تؤثر على السعر. اطلب عرضًا حديثًا من المورد.'},{question:'ماذا لو لم توجد شركات أو كتالوجات بعد؟',answer:'يعتمد التوفر على الشركات المشاركة. يمكنك تصفح الأدلة وإعداد طلب من حساب المشتري، لكن وصول عروض غير مضمون.'}],relatedLabel:'عروض مباشرة',relatedTitle:'اطلب عرضًا لاحتياجاتك من الرخام',otherTopicLabel:'تعرف على طلب عروض الرخام',homeLabel:'الرئيسية',guideLabel:'أدلة شراء الرخام',notice:'Marble Borsa ليست بائع رخام. تحدد الشركات المستقلة المخزون والجودة والأسعار وشروط التسليم.'
 }
};

// Intent themes from qualitative search-result review, not measured query volumes.
const buyerQuestions: Record<GuideLocale, SourcingCopy['faqs']> = {
 tr: [
  {question:'Mermer almak istiyorum, nereden başlamalıyım?',answer:'Önce kullanım alanını, taşın rengini ve blok, plaka veya ebatlı ürün ihtiyacını belirleyin. Doğal taş çeşitlerini inceleyin; miktar ve teslim yeriyle birlikte alıcı hesabınızdan teklif talebi hazırlayın.'},
  {question:'Mermer nereden alınır; üretici ve tedarikçi nasıl bulunur?',answer:'Mermer ocakları, işleme fabrikaları ve tedarikçiler farklı ürün formları sunabilir. Firma rehberindeki işletmeleri inceleyin; istediğiniz ürünün stok, işleme ve teslim kapasitesini firmayla doğrudan teyit edin.'},
  {question:'Plaka mermer fiyatı veya mermer metrekare fiyatı nasıl öğrenilir?',answer:'Taşın adı, kalite seçimi, kalınlığı, yüzey işlemi ve miktarını belirterek güncel teklif isteyin. Metrekare fiyatına kesim, kenar işleme, paketleme, nakliye ve vergilerin dahil olup olmadığını sorun. Blok tekliflerinin birimi ayrıca teyit edilmelidir.'},
  {question:'Afyon beyaz mermer veya toptan blok mermer arıyorum; ne yazmalıyım?',answer:'Taşın adını veya referans görselini, blok/plaka seçimini, yaklaşık miktarı ve teslim noktasını belirtin. Beyaz mermerde damar ve ton seçimi için gerçek parti fotoğrafı ve numune isteyin. Toptan alımın minimum miktarını firma belirler.'},
  {question:'Ölçüye göre mermer kestirmek ve projem için teklif almak mümkün mü?',answer:'Ebatlı ürün ihtiyacınızı ölçü listesi, adet, kalınlık, yüzey ve kenar işlemleriyle açıklayın. Kesim, uygulama veya montaj hizmetinin mevcut olup olmadığını ilgili firmaya sorun; bu hizmetler her teklife dahil değildir.'}
 ],
 en: [
  {question:'I want to buy marble from Turkey. Where do I start?',answer:'Choose the stone and whether you need blocks, slabs or cut-to-size pieces. Prepare the quantity, thickness, finish and delivery destination, then describe your requirements through a buyer account.'},
  {question:'How do I find Turkish marble suppliers and manufacturers?',answer:'Browse the company directory and published catalogues. Confirm the company’s actual stock, production capacity and export arrangements directly before placing an order.'},
  {question:'How can I request a Turkish marble slab price per square metre?',answer:'Specify the stone, selection, thickness, finish and quantity. Ask whether cutting, packing, freight and taxes are included, and compare quotations with the same scope and currency.'},
  {question:'Can I source wholesale marble blocks or Afyon white marble slabs?',answer:'Describe the stone, product form, quantity and destination in your request. Ask responding suppliers for current batch photos, sample options and their minimum order quantity. Available offers depend on participating companies.'},
  {question:'What should a cut-to-size marble quotation include?',answer:'Provide a dimension schedule, piece counts, thickness, finish and edge details. Confirm tolerances, packing and delivery with the supplier; installation and freight are not automatically included.'}
 ],
 ar: [
  {question:'أريد شراء رخام من تركيا، من أين أبدأ؟',answer:'حدد نوع الحجر وهل تحتاج إلى كتل أو ألواح أو قطع حسب المقاس. جهز الكمية والسماكة والتشطيب ووجهة التسليم، ثم قدم احتياجاتك من حساب المشتري.'},
  {question:'كيف أجد مصانع وموردي الرخام التركي؟',answer:'راجع دليل الشركات والكتالوجات المنشورة. تحقق مباشرة مع الشركة من المخزون والطاقة الإنتاجية وإمكانية التصدير قبل الاتفاق على الطلب.'},
  {question:'كيف أحصل على سعر متر الرخام التركي أو عرض سعر للألواح؟',answer:'اذكر النوع والفرز والسماكة والتشطيب والكمية. اسأل عما إذا كان السعر يشمل القص والتغليف والنقل والضرائب، وقارن عروضًا بنفس المواصفات والعملة.'},
  {question:'أبحث عن رخام أفيون الأبيض أو كتل رخام بالجملة، ماذا أذكر؟',answer:'حدد اسم الحجر أو أرفق صورة مرجعية، وشكل المنتج والكمية والوجهة. اطلب صور الدفعة الفعلية والعينات؛ يحدد المورد الحد الأدنى للطلب ويؤكد التوفر.'},
  {question:'هل يمكن طلب رخام مقطع حسب مقاسات المشروع؟',answer:'أرسل جدول الأبعاد وعدد القطع والسماكة والتشطيب وتفاصيل الحواف. أكد تفاوتات المقاسات والتغليف وموعد التسليم؛ التركيب والنقل ليسا مشمولين تلقائيًا.'}
 ],
 zh: [
  {question:'想采购土耳其大理石，应该从哪里开始？',answer:'先确定石材品种，以及荒料、大板或定尺产品需求。准备数量、厚度、表面处理和交货地点，再通过买家账户说明采购要求。'},
  {question:'如何寻找土耳其大理石供应商和生产厂家？',answer:'浏览企业名录和已发布目录，并直接向企业核实实际库存、加工能力及出口安排。平台不是石材销售商。'},
  {question:'如何询问土耳其大理石板材每平方米价格？',answer:'说明品种、选级、厚度、表面处理和数量。询问报价是否包括切割、包装、运费和税费，并在相同规格、币种及交付范围下比较。'},
  {question:'采购土耳其大理石荒料或阿菲永白色大板，需要哪些资料？',answer:'提供石材名称或参考图片、产品形式、数量及目的地。向回复企业索取实际批次照片、样品选项和最小起订量，并直接核实供货情况。'},
  {question:'工程定尺大理石询价应包括什么？',answer:'提供尺寸清单、件数、厚度、表面与边缘加工要求。确认尺寸公差、包装和交期；安装和运输并非自动包含在报价中。'}
 ]
};

export const buyerJourney: Record<GuideLocale,{companies:string;request:string;buy:string}> = {
 tr:{companies:'Mermer firmalarını incele',request:'Alıcı hesabından talep hazırla',buy:'Mermer almak istiyorum'},
 en:{companies:'Explore marble suppliers',request:'Prepare a request in your buyer account',buy:'I want to buy marble'},
 ar:{companies:'تصفح موردي الرخام',request:'جهّز طلبك من حساب المشتري',buy:'أريد شراء الرخام'},
 zh:{companies:'浏览大理石供应商',request:'通过买家账户准备采购需求',buy:'我想采购大理石'}
};

/** Separate product-form needs with distinct buyer guidance, not keyword aliases. */
export const buyerLandingPages: Record<string, SourcingCopy> = {
 'plaka-mermer-al': {
  ...buyingContent.tr,
  title:'Plaka Mermer Al: Ölçü, Kalınlık ve Parti İçin Teklif İste',
  description:'Plaka mermer alımı için ölçü, kalınlık, yüzey ve damar seçimini belirleyin. Gerçek parti fotoğraflarını ve teslim koşullarını firmalardan isteyin.',
  eyebrow:'PLAKA MERMER TEDARİKİ',
  intro:'Plaka mermer almak için yalnızca taşın adını seçmek yeterli değildir. Kesime uygun ölçüleri, kullanılabilir alanı, kalınlığı ve aynı partideki damar dağılımını birlikte değerlendirin. Marble Borsa üzerinden ihtiyacınızı açıklayarak bağımsız firmalardan teklif isteyebilirsiniz.',
  sectionTitle:'Plaka mermer siparişine nasıl hazırlanılır?',
  steps:[{heading:'Kullanılabilir ölçüyü belirleyin',body:'Net proje ölçüsünü, yaklaşık metrekareyi ve kesim planını paylaşın. Plakanın brüt alanı ile projede kullanılabilir alanının aynı olmayabileceğini hesaba katın.'},{heading:'Partiyi inceleyin',body:'Güncel stok fotoğrafları, plaka numaraları, kalınlık ve yüzey bilgisi isteyin. Damar devamlılığı gereken alanlarda yan yana gelecek plakaları birlikte değerlendirin.'},{heading:'Teklif kapsamını yazılı teyit edin',body:'Fiyatın plaka mı metrekare mi üzerinden olduğunu; kesim, paketleme, yükleme ve nakliyenin dahil olup olmadığını sorun.'}],
  details:[{heading:'2 cm mi, 3 cm mi plaka mermer?',paragraphs:['Kalınlık tercihini kullanım alanı, taşıyıcı sistem, kesim ve uygulama gereksinimleriyle birlikte proje sorumlunuzla belirleyin. Her kullanım için tek bir kalınlık önermek doğru değildir.','Tekliflerde aynı kalınlığı ve yüzey işlemini karşılaştırın. Ölçü toleranslarını, yüzeydeki işlem ve onarımları, arka yüz uygulamalarını firmaya sorun.']},{heading:'Beyaz ve damarlı plakalarda parti seçimi',paragraphs:['Afyon beyaz mermer ve diğer damarlı taşlarda renk ve damar dağılımı plakadan plakaya değişebilir. Tür görseli, satın alacağınız partinin fotoğrafının yerini tutmaz.','Eşleştirme veya bookmatch isteniyorsa hangi plakaların birlikte kullanılacağını ve kesim yönünü siparişten önce teyit edin.']}],
  faqs:[{question:'Plaka mermer metrekare fiyatına neler dahildir?',answer:'Kapsam firmaya göre değişir. Kesim, kenar işleme, paketleme, yükleme, nakliye ve vergileri ayrı ayrı sorun; aynı kapsamlı teklifleri karşılaştırın.'},{question:'Tek bir plaka mermer alabilir miyim?',answer:'Minimum sipariş, stok ve teslim seçeneklerini ilgili firma belirler. İstediğiniz adet veya metrekareyi talebinizde açıkça belirtin.'}]
 },
 'blok-mermer-al': {
  ...buyingContent.tr,
  title:'Blok Mermer Al: Ocak, Blok Seçimi ve Tedarik Teklifi',
  description:'Blok mermer alımı için ebat, tonaj, çatlak yapısı, randıman ve yükleme koşullarını değerlendirin; üretici ve tedarikçilerden doğrudan teklif isteyin.',
  eyebrow:'BLOK MERMER TEDARİKİ',intro:'Blok mermer almak isteyen işleme tesisleri ve ticari alıcılar için seçim, yalnızca renk ve tonajdan oluşmaz. Blok geometrisini, çatlakları, kesim yönünü ve hedef ürünün çıkma olasılığını birlikte değerlendirin. Uygun üretici veya tedarikçiyle teklif ve inceleme koşullarını doğrudan görüşün.',
  sectionTitle:'Blok mermer alımında üç kontrol',
  steps:[{heading:'Üretim hedefini anlatın',body:'İşlenecek ürünün ölçüsünü, taş türünü, hedef blok boyutlarını ve tahmini miktarı belirtin. İşleme ekipmanınızın kabul ettiği ölçüleri kontrol edin.'},{heading:'Bloğu tanımlayın',body:'Blok numarası, farklı yüzlerden güncel fotoğraf, ölçü ve tartım bilgisi isteyin. İhtiyaca göre yerinde inceleme planlayın.'},{heading:'Yükleme ve teslimi netleştirin',body:'Fiyat birimini, tartım yöntemini, yükleme sorumluluğunu ve teslim yerini yazılı olarak teyit edin.'}],
  details:[{heading:'Blok mermer fiyatını nasıl karşılaştırmalısınız?',paragraphs:['Ton, metreküp veya blok başına verilen fiyatlar aynı temelde değerlendirilmelidir. Ölçü ve tartım bilgileriyle birlikte teklifin hangi bloğa ait olduğunu kaydedin.','Yalnızca düşük birim fiyatı değerlendirmeyin. Blok şekli, görünen çatlaklar ve işleme hedefiniz olası fireyi etkiler; beklenen randımanı yetkin bir uzmanla inceleyin.']},{heading:'Fotoğrafla blok seçiminin sınırları',paragraphs:['Dış yüzey fotoğrafı blok içindeki tüm özellikleri göstermez. Mümkün olan inceleme yöntemlerini ve ihtilaf durumunda uygulanacak koşulları satıcıyla önceden görüşün.','Marble Borsa stok sahibi değildir ve blok kalitesi veya randıman garantisi vermez. Satın alma ve kontrol sorumlulukları tarafların anlaşmasında açıkça yer almalıdır.']}],
  faqs:[{question:'Doğrudan mermer ocağından blok alabilir miyim?',answer:'Firma rehberindeki ocak ve üretici profillerini inceleyebilirsiniz. Fiili üretim, mevcut bloklar ve satış yetkisini şirketle doğrudan doğrulayın.'},{question:'Blok mermer alım talebine ne yazmalıyım?',answer:'Taş adı, hedef ölçü aralığı, yaklaşık tonaj veya blok adedi, kullanım/işleme amacı ve teslim noktasını yazın. Fiyat birimini ve inceleme beklentinizi belirtin.'}]
 },
 'toptan-mermer-al': {
  ...buyingContent.tr,
  title:'Toptan Mermer Al: Proje ve Düzenli Tedarik İçin Teklif',
  description:'Toptan mermer alımında parti tutarlılığı, miktar, teslim takvimi ve paketlemeyi belirleyin. Fabrika ve tedarikçilerle doğrudan teklif koşullarını görüşün.',
  eyebrow:'TOPTAN VE PROJE TEDARİKİ',intro:'Toptan mermer alımı, tek seferlik yüksek miktarlı sipariş veya aşamalı proje teslimatı olabilir. İhtiyacınızı toplam miktar, parti beklentisi ve teslim programıyla açıklayın. Bağımsız firmaların yanıtlarını aynı ürün ve teslim kapsamıyla değerlendirin.',
  sectionTitle:'Toptan tedarik için talebinizi hazırlayın',
  steps:[{heading:'Miktarı ve programı paylaşın',body:'Toplam ihtiyacı, ürün formatını ve her teslimatta beklediğiniz miktarı belirtin. Proje için ölçü listesi veya aşama takvimini hazırlayın.'},{heading:'Parti devamlılığını sorun',body:'Aynı ton ve damar seçiminin sonraki teslimatlarda nasıl korunacağını görüşün. Numune onayını ve değişkenlik sınırlarını yazılı hale getirin.'},{heading:'Toplam maliyeti karşılaştırın',body:'Birim fiyatla birlikte işleme, paketleme, sevkiyat, yükleme ve teslim sorumluluklarını değerlendirin.'}],
  details:[{heading:'Toptan mermerde minimum sipariş miktarı',paragraphs:['Her firma ve ürün için aynı minimum sipariş geçerli değildir. Miktarı metrekare, ton veya adet olarak açıkça yazın; birim dönüşümlerini firmayla teyit edin.','Fabrika kapasitesini, mevcut parti miktarını ve sonraki üretim süresini ayrı ayrı sorun. Platformda bir firma bulunması belirli bir stoğun hazır olduğu anlamına gelmez.']},{heading:'Ebatlı proje ve aşamalı sevkiyat',paragraphs:['Zemin, kaplama veya diğer proje uygulamaları için ebat, adet, yüzey ve kenar işlemleri listesini paylaşın. Montaj ve uygulama kapsamını ayrıca belirtin.','Siparişten önce paket etiketleri, sevkiyat planı ve hasar kontrol adımlarını kararlaştırın. İhracatta teslim şartları ve evrak sorumluluğunu satıcıyla netleştirin.']}],
  faqs:[{question:'Toptan alımda en ucuz mermer nasıl bulunur?',answer:'Yalnızca fiyatı değil, ürün seçimi, kullanılabilir miktar, fire, işleme ve teslim maliyetini birlikte değerlendirin. En düşük birim fiyat her zaman en düşük proje maliyeti değildir.'},{question:'Düzenli mermer tedariki için firmaya ne sormalıyım?',answer:'Parti sürekliliği, mevcut stok, üretim kapasitesi, teslim takvimi ve yeniden sipariş koşullarını sorun. Kapasiteyi ve verilen bilgileri doğrudan teyit edin.'}]
 }
};

export type BuyerLandingKind = 'slabs'|'blocks'|'wholesale';
export const buyerLandingKinds: BuyerLandingKind[] = ['slabs','blocks','wholesale'];
const buyerLandingSlugs: Record<GuideLocale,Record<BuyerLandingKind,string>> = {
 tr:{slabs:'plaka-mermer-al',blocks:'blok-mermer-al',wholesale:'toptan-mermer-al'},
 en:{slabs:'buy-turkish-marble-slabs',blocks:'buy-turkish-marble-blocks',wholesale:'wholesale-turkish-marble'},
 ar:{slabs:'buy-turkish-marble-slabs',blocks:'buy-turkish-marble-blocks',wholesale:'wholesale-turkish-marble'},
 zh:{slabs:'buy-turkish-marble-slabs',blocks:'buy-turkish-marble-blocks',wholesale:'wholesale-turkish-marble'}
};
export const buyerLandingPath=(locale:GuideLocale,kind:BuyerLandingKind)=>`/${locale}/${buyerLandingSlugs[locale][kind]}`;
export function buyerLandingRoute(locale:string,slug:string):BuyerLandingKind|undefined {
 return sourcingLocales.includes(locale as GuideLocale)?buyerLandingKinds.find(kind=>buyerLandingSlugs[locale as GuideLocale][kind]===slug):undefined;
}
export const buyerLandingAlternates=(kind:BuyerLandingKind)=>({...Object.fromEntries(sourcingLocales.map(locale=>[locale==='zh'?'zh-CN':locale,buyerLandingPath(locale,kind)])),'x-default':buyerLandingPath('en',kind)});

type LandingTranslation = {title:string;intro:string;sectionTitle:string;steps:[string,string][];details:[string,string][];faqs:[string,string][]};
const landingTranslations: Record<Exclude<GuideLocale,'tr'>,Record<BuyerLandingKind,LandingTranslation>> = {
 en:{
  slabs:{title:'Find Turkish Marble Slab Suppliers',intro:'Looking for marble slab suppliers in Turkey? Use Marble Borsa to find participating companies and request Turkish marble slabs for wholesale purchases or individual projects. Specify your stone, usable dimensions, thickness, finish and destination, then discuss batch photos, availability and quotations directly with independent suppliers.',sectionTitle:'Prepare a marble slab purchase request',steps:[['Specify usable sizes','Share the project dimensions, quantity in square metres and cutting plan. A slab’s gross area may differ from the usable area.'],['Review the actual batch','Ask for current slab photos, identification numbers, thickness and finish. Review adjacent slabs together when vein continuity matters.'],['Confirm quotation scope','Confirm whether the price is per slab or square metre and whether cutting, packing, loading and freight are included.']],details:[['Choosing 2 cm or 3 cm slabs','Choose thickness with your project professional based on the application, support and fabrication requirements. Compare identical thicknesses and finishes; ask about tolerances, repairs and backing treatments.'],['Afyon white marble and vein selection','Colour and veins can vary between slabs. Category illustrations do not identify available stock. Request photos of the offered batch, sample options and the cutting direction for matched or bookmatched panels.']],faqs:[['What is the price per square metre of Turkish marble slabs?','The supplier determines the price for the selected stone, batch, thickness, finish and quantity. Request a current quotation and clarify freight, taxes and processing.'],['Can I buy one marble slab?','Minimum quantities and delivery options vary by supplier. State your required slab count or area in the request and confirm availability directly.']]},
  blocks:{title:'Buy Turkish Marble Blocks: Quarry Selection and Supply Quotes',intro:'Source Turkish marble blocks for processing or trade. Define block dimensions, approximate tonnage and your production target, then discuss inspection and supply terms with independent quarry operators or suppliers.',sectionTitle:'Plan your marble block purchase',steps:[['Describe the processing target','State the stone, required block size range, approximate quantity and destination. Check the dimensions accepted by your processing equipment.'],['Identify each block','Request block numbers, measured dimensions, weight information and current photos of different faces. Arrange suitable inspection where needed.'],['Agree loading and delivery','Confirm the pricing unit, weighing method, loading responsibilities and delivery point in writing.']],details:[['Compare block prices on the same basis','Prices per tonne, cubic metre or block are different bases. Record which block each quotation concerns. Block geometry and visible fractures may affect processing yield; seek qualified inspection rather than assuming yield from the unit price.'],['Limits of selecting marble blocks from photos','External photos cannot reveal all internal characteristics. Agree the available inspection methods and the conditions for handling discrepancies before ordering. Marble Borsa does not guarantee block quality or processing yield.']],faqs:[['Can I contact a Turkish marble quarry directly?','Review participating quarry and producer profiles in the directory. Confirm production, available blocks and authority to sell directly with the company.'],['What should a marble block RFQ include?','Include the stone name, target size range, approximate tonnage or block count, processing purpose and destination. Specify the pricing unit and inspection expectations.']]},
  wholesale:{title:'Wholesale Turkish Marble: Bulk and Project Supply Quotes',intro:'Looking for wholesale Turkish marble suppliers? Define the product form, total quantity, batch expectations and delivery schedule. Compare responses from independent companies using the same specifications and supply scope.',sectionTitle:'Prepare a wholesale marble enquiry',steps:[['Share quantities and schedule','State the total requirement and quantities for each delivery. Provide a dimension schedule for cut-to-size project pieces.'],['Discuss batch consistency','Ask how colour and vein selection will be maintained across deliveries. Agree sample approval and acceptable variation in writing.'],['Compare total supply cost','Assess processing, packing, loading and shipment responsibilities alongside the unit price.']],details:[['Minimum orders and production capacity','There is no single minimum order for every supplier. Specify square metres, tonnes or pieces and confirm conversions. Ask separately about current batch stock, manufacturing capacity and lead time. A company listing does not imply ready stock.'],['Phased project deliveries and export','Provide dimensions, counts, finish and edge details. Agree package identification, shipment stages and damage checks. Confirm export documents and delivery responsibilities with the supplier; installation is a separate scope unless agreed.']],faqs:[['How do I find the cheapest wholesale marble?','Compare stone selection, usable quantity, processing losses, fabrication and delivery costs. The lowest unit price does not necessarily mean the lowest project cost.'],['Can I arrange regular marble supply?','Ask responding companies about batch continuity, current stock, capacity and reorder terms. Confirm all production and delivery commitments directly.']]}
 },
 ar:{
  slabs:{title:'شراء ألواح الرخام التركي: المقاسات والسماكة وعروض الموردين',intro:'تبحث عن شراء ألواح الرخام التركي؟ حدد نوع الحجر والمقاسات القابلة للاستخدام والسماكة والتشطيب. اطلب صور الدفعة الفعلية وعروضًا من شركات مستقلة. تربط Marble Borsa المشترين بالموردين ولا تملك مخزونًا أو تبيع الألواح.',sectionTitle:'جهّز طلب شراء ألواح الرخام',steps:[['حدد المقاسات المطلوبة','شارك أبعاد المشروع والكمية بالمتر المربع وخطة القص. قد تختلف مساحة اللوح الإجمالية عن المساحة القابلة للاستخدام.'],['راجع الدفعة الفعلية','اطلب صورًا حديثة وأرقام الألواح والسماكة والتشطيب. افحص الألواح المتجاورة معًا عند الحاجة إلى استمرارية العروق.'],['أكد نطاق عرض السعر','تحقق هل السعر للوح أم للمتر المربع، وهل يشمل القص والتغليف والتحميل والنقل.']],details:[['اختيار سماكة 2 سم أو 3 سم','حدد السماكة مع مسؤول المشروع وفق الاستخدام ونظام الدعم ومتطلبات التصنيع. قارن سماكات وتشطيبات متطابقة واسأل عن التفاوتات والإصلاحات ومعالجة ظهر اللوح.'],['رخام أفيون الأبيض واختيار العروق','قد تختلف الألوان والعروق بين الألواح. الصور التعريفية ليست دليلًا على المخزون الحالي. اطلب صور الدفعة المعروضة وخيارات العينات واتجاه القص عند مطابقة العروق.']],faqs:[['ما سعر متر ألواح الرخام التركي؟','يحدد المورد السعر حسب النوع والدفعة والفرز والسماكة والتشطيب والكمية. اطلب عرضًا حديثًا وحدد ما يشمله من نقل وضرائب ومعالجة.'],['هل يمكن شراء لوح رخام واحد؟','تختلف الكمية الدنيا وخيارات التسليم بحسب المورد. اذكر عدد الألواح أو المساحة المطلوبة وأكد التوفر مباشرة.']]},
  blocks:{title:'شراء كتل الرخام التركي: اختيار المحجر وطلب عرض سعر',intro:'لشراء كتل الرخام التركي للتصنيع أو التجارة، حدد أبعاد الكتل والوزن التقريبي والمنتج المستهدف. ناقش الفحص والتوريد مع أصحاب المحاجر أو الموردين المستقلين.',sectionTitle:'خطوات إعداد طلب كتل الرخام',steps:[['وضح هدف التصنيع','حدد النوع ونطاق الأبعاد والكمية والوجهة. تحقق من الأبعاد التي تقبلها معدات المعالجة لديك.'],['عرّف كل كتلة','اطلب رقم الكتلة والقياسات والوزن وصورًا حديثة لعدة أوجه. رتب فحصًا مناسبًا عند الحاجة.'],['اتفق على التحميل والتسليم','أكد وحدة التسعير وطريقة الوزن ومسؤوليات التحميل ونقطة التسليم كتابيًا.']],details:[['مقارنة أسعار الكتل على أساس موحد','السعر للطن أو للمتر المكعب أو للكتلة أسس مختلفة. سجل الكتلة المقصودة بكل عرض. قد تؤثر الهندسة والشقوق على مردود القص؛ استعن بفحص متخصص بدل تقدير المردود من السعر وحده.'],['حدود اختيار الكتل من الصور','لا تكشف الصور الخارجية جميع الخصائص الداخلية. اتفق على طرق الفحص وشروط معالجة الاختلافات قبل الطلب. لا تضمن Marble Borsa جودة الكتل أو مردود التصنيع.']],faqs:[['هل أستطيع التواصل مع محجر رخام تركي مباشرة؟','راجع ملفات المحاجر والمنتجين المشاركين وتحقق مباشرة من الإنتاج والكتل المتاحة وصلاحية الشركة للبيع.'],['ماذا يتضمن طلب عرض سعر لكتل الرخام؟','اسم الحجر ونطاق الأبعاد والوزن التقريبي أو عدد الكتل وغرض التصنيع والوجهة. حدد وحدة السعر وتوقعات الفحص.']]},
  wholesale:{title:'شراء الرخام التركي بالجملة: عروض للمشاريع والتوريد المنتظم',intro:'تبحث عن موردي رخام تركي بالجملة؟ حدد شكل المنتج والكمية الإجمالية وتوقعات الدفعة وبرنامج التسليم. قارن ردود الشركات المستقلة بنفس المواصفات ونطاق التوريد.',sectionTitle:'جهّز استفسار توريد الرخام بالجملة',steps:[['شارك الكميات والجدول','حدد الاحتياج الكلي وكمية كل تسليم. أرفق قائمة أبعاد للقطع المخصصة للمشروع.'],['ناقش اتساق الدفعة','اسأل عن الحفاظ على اختيار اللون والعروق عبر التسليمات. اتفق على اعتماد العينات وحدود التفاوت كتابةً.'],['قارن التكلفة الإجمالية','قيّم المعالجة والتغليف والتحميل والنقل مع سعر الوحدة.']],details:[['الحد الأدنى للطلب والطاقة الإنتاجية','لا توجد كمية دنيا موحدة لكل الموردين. حدد المتر المربع أو الطن أو عدد القطع وأكد التحويلات. اسأل منفصلًا عن المخزون الفعلي والطاقة الإنتاجية ومدة التصنيع؛ ظهور الشركة لا يعني توافر مخزون جاهز.'],['تسليم المشاريع على مراحل والتصدير','قدم الأبعاد والأعداد والتشطيب وتفاصيل الحواف. اتفق على تعريف العبوات ومراحل الشحن وفحص الضرر. أكد مستندات التصدير ومسؤوليات التسليم؛ التركيب نطاق منفصل ما لم يتم الاتفاق عليه.']],faqs:[['كيف أجد أرخص رخام بالجملة؟','قارن الاختيار والكمية القابلة للاستخدام وفاقد القص والتصنيع والتسليم. أقل سعر للوحدة لا يعني دائمًا أقل تكلفة للمشروع.'],['هل يمكن ترتيب توريد رخام منتظم؟','اسأل الشركات المستجيبة عن استمرار الدفعة والمخزون والطاقة وشروط إعادة الطلب. أكد التزامات الإنتاج والتسليم مباشرة.']]}
 },
 zh:{
  slabs:{title:'采购土耳其大理石板材：大板尺寸、厚度与供应商报价',intro:'想购买土耳其大理石大板？请明确品种、可用尺寸、厚度及表面处理，核对实际批次照片，再向独立企业询价。Marble Borsa 连接买家与供应商，不持有库存或销售板材。',sectionTitle:'准备大理石板材采购需求',steps:[['明确可用尺寸','提供项目尺寸、平方米数量与切割计划。大板总面积可能不同于实际可用面积。'],['核对实际批次','索取最新照片、大板编号、厚度及表面处理资料。需要连续纹理时，请同时查看相邻板材。'],['确认报价范围','确认按整板还是平方米计价，以及切割、包装、装货和运费是否包含。']],details:[['选择 2 厘米还是 3 厘米厚度','请与项目专业人员根据用途、支撑系统及加工要求确定厚度。比较相同厚度和表面处理，并询问公差、修补及背面处理情况。'],['阿菲永白色大理石与纹理选择','不同板材的色调和纹理可能变化。品种示意图不代表现货。要求查看报价批次照片、样品选项，并为对纹或拼花确认切割方向。']],faqs:[['土耳其大理石大板每平方米多少钱？','价格由供应商根据品种、选级、批次、厚度、表面处理和数量确定。请索取最新报价，明确运费、税费和加工范围。'],['可以只购买一块大理石大板吗？','最小起订量和交货选项由供应商确定。请在需求中说明板数或面积，并直接核实库存。']]},
  blocks:{title:'采购土耳其大理石荒料：矿山、选块与供应报价',intro:'为加工或贸易采购土耳其大理石荒料时，请明确块料尺寸、预计吨位与加工目标，并直接与独立矿山企业或供应商讨论验货和供货条件。',sectionTitle:'准备大理石荒料采购',steps:[['说明加工目标','提供品种、目标尺寸范围、预计数量和目的地。核对加工设备可接受的尺寸。'],['识别每一块荒料','索取块号、实测尺寸、重量信息及多面最新照片；根据需要安排适当验货。'],['商定装货和交付','书面确认计价单位、称重方法、装货责任与交货地点。']],details:[['在相同基础上比较荒料价格','每吨、每立方米和每块的价格基础不同。记录每份报价对应的块料。形状和可见裂纹可能影响加工出材率，应寻求专业检验，而不是仅凭单价估算。'],['通过照片选块的局限','外部照片无法展示全部内部特征。下单前商定可行的验货方式及差异处理条件。Marble Borsa 不保证块料质量或加工出材率。']],faqs:[['可以直接联系土耳其大理石矿山吗？','请浏览参与企业的矿山和生产商资料，直接核实实际生产、可用块料及销售资格。'],['大理石荒料询价应包括哪些资料？','包括石材名称、目标尺寸范围、预计吨位或块数、加工目的及目的地，并明确计价单位和验货要求。']]},
  wholesale:{title:'土耳其大理石批发采购：工程与持续供货询价',intro:'寻找土耳其大理石批发供应商？明确产品形式、总量、批次要求和交货计划，以相同规格与供货范围比较独立企业的回复。',sectionTitle:'准备大批量大理石询价',steps:[['提供数量和计划','说明总需求及每次交货数量。工程定尺产品请提供尺寸清单。'],['讨论批次一致性','询问如何在多次交货中保持色调和纹理选择，并书面确认样品批准与可接受变化。'],['比较供货总成本','在单价之外，评估加工、包装、装货与运输责任。']],details:[['最小起订量与生产能力','各供应商没有统一的最小起订量。说明平方米、吨或件数并确认换算。分别询问实际批次库存、生产能力及交期；企业展示不等于有现货。'],['分阶段工程交付与出口','提供尺寸、件数、表面及边缘加工资料。约定包装标识、发货阶段和损坏检查，并确认出口文件和交货责任。安装服务需另行约定。']],faqs:[['如何找到便宜的大理石批发货源？','综合比较选级、可用数量、切割损耗、加工和交付成本。最低单价不一定对应最低工程总成本。'],['可以安排长期大理石供货吗？','向回复企业询问批次延续、现货、产能和再次订购条件，并直接核实生产与交货承诺。']]}
 }
};
export function getBuyerLandingCopy(locale:GuideLocale,kind:BuyerLandingKind):SourcingCopy {
 if(locale==='tr')return buyerLandingPages[buyerLandingSlugs.tr[kind]];
 const copy=landingTranslations[locale][kind];
 if(locale==='en'&&kind==='slabs') {
  const extraDetails: [string,string][] = [
   ['Compare Turkish marble slab suppliers on the same specification','Ask each company to quote the same stone selection, thickness, surface finish, usable sizes and quantity. Confirm the company identity, production or trading role, current batch availability and whether the quotation covers packing, loading and transport.'],
   ['Wholesale marble slabs and export enquiries','For wholesale Turkish marble slabs, state the total square metres, slab count where known, destination country and port, and requested delivery schedule. Ask the supplier to confirm minimum order quantities, sample options, lead time and delivery terms; these vary by company and batch.'],
   ['Slab photos, dimensions and surface finish','Request full-face photographs of each offered slab or bundle, plus close-ups and slab identifiers. Confirm measured length and width, nominal thickness and tolerances, polished or honed finish, and any resin, mesh or repairs. Ask for usable dimensions before finalising your cutting plan.']
  ];
  const extraFaqs: [string,string][] = [
   ['How can I find a marble slab supplier in Turkey?','Browse the participating company directory and natural stone catalogue, then create a buyer account to submit your requirements. Check the responding company’s identity, slab specifications and current availability directly before ordering.'],
   ['Can I request 2 cm or 3 cm Turkish marble slabs?','State your required thickness, finish, quantity and usable dimensions in the enquiry. Each supplier confirms which options are available; a guide image or company listing is not confirmation of stock.'],
   ['Does Marble Borsa manufacture or export the slabs?','Marble Borsa is a B2B directory and quotation platform. Independent companies provide their own offers and agree production, payment, inspection and export arrangements directly with buyers.']
  ];
  return {...buyingContent.en,title:copy.title,seoTitle:'Turkish Marble Slabs — Find Suppliers in Turkey',description:'Find Turkish marble slab suppliers on Marble Borsa. Specify slab sizes, thickness, finish and quantity, and request quotes directly from independent companies.',intro:copy.intro,sectionTitle:copy.sectionTitle,steps:copy.steps.map(([heading,body])=>({heading,body})),details:[...copy.details,...extraDetails].map(([heading,text])=>({heading,paragraphs:[text]})),faqs:[...copy.faqs,...extraFaqs].map(([question,answer])=>({question,answer}))};
 }
 return {...buyingContent[locale],title:copy.title,description:copy.title + ({en:'. Specify your requirements and request direct quotations from independent suppliers on Marble Borsa.',ar:'. حدد احتياجاتك واطلب عروضًا مباشرة من الموردين المستقلين عبر Marble Borsa.',zh:'。明确规格、数量与交货地点，通过 Marble Borsa 向独立供应商直接询价。'})[locale],intro:copy.intro,sectionTitle:copy.sectionTitle,
  steps:copy.steps.map(([heading,body])=>({heading,body})),details:copy.details.map(([heading,text])=>({heading,paragraphs:[text]})),faqs:copy.faqs.map(([question,answer])=>({question,answer}))};
}

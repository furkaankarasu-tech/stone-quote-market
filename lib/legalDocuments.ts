import { dataController } from "./dataController";

export const legalVersion = "2026-10-06";

type Section = { heading: string; body: string };
type LegalDocument = { title: string; intro?: string; sections: Section[] };

export const legalDocuments: Record<"kvkk" | "gizlilik" | "kullanim-kosullari" | "cerez", LegalDocument> = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    intro: "Marble Borsa kapsamında kişisel verilerin işlenmesine ilişkin bilgilendirme aşağıda yer alır.",
    sections: [
      ...((dataController.unvan && dataController.adres) ? [{ heading: "Veri sorumlusu", body: `${dataController.unvan}. Tebligat adresi: ${dataController.adres}.` }] : []),
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
      { heading: "Paylaşım", body: "Onaylı ve aktif firmaların firma adı, şehir, faaliyet türü, logosu ve yayınladıkları katalog açıklamaları, görselleri, isteğe bağlı PDF ve video bağlantıları rehber görünürlüğü tercihi açılmışsa herkese açık olarak gösterilir. Logo ve katalog dosyaları herkese açık depolama alanındadır; firma doğrulama belgeleri özel alanda saklanır. Teknik hizmet sağlayıcılarla hizmet için gerekli ölçüde paylaşım yapılabilir." },
      { heading: "Saklama", body: "Veriler işleme amacı ve uygulanabilir yasal saklama süreleri boyunca tutulur." },
    ],
  },
  cerez: {
    title: "Çerez ve Tarayıcı Depolama Tercihleri",
    sections: [
      { heading: "Zorunlu depolama", body: "Oturumun korunması, dil seçimi ve çerez tercihleriniz için çerezler veya tarayıcı depolaması kullanılabilir. Bunlar hesap ve tercih işlevlerini sağlar." },
      { heading: "İsteğe bağlı ziyaret ölçümü", body: "Google Analytics ölçümü yapılandırılmışsa yalnızca analitik izni verdiğinizde yüklenir. Google'a ziyaret edilen herkese açık sayfanın adresi ve başlığı ile teknik ziyaret bilgileri aktarılabilir. Form içerikleri, şifreler, teklif tutarları ve doğrulama bağlantılarındaki parametreler ölçüm kodumuz tarafından gönderilmez." },
      { heading: "Tercihlerinizi değiştirme", body: "Her sayfadaki Çerez tercihleri düğmesinden analitik iznini kapatabilirsiniz. Ret tercihiniz de kaydedilir. Tercihinizin kaydedilmesi oturumunuzu kapatmaz." },
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
      { heading: "Firma hesapları", body: "Firma hesabı başvuruları yönetici incelemesinden geçer. Başvuru yapmak tek başına teklif verme veya satış yetkisi sağlamaz. Üretici/tedarikçi ve hizmet sağlayıcı firma hesaplarında ücretli üyelik uygulanır. Güncel bedel ve diğer koşullar herhangi bir ödeme yükümlülüğü doğmadan önce başvuru sahibine açık ve yazılı olarak bildirilir ve onayı alınır. Başvurunun onaylanması, belirtilen koşulların yerine getirilmesi ve gerekli doğrulamalar sonrasında hesap yetkileri etkinleştirilir." },
    ],
  },
};

export const legalLinks = [
  { href: "/tr/yasal/cerez", label: "Çerez Politikası" },
  { href: "/tr/yasal/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/tr/yasal/gizlilik", label: "Gizlilik Sözleşmesi" },
  { href: "/tr/yasal/kullanim-kosullari", label: "Kullanım Koşulları" },
] as const;

export type LegalLocale = "tr" | "en" | "zh" | "ar";
export const legalUi = {
  tr: {home:"Ana Sayfa", breadcrumb:"İçerik yolu", heading:"HUKUKİ METİNLER", updated:"Son güncelleme", close:"Kapat"},
  en: {home:"Home", breadcrumb:"Breadcrumb", heading:"LEGAL DOCUMENTS", updated:"Last updated", close:"Close"},
  zh: {home:"首页", breadcrumb:"导航路径", heading:"法律文件", updated:"最后更新", close:"关闭"},
  ar: {home:"الرئيسية", breadcrumb:"مسار التصفح", heading:"الوثائق القانونية", updated:"آخر تحديث", close:"إغلاق"}
};
const translations: Record<Exclude<LegalLocale,"tr">, Record<keyof typeof legalDocuments, LegalDocument>> = {
 en: {
  kvkk:{title:"KVKK Personal Data Notice",intro:"Information about personal data processing on Marble Borsa under Türkiye's Personal Data Protection Law (KVKK).",sections:[
   {heading:"Data processed",body:"Identity and contact details, membership and company data, transaction security data, product/catalogue information, quote requests and user-provided content may be processed."},
   {heading:"Purposes",body:"Creating and managing memberships, B2B matching, directing requests to relevant companies, support, security, dispute management and compliance with legal obligations."},
   {heading:"Legal grounds",body:"Depending on the activity: entering into or performing a contract, legal obligations, establishing, exercising or protecting a right, legitimate interests and explicit consent only where necessary."},
   {heading:"Transfers",body:"Data may be shared, to the extent necessary, with hosting, storage, email and security providers; relevant users in request/quote workflows; and legally authorised authorities."},
   {heading:"Collection methods",body:"Registration and contact forms, account panels, file uploads, quote transactions and technical logs, through automated or partly automated methods."},
   {heading:"Your rights",body:`Rights under Article 11 of KVKK may be exercised by applying to the data controller. Send applications to ${dataController.kvkkBasvuruEmail}.`}
  ]},
  gizlilik:{title:"Privacy Policy",sections:[
   {heading:"Information collected",body:"Names, email addresses, telephone numbers, company names, country/city, membership and company profiles, product/catalogue information, quote requests, uploaded media/documents and technical/security logs may be processed."},
   {heading:"Purposes",body:"Account and company management, buyer-supplier matching, quote workflows, security, support, preventing misuse and compliance with legal obligations."},
   {heading:"Sharing",body:"When directory visibility is enabled, approved active companies' names, cities, activities, logos and published catalogue descriptions, images, optional PDFs and video links are publicly displayed. Logo and catalogue files use public storage; company verification documents use private storage. Technical providers may receive data necessary to deliver the service."},
   {heading:"Retention",body:"Data is retained for the processing purpose and applicable statutory retention periods."}
  ]},
  cerez:{title:"Cookies and Browser Storage",sections:[
   {heading:"Necessary storage",body:"Cookies or browser storage may maintain your session, language selection and cookie preferences. These support account and preference functions."},
   {heading:"Optional analytics",body:"If configured, Google Analytics loads only with your analytics consent. Public page URLs and titles and technical visit information may be transferred to Google. Our analytics code does not send form contents, passwords, quote amounts or parameters in verification links."},
   {heading:"Changing preferences",body:"Use Cookie preferences on any page to disable analytics consent. Rejection is also saved. Saving your preference does not sign you out."}
  ]},
  "kullanim-kosullari":{title:"Terms of Use",intro:"Marble Borsa is a B2B discovery and quote-request platform connecting buyers, producers and service providers in the natural stone sector.",sections:[
   {heading:"Platform role",body:"Marble Borsa is not a seller, buyer, payment institution, carrier, shipping agent, customs broker or party to contracts between users. Sales, payments, shipping, insurance, customs and other commercial transactions take place directly between users."},
   {heading:"Accounts and content",body:"Users are responsible for the accuracy and lawfulness of company, product, stock, capacity, image, video, test-result and document information they provide."},
   {heading:"Quotes",body:"Prices, quality, lead times, delivery and technical information are provided by the relevant user; the platform does not guarantee their accuracy."},
   {heading:"Prohibited use",body:"Fake companies, fake requests/quotes, misleading product information, unauthorised use of documents or images and unlawful content are prohibited."},
   {heading:"Company accounts",body:"Company applications undergo administrator review. Applying alone does not grant permission to quote or sell. Producer/supplier and service-provider accounts require paid membership. Current fees and other conditions are disclosed clearly in writing and accepted by the applicant before any payment obligation arises. Account permissions activate after approval, fulfilment of the stated conditions and required verification."}
  ]}
 },
 zh: {
  kvkk:{title:"KVKK个人数据告知",intro:"以下说明Marble Borsa依据土耳其个人数据保护法（KVKK）处理个人数据的情况。",sections:[
   {heading:"处理的数据",body:"可能处理身份及联系方式、会员及企业数据、交易安全数据、产品及目录信息、询价需求以及用户提供的内容。"},
   {heading:"处理目的",body:"创建和管理会员账户、企业间匹配、向相关企业转交需求、提供支持、保障安全、处理争议以及履行法律义务。"},
   {heading:"法律依据",body:"根据具体活动，包括订立或履行合同、法律义务、确立或行使或保护权利、合法利益，以及仅在必要时取得明确同意。"},
   {heading:"数据共享",body:"在提供服务所必需的范围内，可向托管、存储、邮件和安全服务商，询价及报价流程中的相关用户，以及依法获授权的机构传输数据。"},
   {heading:"收集方式",body:"通过注册和联系表单、账户面板、文件上传、报价操作及技术日志，以自动或部分自动方式收集。"},
   {heading:"您的权利",body:`可向数据控制者申请行使KVKK第11条规定的权利。申请邮箱：${dataController.kvkkBasvuruEmail}。`}
  ]},
  gizlilik:{title:"隐私政策",sections:[
   {heading:"收集的信息",body:"可能处理姓名、邮箱、电话、企业名称、国家和城市、会员和企业资料、产品及目录信息、询价需求、上传的媒体和文件以及技术和安全日志。"},
   {heading:"用途",body:"管理账户和企业、匹配买家与供应商、处理报价、保障安全、提供支持、防止滥用以及履行法律义务。"},
   {heading:"信息共享",body:"开启企业名录展示后，已审核且会员有效的企业名称、城市、业务类型、标志，以及已发布的目录说明、图片、可选PDF和视频链接将公开展示。标志和目录文件存储于公开空间；企业验证文件存储于私有空间。可向技术服务商共享提供服务所必需的信息。"},
   {heading:"保存期限",body:"数据按处理目的和适用的法定保存期限保存。"}
  ]},
  cerez:{title:"Cookie和浏览器存储",sections:[
   {heading:"必要存储",body:"可能使用Cookie或浏览器存储维持登录、语言选择及Cookie偏好，以支持账户和偏好功能。"},
   {heading:"可选访问分析",body:"若已配置Google Analytics，仅在您同意分析后加载。公开页面的地址、标题及技术访问信息可能传输至Google。我们的分析代码不发送表单内容、密码、报价金额或验证链接中的参数。"},
   {heading:"更改偏好",body:"可通过任何页面上的Cookie偏好按钮撤回分析同意。拒绝选择也会保存。保存偏好不会退出登录。"}
  ]},
  "kullanim-kosullari":{title:"使用条款",intro:"Marble Borsa是连接天然石材行业买家、生产商和服务商的企业间发现与询价平台。",sections:[
   {heading:"平台角色",body:"Marble Borsa不是卖家、买家、支付机构、承运人、船务代理、报关代理或用户之间合同的一方。销售、支付、运输、保险、海关及其他商业交易由用户直接进行。"},
   {heading:"账户与内容",body:"用户对其提供的企业、产品、库存、产能、图片、视频、测试结果及文件信息的真实性与合法性负责。"},
   {heading:"报价",body:"价格、质量、交期、交付及技术信息由相关用户提供；平台不保证其准确性。"},
   {heading:"禁止行为",body:"禁止虚假企业、虚假需求或报价、误导性产品信息、未经授权使用文件或图片及违法内容。"},
   {heading:"企业账户",body:"企业申请须经管理员审核。提交申请本身不赋予报价或销售权限。生产商、供应商和服务商账户实行付费会员制。在产生任何付款义务前，当前费用和其他条件将明确以书面形式告知申请人并取得同意。申请获批、所述条件满足且必要验证完成后，账户权限才会启用。"}
  ]}
 },
 ar: {
  kvkk:{title:"إشعار حماية البيانات الشخصية KVKK",intro:"توضح المعلومات التالية معالجة البيانات الشخصية في Marble Borsa وفق قانون حماية البيانات الشخصية التركي KVKK.",sections:[
   {heading:"البيانات المعالجة",body:"قد تشمل بيانات الهوية والاتصال والعضوية والشركة وأمن المعاملات والمنتجات والكتالوجات وطلبات الأسعار والمحتوى الذي يقدمه المستخدم."},
   {heading:"الأغراض",body:"إنشاء العضوية وإدارتها، وربط الشركات، وتوجيه الطلبات إلى الشركات المعنية، والدعم والأمن وإدارة النزاعات والوفاء بالالتزامات القانونية."},
   {heading:"الأسس القانونية",body:"بحسب النشاط: إبرام العقد أو تنفيذه، والالتزامات القانونية، وإنشاء حق أو ممارسته أو حمايته، والمصلحة المشروعة، والموافقة الصريحة فقط عند الحاجة."},
   {heading:"نقل البيانات",body:"يجوز نقل البيانات بالقدر اللازم إلى مزودي الاستضافة والتخزين والبريد والأمن، وإلى المستخدمين المعنيين بطلبات الأسعار والعروض، والجهات المخولة قانونًا."},
   {heading:"طرق الجمع",body:"عبر نماذج التسجيل والاتصال ولوحة الحساب ورفع الملفات ومعاملات العروض والسجلات التقنية، بوسائل آلية أو آلية جزئيًا."},
   {heading:"حقوقك",body:`يمكن ممارسة حقوق المادة 11 من KVKK بطلب إلى مسؤول البيانات. أرسل الطلب إلى ${dataController.kvkkBasvuruEmail}.`}
  ]},
  gizlilik:{title:"سياسة الخصوصية",sections:[
   {heading:"المعلومات المجموعة",body:"قد تُعالج الأسماء والبريد والهاتف واسم الشركة والدولة والمدينة وبيانات العضوية والشركة والمنتجات والكتالوجات وطلبات الأسعار والوسائط والوثائق المرفوعة والسجلات التقنية والأمنية."},
   {heading:"الأغراض",body:"إدارة الحسابات والشركات وربط المشترين بالموردين وإجراءات العروض والأمن والدعم ومنع إساءة الاستخدام والالتزامات القانونية."},
   {heading:"المشاركة",body:"عند تفعيل الظهور في الدليل، تُعرض للعامة أسماء الشركات المعتمدة ذات العضوية السارية ومدنها وأنشطتها وشعاراتها وأوصاف الكتالوجات المنشورة وصورها وملفات PDF الاختيارية وروابط الفيديو. ملفات الشعارات والكتالوجات في تخزين عام، ووثائق التحقق من الشركات في تخزين خاص. يمكن مشاركة ما يلزم لتقديم الخدمة مع المزودين التقنيين."},
   {heading:"الاحتفاظ",body:"تُحفظ البيانات طوال مدة الغرض من المعالجة وفترات الاحتفاظ القانونية المنطبقة."}
  ]},
  cerez:{title:"ملفات الارتباط وتخزين المتصفح",sections:[
   {heading:"التخزين الضروري",body:"قد تُستخدم ملفات الارتباط أو تخزين المتصفح للحفاظ على الجلسة واختيار اللغة وتفضيلات ملفات الارتباط. وهي تدعم وظائف الحساب والتفضيلات."},
   {heading:"التحليلات الاختيارية",body:"إذا تم إعداد Google Analytics، لا يُحمّل إلا بعد موافقتك على التحليلات. قد تُنقل إلى Google عناوين الصفحات العامة وعناوينها النصية والمعلومات التقنية للزيارة. لا يرسل كود التحليلات محتوى النماذج أو كلمات المرور أو مبالغ العروض أو معاملات روابط التحقق."},
   {heading:"تغيير التفضيلات",body:"يمكن إلغاء موافقة التحليلات عبر زر تفضيلات ملفات الارتباط في كل صفحة. يُحفظ الرفض أيضًا. حفظ التفضيل لا يسجّل خروجك."}
  ]},
  "kullanim-kosullari":{title:"شروط الاستخدام",intro:"Marble Borsa منصة اكتشاف وطلبات أسعار بين الشركات تجمع المشترين والمنتجين ومقدمي الخدمات في قطاع الحجر الطبيعي.",sections:[
   {heading:"دور المنصة",body:"Marble Borsa ليست بائعًا أو مشتريًا أو مؤسسة دفع أو ناقلًا أو وكيل شحن أو مخلصًا جمركيًا أو طرفًا في عقود المستخدمين. تتم المبيعات والدفع والشحن والتأمين والجمارك والمعاملات التجارية مباشرة بين المستخدمين."},
   {heading:"الحساب والمحتوى",body:"المستخدم مسؤول عن صحة ومشروعية معلومات الشركة والمنتجات والمخزون والطاقة الإنتاجية والصور والفيديو ونتائج الاختبارات والوثائق التي يقدمها."},
   {heading:"العروض",body:"يقدم المستخدم المعني السعر والجودة والمهلة والتسليم والمعلومات التقنية؛ ولا تضمن المنصة صحتها."},
   {heading:"الاستخدام المحظور",body:"تُحظر الشركات والطلبات والعروض الوهمية والمعلومات المضللة والاستخدام غير المصرح للوثائق والصور والمحتوى غير القانوني."},
   {heading:"حسابات الشركات",body:"تخضع الطلبات لمراجعة المسؤول. التقديم وحده لا يمنح صلاحية تقديم عروض أو البيع. عضوية المنتجين والموردين ومقدمي الخدمات مدفوعة. تُوضح الرسوم والشروط الحالية كتابةً ويوافق عليها المتقدم قبل نشوء أي التزام بالدفع. تُفعّل الصلاحيات بعد الموافقة واستيفاء الشروط والتحقق المطلوب."}
  ]}
 }
};
export function getLegalDocuments(locale: string): typeof legalDocuments {
 if(locale === "tr") return legalDocuments;
 if(!(locale in translations)) return legalDocuments;
 const result=translations[locale as Exclude<LegalLocale,"tr">];
 if(!dataController.unvan || !dataController.adres) return result;
 const label={en:"Data controller",zh:"数据控制者",ar:"مسؤول البيانات"}[locale as Exclude<LegalLocale,"tr">];
 return {...result,kvkk:{...result.kvkk,sections:[{heading:label,body:`${dataController.unvan}. ${dataController.adres}.`},...result.kvkk.sections]}};
}
export function getLegalLinks(locale:string) {
 const docs=getLegalDocuments(locale);
 return legalLinks.map(link=>{const key=link.href.split("/").at(-1) as keyof typeof legalDocuments;return {href:`/${locale}/yasal/${key}`,label:docs[key].title}});
}

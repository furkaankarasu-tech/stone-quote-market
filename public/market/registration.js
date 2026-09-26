const regCopy={
tr:{signup:"Üye Ol",choose:"ÖNCE HESAP TÜRÜNÜ SEÇİN",title:"Marble Borsa üyeliği",select:"Devam etmek için hesap türünü seçin.",buyer:"Alıcı",buyerHint:"Taş ve ürün talebi oluşturur",supplier:"Üretici / Tedarikçi",supplierHint:"Alım taleplerini görür ve teklif verir",service:"Hizmet Sağlayıcı",serviceHint:"Lojistik, gümrük ve diğer hizmetler",account:"HESAP BİLGİLERİ",company:"FİRMA BİLGİLERİ",fullName:"Ad soyad",email:"E-posta",password:"Şifre",confirm:"Şifre tekrar",legalType:"Şirket türü",selectLegal:"Seçiniz",limited:"Limited şirket",corporation:"Anonim şirket",sole:"Şahıs işletmesi",companyName:"Ticari unvan",activity:"Faaliyet alanı",quarry:"Ocak",factory:"Fabrika",trader:"Tedarik / ticaret",logistics:"Lojistik",customs:"Gümrük",quality:"Kalite / test",other:"Diğer hizmet",country:"Ülke",city:"Şehir",create:"Hesap oluştur",existing:"Zaten üye misiniz? Giriş yapın",realLogin:"Gerçek hesap girişi",demoLogin:"Demo hesabıyla giriş",back:"Üyeliğe dön",privacy:"Hesap açılışı için kimlik ve iletişim bilgileriniz; firma başvurusu için vergi, adres, yetkili kişi ve yüklediğiniz doğrulama belgeleri işlenir. Firma doğrulaması ayrıca yapılır. Katalog ilanları örnektir; gerçek talepler ve teklifler hesabınızda saklanır.",ack:"Bu bilgilendirmeyi okudum.",mismatch:"Şifreler eşleşmiyor.",short:"Şifre en az 10 karakter olmalı.",missing:"Zorunlu alanları doldurun.",checking:"Kaydediliyor…",confirmEmail:"Hesap oluşturma isteği alındı. E-postanızdaki doğrulama bağlantısını açın; sonra bu sayfadan giriş yapın.",signed:"Hesabınıza giriş yapıldı.",signout:"Çıkış yap",pending:"Firma bilgileri henüz doğrulanmadı.",network:"Üyelik sunucusuna ulaşılamadı. Bağlantınızı veya proje ayarlarını kontrol edin.",failed:"İşlem tamamlanamadı. Bilgileri kontrol edip tekrar deneyin.",badLogin:"E-posta veya şifre hatalı.",emailNotConfirmed:"E-posta henüz onaylanmadı. Gelen kutunuzu kontrol edin veya onay bağlantısını tekrar gönderin.",resendConfirmation:"Onay e-postasını tekrar gönder",confirmationSent:"Onay bağlantısı gönderildi. E-postanızı kontrol edin.",confirmRequiredConfig:"E-posta onayı sistemde etkin değil. Hesap erişimi kapalı; yönetici Supabase ayarını açmalı.",emailInvalid:"Geçerli bir e-posta adresi girin.",notConfigured:"Üyelik bağlantısı hazır değil."},
en:{signup:"Join",choose:"CHOOSE ACCOUNT TYPE FIRST",title:"Marble Borsa membership",select:"Select an account type to continue.",buyer:"Buyer",buyerHint:"Creates stone and product requests",supplier:"Producer / supplier",supplierHint:"Reviews purchase requests and sends offers",service:"Service provider",serviceHint:"Logistics, customs and services",account:"ACCOUNT DETAILS",company:"COMPANY DETAILS",fullName:"Full name",email:"Email",password:"Password",confirm:"Confirm password",legalType:"Legal type",selectLegal:"Select",limited:"Limited company",corporation:"Corporation",sole:"Sole proprietor",companyName:"Legal company name",activity:"Business activity",quarry:"Quarry",factory:"Factory",trader:"Supplier / trader",logistics:"Logistics",customs:"Customs",quality:"Quality / testing",other:"Other service",country:"Country",city:"City",create:"Create account",existing:"Already a member? Sign in",realLogin:"Member sign in",demoLogin:"Use a demo account",back:"Back to sign up",privacy:"Your name and contact details are used for the account; company applications also collect tax, address, authorized contact and verification documents. Company verification is separate. Catalogue listings are samples; real requests and offers are stored under your account.",ack:"I have read this information.",mismatch:"Passwords do not match.",short:"Use at least 10 characters.",missing:"Complete the required fields.",checking:"Creating account…",confirmEmail:"Account request received. Open the confirmation link in your email, then sign in here.",signed:"Signed in.",signout:"Sign out",pending:"Company details are not yet verified.",network:"Could not reach the account server. Check your connection or project settings.",failed:"Could not complete the request. Check the details and try again.",badLogin:"Incorrect email or password.",emailNotConfirmed:"Email not confirmed yet. Check your inbox or resend the confirmation link.",resendConfirmation:"Resend confirmation email",confirmationSent:"Confirmation link sent. Check your email.",confirmRequiredConfig:"Email confirmation is not enabled. Account access is blocked until the administrator enables it in Supabase.",emailInvalid:"Enter a valid email address.",notConfigured:"Account connection is unavailable."},
zh:{signup:"注册",choose:"请先选择账户类型",title:"Marble Borsa 会员注册",select:"选择账户类型后填写资料。",buyer:"买家",buyerHint:"发布石材与产品采购需求",supplier:"生产商 / 供应商",supplierHint:"查看采购需求并提交报价",service:"服务企业",serviceHint:"物流、报关等服务",account:"账户信息",company:"企业信息",fullName:"姓名",email:"邮箱",password:"密码",confirm:"确认密码",legalType:"企业类型",selectLegal:"请选择",limited:"有限责任公司",corporation:"股份公司",sole:"个体经营",companyName:"企业法定名称",activity:"经营范围",quarry:"矿场",factory:"工厂",trader:"供应与贸易",logistics:"物流",customs:"报关",quality:"质检与检测",other:"其他服务",country:"国家",city:"城市",create:"创建账户",existing:"已有账户？登录",realLogin:"会员登录",demoLogin:"使用演示账户",back:"返回注册",privacy:"账户使用姓名与联系方式；企业申请还会收集税务、地址、负责人及证明文件。企业认证另行进行。目录信息为示例；实际询价和报价保存在账户中。",ack:"我已阅读以上说明。",mismatch:"两次密码不一致。",short:"密码至少10位。",missing:"请填写必填项。",checking:"正在创建…",confirmEmail:"账户申请已收到。请点击邮件中的确认链接，然后在此登录。",signed:"已登录。",signout:"退出登录",pending:"企业信息尚未认证。",network:"无法连接账户服务器，请检查网络或项目设置。",failed:"操作未完成，请检查信息后重试。",badLogin:"邮箱或密码不正确。",emailNotConfirmed:"邮箱尚未验证。请查看邮件或重新发送验证链接。",resendConfirmation:"重新发送验证邮件",confirmationSent:"验证链接已发送，请检查邮箱。",confirmRequiredConfig:"邮箱验证尚未启用。管理员需在 Supabase 中启用后才能访问账户。",emailInvalid:"请输入有效邮箱地址。",notConfigured:"账户连接不可用。"},
ar:{signup:"إنشاء حساب",choose:"اختر نوع الحساب أولًا",title:"عضوية Marble Borsa",select:"اختر نوع الحساب لمتابعة التسجيل.",buyer:"مشتري",buyerHint:"ينشر طلبات الحجر والمنتجات",supplier:"منتج / مورد",supplierHint:"يطلع على طلبات الشراء ويقدم العروض",service:"شركة خدمات",serviceHint:"النقل والجمارك والخدمات",account:"بيانات الحساب",company:"بيانات الشركة",fullName:"الاسم الكامل",email:"البريد الإلكتروني",password:"كلمة المرور",confirm:"تأكيد كلمة المرور",legalType:"نوع الشركة",selectLegal:"اختر",limited:"شركة محدودة",corporation:"شركة مساهمة",sole:"مؤسسة فردية",companyName:"الاسم القانوني للشركة",activity:"مجال النشاط",quarry:"محجر",factory:"مصنع",trader:"توريد وتجارة",logistics:"خدمات لوجستية",customs:"جمارك",quality:"جودة واختبار",other:"خدمة أخرى",country:"الدولة",city:"المدينة",create:"إنشاء الحساب",existing:"هل لديك حساب؟ سجل الدخول",realLogin:"دخول الأعضاء",demoLogin:"استخدم حساب العرض",back:"العودة إلى التسجيل",privacy:"تُستخدم بيانات الاسم والاتصال لإنشاء الحساب؛ ويجمع طلب الشركة أيضًا بيانات الضرائب والعنوان والمسؤول ووثائق الإثبات. التحقق من الشركة إجراء منفصل. قوائم الدليل أمثلة؛ تُحفظ الطلبات والعروض الفعلية في الحساب.",ack:"قرأت هذه المعلومات.",mismatch:"كلمتا المرور غير متطابقتين.",short:"استخدم 10 أحرف على الأقل.",missing:"أكمل الحقول المطلوبة.",checking:"جارٍ الإنشاء…",confirmEmail:"تم استلام طلب الحساب. افتح رابط التأكيد في بريدك ثم سجل الدخول هنا.",signed:"تم تسجيل الدخول.",signout:"تسجيل الخروج",pending:"لم يتم التحقق من بيانات الشركة بعد.",network:"تعذر الوصول إلى خادم الحسابات. تحقق من الاتصال أو إعدادات المشروع.",failed:"تعذر إكمال العملية. راجع المعلومات وحاول مجددًا.",badLogin:"البريد أو كلمة المرور غير صحيحة.",emailNotConfirmed:"لم يتم تأكيد البريد بعد. تحقق من بريدك أو أعد إرسال رابط التأكيد.",resendConfirmation:"إعادة إرسال رسالة التأكيد",confirmationSent:"أُرسل رابط التأكيد. تحقق من بريدك.",confirmRequiredConfig:"تأكيد البريد غير مفعل. لا يمكن الوصول للحساب حتى يفعله المسؤول في Supabase.",emailInvalid:"أدخل بريداً إلكترونياً صالحاً.",notConfigured:"الاتصال بالحسابات غير متاح."}
};
const membershipCopy={
  tr:{free:"Ücretsiz",vat:"KDV",annual:"/ yıl",membershipTitle:"Yıllık firma üyeliği",membershipAwait:"Ödeme bu siteden alınmaz. Başvurunuz ve banka yoluyla yaptığınız ödeme doğrulandıktan sonra 12 aylık üyeliğiniz yönetici tarafından etkinleştirilir.",supplierAccess:"Alım taleplerini görme ve teklif verme hakkı üyelik onaylandıktan sonra açılır.",contact:"Detaylı bilgi için",submitApplication:"Üyelik başvurusu gönder",applicationReceived:"Başvurunuz alındı. E-postanızı doğrulayın. Firma ve ödeme kontrolü tamamlanana kadar üyeliğiniz onay bekleyecek.",applicationPending:"Başvurunuz firma ve ödeme onayı bekliyor. Satış yetkiniz henüz aktif değil.",pendingPayment:"Firma ve ödeme onayı bekleniyor",termsName:"Kullanım Koşulları’nı",privacyName:"Gizlilik Sözleşmesi’ni",kvkkName:"KVKK Aydınlatma Metni’ni",readAndAccept:"okudum ve kabul ediyorum.",readOnly:"okudum.",requiredLegal:"Kullanım Koşulları, Gizlilik Sözleşmesi ve KVKK metni için ayrı kutuları işaretleyin."},
  en:{free:"Free",vat:"VAT",annual:"/ year",membershipTitle:"Annual company membership",membershipAwait:"Payment is not collected on this site. Your 12-month membership starts after we verify the company and the bank transfer.",supplierAccess:"Access to purchase requests and quoting starts after membership approval.",contact:"For details, contact",submitApplication:"Submit membership application",applicationReceived:"Application received. Confirm your email. Your company and payment will be reviewed before your membership becomes active.",applicationPending:"Your company and payment are awaiting review. Selling access is not active.",pendingPayment:"Company and payment approval pending",termsName:"Terms of Use",privacyName:"Privacy Policy",kvkkName:"KVKK Privacy Notice",readAndAccept:"read and accepted.",readOnly:"read.",requiredLegal:"Check each of the three legal notices separately."},
  zh:{free:"免费",vat:"增值税",annual:"/ 年",membershipTitle:"年度企业会员",membershipAwait:"本站不收取在线款项。企业资料及银行转账经核实后，管理员将开通12个月会员资格。",supplierAccess:"会员审核通过后，才能查看采购需求并提交报价。",contact:"详情请联系",submitApplication:"提交会员申请",applicationReceived:"申请已收到。请验证邮箱。企业资料及付款经审核后，会员资格才会生效。",applicationPending:"企业资料和付款待审核，销售权限尚未开通。",pendingPayment:"企业与付款待审核",termsName:"使用条款",privacyName:"隐私协议",kvkkName:"KVKK隐私告知",readAndAccept:"已阅读并同意。",readOnly:"已阅读。",requiredLegal:"请分别勾选三份法律文件。"},
  ar:{free:"مجاني",vat:"ضريبة القيمة المضافة",annual:"/ سنة",membershipTitle:"عضوية الشركة السنوية",membershipAwait:"لا يتم تحصيل الدفع على الموقع. تبدأ عضويتك لمدة 12 شهرًا بعد التحقق من الشركة والتحويل البنكي وموافقة الإدارة.",supplierAccess:"يمكن مشاهدة طلبات الشراء وتقديم العروض بعد الموافقة على العضوية.",contact:"للتفاصيل تواصل معنا",submitApplication:"إرسال طلب العضوية",applicationReceived:"تم استلام الطلب. أكد بريدك الإلكتروني؛ ستراجع الشركة والدفع قبل تفعيل العضوية.",applicationPending:"طلبك بانتظار التحقق من الشركة والدفع. صلاحية البيع غير مفعلة.",pendingPayment:"مراجعة الشركة والدفع معلقة",termsName:"شروط الاستخدام",privacyName:"سياسة الخصوصية",kvkkName:"إشعار KVKK للخصوصية",readAndAccept:"قرأتها وأوافق عليها.",readOnly:"قرأته.",requiredLegal:"حدد كلًا من الوثائق القانونية الثلاث بشكل منفصل."}
};
const corporateCopy={
  tr:{intro:"Firma hesabı için kurumsal ve yetkili kişi bilgilerini doldurun.",companyNote:"Firma hesabı açmak için kurumsal bilgiler zorunludur.",foreignNote:"Türkiye dışındaki firmalarda vergi ve sicil alanlarını ülkenizdeki eşdeğer resmi şirket bilgileriyle doldurabilirsiniz.",legalType:"Şirket hukuki türü",activity:"Faaliyet türü",taxNo:"Vergi numarası",taxOffice:"Vergi dairesi",mersis:"MERSİS No",registry:"Ticaret sicil no",address:"Firma adresi",person:"YETKİLİ KİŞİ",personNote:"Firma adına hesabı yönetecek kişi.",authorizedName:"Ad soyad",authorizedTitle:"Görevi / unvanı",corporateEmail:"Kurumsal e-posta",phone:"Telefon",website:"Web sitesi",verification:"FİRMA DOĞRULAMA",verificationNote:"Başvurudan sonra belgeler kontrol edilir; doğrulama rozeti inceleme tamamlandıktan sonra verilebilir.",document:"Firma doğrulama belgesi",documentHint:"Vergi levhası, faaliyet belgesi, oda kayıt belgesi veya eşdeğer resmi belge. PDF, JPG, PNG; en fazla 10 MB.",additional:"Ek kurumsal belge",additionalHint:"Limited ve anonim şirketler için ticaret sicil gazetesi veya faaliyet belgesi eklenebilir.",pending:"Başvuru durumu: İnceleme bekliyor",pendingHint:"Belge ve ödeme kontrolü tamamlanmadan firma doğrulanmış olarak gösterilmez.",marketing:"Kampanya ve sektör duyuruları için elektronik ileti almak istiyorum. İsteğe bağlıdır.",fileInvalid:"PDF, JPG veya PNG biçiminde, en fazla 10 MB dosya seçin.",fileRequired:"Firma doğrulama belgesi seçin.",fileAwait:"Belgeniz bu adımda yüklenmedi. E-postanızı doğrulayıp giriş yaptıktan sonra belgeyi yeniden seçerek yükleyin.",uploadFailed:"Hesabınız açıldı ancak belge yüklenemedi. Bu formdan yeniden deneyin veya giriş yaptıktan sonra hesabınızdan yükleyin. Depolama ayarı eksik olabilir.",uploadRetry:"Belge yüklemeyi yeniden dene",uploadNow:"Belgeyi yükle",uploadSuccess:"Belge yüklendi; firma incelemesi ve ödeme onayı bekleniyor.",documentMissing:"Firma doğrulama belgesi henüz yüklenmedi.",documentUploaded:"Doğrulama belgesi yüklendi; inceleme ve ödeme onayı bekleniyor.",uploadStatusError:"Belge durumu okunamadı. Yeniden yüklemeden önce destek adresine yazabilirsiniz.",chooseFile:"Belgenizi seçin",chooseAdditional:"İsteğe bağlı ek belge",selectOption:"Seçiniz",legalTypes:{sole:"Şahıs işletmesi",ltd:"Limited şirket",as:"Anonim şirket",coop:"Kooperatif",partnership:"Adi ortaklık / diğer ortaklık",foreign:"Yabancı şirket",other:"Diğer"},activities:{quarry:"Mermer ocağı",factory:"Mermer fabrikası",quarryFactory:"Ocak + fabrika",trader:"İhracatçı / tedarikçi",machine:"Makine üreticisi",supplies:"Soket / testere / sarf tedarikçisi",logistics:"Lojistik / forwarder",shipping:"Gemi acentesi",fumigation:"Fumigasyon / konteyner ilaçlama",customs:"Gümrük müşavirliği",quality:"Ekspertiz / kalite kontrol",other:"Diğer sektör hizmeti"}},
  en:{intro:"Enter company and authorized contact details.",companyNote:"Company details are required for business accounts.",foreignNote:"Companies outside Türkiye may provide equivalent local tax and registry details.",legalType:"Legal entity type",activity:"Business activity",taxNo:"Tax identification number",taxOffice:"Tax office",mersis:"MERSIS number",registry:"Trade registry number",address:"Company address",person:"AUTHORIZED CONTACT",personNote:"Person responsible for the company account.",authorizedName:"Full name",authorizedTitle:"Role / title",corporateEmail:"Business email",phone:"Phone",website:"Website",verification:"COMPANY VERIFICATION",verificationNote:"Documents are reviewed after application; a verified badge requires completed review.",document:"Company verification document",documentHint:"Tax certificate, activity certificate, chamber record or equivalent. PDF, JPG, PNG; up to 10 MB.",additional:"Additional company document",additionalHint:"Limited and joint stock companies may add a registry or activity certificate.",pending:"Application status: Pending review",pendingHint:"The company is not marked verified before document and payment checks.",marketing:"I want to receive campaign and industry updates. Optional.",fileInvalid:"Choose a PDF, JPG or PNG file up to 10 MB.",fileRequired:"Choose a company verification document.",fileAwait:"The document has not been uploaded yet. Confirm your email, sign in and select it again to upload.",uploadFailed:"Your account was created, but the document upload failed. Retry here or upload from your account after signing in. Storage setup may be missing.",uploadRetry:"Retry document upload",uploadNow:"Upload document",uploadSuccess:"Document uploaded; company review and payment approval remain pending.",documentMissing:"No company verification document has been uploaded.",documentUploaded:"Document uploaded; company review and payment approval remain pending.",uploadStatusError:"Could not check document status. Contact support before uploading a duplicate.",chooseFile:"Select your document",chooseAdditional:"Optional extra document",selectOption:"Select",legalTypes:{sole:"Sole proprietor",ltd:"Limited company",as:"Joint stock company",coop:"Cooperative",partnership:"Partnership",foreign:"Foreign company",other:"Other"},activities:{quarry:"Marble quarry",factory:"Marble factory",quarryFactory:"Quarry + factory",trader:"Exporter / supplier",machine:"Machinery manufacturer",supplies:"Saw / cutting supplies",logistics:"Logistics / forwarding",shipping:"Shipping agency",fumigation:"Fumigation / container treatment",customs:"Customs brokerage",quality:"Inspection / quality control",other:"Other industry service"}},
  zh:{intro:"填写企业及负责人信息。",companyNote:"企业账户需填写完整企业资料。",foreignNote:"土耳其以外的企业可填写本国对应的税务与登记信息。",legalType:"企业法律类型",activity:"经营类别",taxNo:"税务识别号",taxOffice:"税务机关",mersis:"MERSIS 编号",registry:"商业登记号",address:"企业地址",person:"负责人",personNote:"管理企业账户的人员。",authorizedName:"姓名",authorizedTitle:"职务",corporateEmail:"企业邮箱",phone:"联系电话",website:"网站",verification:"企业认证",verificationNote:"申请后审核文件，认证标志需审核通过后才可使用。",document:"企业证明文件",documentHint:"税务证明、经营证明、商会登记或同等文件。PDF、JPG、PNG，不超过 10 MB。",additional:"补充企业文件",additionalHint:"有限责任或股份公司可补充商业登记或经营证明。",pending:"申请状态：等待审核",pendingHint:"文件和付款审核前不显示企业认证。",marketing:"我愿意接收活动和行业动态（可选）。",fileInvalid:"请选择不超过 10 MB 的 PDF、JPG 或 PNG 文件。",fileRequired:"请选择企业证明文件。",fileAwait:"文件尚未上传。请验证邮箱并登录，然后重新选择文件上传。",uploadFailed:"账户已创建，但文件上传失败。请重试或登录后上传。请检查存储设置。",uploadRetry:"重试上传文件",uploadNow:"上传文件",uploadSuccess:"文件已上传，企业与付款审核仍在进行。",documentMissing:"尚未上传企业证明文件。",documentUploaded:"证明文件已上传，企业与付款审核仍在进行。",uploadStatusError:"无法查询文件状态。再次上传前请联系支持。",chooseFile:"选择文件",chooseAdditional:"补充文件（可选）",selectOption:"请选择",legalTypes:{sole:"个人企业",ltd:"有限责任公司",as:"股份公司",coop:"合作社",partnership:"合伙企业",foreign:"外国企业",other:"其他"},activities:{quarry:"大理石矿场",factory:"大理石工厂",quarryFactory:"矿场与工厂",trader:"出口商 / 供应商",machine:"机械制造",supplies:"锯片与耗材",logistics:"物流货运",shipping:"船务代理",fumigation:"集装箱熏蒸",customs:"报关服务",quality:"检验与质控",other:"其他行业服务"}},
  ar:{intro:"أدخل بيانات الشركة والشخص المسؤول.",companyNote:"بيانات الشركة مطلوبة لحسابات الأعمال.",foreignNote:"يمكن للشركات خارج تركيا إدخال بيانات الضرائب والسجل التجاري المعادلة في بلدها.",legalType:"الشكل القانوني",activity:"نوع النشاط",taxNo:"الرقم الضريبي",taxOffice:"مكتب الضرائب",mersis:"رقم MERSIS",registry:"رقم السجل التجاري",address:"عنوان الشركة",person:"الشخص المسؤول",personNote:"الشخص الذي يدير حساب الشركة.",authorizedName:"الاسم الكامل",authorizedTitle:"المنصب",corporateEmail:"بريد العمل",phone:"الهاتف",website:"الموقع الإلكتروني",verification:"التحقق من الشركة",verificationNote:"تُراجع المستندات بعد الطلب ولا تُمنح شارة التحقق إلا بعد اكتمال المراجعة.",document:"وثيقة إثبات الشركة",documentHint:"شهادة ضريبية أو شهادة نشاط أو قيد غرفة التجارة أو ما يعادلها. PDF أو JPG أو PNG حتى 10 ميغابايت.",additional:"وثيقة شركة إضافية",additionalHint:"يمكن للشركات المحدودة والمساهمة إضافة شهادة السجل أو النشاط.",pending:"حالة الطلب: قيد المراجعة",pendingHint:"لا تظهر الشركة موثقة قبل التحقق من المستندات والدفع.",marketing:"أرغب في تلقي الحملات وأخبار القطاع (اختياري).",fileInvalid:"اختر ملف PDF أو JPG أو PNG لا يزيد عن 10 ميغابايت.",fileRequired:"اختر وثيقة إثبات الشركة.",fileAwait:"لم يُرفع المستند بعد. أكد بريدك وسجل الدخول ثم اختره مجددًا لرفعه.",uploadFailed:"تم إنشاء الحساب لكن رفع المستند فشل. أعد المحاولة هنا أو بعد تسجيل الدخول. قد يلزم إعداد التخزين.",uploadRetry:"إعادة رفع المستند",uploadNow:"رفع المستند",uploadSuccess:"تم رفع المستند؛ ما زالت مراجعة الشركة والدفع معلقة.",documentMissing:"لم تُرفع وثيقة إثبات الشركة بعد.",documentUploaded:"رُفع المستند؛ مراجعة الشركة والدفع ما زالت معلقة.",uploadStatusError:"تعذر التحقق من حالة المستند. اتصل بالدعم قبل إعادة الرفع.",chooseFile:"اختر المستند",chooseAdditional:"مستند إضافي اختياري",selectOption:"اختر",legalTypes:{sole:"مؤسسة فردية",ltd:"شركة محدودة",as:"شركة مساهمة",coop:"تعاونية",partnership:"شراكة",foreign:"شركة أجنبية",other:"أخرى"},activities:{quarry:"محجر رخام",factory:"مصنع رخام",quarryFactory:"محجر ومصنع",trader:"مصدر / مورد",machine:"صانع آلات",supplies:"مورد أدوات ومستهلكات",logistics:"النقل والشحن",shipping:"وكالة سفن",fumigation:"تعقيم حاويات",customs:"تخليص جمركي",quality:"فحص الجودة",other:"خدمات أخرى"}}
};
const ct=key=>corporateCopy[state.lang]?.[key]||corporateCopy.tr[key]||regCopy[state.lang]?.[key]||regCopy.tr[key]||key;
const corporatePlaceholders={
  tr:{companyName:"Örn. ABC Mermer San. ve Tic. Ltd. Şti.",taxNo:"Vergi numarası",taxOffice:"Vergi dairesi",mersisNo:"Varsa MERSİS numarası",registryNo:"Ticaret sicil numarası",country:"Türkiye",city:"Afyonkarahisar",companyAddress:"Açık firma adresi",authorizedName:"Yetkili kişinin adı soyadı",authorizedTitle:"Satış müdürü, firma sahibi...",corporateEmail:"isim@firma.com",phone:"+90 ...",website:"https://firma.com"},
  en:{companyName:"e.g. ABC Marble Ltd.",taxNo:"Tax identification number",taxOffice:"Tax office",mersisNo:"MERSIS number, if available",registryNo:"Trade registry number",country:"Türkiye",city:"Afyonkarahisar",companyAddress:"Full company address",authorizedName:"Authorized person's full name",authorizedTitle:"Sales manager, company owner...",corporateEmail:"name@company.com",phone:"+90 ...",website:"https://company.com"},
  zh:{companyName:"例如 ABC 石材有限公司",taxNo:"税务识别号",taxOffice:"税务机关",mersisNo:"如有 MERSIS 编号",registryNo:"商业登记号",country:"土耳其",city:"阿菲永卡拉希萨尔",companyAddress:"企业详细地址",authorizedName:"负责人姓名",authorizedTitle:"销售经理、企业负责人等",corporateEmail:"name@company.com",phone:"+90 ...",website:"https://company.com"},
  ar:{companyName:"مثال: شركة ABC للرخام",taxNo:"الرقم الضريبي",taxOffice:"مكتب الضرائب",mersisNo:"رقم MERSIS إن وجد",registryNo:"رقم السجل التجاري",country:"تركيا",city:"أفيون قره حصار",companyAddress:"عنوان الشركة الكامل",authorizedName:"اسم الشخص المسؤول",authorizedTitle:"مدير المبيعات، مالك الشركة...",corporateEmail:"name@company.com",phone:"+90 ...",website:"https://company.com"}
};
const ph=key=>corporatePlaceholders[state.lang]?.[key]||corporatePlaceholders.tr[key]||"";

const rt=k=>membershipCopy[state.lang]?.[k]||regCopy[state.lang]?.[k]||membershipCopy.tr[k]||regCopy.tr[k]||k;
const membershipConfig=JSON.parse(document.getElementById("mb-membership-plans").textContent);
const priceLabel=role=>role==="buyer"?rt("free"):`${new Intl.NumberFormat("tr-TR").format(membershipConfig.plans[role].annualAmountTRY)} TL + ${rt("vat")} ${rt("annual")}`;
let selectedSignupRole=null;
let verificationState={userId:null,status:"loading",main:false};
const memberStateCopy={
  tr:{loading:"Üyelik bilgileri yükleniyor…",error:"Üyelik veritabanına ulaşılamadı. Kurulum SQL'ini ve bağlantıyı kontrol edin.",verified:"Firma doğrulandı; ödeme ve aktivasyon bekleniyor.",pending:"Firma doğrulaması ve banka ödemesi bekleniyor.",active:"Üyelik aktif",expired:"Üyelik süresi doldu. Yeni teklif ve taleplere erişim kapalı.",ends:"Bitiş tarihi",admin:"Yönetim paneli",buyer:"Alıcı hesabınızla gerçek alım talepleri oluşturabilirsiniz."},
  en:{loading:"Loading membership details…",error:"Membership database unavailable. Check the SQL setup and connection.",verified:"Company verified; awaiting payment and activation.",pending:"Company verification and bank payment pending.",active:"Membership active",expired:"Membership expired. New offers and request access are closed.",ends:"Ends on",admin:"Admin panel",buyer:"You can create real purchase requests from your buyer account."},
  zh:{loading:"正在加载会员信息…",error:"无法连接会员数据库。请检查 SQL 安装和连接。",verified:"企业已核验；等待付款确认与开通。",pending:"等待企业核验和银行付款确认。",active:"会员有效",expired:"会员已到期，无法继续查看采购需求或提交报价。",ends:"到期日",admin:"管理后台",buyer:"买家账户可发布真实采购需求。"},
  ar:{loading:"جار تحميل بيانات العضوية…",error:"تعذر الاتصال بقاعدة العضويات. تحقق من إعداد SQL والاتصال.",verified:"تم التحقق من الشركة؛ بانتظار الدفع والتفعيل.",pending:"بانتظار التحقق من الشركة والدفع البنكي.",active:"العضوية فعالة",expired:"انتهت العضوية، وتوقف الوصول إلى الطلبات والعروض الجديدة.",ends:"تنتهي في",admin:"لوحة الإدارة",buyer:"يمكنك إنشاء طلبات شراء فعلية بحساب المشتري."}
};
const mt=key=>memberStateCopy[state.lang]?.[key]||memberStateCopy.tr[key];
window.MarbleAuthUser=null;
window.MarbleRegistration={
  t:rt,
  accountCard(user){
    const snapshot=window.MarbleDBState;
    if(!snapshot||snapshot.userId!==user.id||snapshot.status==="loading")return `<div class="workspace-card"><p>${mt("loading")}</p></div>`;
    if(snapshot.status==="error")return `<div class="workspace-card"><p role="alert">${mt("error")}</p></div>`;
    const account=snapshot.account;
    const role=account.profile.account_role;
    const business=role==="supplier"||role==="service";
    const membership=account.membership;
    const active=!!membership&&account.verification?.verified&&Date.parse(membership.ends_at)>Date.now();
    const expired=!!membership&&!active&&Date.parse(membership.ends_at)<=Date.now();
    const status=active?mt("active"):expired?mt("expired"):account.verification?.verified?mt("verified"):mt("pending");
    const documentStatus=verificationState.userId===user.id?verificationState:{status:"loading",main:false};
    const documentCard=business?`<div class="workspace-card"><strong>${ct("verification")}</strong><p>${documentStatus.status==="error"?ct("uploadStatusError"):documentStatus.status==="loading"?rt("checking"):documentStatus.main?ct("documentUploaded"):ct("documentMissing")}</p>${documentStatus.status==="ready"&&!documentStatus.main?`<form id="verificationForm"><label class="field">${ct("document")} *<input name="companyDocument" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required></label><label class="field">${ct("additional")}<input name="additionalDocument" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"></label><p class="signup-help">${ct("documentHint")}</p><p class="form-error" id="verificationError" role="alert"></p><button class="button dark" type="submit">${ct("uploadNow")}</button></form>`:""}</div>`:"";
    const listed=user.user_metadata?.directory_consent===true;
    const directoryCard=business?`<div class="workspace-card"><strong>${categoryDirectoryCopy[state.lang].settingTitle}</strong><p>${categoryDirectoryCopy[state.lang].settingBody}</p><button type="button" class="button outline" data-directory-opt-in="${listed?"false":"true"}" aria-pressed="${listed}">${listed?categoryDirectoryCopy[state.lang].disable:categoryDirectoryCopy[state.lang].enable}</button></div>`:"";
    return `<div class="workspace-grid"><div class="workspace-card"><span class="status">${rt(role)}</span><p class="minor">${safe(user.email)}</p><strong>${safe(account.profile.full_name||user.email)}</strong><p>${business?status:mt("buyer")}</p>${account.admin?`<p><a href="/tr/yonetim">${mt("admin")} →</a></p>`:""}<button type="button" class="button outline" data-logout>${tr("logout")}</button></div>${business?`<div class="workspace-card"><strong>${safe(account.application?.company_name||rt("company"))}</strong><p>${priceLabel(role)}</p><span class="minor">${status}</span>${membership?`<p>${mt("ends")}: ${safe(new Date(membership.ends_at).toLocaleDateString(state.lang))}</p>`:""}<p class="minor">${rt("contact")} <a href="mailto:${membershipConfig.contactEmail}">${membershipConfig.contactEmail}</a></p></div>`:""}${documentCard}${directoryCard}<div class="workspace-card"><strong>${tr("workspaceSigned")}</strong><div id="realRequests"></div></div></div>`;
  },
  async refreshVerification(user,force=false){
    if(!user||!["supplier","service"].includes(window.MarbleDBState?.account?.profile?.account_role))return;
    if(!force&&verificationState.userId===user.id&&verificationState.status!=="loading")return;
    verificationState={userId:user.id,status:"loading",main:false};
    try{
      const {data,error}=await window.MarbleAuth.listVerificationFiles();
      if(error)throw error;
      if(window.MarbleAuthUser?.id!==user.id)return;
      verificationState={userId:user.id,status:"ready",main:!!data};
    }catch{
      if(window.MarbleAuthUser?.id!==user.id)return;
      verificationState={userId:user.id,status:"error",main:false};
    }
    window.MarbleUIRefresh?.();
  }
};
function roleCards(){
  return `<div class="signup-roles" role="group" aria-label="${rt("choose")}">${["buyer","supplier","service"].map(role=>`<button type="button" data-signup-role="${role}" class="${selectedSignupRole===role?"active":""}"><strong>${rt(role)}</strong><small>${rt(role+"Hint")}</small><span class="signup-role-price">${priceLabel(role)}</span></button>`).join("")}</div>`;
}
function field(label,name,type="text",extra=""){
  return `<label class="field">${rt(label)}<input name="${name}" type="${type}" ${extra} required></label>`;
}
function signupInput(label,name,placeholder="",extra="",full=false){
  return `<label class="field${full?" full":""}">${ct(label)} *<input name="${name}" type="text" placeholder="${safe(placeholder)}" ${extra} required></label>`;
}
function signupSelect(label,name,options){
  return `<label class="field full">${ct(label)} *<select name="${name}" required><option value="">${ct("selectOption")}</option>${options.map(key=>`<option value="${key}">${ct(label==="legalType"?"legalTypes":"activities")[key]}</option>`).join("")}</select></label>`;
}
function signupFields(role){
  const business=role==="supplier"||role==="service";
  const activities=role==="supplier"?["quarry","factory","quarryFactory","trader","machine","supplies"]:["logistics","shipping","fumigation","customs","quality","other"];
  return `<form id="signupForm" data-role="${role}">${business?`<div class="membership-summary"><strong>${rt("membershipTitle")}: ${priceLabel(role)}</strong><p>${rt("membershipAwait")}</p>${role==="supplier"?`<p>${rt("supplierAccess")}</p>`:""}<p>${rt("contact")} <a href="mailto:${membershipConfig.contactEmail}">${membershipConfig.contactEmail}</a></p></div>`:""}
  <div class="signup-section-heading"><span>${rt("account")}</span></div><div class="form-grid">
  ${field("fullName","fullName","text",'autocomplete="name" maxlength="90"')}
  ${field("email","email","email",'autocomplete="email" maxlength="180"')}
  ${field("password","password","password",'autocomplete="new-password" minlength="10" maxlength="128"')}
  ${field("confirm","confirm","password",'autocomplete="new-password" minlength="10" maxlength="128"')}
  </div>${business?`<div class="signup-corporate">
  <div class="signup-section-heading"><span>${rt("company")}</span><small>${ct("companyNote")}</small></div>
  <p class="signup-foreign-note">${ct("foreignNote")}</p>
  <div class="form-grid">
  ${signupSelect("legalType","legalType",["sole","ltd","as","coop","partnership","foreign","other"])}
  ${signupSelect("activity","activityType",activities)}
  ${signupInput("companyName","companyName",ph("companyName"),'maxlength="160"')}
  ${signupInput("taxNo","taxNo",ph("taxNo"),'maxlength="35"')}
  ${signupInput("taxOffice","taxOffice",ph("taxOffice"),'maxlength="90"')}
  <label class="field">${ct("mersis")}<input name="mersisNo" type="text" placeholder="${ph("mersisNo")}" maxlength="35"></label>
  <label class="field">${ct("registry")}<input name="registryNo" type="text" placeholder="${ph("registryNo")}" maxlength="50"></label>
  ${signupInput("country","country",ph("country"),'maxlength="80"')}
  ${signupInput("city","city",ph("city"),'maxlength="80"')}
  <label class="field full">${ct("address")} *<textarea name="companyAddress" rows="2" placeholder="${ph("companyAddress")}" maxlength="500" required></textarea></label>
  </div>
  <div class="signup-section-heading second"><span>${ct("person")}</span><small>${ct("personNote")}</small></div>
  <div class="form-grid">
  ${signupInput("authorizedName","authorizedName",ph("authorizedName"),'autocomplete="name" maxlength="90"')}
  ${signupInput("authorizedTitle","authorizedTitle",ph("authorizedTitle"),'maxlength="90"')}
  <label class="field">${ct("corporateEmail")} *<input name="corporateEmail" type="email" placeholder="${ph("corporateEmail")}" maxlength="180" required></label>
  <label class="field">${ct("phone")} *<input name="phone" type="tel" placeholder="${ph("phone")}" autocomplete="tel" maxlength="30" required></label>
  <label class="field full">${ct("website")}<input name="website" type="url" placeholder="${ph("website")}" maxlength="220"></label>
  </div>
  <div class="signup-section-heading second"><span>${ct("verification")}</span><small>${ct("verificationNote")}</small></div>
  <div class="form-grid">
  <label class="field full">${ct("document")} *<input name="companyDocument" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required><small class="signup-help">${ct("documentHint")}</small></label>
  <label class="field full">${ct("additional")}<input name="additionalDocument" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"><small class="signup-help">${ct("additionalHint")}</small></label>
  </div><p class="signup-verification-state"><strong>${ct("pending")}</strong><span>${ct("pendingHint")}</span></p>
  </div>`:""}
  <p class="modal-note">${rt("privacy")}</p>
  <div class="signup-consents">
    <label class="signup-ack"><input name="termsConsent" type="checkbox" required><span><a href="/tr/yasal/kullanim-kosullari" data-legal="kullanim-kosullari">${rt("termsName")}</a> ${rt("readAndAccept")}</span></label>
    <label class="signup-ack"><input name="privacyConsent" type="checkbox" required><span><a href="/tr/yasal/gizlilik" data-legal="gizlilik">${rt("privacyName")}</a> ${rt("readAndAccept")}</span></label>
    <label class="signup-ack"><input name="kvkkNotice" type="checkbox" required><span><a href="/tr/yasal/kvkk" data-legal="kvkk">${rt("kvkkName")}</a> ${rt("readOnly")}</span></label>
    <label class="signup-ack"><input name="marketingConsent" type="checkbox"><span>${ct("marketing")}</span></label>
    ${business?`<label class="signup-ack"><input name="directoryConsent" type="checkbox"><span>${categoryDirectoryCopy[state.lang].consent}</span></label>`:""}
  </div>
  <p class="form-error" id="signupError" role="alert"></p>
  <button class="button dark signup-submit" type="submit">${business?rt("submitApplication"):rt("create")}</button></form>`;
}
function renderSignupContent(){
  $("modalBody").innerHTML=`<p class="detail-copy">${rt("select")}</p>${roleCards()}<div id="signupDetails">${selectedSignupRole?signupFields(selectedSignupRole):""}</div><button class="text-button" type="button" data-real-login>${rt("existing")} →</button>`;
}
function openSignup(){
  selectedSignupRole=null;
  modal(rt("choose"),rt("title"),"");
  renderSignupContent();
}
function realLogin(){
  modal(rt("account"),rt("realLogin"),`<form id="realLoginForm">${field("email","email","email",'autocomplete="username" maxlength="180"')}${field("password","password","password",'autocomplete="current-password"')}<p class="form-error" id="signupError" role="alert"></p><button class="button dark signup-submit" type="submit">${tr("enter")}</button><button class="text-button" type="button" data-resend-confirmation>${rt("resendConfirmation")}</button></form><button class="text-button" type="button" data-signup-back>${rt("back")} →</button>`);
}
async function toggleDirectoryListing(button){
  const next=button.dataset.directoryOptIn==="true";
  button.disabled=true;
  try{
    if(!window.MarbleAuthUser||!window.MarbleAuth?.client)throw Error("Sign in required");
    const {data,error}=await window.MarbleAuth.client.auth.updateUser({data:{directory_consent:next}});
    if(error)throw error;
    window.MarbleAuthUser=data.user;
    window.MarbleUIRefresh?.();
    await window.MarbleDB?.refreshDirectory?.();
    toast(categoryDirectoryCopy[state.lang][next?"enabled":"disabled"]);
  }catch(error){console.error("Directory choice failed",error);toast(rt("failed"))}
  finally{if(button.isConnected)button.disabled=false}
}
function friendlyAuthError(error,login=false){
  if(!error)return rt("failed");
  if(error.name==="AuthRetryableFetchError"||/fetch|network/i.test(error.message||""))return rt("network");
  if(/email not confirmed/i.test(error.message||""))return rt("emailNotConfirmed");
  if(login)return rt("badLogin");
  if(/password/i.test(error.message||""))return rt("short");
  return rt("failed");
}
function validDocument(file){
  const ext=file?.name?.split(".").pop()?.toLowerCase(),mime={pdf:"application/pdf",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png"}[ext];
  return !!mime&&file.size>0&&file.size<=10485760&&(!file.type||file.type===mime);
}
function validateDocuments(data){
  const main=data.get("companyDocument"),extra=data.get("additionalDocument");
  if(!main?.name)return ct("fileRequired");
  if(!validDocument(main)||(extra?.name&&!validDocument(extra)))return ct("fileInvalid");
  return "";
}
async function uploadCompanyDocuments(data,form){
  if(!window.MarbleAuth?.uploadVerificationFile)throw Error("Storage unavailable");
  if(form.dataset.mainUploaded!=="true"){
    const {error}=await window.MarbleAuth.uploadVerificationFile(data.get("companyDocument"),"company-document");
    if(error)throw error;
    form.dataset.mainUploaded="true";
  }
  const extra=data.get("additionalDocument");
  if(extra?.name&&form.dataset.extraUploaded!=="true"){
    const {error}=await window.MarbleAuth.uploadVerificationFile(extra,"additional-document");
    if(error)throw error;
    form.dataset.extraUploaded="true";
  }
  if(window.MarbleAuthUser)await window.MarbleRegistration.refreshVerification(window.MarbleAuthUser,true);
}
async function submitSignup(form){
  const button=form.querySelector('button[type="submit"]'),errorBox=$("signupError");
  const data=new FormData(form),email=String(data.get("email")||"").trim().toLowerCase(),password=String(data.get("password")||"");
  const role=form.dataset.role,business=role==="supplier"||role==="service";
  if(password!==data.get("confirm")){errorBox.textContent=rt("mismatch");return}
  if(password.length<10){errorBox.textContent=rt("short");return}
  if(!data.get("termsConsent")||!data.get("privacyConsent")||!data.get("kvkkNotice")){errorBox.textContent=rt("requiredLegal");return}
  if(business){const problem=validateDocuments(data);if(problem){errorBox.textContent=problem;return}}
  const acceptedAt=new Date().toISOString();
  const value=name=>String(data.get(name)||"").trim();
  const metadata={
    role,full_name:value("fullName"),company_name:business?value("companyName"):"",
    legal_name:business?value("companyName"):"",legal_type:business?value("legalType"):"",
    activity:business?value("activityType"):"",activity_type:business?value("activityType"):"",
    tax_no:business?value("taxNo"):"",tax_office:business?value("taxOffice"):"",
    mersis_no:business?value("mersisNo"):"",registry_no:business?value("registryNo"):"",
    country:business?value("country"):"",city:business?value("city"):"",
    company_address:business?value("companyAddress"):"",
    authorized_name:business?value("authorizedName"):"",authorized_title:business?value("authorizedTitle"):"",
    corporate_email:business?value("corporateEmail").toLowerCase():"",phone:business?value("phone"):"",
    website:business?value("website"):"",requested_membership_plan:business?role:"",
    legal_version:membershipConfig.legalVersion,terms_accepted_at:acceptedAt,
    privacy_accepted_at:acceptedAt,kvkk_notice_read_at:acceptedAt,
    marketing_consent:!!data.get("marketingConsent"),marketing_consent_at:data.get("marketingConsent")?acceptedAt:null,
    directory_consent:business&&!!data.get("directoryConsent"),
    company_verification_status:"unverified"
  };
  const requiredCompany=["company_name","legal_type","activity_type","tax_no","tax_office","country","city","company_address","authorized_name","authorized_title","corporate_email","phone"];
  if(!email||!metadata.full_name||(business&&requiredCompany.some(key=>!metadata[key]))){errorBox.textContent=rt("missing");return}
  button.disabled=true;button.textContent=rt("checking");errorBox.textContent="";
  try{
    if(!window.MarbleAuth)throw Error("Auth unavailable");
    const {data:result,error}=await window.MarbleAuth.signUp({email,password,metadata});
    if(error)throw error;
    if(result?.session){
      await window.MarbleAuth.signOut();
      errorBox.textContent=rt("confirmRequiredConfig");
      return;
    }
    $("modalBody").innerHTML=`<div class="modal-note"><strong>${role==="buyer"?rt("confirmEmail"):rt("applicationReceived")}</strong>${business?`<p>${ct("fileAwait")}</p>`:""}</div><button class="button dark" type="button" data-real-login>${rt("realLogin")}</button>`;
  }catch(err){errorBox.textContent=friendlyAuthError(err)}
  finally{if(button.isConnected){button.disabled=false;button.textContent=business?rt("submitApplication"):rt("create")}}
}
async function submitVerification(form){
  const button=form.querySelector('button[type="submit"]'),box=$("verificationError"),data=new FormData(form);
  const problem=validateDocuments(data);if(problem){box.textContent=problem;return}
  button.disabled=true;box.textContent="";
  try{await uploadCompanyDocuments(data,form);toast(ct("uploadSuccess"));window.MarbleUIRefresh?.()}
  catch{box.textContent=ct("uploadFailed")}
  finally{if(button.isConnected)button.disabled=false}
}
async function submitRealLogin(form){
  const button=form.querySelector('button[type="submit"]'),errorBox=$("signupError");
  const data=new FormData(form);button.disabled=true;errorBox.textContent="";
  try{
    if(!window.MarbleAuth)throw Error("Auth unavailable");
    const {error}=await window.MarbleAuth.signIn(String(data.get("email")||"").trim().toLowerCase(),String(data.get("password")||""));
    if(error)throw error;
    closeModal();toast(rt("signed"));$("workspace").scrollIntoView({behavior:"smooth"});
  }catch(err){errorBox.textContent=friendlyAuthError(err,true)}
  finally{button.disabled=false}
}
async function resendConfirmation(){
  const form=$("realLoginForm"),box=$("signupError");
  const email=String(form?.elements.email.value||"").trim().toLowerCase();
  if(!email||!form.elements.email.checkValidity()){box.textContent=rt("emailInvalid");return}
  const button=form.querySelector("[data-resend-confirmation]");button.disabled=true;box.textContent="";
  try{const {error}=await window.MarbleAuth.resendConfirmation(email);if(error)throw error;box.textContent=rt("confirmationSent")}
  catch(error){box.textContent=friendlyAuthError(error)}
  finally{button.disabled=false}
}
const validationCopy={
  tr:{emailRequired:"Lütfen e-posta adresinizi yazın.",emailInvalid:"Geçerli bir e-posta adresi yazın.",urlInvalid:"Geçerli bir web adresi yazın (https://...).",required:"Lütfen {field} alanını doldurun.",selectRequired:"Lütfen {field} seçin.",fileRequired:"Lütfen {field} seçin.",checkRequired:"Devam etmek için bu kutuyu işaretleyin.",numberInvalid:"Lütfen geçerli bir sayı yazın.",min:"{field} en az {limit} olmalı.",max:"{field} en fazla {limit} olmalı.",tooShort:"{field} en az {limit} karakter olmalı.",tooLong:"{field} en fazla {limit} karakter olmalı.",invalid:"Lütfen {field} bilgisini kontrol edin."},
  en:{emailRequired:"Please enter your email address.",emailInvalid:"Please enter a valid email address.",urlInvalid:"Please enter a valid website address (https://...).",required:"Please enter {field}.",selectRequired:"Please select {field}.",fileRequired:"Please choose {field}.",checkRequired:"Please check this box to continue.",numberInvalid:"Please enter a valid number.",min:"{field} must be at least {limit}.",max:"{field} must be at most {limit}.",tooShort:"{field} must have at least {limit} characters.",tooLong:"{field} must have at most {limit} characters.",invalid:"Please check {field}."},
  zh:{emailRequired:"请输入您的电子邮箱。",emailInvalid:"请输入有效的电子邮箱。",urlInvalid:"请输入有效的网站地址（https://...）。",required:"请填写{field}。",selectRequired:"请选择{field}。",fileRequired:"请选择{field}。",checkRequired:"请勾选此项后继续。",numberInvalid:"请输入有效数字。",min:"{field}不能小于{limit}。",max:"{field}不能大于{limit}。",tooShort:"{field}至少需要{limit}个字符。",tooLong:"{field}最多允许{limit}个字符。",invalid:"请检查{field}。"},
  ar:{emailRequired:"يرجى إدخال بريدك الإلكتروني.",emailInvalid:"يرجى إدخال بريد إلكتروني صالح.",urlInvalid:"يرجى إدخال رابط موقع صالح (https://...).",required:"يرجى إدخال {field}.",selectRequired:"يرجى اختيار {field}.",fileRequired:"يرجى اختيار {field}.",checkRequired:"يرجى تحديد هذا المربع للمتابعة.",numberInvalid:"يرجى إدخال رقم صالح.",min:"يجب ألا يقل {field} عن {limit}.",max:"يجب ألا يتجاوز {field} {limit}.",tooShort:"يجب أن يحتوي {field} على {limit} أحرف على الأقل.",tooLong:"يجب ألا يتجاوز {field} {limit} أحرف.",invalid:"يرجى مراجعة {field}."}
};
const validationFields={
  fullName:()=>rt("fullName"),email:()=>rt("email"),password:()=>rt("password"),confirm:()=>rt("confirm"),
  legalType:()=>ct("legalType"),activityType:()=>ct("activity"),companyName:()=>ct("companyName"),
  taxNo:()=>ct("taxNo"),taxOffice:()=>ct("taxOffice"),country:()=>ct("country"),city:()=>ct("city"),
  companyAddress:()=>ct("address"),authorizedName:()=>ct("authorizedName"),authorizedTitle:()=>ct("authorizedTitle"),
  corporateEmail:()=>ct("corporateEmail"),phone:()=>ct("phone"),website:()=>ct("website"),
  companyDocument:()=>ct("document"),additionalDocument:()=>ct("additional"),
  item:()=>tr("item"),format:()=>tr("format"),quantity:()=>tr("quantity"),unit:()=>tr("unit"),
  destination:()=>tr("destination"),notes:()=>tr("notes"),price:()=>tr("price"),currency:()=>tr("currency"),
  contactEmail:()=>rt("email")
};
function formValidationMessage(field){
  const words=validationCopy[state.lang]||validationCopy.tr;
  const label=validationFields[field.name]?.()||field.name||rt("account");
  const message=(key,limit="")=>words[key].replace(/\{field\}|\{limit\}/g,placeholder=>placeholder==="{field}"?label:limit);
  const validity=field.validity;
  if(validity.valueMissing){
    if(field.type==="email")return words.emailRequired;
    if(field.type==="checkbox")return words.checkRequired;
    if(field.type==="file")return message("fileRequired");
    if(field.tagName==="SELECT")return message("selectRequired");
    return message("required");
  }
  if(validity.typeMismatch)return field.type==="email"?words.emailInvalid:words.urlInvalid;
  if(validity.badInput||validity.stepMismatch)return words.numberInvalid;
  if(validity.rangeUnderflow)return message("min",field.min);
  if(validity.rangeOverflow)return message("max",field.max);
  if(validity.tooShort)return message("tooShort",field.minLength);
  if(validity.tooLong)return message("tooLong",field.maxLength);
  if(validity.patternMismatch)return message("invalid");
  return "";
}
// Native browser prompts follow the browser locale, so set the message from the site's active language.
document.addEventListener("invalid",event=>{
  const field=event.target;
  if(!field.closest?.("#signupForm, #realLoginForm, #verificationForm, #requestForm, #offerForm")||!field.setCustomValidity)return;
  field.setCustomValidity("");
  const message=formValidationMessage(field);
  if(message)field.setCustomValidity(message);
},true);
for(const eventName of ["input","change"]){
  document.addEventListener(eventName,event=>{
    const field=event.target;
    if(field.closest?.("#signupForm, #realLoginForm, #verificationForm, #requestForm, #offerForm")&&field.setCustomValidity)field.setCustomValidity("");
  },true);
}
document.addEventListener("click",async e=>{
  if(e.target.closest("#signupButton, [data-signup-open]")){openSignup();return}
  const directoryButton=e.target.closest("[data-directory-opt-in]");
  if(directoryButton){await toggleDirectoryListing(directoryButton);return}
  const role=e.target.closest("[data-signup-role]");
  if(role){selectedSignupRole=role.dataset.signupRole;renderSignupContent();$("signupDetails input")?.focus();return}
  if(e.target.closest("[data-real-login]")){realLogin();return}
  if(e.target.closest("[data-resend-confirmation]")){await resendConfirmation();return}
  if(e.target.closest("[data-signup-back]")){openSignup();return}
});
document.addEventListener("submit",e=>{
  if(e.target.id==="signupForm"){e.preventDefault();submitSignup(e.target)}
  if(e.target.id==="realLoginForm"){e.preventDefault();submitRealLogin(e.target)}
  if(e.target.id==="verificationForm"){e.preventDefault();submitVerification(e.target)}
});
window.addEventListener("marble-auth",e=>{
  window.MarbleAuthUser=e.detail.user?.email_confirmed_at?e.detail.user:null;
  window.MarbleUIRefresh?.();
});
window.addEventListener("marble-db",()=>{
  if(window.MarbleAuthUser)void window.MarbleRegistration.refreshVerification(window.MarbleAuthUser);
});
$("signupButton").textContent=rt("signup");

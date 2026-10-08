import Link from 'next/link';
import type { GuideArticle } from '@/lib/guideContent';
import { guidePath, getGuides, type GuideLocale } from '@/lib/translatedGuides';
import { getSourcingCopy, sourcingPath } from '@/lib/sourcingContent';

const copy = {
  tr: {home:'Ana sayfa',guide:'Mermer Rehberi',eyebrow:'MERMER VE DOĞAL TAŞ BİLGİ MERKEZİ',title:'Mermer nasıl alınır? Taş seçimi ve satın alma rehberleri.',desc:'Mermer satın alma, fiyat karşılaştırması, blok ve plaka seçimi, yüzey türleri ve Türkiye’nin doğal taşları hakkında genel, anlaşılır bilgiler.',explore:'Konuları incele ↓',topics:'Mermer satın alma ve doğal taş rehberleri',topicsDesc:'Ürün ve stok tanıtımı değil; karar vermeden önce öğrenmeniz gerekenler.',read:'Rehberi oku ↗',ctaEyebrow:'SATIN ALMA KONTROL LİSTESİ',cta:'Teklif istemeden önce teknik ayrıntıları netleştirin.',ctaDesc:'Taş türü, numune, miktar, ölçü, yüzey, teslim koşulları ve gerekli test belgeleri açıkça belirtilmelidir.',ctaLink:'Satın alma rehberini oku →',articleEyebrow:'MERMER REHBERİ',reading:'OKUMA',editor:'Editör notu',editorBody:'Bu yazı genel bilgilendirme amaçlıdır; stok veya fiyat teklifi değildir. Siparişten önce numuneyi, teknik özellikleri ve teslim koşullarını ilgili satıcıyla doğrulayın.',related:'İLGİLİ REHBERLER',more:'Daha fazla bilgi',all:'Tüm rehberler →'},
  en: {home:'Home',guide:'Marble Buyer Guides',eyebrow:'MARBLE AND NATURAL STONE KNOWLEDGE CENTRE',title:'How to buy marble: stone selection and purchasing guides.',desc:'Practical, independent information about buying marble, comparing prices, selecting blocks and slabs, surface finishes and Turkish natural stone.',explore:'Explore topics ↓',topics:'Marble buying and natural stone guides',topicsDesc:'Independent educational resources, not stock or product advertisements.',read:'Read guide ↗',ctaEyebrow:'BUYER CHECKLIST',cta:'Confirm the technical details before requesting a quote.',ctaDesc:'Specify the stone type, sample, quantity, dimensions, finish, delivery terms and relevant test documents.',ctaLink:'Read the buying guide →',articleEyebrow:'MARBLE GUIDE',reading:'READ',editor:'Editorial note',editorBody:'This article is for general information, not a stock listing or price offer. Verify samples, technical requirements and delivery terms with the seller before ordering.',related:'RELATED GUIDES',more:'Learn more',all:'All guides →'},
  zh: {home:'首页',guide:'石材选购指南',eyebrow:'大理石及天然石材知识中心',title:'如何购买大理石：选材与采购指南',desc:'独立介绍大理石采购、价格比较、荒料与板材、表面处理及土耳其天然石材。',explore:'浏览主题 ↓',topics:'大理石采购与天然石材指南',topicsDesc:'通用选材知识，并非产品库存或报价广告。',read:'阅读指南 ↗',ctaEyebrow:'采购核对清单',cta:'询价前先确认技术细节',ctaDesc:'明确石材种类、样品、数量、尺寸、表面处理、交付条件和必要的检测文件。',ctaLink:'阅读采购指南 →',articleEyebrow:'大理石指南',reading:'阅读',editor:'编辑说明',editorBody:'本文仅提供一般信息，不代表库存或价格承诺。下单前请向卖方核实样品、技术要求和交付条款。',related:'相关指南',more:'了解更多',all:'全部指南 →'},
  ar: {home:'الرئيسية',guide:'دليل شراء الرخام',eyebrow:'مركز معرفة الرخام والحجر الطبيعي',title:'كيف تشتري الرخام؟ أدلة اختيار الحجر والشراء',desc:'معلومات مستقلة عن شراء الرخام ومقارنة الأسعار واختيار الكتل والألواح والتشطيبات والحجر التركي.',explore:'استعرض المواضيع ↓',topics:'أدلة شراء الرخام والحجر الطبيعي',topicsDesc:'معلومات تعليمية عامة وليست إعلانات عن المخزون أو عروض أسعار.',read:'اقرأ الدليل ↗',ctaEyebrow:'قائمة المشتري',cta:'حدد التفاصيل الفنية قبل طلب السعر',ctaDesc:'وضح نوع الحجر والعينة والكمية والمقاسات والتشطيب وشروط التسليم والاختبارات المطلوبة.',ctaLink:'اقرأ دليل الشراء ←',articleEyebrow:'دليل الرخام',reading:'قراءة',editor:'ملاحظة تحريرية',editorBody:'هذه المقالة للمعلومات العامة وليست عرض مخزون أو سعر. تحقق من العينات والمتطلبات الفنية وشروط التسليم مع المورد قبل الطلب.',related:'أدلة ذات صلة',more:'المزيد من المعلومات',all:'جميع الأدلة ←'}
} as const;
const homePath=(locale:GuideLocale)=>locale==='tr'?'/':`/?lang=${locale}`;

export function GuideIndex({locale='tr'}:{locale?:GuideLocale}) {
  const t=copy[locale]; const guides=getGuides(locale);
  return <>
    
    <main className="guide-wrap" id="main-content" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}>
      <nav aria-label="Breadcrumb" className="guide-breadcrumb"><a href={homePath(locale)}>{t.home}</a><span>/</span>{t.guide}</nav>
      <header className="guide-hero"><span className="guide-kicker">{t.eyebrow}</span><h1>{t.title}</h1><p>{t.desc}</p><a className="guide-hero-link" href="#konular">{t.explore}</a></header>
      <div className="guide-heading" id="konular"><h2>{t.topics}</h2><p>{t.topicsDesc}</p></div>
      <div className="guide-grid">{guides.map((article,i)=><Link key={article.slug} className="guide-tile" href={guidePath(locale,article.slug)}>
        <span className="guide-number">{String(i+1).padStart(2,'0')} / {article.readingTime}</span>
        <h3>{article.title}</h3><p>{article.summary}</p><span className="guide-tile-link">{t.read}</span>
      </Link>)}</div>
      <section className="sourcing-guide-links" aria-label="B2B marble sourcing">
        {(['quote','b2b'] as const).map(topic=>{const x=getSourcingCopy(locale,topic);return <Link key={topic} href={sourcingPath(topic,locale)}><span className="guide-kicker">{x.eyebrow}</span><strong>{x.title}</strong><span>{x.description}</span></Link>;})}
      </section>
      <section className="guide-category-callout" aria-labelledby="guideNextTitle">
        <div><span className="guide-kicker">{t.ctaEyebrow}</span><h2 id="guideNextTitle">{t.cta}</h2><p>{t.ctaDesc}</p></div>
        <Link href={guidePath(locale,'mermer-satin-alma')}>{t.ctaLink}</Link>
      </section>
    </main>
    
  </>;
}

export function GuideArticlePage({article,locale='tr'}:{article:GuideArticle;locale?:GuideLocale}) {
  const t=copy[locale]; const guides=getGuides(locale);
  return <>
    
    <main className="guide-wrap guide-article-layout" id="main-content" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}>
      <nav aria-label="Breadcrumb" className="guide-breadcrumb"><a href={homePath(locale)}>{t.home}</a><span>/</span><Link href={guidePath(locale)}>{t.guide}</Link><span>/</span>{article.title}</nav>
      <article className="guide-article">
        <header className="guide-article-intro"><span className="guide-kicker">{t.articleEyebrow} · {article.readingTime} {t.reading}</span><h1>{article.title}</h1><p>{article.summary}</p></header>
        <div className="guide-reading">
          {article.sections.map(section=><section key={section.heading} className="guide-section">
            <h2>{section.heading}</h2>{section.paragraphs.map(text=><p key={text}>{text}</p>)}
            {section.bullets&&<ul>{section.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul>}
          </section>)}
          <aside className="guide-editor-note"><strong>{t.editor}</strong><p>{t.editorBody}</p></aside>
        </div>
      </article>
      <aside className="guide-aside" aria-label={t.related}><div className="guide-aside-box"><span className="guide-kicker">{t.related}</span><h2>{t.more}</h2>
        {guides.filter(item=>item.slug!==article.slug).map(item=><Link key={item.slug} className="guide-other-link" href={guidePath(locale,item.slug)}>{item.title} ↗</Link>)}
        {(['quote','b2b'] as const).map(topic=>{const x=getSourcingCopy(locale,topic);return <Link className="guide-other-link" key={topic} href={sourcingPath(topic,locale)}>{x.title} ↗</Link>;})}
        <Link className="guide-other-link" href={guidePath(locale)}>{t.all}</Link>
      </div></aside>
    </main>
    
  </>;
}

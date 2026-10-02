import Link from 'next/link';
import { DetailHeader, DetailFooter } from '@/components/DetailChrome';
import SourcingLanguagePicker from '@/components/SourcingLanguagePicker';
import { guidePath, type GuideLocale } from '@/lib/guideRoutes';
import { getSourcingCopy, sourcingPath, type SourcingTopic } from '@/lib/sourcingContent';

const languageQuery=(locale:GuideLocale)=>locale === 'tr' ? '' : `?lang=${locale}`;
export default function SourcingPage({ locale, topic }: {locale:GuideLocale;topic:SourcingTopic}) {
  const t=getSourcingCopy(locale,topic);
  const otherTopic: SourcingTopic=topic==='quote'?'b2b':'quote';
  const home=locale==='tr'?'/':`/?lang=${locale}`;
  return <>
    <DetailHeader language={locale} languagePicker={<SourcingLanguagePicker locale={locale} topic={topic}/>}/>
    <main className="guide-wrap sourcing-wrap" id="main-content" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}>
      <nav aria-label="Breadcrumb" className="guide-breadcrumb">
        <Link href={home}>{t.homeLabel}</Link><span>/</span><span aria-current="page">{t.title}</span>
      </nav>
      <header className="guide-hero sourcing-hero">
        <span className="guide-kicker">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
        <div className="sourcing-actions">
          <Link className="guide-hero-link" href={`/tr/dogal-tas${languageQuery(locale)}`}>{t.firstCta} ↗</Link>
          <Link className="sourcing-outline-button" href={guidePath(locale)}>{t.secondCta} ↗</Link>
        </div>
      </header>
      <section className="sourcing-process" aria-labelledby="sourcing-steps">
        <div className="guide-heading"><h2 id="sourcing-steps">{t.sectionTitle}</h2></div>
        <div className="sourcing-steps">{t.steps.map((step,i)=><article className="sourcing-step" key={step.heading}>
          <span className="guide-number">{String(i+1).padStart(2,'0')}</span>
          <h3>{step.heading}</h3><p>{step.body}</p>
        </article>)}</div>
      </section>
      <div className="sourcing-info-grid">
        <article className="sourcing-info">
          {t.details.map(section=><section className="guide-section" key={section.heading}>
            <h2>{section.heading}</h2>{section.paragraphs.map(para=><p key={para}>{para}</p>)}
            {section.bullets&&<ul>{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}
          </section>)}
        </article>
        <aside className="guide-aside-box sourcing-related">
          <span className="guide-kicker">{t.relatedLabel}</span><h2>{t.relatedTitle}</h2>
          <Link className="guide-other-link" href={sourcingPath(otherTopic,locale)}>{t.otherTopicLabel} ↗</Link>
          <Link className="guide-other-link" href={guidePath(locale)}>{t.guideLabel} ↗</Link>
        </aside>
      </div>
      <section className="sourcing-faq" aria-label="FAQ">
        {t.faqs.map(item=><article key={item.question}><h2>{item.question}</h2><p>{item.answer}</p></article>)}
      </section>
      <p className="sourcing-notice">{t.notice}</p>
    </main>
    <DetailFooter language={locale}/>
  </>;
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pageSeo } from "./seo";
import { stones } from "./stoneData";
import { services } from "./serviceData";
import { equipmentCategories } from "./machineData";
import { membershipPlans } from "./membershipPlans";
import { legalVersion } from "./legalDocuments";
import { safeJsonLd } from "./seo";

const body = readFileSync(join(process.cwd(), "lib/marketBody.html"), "utf8");
const panelTitle = {
  "dogal-tas": "Doğal taş koleksiyonu",
  firmalar: "Firma rehberi",
  "tedarikci-talepleri": "Alım Talepleri",
  "makine-sarf": "Makine ve sarf pazarı",
  hizmetler: "Sektörel hizmetler",
} as const;
const panelSubtitle = {
  "dogal-tas": "Türe ve formata göre doğal taşlar",
  firmalar: "Onaylı üretici ve tedarikçiler",
  "tedarikci-talepleri": "Tedarikçi hesabına özel talepler",
  "makine-sarf": "Ekipman ve sarf ürünleri",
  hizmetler: "Taş ticaretini destekleyen hizmetler",
} as const;

const navigation = [
  { tab: "stones", slug: "dogal-tas", title: "Doğal Taş" },
  { tab: "companies", slug: "firmalar", title: "Firmalar" },
  { tab: "machines", slug: "makine-sarf", title: "Makine &amp; Sarf" },
  { tab: "services", slug: "hizmetler", title: "Hizmetler" },
] as const;

function stoneCards(): string {
  return stones.map((stone, index) => `<article class="card"><div class="card-media has-illustration stone-visual"><img src="/market/images/marble/${stone.image}" alt="${stone.name} için temsili plaka sunumu" loading="lazy" decoding="async" width="1000" height="730"><span class="card-index">${String(index + 1).padStart(2, "0")}</span></div><div class="card-body"><span class="card-kicker">${stone.forms.join(" · ")}</span><h4><a href="/tr/dogal-tas/${stone.slug}">${stone.name}</a></h4><p>${stone.type} · ${stone.city}</p><div class="card-footer"><span>${stone.color}</span><button type="button" data-card="${index}">Teklif iste →</button></div></div></article>`).join("");
}

function serviceCards(): string {
  return services.map((service, index) => `<article class="card"><div class="card-media has-illustration"><img src="/market/images/services/${service.image}.webp" alt="${service.title} için temsili sektör fotoğrafı" loading="lazy" decoding="async" width="1000" height="730"><span class="card-index">${String(index + 1).padStart(2, "0")}</span></div><div class="card-body"><span class="card-kicker">${service.subtitle}</span><h4>${service.title}</h4><p>${service.subtitle}</p><div class="card-footer"><span>Hizmet türü</span><button type="button" data-card="${index}">Detayları gör →</button></div></div></article>`).join("");
}

function machineCards(): string {
  return equipmentCategories.map((item, index) => `<article class="card"><div class="card-media has-illustration"><img src="/market/images/machines/${item.image}.webp" alt="${item.title} kategorisi için temsili sektör fotoğrafı" loading="lazy" decoding="async" width="1000" height="730"><span class="card-index">${String(index + 1).padStart(2, "0")}</span></div><div class="card-body"><span class="card-kicker">${item.subtitle}</span><h4>${item.title}</h4><p>${item.detail}</p><div class="card-footer"><span>Kategori bilgisi</span><button type="button" data-card="${index}">Detayları gör →</button></div></div></article>`).join("");
}

// The front page offers navigation into all four marketplaces, rather than
// presenting the natural stone catalogue as if it were the entire website.
function homeCategoryCards(): string {
  const categories = [
    { slug: "dogal-tas", title: "Doğal Taş", subtitle: "Mermer ve traverten çeşitlerini keşfedin", image: "/market/images/marble/white.webp", alt: "Temsili beyaz mermer plaka sunumu" },
    { slug: "firmalar", title: "Firmalar", subtitle: "Üretici ve tedarikçi rehberini inceleyin", image: "", alt: "" },
    { slug: "makine-sarf", title: "Makine ve Sarf", subtitle: "Kesim ekipmanları ve sarf kategorileri", image: "/market/images/machines/elmas-tel.webp", alt: "Temsili mermer kesim ekipmanı görseli" },
    { slug: "hizmetler", title: "Sektörel Hizmetler", subtitle: "Nakliye, gümrük ve sektör hizmetleri", image: "/market/images/services/lojistik.webp", alt: "Temsili taş taşımacılığı görseli" },
  ];
  return categories.map((item,index) => `<article class="discovery-card"><a href="/tr/${item.slug}" data-tab="${item.slug === 'dogal-tas' ? 'stones' : item.slug === 'firmalar' ? 'companies' : item.slug === 'makine-sarf' ? 'machines' : 'services'}" class="discovery-link">${item.image ? `<span class="discovery-media"><img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async" width="560" height="360" /></span>` : `<span class="discovery-media discovery-firm-mark" aria-hidden="true"><span>MB</span><small>B2B</small></span>`}<span class="discovery-copy"><small>0${index+1} / MARBLE BORSA</small><strong>${item.title}</strong><span>${item.subtitle}</span><b>Keşfet <span aria-hidden="true">↗</span></b></span></a></article>`).join("");
}

const editorialContent = {
  title: "Mermer satın alma süreci doğru bilgi ve doğrudan temasla başlar",
  description: "Mermer blok, plaka, ebatlı ürün, makine, sarf ve sektör hizmetleri arayan işletmeler için ihtiyaç belirleme, teklif toplama ve firmalarla doğrudan iletişim adımlarını açıklıyoruz. Marble Borsa kendi adına mermer satmaz; alıcılarla üretici, tedarikçi ve hizmet sağlayıcıları buluşturan B2B keşif ve teklif platformudur.",
};

export type MarketplaceCategory = keyof typeof pageSeo | "tedarikci-talepleri";

export function marketMarkup(category?: MarketplaceCategory, profile = false): string {
  const heading = category && category in pageSeo
    ? pageSeo[category as keyof typeof pageSeo].title
    : "Mermer ve doğal taş için doğrudan teklif alın.";
  const active = category || "home";
  const initialCards = !category ? homeCategoryCards() : category === "dogal-tas" ? stoneCards() : category === "hizmetler" ? serviceCards() : category === "makine-sarf" ? machineCards() : "";
  const topNav = navigation.map(({ tab, slug, title }) =>
    `<a href="/tr/${slug}" data-tab="${tab}" class="${slug === active ? "active" : ""}">${title}</a>`
  ).join("");
  const guideNav = '<a class="guide-nav-link" href="/tr/rehber">Mermer Rehberi</a>';
  const sideNav = navigation.map(({ tab, slug, title }) =>
    `<a href="/tr/${slug}" data-tab="${tab}" class="${slug === active ? "active" : ""}">${title}<b>›</b></a>`
  ).join("");
  const markup = body
    .replace('<div id="toast" role="status" aria-live="polite"></div>', `<script type="application/json" id="mb-company-data">[]</script><script type="application/json" id="mb-membership-plans">${safeJsonLd({ plans: Object.fromEntries(Object.entries(membershipPlans).map(([role, plan]) => [role, { durationMonths: plan.durationMonths }])), legalVersion })}</script><div id="toast" role="status" aria-live="polite"></div>`)
    .replace('<span id="stripText"></span>', '<span id="stripText">Doğal taş tedarik platformu</span>')
    .replace('href="./" aria-label="Marble Borsa ana sayfa"', 'href="/" aria-label="Marble Borsa ana sayfa"')
    .replace('<nav id="topNav" aria-label="Ana gezinme"></nav>', `<nav id="topNav" aria-label="Ana gezinme"><a href="/" data-tab="home" class="${active === "home" ? "active" : ""}">Ana Sayfa</a>${topNav}${guideNav}</nav>`)
    .replace('<div id="sideNav"></div>', `<div id="sideNav"><a href="/" data-tab="home" class="${active === "home" ? "active" : ""}">Genel Bakış<b>›</b></a>${sideNav}</div>`)
    .replace('<h1 id="heroTitle"></h1>', `<h1 id="heroTitle">${heading}</h1>`)
    .replace('<p id="heroLead"></p>', '<p id="heroLead">Mermer, traverten, makine ve doğal taş sektörü hizmetlerini inceleyin. Üretici ve tedarikçilerden doğrudan teklif isteyin; yanıtları Profil sayfanızda değerlendirin.</p>')
    .replace('<h2 id="marketHeading"></h2>', '<h2 id="marketHeading">Doğal taş ticaretinin buluşma noktası</h2>')
    .replace('<p id="marketIntro"></p>', '<p id="marketIntro">Taşları, firmaları, makine ve hizmetleri keşfedin. İşletmelerle doğrudan iletişime geçin.</p>')
    .replace('<small id="stoneNote"></small>', '<small id="stoneNote">TEMSİLİ PLAKA GÖRSELİ</small>')
    .replace('<strong id="stoneName"></strong>', '<strong id="stoneName">Afyon White</strong>')
    .replace('<span id="stoneCount"></span>', '<span id="stoneCount">01 / 04</span>')
    .replace('<h3 id="panelTitle"></h3>', `<h3 id="panelTitle">${category && category in panelTitle ? panelTitle[category as keyof typeof panelTitle] : "Platformu keşfedin"}</h3>`)
    .replace('<p id="panelSubtitle"></p>', `<p id="panelSubtitle">${category && category in panelSubtitle ? panelSubtitle[category as keyof typeof panelSubtitle] : "İhtiyacınıza uygun bir kategori seçin"}</p>`)
    .replace('<span id="resultCount" aria-live="polite"></span>', `<span id="resultCount" aria-live="polite">${category && initialCards ? `${category === "hizmetler" ? services.length : category === "makine-sarf" ? equipmentCategories.length : stones.length} sonuç` : ""}</span>`)
    .replace('<div id="cards" class="cards"></div>', `<div id="cards" class="cards${!category ? " discovery-grid" : ""}">${initialCards}</div>`)
    .replace('    <!-- mb-content-insertion -->', (!profile && (!category || category === "dogal-tas") ? `<section class="market-guide-preview" aria-labelledby="guide-preview-heading">
      <div><span class="guide-kicker" id="guide-preview-kicker">MERMER REHBERİ</span><h2 id="guide-preview-heading">Mermer almadan önce bilmeniz gerekenler</h2><p id="guide-preview-desc">Mermer nasıl alınır, fiyatlar nasıl karşılaştırılır, blok ve plaka seçiminde nelere dikkat edilir? Bağımsız satın alma rehberlerimizde öğrenin.</p></div>
      <a id="guide-preview-link" href="/tr/rehber">Rehberleri keşfet →</a></section>
      <section class="market-sourcing-preview" aria-label="Mermer teklifi ve B2B tedarik">
        <a class="market-sourcing-card" id="sourcing-quote-link" href="/tr/mermer-teklifi-al">
          <small id="sourcing-quote-kicker">ALICILAR İÇİN</small><strong id="sourcing-quote-title">Mermer teklifi nasıl alınır?</strong>
          <span id="sourcing-quote-desc">Blok ve plaka ihtiyacınız için üretici ve tedarikçilerden doğrudan teklif isteyin.</span>
          <b id="sourcing-quote-action">Teklif sürecini incele →</b>
        </a>
        <a class="market-sourcing-card" id="sourcing-b2b-link" href="/tr/b2b-mermer">
          <small id="sourcing-b2b-kicker">İŞLETMELER İÇİN</small><strong id="sourcing-b2b-title">B2B mermer ve doğal taş tedariki</strong>
          <span id="sourcing-b2b-desc">Alıcılarla üretici firmaları buluşturan doğrudan ticaret modelini keşfedin.</span>
          <b id="sourcing-b2b-action">B2B platformunu keşfet →</b>
        </a>
      </section>` : "") + '    <!-- mb-content-insertion -->');
  const withEditorial = markup.replace('    <!-- mb-content-insertion -->', `
      <section class="market-editorial" id="marketEditorial" aria-labelledby="marketEditorialTitle">
        <div class="market-editorial-copy">
          <span class="market-editorial-eyebrow" id="marketEditorialEyebrow">B2B DOĞAL TAŞ BİLGİ MERKEZİ</span>
          <h2 id="marketEditorialTitle">${editorialContent.title}</h2>
          <p id="marketEditorialDescription">${editorialContent.description}</p>
        </div>
        <nav class="market-editorial-links" aria-label="Mermer tedarik rehberleri">
          <a id="marketEditorialQuote" href="/tr/mermer-teklifi-al">Mermer teklifi alma süreci <span aria-hidden="true">↗</span></a>
          <a id="marketEditorialB2b" href="/tr/b2b-mermer">B2B mermer ve doğal taş <span aria-hidden="true">↗</span></a>
          <a id="marketEditorialGuide" href="/tr/rehber">Alım ve taş seçimi rehberi <span aria-hidden="true">↗</span></a>
        </nav>
      </section>
      <!-- mb-content-insertion -->`);
  return profile ? withEditorial
    .replace('<main>', '<main class="profile-page">')
    .replace('id="workspace" aria-labelledby="workspaceTitle" hidden', 'id="workspace" aria-labelledby="workspaceTitle"')
    .replace('<h2 id="workspaceTitle"></h2>', '<h1 id="workspaceTitle">Profil</h1>')
    .replace('<div id="workspaceContent"></div>', '<div id="workspaceContent"><div class="workspace-card">Hesap bilgileri yükleniyor…</div></div>') : withEditorial;
}

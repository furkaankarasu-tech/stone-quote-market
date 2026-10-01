import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pageSeo } from "./seo";
import { stones } from "./stoneData";
import { services } from "./serviceData";
import { membershipContactEmail, membershipPlans } from "./membershipPlans";
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
  return stones.map((stone, index) => `<article class="card"><div class="card-media has-illustration"><img src="/market/images/marble/${stone.image}" alt="${stone.name} doku önizlemesi" loading="lazy" decoding="async" width="640" height="640"><span class="card-index">${String(index + 1).padStart(2, "0")}</span></div><div class="card-body"><span class="card-kicker">${stone.forms.join(" · ")}</span><h4><a href="/tr/dogal-tas/${stone.slug}">${stone.name}</a></h4><p>${stone.type} · ${stone.city}</p><div class="card-footer"><span>${stone.color}</span><button type="button" data-card="${index}">Teklif iste →</button></div></div></article>`).join("");
}

function serviceCards(): string {
  return services.map((service, index) => `<article class="card"><div class="card-media has-illustration"><img src="/market/images/services/${service.image}.svg" alt="${service.title}" loading="lazy" decoding="async" width="640" height="640"><span class="card-index">${String(index + 1).padStart(2, "0")}</span></div><div class="card-body"><span class="card-kicker">${service.subtitle}</span><h4>${service.title}</h4><p>${service.subtitle}</p><div class="card-footer"><span>Hizmet türü</span><button type="button" data-card="${index}">Detayları gör →</button></div></div></article>`).join("");
}

export type MarketplaceCategory = keyof typeof pageSeo | "tedarikci-talepleri";

export function marketMarkup(category?: MarketplaceCategory, profile = false): string {
  const heading = category && category in pageSeo
    ? pageSeo[category as keyof typeof pageSeo].title
    : "Marble Borsa ile doğal taş tedariki için doğrudan teklif alın.";
  const active = category || "dogal-tas";
  const initialCards = !category || category === "dogal-tas" ? stoneCards() : category === "hizmetler" ? serviceCards() : "";
  const topNav = navigation.map(({ tab, slug, title }) =>
    `<a href="/tr/${slug}" data-tab="${tab}" class="${slug === active ? "active" : ""}">${title}</a>`
  ).join("");
  const guideNav = '<a class="guide-nav-link" href="/tr/rehber">Mermer Rehberi</a>';
  const sideNav = navigation.map(({ tab, slug, title }) =>
    `<a href="/tr/${slug}" data-tab="${tab}" class="${slug === active ? "active" : ""}">${title}<b>›</b></a>`
  ).join("");
  const markup = body
    .replace('<div id="toast" role="status" aria-live="polite"></div>', `<script type="application/json" id="mb-company-data">[]</script><script type="application/json" id="mb-membership-plans">${safeJsonLd({ plans: Object.fromEntries(Object.entries(membershipPlans).map(([role, plan]) => [role, { durationMonths: plan.durationMonths }])), contactEmail: membershipContactEmail, legalVersion })}</script><div id="toast" role="status" aria-live="polite"></div>`)
    .replace('href="./" aria-label="Marble Borsa ana sayfa"', 'href="/" aria-label="Marble Borsa ana sayfa"')
    .replace('<nav id="topNav" aria-label="Ana gezinme"></nav>', `<nav id="topNav" aria-label="Ana gezinme">${topNav}${guideNav}</nav>`)
    .replace('<div id="sideNav"></div>', `<div id="sideNav">${sideNav}</div>`)
    .replace('<h1 id="heroTitle"></h1>', `<h1 id="heroTitle">${heading}</h1>`)
    .replace('<p id="heroLead"></p>', '<p id="heroLead">Ürünleri ve üreticileri inceleyin. İhtiyacınız için teklif isteyin; gelen yanıtları Profil sayfanızda değerlendirin.</p>')
    .replace('<h2 id="marketHeading"></h2>', '<h2 id="marketHeading">Aradığınız her şey, tek pazarda.</h2>')
    .replace('<p id="marketIntro"></p>', '<p id="marketIntro">Doğal taş, makine, firma ve hizmetleri inceleyin.</p>')
    .replace('<small id="stoneNote"></small>', '<small id="stoneNote">DOKU ÖNİZLEMESİ</small>')
    .replace('<strong id="stoneName"></strong>', '<strong id="stoneName">Afyon White</strong>')
    .replace('<span id="stoneCount"></span>', '<span id="stoneCount">01 / 04</span>')
    .replace('<h3 id="panelTitle"></h3>', `<h3 id="panelTitle">${panelTitle[category || "dogal-tas"]}</h3>`)
    .replace('<p id="panelSubtitle"></p>', `<p id="panelSubtitle">${panelSubtitle[category || "dogal-tas"]}</p>`)
    .replace('<span id="resultCount" aria-live="polite"></span>', `<span id="resultCount" aria-live="polite">${initialCards ? `${category === "hizmetler" ? services.length : stones.length} sonuç` : ""}</span>`)
    .replace('<div id="cards" class="cards"></div>', `<div id="cards" class="cards">${initialCards}</div>`)
    .replace('    <section class="partners-section"', (!profile && (!category || category === "dogal-tas") ? `<section class="market-guide-preview" aria-labelledby="guide-preview-heading">
      <div><span class="guide-kicker" id="guide-preview-kicker">MERMER REHBERİ</span><h2 id="guide-preview-heading">Mermer almadan önce bilmeniz gerekenler</h2><p id="guide-preview-desc">Mermer nasıl alınır, fiyatlar nasıl karşılaştırılır, blok ve plaka seçiminde nelere dikkat edilir? Bağımsız satın alma rehberlerimizde öğrenin.</p></div>
      <a id="guide-preview-link" href="/tr/rehber">Rehberleri keşfet →</a></section>` : "") + '    <section class="partners-section"');
  return profile ? markup
    .replace('<main>', '<main class="profile-page">')
    .replace('id="workspace" aria-labelledby="workspaceTitle" hidden', 'id="workspace" aria-labelledby="workspaceTitle"')
    .replace('<h2 id="workspaceTitle"></h2>', '<h1 id="workspaceTitle">Profil</h1>')
    .replace('<div id="workspaceContent"></div>', '<div id="workspaceContent"><div class="workspace-card">Hesap bilgileri yükleniyor…</div></div>') : markup;
}

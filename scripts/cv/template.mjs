/* The print layout of the CV PDFs.
 *
 * Geometry is expressed in CSS pixels on an 816 × 1056 px page — that is US
 * Letter at 96 dpi, which is what Chrome's print pipeline uses and what the
 * existing PDFs were laid out on. Every page is an explicit <section>, so the
 * running header, the page number and the page breaks are deterministic rather
 * than dependent on how content happens to reflow. */

const PAGES = { profile: 1, skills: 2, overview: 1 };

/** Escapes text for HTML; **bold** runs become <b>. */
function rich(value) {
  const escaped = String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

function tag(item) {
  if (typeof item === "string") return `<span class="tag">${rich(item)}</span>`;
  return `<a class="tag tag-link" href="${item.href}">${rich(item.text)}</a>`;
}

function metaChip({ label, value, href }) {
  const body = href
    ? `<a href="${href}">${rich(value)}</a>`
    : rich(value);
  return `<span class="meta"><b>${rich(label)}</b> ${body}</span>`;
}

function page(cv, index, total, body, klass = "") {
  const { asOf, headerName, headerPlace, contact, pageLabel } = cv;
  return `
<section class="page ${klass}">
  <header class="running">
    <div class="asof">${rich(asOf)}</div>
    <div class="who">${rich(headerName)}</div>
    <div class="where">${rich(headerPlace)} · ${rich(contact.phone)} ·
      <a href="mailto:${contact.mail}">${contact.mail}</a> ·
      <a href="https://${contact.web}">${contact.web}</a> ·
      <a href="https://${contact.linkedin}">${contact.linkedin}</a></div>
  </header>
  <main class="body">${body}</main>
  <footer class="running-foot">${rich(pageLabel)} ${index} / ${total}</footer>
</section>`;
}

/* ---------------------------------------------------------------- page 1 */

function profilePage(cv, assets) {
  const p = cv.profile;
  const facts = p.lines
    .map(
      (line) =>
        `<div class="fact">${line
          .map(
            ({ label, value, href }) =>
              `<span class="fact-item"><b>${rich(label)}</b> ${
                href ? `<a href="${href}">${rich(value)}</a>` : rich(value)
              }</span>`,
          )
          .join("")}</div>`,
    )
    .join("");

  const groups = p.tagGroups
    .map(
      (g) =>
        `<div class="taggroup"><div class="taggroup-title">${rich(g.title)}</div>
         <div class="tags">${g.tags.map(tag).join("")}</div></div>`,
    )
    .join("");

  return `
<div class="banner"><span class="banner-mark">&lt;/&gt;</span></div>
<div class="hero">
  <div class="portrait"><img src="${assets.profile}" alt=""></div>
  <div class="hero-main">
    <div class="quote">${rich(p.quote)}</div>
    <h1 class="hero-name">${rich(p.name)}</h1>
    <div class="hero-role">${rich(p.role)}</div>
    ${facts}
    ${groups}
  </div>
</div>
<div class="callout">
  <span class="callout-mark">i</span>
  <div class="callout-body">
    ${p.intro.map((line) => `<p>${rich(line)}</p>`).join("")}
    <p class="cta"><b>${rich(p.cta.question)}</b> ${rich(p.cta.text)}<a href="${
      p.cta.href
    }">${rich(p.cta.link)}</a></p>
  </div>
</div>`;
}

/* -------------------------------------------------------------- pages 2–3 */

function skillsPage(cv, categories, subtitle) {
  const cards = categories
    .map(
      (c) => `<div class="skillcat">
        <div class="skillcat-head"><span class="num-sq">${c.num}</span>
          <span class="skillcat-name">${rich(c.name)}</span></div>
        <div class="tags">${c.items.map(tag).join("")}</div>
      </div>`,
    )
    .join("");
  return `
<h2 class="section-title">${rich(cv.skills.title)}</h2>
<div class="section-sub">${rich(subtitle)}</div>
<div class="skillgrid">${cards}</div>`;
}

/* ---------------------------------------------------------------- page 4 */

function overviewPage(cv) {
  const rows = cv.projects
    .map(
      (p) => `<div class="ovrow">
        <span class="num-circle">${p.num}</span>
        <span class="ovmain">
          <span class="ovname">${rich(p.name)}</span>
          <span class="ovdot"> · </span><span class="ovclient">${rich(p.client)}</span>
          <span class="ovrole">${rich(p.overviewRole)}</span>
        </span>
        <span class="ovcat">${rich(p.cat)}</span>
        <span class="ovdates"><span>${rich(p.dates)}</span><span class="ovdur">${rich(
          p.duration,
        )}</span></span>
      </div>`,
    )
    .join("");
  return `
<h2 class="section-title">${rich(cv.overview.title)}</h2>
<div class="section-sub">${rich(cv.overview.subtitle)}</div>
<div class="ovlist">${rows}</div>`;
}

/* -------------------------------------------------------------- pages 5–13 */

function projectPage(cv, project, assets) {
  const client = project.clientHref
    ? `<a href="${project.clientHref}">${rich(project.client)}</a>`
    : rich(project.client);
  const badge = project.recommendation
    ? `<span class="rec">↗ ${rich(cv.labels.recommendation)}</span>`
    : "";

  return `
<div class="proj-head">
  <span class="num-circle proj-num">${project.num}</span>
  <div class="proj-headtext">
    <div class="proj-cat">${rich(project.cat)}</div>
    <div class="proj-period">${rich(project.period)}</div>
    <h2 class="proj-title">${rich(project.name)}${
      project.subtitle ? ` — ${rich(project.subtitle)}` : ""
    }</h2>
    <div class="proj-role"><span><b>${rich(cv.labels.role)}</b> ${rich(
      project.role,
    )}</span><span><b>${rich(cv.labels.client)}</b> ${client}</span>${badge}</div>
  </div>
</div>
<div class="cover"><img src="${assets.covers[project.cover]}" alt=""></div>
<div class="metarow">${project.meta.map(metaChip).join("")}</div>
<h3 class="block-title">${rich(cv.labels.responsibilities)}</h3>
<ul class="bullets">${project.responsibilities
    .map((r) => `<li>${rich(r)}</li>`)
    .join("")}</ul>
<div class="resultbox">
  <h3 class="block-title">${rich(cv.labels.results)}</h3>
  <ul class="bullets">${project.results.map((r) => `<li>${rich(r)}</li>`).join("")}</ul>
</div>
<div class="techblock">
  <div class="tech-title">${rich(cv.labels.technologies)}</div>
  <div class="tags">${project.tech.map(tag).join("")}</div>
</div>`;
}

/* A project page carries whatever the project earned; the longest ones simply
   have more to say than the shortest. Rather than hand-tuning each page, the
   layout is given a fixed set of tightening steps and the page takes the first
   one it fits in — the cover gives way first (it is decoration), then the text
   metrics close up by a hair. Runs once, before Chrome paints the PDF. */
const FIT_SCRIPT = `
const STEPS = [
  {},
  { cover: 210 },
  { cover: 170 },
  { cover: 140 },
  { cover: 118 },
  { cover: 118, lead: 1.4 },
  { cover: 104, lead: 1.38, size: 10.6 },
  { cover: 92, lead: 1.36, size: 10.2 },
  { cover: 84, lead: 1.34, size: 9.9 },
];
for (const page of document.querySelectorAll(".page")) {
  const body = page.querySelector(".body");
  const cover = page.querySelector(".cover");
  for (const step of STEPS) {
    if (cover) cover.style.flexBasis = (step.cover || 262) + "px";
    body.style.setProperty("--bullet-lead", step.lead || "");
    body.style.setProperty("--bullet-size", step.size ? step.size + "px" : "");
    if (body.scrollHeight <= body.clientHeight + 0.5) break;
  }
}
`;

/* ------------------------------------------------------------------ shell */

export function renderCv(cv, assets) {
  const total = PAGES.profile + PAGES.skills + PAGES.overview + cv.projects.length;
  const half = Math.ceil(cv.skills.categories.length / 2);
  let n = 0;
  const pages = [
    page(cv, ++n, total, profilePage(cv, assets), "page-profile"),
    page(
      cv,
      ++n,
      total,
      skillsPage(cv, cv.skills.categories.slice(0, 9), cv.skills.subtitleA),
      "page-skills",
    ),
    page(
      cv,
      ++n,
      total,
      skillsPage(cv, cv.skills.categories.slice(9), cv.skills.subtitleB),
      "page-skills",
    ),
    page(cv, ++n, total, overviewPage(cv), "page-overview"),
    ...cv.projects.map((p) => page(cv, ++n, total, projectPage(cv, p, assets), "page-project")),
  ];
  void half;

  return `<!doctype html>
<html lang="${cv.lang}">
<head>
<meta charset="utf-8">
<title>CV Design</title>
<style>${css(assets)}</style>
</head>
<body>${pages.join("\n")}
<script>${FIT_SCRIPT}</script>
</body>
</html>`;
}

function css(assets) {
  return `
@font-face { font-family: Geist; font-weight: 400; font-style: normal;
  src: url(${assets.fonts.regular}) format("woff2"); }
@font-face { font-family: Geist; font-weight: 500; font-style: normal;
  src: url(${assets.fonts.medium}) format("woff2"); }
@font-face { font-family: Geist; font-weight: 600; font-style: normal;
  src: url(${assets.fonts.semibold}) format("woff2"); }
@font-face { font-family: Geist; font-weight: 700; font-style: normal;
  src: url(${assets.fonts.bold}) format("woff2"); }

:root {
  --ink: #161616;
  --body: #4a4a4a;
  --muted: #7a7a7a;
  --soft: #a39a8f;
  --accent: #c9622a;
  --accent-deep: #9a5a2e;
  --line: #ece7e0;
  --line-strong: #f0e8dd;
  --chip: #f0e8dd;
  --box: #faf7f2;
  --dark: #33302b;
}

@page { size: 8.5in 11in; margin: 0; }

* { box-sizing: border-box; margin: 0; padding: 0; }

html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

body {
  font-family: Geist, sans-serif;
  color: var(--body);
  font-size: 11px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--accent-deep); text-decoration: underline; text-underline-offset: 1.5px; }

b { font-weight: 600; color: var(--ink); }

.page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 816px;
  height: 1056px;
  padding: 0 58px 21px;
  overflow: hidden;
  break-after: page;
}
.page:last-child { break-after: auto; }

/* --- running header / footer ------------------------------------------ */

.running { padding-top: 22px; border-bottom: 1px solid var(--line); padding-bottom: 8px; }
.asof {
  font-size: 9.5px; font-style: italic; color: var(--soft);
  text-align: right; line-height: 1.35;
}
.who, .where {
  font-size: 10.5px; color: var(--muted); text-align: center; line-height: 1.42;
}
.who { margin-top: 1px; }
.where a { color: var(--accent-deep); }

.running { flex: 0 0 auto; }
.running-foot {
  flex: 0 0 auto;
  border-top: 1px solid var(--line); padding-top: 8px;
  font-size: 10px; color: var(--muted); text-align: right;
}

/* The body owns the space between header and footer, so a project page can
   push its technology block to the bottom edge and let the cover give way
   when the responsibilities run long — exactly what the layout does on paper. */
.body {
  flex: 1 1 auto; min-height: 0;
  display: flex; flex-direction: column;
  padding-top: 7px;
}

/* --- page 1 ------------------------------------------------------------ */

.banner {
  height: 40px; border-radius: 10px;
  background: linear-gradient(96deg, #f7ded6 0%, #f6ece2 46%, #ecdccb 100%);
  display: flex; align-items: center; padding-left: 12px;
}
.banner-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 26px; border-radius: 7px;
  background: var(--dark); color: var(--accent);
  font-size: 12px; font-weight: 600; letter-spacing: -0.02em;
}

.hero { display: flex; gap: 19px; margin-top: 6px; }
.portrait { width: 211px; flex: 0 0 211px; }
.portrait img {
  width: 211px; height: 264px; object-fit: cover; object-position: 50% 22%;
  border-radius: 10px; filter: grayscale(1) contrast(1.02);
}
.hero-main { flex: 1; min-width: 0; }

.quote { font-size: 12px; font-style: italic; font-weight: 600; color: var(--accent-deep); }
.hero-name {
  font-size: 24px; font-weight: 700; color: var(--ink);
  letter-spacing: -0.015em; line-height: 1.15; margin-top: 5px;
}
.hero-role {
  font-size: 10px; font-weight: 600; color: var(--accent);
  letter-spacing: 0.055em; text-transform: uppercase; margin-top: 3px;
}

/* One flex item per fact keeps the label glued to its value; a long value
   (the location line) then wraps inside its own item instead of running off
   the page. */
.fact { display: flex; flex-wrap: wrap; column-gap: 14px;
  font-size: 10.5px; margin-top: 5.5px; line-height: 1.35; }
.fact-item { max-width: 100%; }
.fact-item b { color: var(--accent-deep); font-weight: 600; }
.fact:first-of-type { margin-top: 8px; }

.taggroup { margin-top: 8px; }
.taggroup-title {
  font-size: 9.5px; font-weight: 600; color: var(--accent);
  letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 4px;
}
.tags { display: flex; flex-wrap: wrap; gap: 4px 5px; }
.tag {
  display: inline-block; padding: 2px 6px; border-radius: 5px;
  background: var(--chip); color: var(--body); font-size: 9.5px; line-height: 1.35;
}
.tag-link { color: var(--accent-deep); text-decoration: underline; }

.callout {
  display: flex; gap: 10px; margin-top: 13px;
  background: var(--box); border: 1px solid var(--line);
  border-left: 3px solid var(--accent); border-radius: 8px;
  padding: 12px 16px 13px 13px;
}
.callout-mark {
  flex: 0 0 auto; width: 12px; height: 12px; margin-top: 3px;
  border: 1.2px solid var(--accent); border-radius: 50%;
  color: var(--accent); font-size: 8px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.callout-body { flex: 1; min-width: 0; }
.callout-body p { font-size: 12px; line-height: 1.44; margin-bottom: 6px; }
.callout-body p:last-child { margin-bottom: 0; }
.cta { color: var(--accent-deep); }
.cta b { color: var(--accent-deep); }

/* --- pages 2–4 --------------------------------------------------------- */

.section-title { font-size: 17px; font-weight: 700; color: var(--ink); margin-top: 14px; }
.section-sub { font-size: 11px; color: var(--muted); margin-top: 2px; margin-bottom: 14px; }

.skillgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px 22px; }
.skillcat { break-inside: avoid; }
.skillcat-head { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.num-sq {
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; border-radius: 4px;
  background: var(--accent); color: #fff; font-size: 7.5px; font-weight: 700;
}
.skillcat-name {
  font-size: 10.5px; font-weight: 700; color: var(--ink);
  letter-spacing: 0.055em; text-transform: uppercase;
}

.ovlist { display: flex; flex-direction: column; gap: 6px; }
.ovrow {
  display: flex; align-items: center; gap: 10px;
  background: var(--box); border: 1px solid var(--line);
  border-radius: 8px; padding: 8px 12px;
}
.num-circle {
  display: inline-flex; align-items: center; justify-content: center;
  flex: 0 0 auto; width: 19px; height: 19px; border-radius: 50%;
  background: var(--dark); color: #fff; font-size: 8.5px; font-weight: 700;
}
.ovmain { flex: 1; min-width: 0; }
.ovname { font-size: 11.5px; font-weight: 700; color: var(--ink); }
.ovdot, .ovclient { font-size: 11.5px; color: var(--muted); }
.ovrole { display: block; font-size: 9.5px; color: var(--muted); margin-top: 1px; }
.ovcat {
  flex: 0 0 auto; background: var(--chip); color: var(--accent-deep);
  border-radius: 5px; padding: 3px 7px; font-size: 9px; font-weight: 600;
  margin-right: 10px;
}
.ovdates {
  flex: 0 0 auto; width: 108px; text-align: right;
  font-size: 9.5px; color: var(--body);
}
.ovdur { display: block; color: var(--muted); }

/* --- project pages ----------------------------------------------------- */

.proj-head { flex: 0 0 auto; display: flex; gap: 10px; margin-top: 10px; }
.proj-num { width: 22px; height: 22px; font-size: 9px; margin-top: 20px; }
.proj-headtext { flex: 1; min-width: 0; }
.proj-cat {
  font-size: 9.5px; font-weight: 700; color: var(--muted);
  letter-spacing: 0.09em; text-transform: uppercase;
}
.proj-period {
  font-size: 10.5px; font-weight: 500; color: var(--accent-deep);
  letter-spacing: 0.05em; text-transform: uppercase; margin-top: 4px;
}
.proj-title {
  font-size: 19.5px; font-weight: 700; color: var(--ink);
  letter-spacing: -0.012em; line-height: 1.2; margin-top: 3px;
}
.proj-role { display: flex; align-items: center; gap: 16px; margin-top: 5px; font-size: 13px; }
.proj-role b { color: var(--accent); font-weight: 600; }
.proj-role span { color: var(--ink); font-weight: 500; }
.rec {
  background: var(--chip); color: var(--accent-deep) !important;
  border-radius: 5px; padding: 2px 8px; font-size: 10px; font-weight: 600 !important;
}

.cover { flex: 0 1 262px; min-height: 0; margin-top: 11px; overflow: hidden; }
.cover img {
  width: 700px; height: 100%; object-fit: cover; border-radius: 10px; display: block;
}

.metarow { flex: 0 0 auto; display: flex; flex-wrap: wrap; gap: 5px 6px; margin-top: 11px; }
.meta {
  background: var(--box); border: 1px solid var(--line); border-radius: 6px;
  padding: 4px 9px; font-size: 10.5px; color: var(--body);
}
.meta b { color: var(--accent-deep); font-weight: 600; }

.block-title {
  flex: 0 0 auto;
  font-size: 11.5px; font-weight: 700; color: var(--ink);
  letter-spacing: 0.075em; text-transform: uppercase; margin-top: 13px;
}
.bullets { flex: 0 0 auto; list-style: none; margin-top: 5px; }
.bullets li {
  position: relative; padding-left: 16px;
  font-size: var(--bullet-size, 11px);
  line-height: var(--bullet-lead, 1.46); margin-bottom: 3px;
}
.bullets li::before {
  content: ""; position: absolute; left: 5px; top: 6px;
  width: 3px; height: 3px; border-radius: 50%; background: var(--dark);
}

.resultbox {
  flex: 0 0 auto;
  background: var(--box); border: 1px solid var(--line); border-radius: 8px;
  padding: 3px 14px 11px; margin-top: 14px;
}
.resultbox .block-title { margin-top: 9px; }

.techblock { margin-top: auto; padding-top: 14px; }
.tech-title {
  font-size: 9.5px; font-weight: 700; color: var(--accent);
  letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 5px;
}
`;
}

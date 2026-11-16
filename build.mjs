// Générateur statique sans dépendance : node build.mjs  →  dist/
import { readdirSync, readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const cfg = JSON.parse(readFileSync('site.config.json', 'utf8'));
const tpl = readFileSync('src/template.html', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const warn = m => console.warn('⚠️  ' + m);
const sub = (s, o) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in o ? o[k] : `{{${k}}}`));
const vars = { base: cfg.basePath, doctolib: cfg.doctolib, phone: cfg.phone, email: cfg.email,
  phoneHref: cfg.phone.replace(/\s/g, ''), baseUrl: cfg.baseUrl, city: cfg.city };

function load(dir, type) {
  return readdirSync(dir).filter(f => f.endsWith('.html')).map(f => {
    const m = readFileSync(join(dir, f), 'utf8').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) throw new Error(`${dir}/${f} : front matter manquant`);
    const p = { type, body: m[2] };
    m[1].split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) p[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    p.slug ??= ''; p.related = (p.related || '').split(',').map(s => s.trim()).filter(Boolean);
    return p;
  });
}
const pages = load('src/pages', 'page');
const articles = load('src/articles', 'article').sort((a, b) => b.date.localeCompare(a.date));
const all = [...pages, ...articles];
const bySlug = Object.fromEntries(all.map(p => [p.slug, p]));
const href = p => `${cfg.basePath}/${p.slug}${p.slug ? '/' : ''}`;
const inbound = {};

// Contrôles SEO
for (const p of all) {
  const t = p.title.length + (p.type === 'article' ? 0 : 0);
  if (t > 65) warn(`${p.slug || 'accueil'} : title de ${t} car. (idéal ≤ 60)`);
  if (!p.description || p.description.length < 80 || p.description.length > 160)
    warn(`${p.slug || 'accueil'} : meta description de ${(p.description || '').length} car. (visé 110–160)`);
  p.related.forEach(r => { if (!bySlug[r]) warn(`${p.slug} : related inconnu « ${r} »`); else inbound[r] = (inbound[r] || 0) + 1; });
  if (p.type === 'article' && p.related.length < 2) warn(`${p.slug} : moins de 2 liens « related »`);
}
articles.forEach(a => { if (!inbound[a.slug]) warn(`${a.slug} : aucun lien entrant depuis une autre page (orpheline)`); });

const card = a => `<li><a href="${href(a)}"><strong>${esc(a.title)}</strong><span>${esc(a.description)}</span></a></li>`;
const list = n => `<ul class="cards">${articles.slice(0, n || undefined).map(card).join('')}</ul>`;
const nav = pages.filter(p => p.nav).sort((a, b) => a.order - b.order).map(p =>
  `<a href="${href(p)}"${p.slug === 'prendre-rendez-vous' ? ' class="cta"' : ''}>${esc(p.nav)}</a>`).join('');

function jsonld(p, url) {
  const person = { '@type': 'Person', name: cfg.name, jobTitle: 'Psychologue clinicienne', url: cfg.baseUrl + '/' };
  const g = [];
  if (p.slug === '') g.push({ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: cfg.name + ', psychologue',
    description: p.description, url: url, telephone: '+33' + cfg.phone.replace(/\s/g, '').slice(1), email: cfg.email,
    image: cfg.baseUrl + '/assets/img/og-image.jpg', areaServed: cfg.city, address: { '@type': 'PostalAddress', addressLocality: cfg.city, addressCountry: 'FR' }, founder: person });
  if (p.type === 'article') {
    g.push({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, author: person,
      datePublished: p.date, dateModified: p.updated || p.date, mainEntityOfPage: url,
      image: cfg.baseUrl + '/assets/img/' + (p.image || 'og-image.jpg') });
    g.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      [cfg.name, cfg.baseUrl + '/'], ['Questions fréquentes', cfg.baseUrl + '/articles/'], [p.title, url]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });
  }
  return g.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('');
}

function render(p) {
  const url = `${cfg.baseUrl}/${p.slug}${p.slug ? '/' : ''}`;
  let body = p.body.replace(/<!--ARTICLES(?::(\d+))?-->/g, (_, n) => list(n && +n));
  if (p.type === 'article') {
    const img = p.image ? `<figure><picture><source type="image/webp" srcset="{{base}}/assets/img/${p.image}-640.webp 640w, {{base}}/assets/img/${p.image}-1200.webp 1200w" sizes="(min-width:800px) 760px, 100vw"><img src="{{base}}/assets/img/${p.image}-1200.webp" width="1200" height="${p.imageH || 600}" alt="${esc(p.alt || '')}" fetchpriority="high"></picture></figure>` : '';
    const rel = p.related.filter(r => bySlug[r]).map(r => `<li><a href="${href(bySlug[r])}">${esc(bySlug[r].title)}</a></li>`).join('');
    body = `<article class="wrap prose"><nav class="crumbs" aria-label="Fil d’Ariane"><a href="{{base}}/">Accueil</a> › <a href="{{base}}/articles/">Questions fréquentes</a></nav>
<h1>${esc(p.title)}</h1><p class="meta">Par Isabelle Cuchet, psychologue à ${cfg.city} · <time datetime="${p.updated || p.date}">${p.updated || p.date}</time></p>${img}${body}
${rel ? `<aside class="more"><h2>Pour aller plus loin</h2><ul>${rel}</ul></aside>` : ''}
<aside class="cta-box"><p>Vous vous reconnaissez dans cette question ? Je vous reçois à ${cfg.city}.</p><p><a class="btn" href="{{doctolib}}" rel="noopener">Prendre rendez-vous</a> <a class="btn ghost" href="{{base}}/">Découvrir mon cabinet</a></p></aside></article>`;
  }
  const out = sub(tpl, { css, nav, content: body, title: esc(p.title), description: esc(p.description), canonical: url,
    ogimage: `${cfg.baseUrl}/assets/img/${p.image ? p.image + '-1200' : 'og-image'}.${p.image ? 'webp' : 'jpg'}`,
    ogtype: p.type === 'article' ? 'article' : 'website', jsonld: jsonld(p, url), adeli: cfg.adeli, siret: cfg.siret, name: cfg.name, robots: p.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large' });
  return sub(out, vars);
}

rmSync('dist', { recursive: true, force: true });
cpSync('public', 'dist', { recursive: true });
for (const p of all) {
  const dir = join('dist', p.slug); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), render(p));
}
writeFileSync('dist/robots.txt', sub(readFileSync('public/robots.txt', 'utf8'), vars));
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  all.filter(p => !p.noindex).map(p => `<url><loc>${cfg.baseUrl}/${p.slug}${p.slug ? '/' : ''}</loc>${p.updated || p.date ? `<lastmod>${p.updated || p.date}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n');
console.log(`✅ ${pages.length} pages, ${articles.length} articles → dist/`);

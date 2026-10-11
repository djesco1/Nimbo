#!/usr/bin/env node
// Nimbo build: valida la especificación y genera iconos, relaciones, ejemplos, tabla de equivalencias y catálogo.
// Uso:  node scripts/build.mjs          genera los archivos
//       node scripts/build.mjs --check  falla si la especificación es inválida o los archivos generados están desactualizados
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

const families = read('spec/families.json');
const components = read('spec/components.json');
const relations = read('spec/relations.json');
const providers = readdirSync(join(ROOT, 'spec/bindings')).filter(f => f.endsWith('.json')).sort((a, b) => order(a) - order(b)).map(f => read(`spec/bindings/${f}`));
const examples = readdirSync(join(ROOT, 'spec/examples')).filter(f => f.endsWith('.json')).map(f => read(`spec/examples/${f}`));
function order(f) { const i = ['aws.json', 'azure.json', 'gcp.json'].indexOf(f); return i < 0 ? 99 : i; }

// ---------------------------------------------------------------- validación
const errors = [];
const famById = Object.fromEntries(families.map(f => [f.id, f]));
const compByKey = new Map();
const TIERS = ['core', 'extended', 'notation'];
for (const c of components) {
  if (compByKey.has(c.key)) errors.push(`Clave repetida: ${c.key}`);
  compByKey.set(c.key, c);
  if (!/^[a-z]+\.[a-z0-9-]+$/.test(c.key)) errors.push(`Clave con formato inválido: ${c.key} (usa familia.nombre)`);
  if (!famById[c.family]) errors.push(`${c.key}: familia desconocida "${c.family}"`);
  if (c.key.split('.')[0] !== c.family) errors.push(`${c.key}: el prefijo de la clave no coincide con la familia`);
  if (!TIERS.includes(c.tier)) errors.push(`${c.key}: nivel "${c.tier}" inválido`);
  if (!c.icon || !c.icon.includes('<')) errors.push(`${c.key}: falta el icono`);
  const bound = providers.filter(p => p.services[c.key]).length;
  if (c.tier === 'core' && bound !== providers.length) errors.push(`${c.key}: es "core" pero solo tiene equivalencia en ${bound} de ${providers.length} proveedores`);
  if (c.tier === 'extended' && bound === 0) errors.push(`${c.key}: es "extended" pero no tiene ninguna equivalencia`);
  if (c.tier === 'notation' && bound > 0) errors.push(`${c.key}: es "notation" y no debería tener equivalencias`);
}
for (const p of providers) for (const k of Object.keys(p.services)) if (!compByKey.has(k)) errors.push(`${p.provider}: equivalencia para clave inexistente ${k}`);
const relByKey = Object.fromEntries(relations.map(r => [r.key, r]));
const matches = (pattern, key) => pattern === '*' || pattern === key || (pattern.endsWith('.*') && key.startsWith(pattern.slice(0, -1)));
for (const r of relations) for (const pat of [...r.from, ...r.to]) {
  if (pat === '*') continue;
  const ok = pat.endsWith('.*') ? !!famById[pat.slice(0, -2)] : compByKey.has(pat);
  if (!ok) errors.push(`${r.key}: patrón desconocido "${pat}"`);
}
for (const ex of examples) {
  const nodes = Object.fromEntries(ex.nodes.map(n => [n.id, n]));
  for (const n of ex.nodes) {
    if (!compByKey.has(n.type)) errors.push(`ejemplo ${ex.name}: ${n.id} usa un tipo inexistente ${n.type}`);
    if (!ex.layout?.[n.id]) errors.push(`ejemplo ${ex.name}: ${n.id} no tiene posición`);
  }
  for (const z of ex.zones || []) for (const id of z.contains) if (!nodes[id]) errors.push(`ejemplo ${ex.name}: la zona ${z.id} contiene ${id}, que no existe`);
  for (const e of ex.edges) {
    const r = relByKey[e.rel], a = nodes[e.from], b = nodes[e.to];
    if (!r) { errors.push(`ejemplo ${ex.name}: relación desconocida ${e.rel}`); continue; }
    if (!a || !b) { errors.push(`ejemplo ${ex.name}: ${e.from} → ${e.to} usa nodos inexistentes`); continue; }
    if (!r.from.some(p => matches(p, a.type)) || !r.to.some(p => matches(p, b.type)))
      errors.push(`ejemplo ${ex.name}: error de tipo, ${r.key} no conecta ${a.type} → ${b.type}`);
  }
}
if (errors.length) { console.error('La especificación tiene errores:\n- ' + errors.join('\n- ')); process.exit(1); }

// ---------------------------------------------------------------- render
const ATTRS = 'fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const iconSvg = (c, stroke, size = 44) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 44 44" ${ATTRS} stroke="${stroke}"><title>${c.name} (${c.key})</title>${c.icon}</svg>\n`;

const HEAD_LEN = { tri: 11, chev: 1, dchev: 1, circ: 11, sq: 11, dia: 16, htri: 11 };
function head(type, x, y, angle, col, bg, k) {
  const st = `fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const g = (s) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)}) scale(${k})">${s}</g>`;
  switch (type) {
    case 'tri': return g(`<path d="M0 0L-11 -5.5L-11 5.5Z" fill="${col}"/>`);
    case 'chev': return g(`<path d="M-10 -6L0 0L-10 6" ${st}/>`);
    case 'dchev': return g(`<path d="M-10 -6L0 0L-10 6M-17 -6L-7 0L-17 6" ${st}/>`);
    case 'circ': return g(`<circle cx="-5.5" cy="0" r="5" fill="${bg}" stroke="${col}" stroke-width="2"/>`);
    case 'sq': return g(`<rect x="-11" y="-5.5" width="11" height="11" fill="${col}"/>`);
    case 'dia': return g(`<path d="M0 0L-8 -6L-16 0L-8 6Z" fill="${bg}" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`);
    case 'htri': return g(`<path d="M0 0L-11 -6L-11 6Z" fill="${bg}" stroke="${col}" stroke-width="1.5" stroke-linejoin="round"/>`);
  }
  return '';
}
function r1(n) { return Math.round(n * 10) / 10; }
// Dibuja una relación de (x1,y1) a (x2,y2). fg = color del trazo, muted = color atenuado, bg = fondo detrás.
function edgeSvg(rel, x1, y1, x2, y2, { fg, muted, bg }) {
  const s = rel.style, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI, k = s.double ? 1.35 : 1;
  const he = s.double ? 6 : HEAD_LEN[s.head] * k, te = s.tail ? (s.double ? 6 : HEAD_LEN[s.tail]) : 0;
  const sx = x1 + ux * te, sy = y1 + uy * te, ex = x2 - ux * he, ey = y2 - uy * he, col = s.muted ? muted : fg;
  const ln = (a) => `<line x1="${r1(sx)}" y1="${r1(sy)}" x2="${r1(ex)}" y2="${r1(ey)}" ${a}/>`;
  let o = s.double
    ? ln(`stroke="${col}" stroke-width="7"`) + ln(`stroke="${bg}" stroke-width="3"`)
    : ln(`stroke="${col}" stroke-width="${s.w || 2}" stroke-linecap="${s.cap || 'butt'}"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''}`);
  o += head(s.head, x2, y2, angle, col, bg, k);
  if (s.tail) o += head(s.tail, x1, y1, angle + 180, col, bg, k);
  return o;
}
const relationSvg = (rel, pal) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="40" viewBox="0 0 260 40"><title>${rel.name} (${rel.key})</title>` +
  `<circle cx="14" cy="20" r="5" fill="${pal.dot}"/><circle cx="246" cy="20" r="5" fill="${pal.dot}"/>${edgeSvg(rel, 24, 20, 236, 20, pal)}</svg>\n`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// pal: { fg, muted, bg, line, family: id => color, font }
function exampleSvg(ex, pal) {
  const nodes = Object.fromEntries(ex.nodes.map(n => [n.id, n]));
  const pos = ex.layout, xs = Object.values(pos).map(p => p[0]), ys = Object.values(pos).map(p => p[1]);
  const W = Math.max(...xs) + 100, H = Math.max(...ys) + 100;
  const txt = (x, y, s, size, fill) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${pal.font}" font-size="${size}" fill="${fill}">${esc(s)}</text>`;
  let o = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img"><title>${esc(ex.title)}</title>`;
  for (const z of ex.zones || []) {
    const pts = z.contains.map(id => pos[id]);
    const x0 = Math.min(...pts.map(p => p[0])) - 66, x1 = Math.max(...pts.map(p => p[0])) + 66;
    const y0 = Math.min(...pts.map(p => p[1])) - 66, y1 = Math.max(...pts.map(p => p[1])) + 70;
    o += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="8" fill="none" stroke="${pal.muted}" stroke-dasharray="5 4"/>`;
    o += `<text x="${x0 + 10}" y="${y0 - 8}" font-family="${pal.font}" font-size="11" fill="${pal.muted}">${esc(z.type)} · ${esc(z.id)}</text>`;
  }
  for (const e of ex.edges) {
    const a = pos[e.from], b = pos[e.to], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), r = 30;
    o += edgeSvg(relations.find(r => r.key === e.rel), a[0] + dx / L * r, a[1] + dy / L * r, b[0] - dx / L * r, b[1] - dy / L * r, pal);
  }
  const rowTop = Math.min(...ys);
  for (const n of ex.nodes) {
    const c = compByKey.get(n.type), [x, y] = pos[n.id];
    o += `<g transform="translate(${x - 22} ${y - 22})" ${ATTRS} stroke="${pal.family(c.family)}">${c.icon}</g>`;
    o += y === rowTop
      ? txt(x, y - 48, n.id, 12, pal.fg) + txt(x, y - 34, n.type, 11, pal.muted)
      : txt(x, y + 44, n.id, 12, pal.fg) + txt(x, y + 58, n.type, 11, pal.muted);
  }
  return o + '</svg>';
}

// ---------------------------------------------------------------- salidas
const out = new Map();
const LIGHT = { fg: '#1A1D23', muted: '#5D6472', bg: '#FFFFFF', dot: '#C9CED8', family: id => famById[id].color.light, font: 'IBM Plex Mono, ui-monospace, monospace' };
for (const c of components) {
  out.set(`icons/${c.family}/${c.key}.svg`, iconSvg(c, famById[c.family].color.light));
  out.set(`icons/mono/${c.key}.svg`, iconSvg(c, 'currentColor'));
}
for (const r of relations) out.set(`relations/${r.key}.svg`, relationSvg(r, LIGHT));
for (const ex of examples) out.set(`docs/examples/${ex.name}.svg`, exampleSvg(ex, LIGHT) + '\n');

// Tabla de equivalencias
const TIER_LABEL = { core: 'Núcleo', extended: 'Extendido', notation: 'Notación' };
let md = `<!-- Archivo generado por scripts/build.mjs a partir de spec/. No lo edites a mano. -->\n# Tabla de equivalencias\n\n`;
md += `Cada componente del lenguaje y el servicio que lo implementa en cada proveedor. Revisado: ${providers.map(p => `${p.name} ${p.reviewed}`).join(', ')}.\n\n`;
md += `- **Núcleo:** los ${providers.length} proveedores tienen un servicio administrado con el mismo rol.\n- **Extendido:** existe en algunos proveedores, o la equivalencia tiene diferencias importantes.\n- **Notación:** elemento del lenguaje sin servicio que lo respalde.\n\n`;
md += `| Familia | Núcleo | Extendido | Notación |\n|---|---:|---:|---:|\n`;
for (const f of families) {
  const cs = components.filter(c => c.family === f.id);
  md += `| ${f.name} | ${cs.filter(c => c.tier === 'core').length} | ${cs.filter(c => c.tier === 'extended').length} | ${cs.filter(c => c.tier === 'notation').length} |\n`;
}
md += `| **Total** | **${components.filter(c => c.tier === 'core').length}** | **${components.filter(c => c.tier === 'extended').length}** | **${components.filter(c => c.tier === 'notation').length}** |\n\n`;
for (const f of families) {
  md += `## ${f.name}\n\n${f.description}\n\n| Icono | Componente | Nivel | ${providers.map(p => p.name).join(' | ')} |\n|---|---|---|${providers.map(() => '---').join('|')}|\n`;
  const notes = [];
  for (const c of components.filter(c => c.family === f.id)) {
    md += `| <img src="../icons/${c.family}/${c.key}.svg" width="28" alt=""> | **${c.name}**<br>\`${c.key}\` | ${TIER_LABEL[c.tier]} | ${providers.map(p => p.services[c.key]?.service ?? '—').join(' | ')} |\n`;
    if (c.note) notes.push(`- \`${c.key}\`: ${c.note}`);
  }
  md += notes.length ? `\n${notes.join('\n')}\n\n` : '\n';
}
out.set('docs/equivalencias.md', md);

// Catálogo web (GitHub Pages sirve docs/index.html)
const data = {
  families,
  components: components.map(c => ({ ...c, bindings: Object.fromEntries(providers.map(p => [p.provider, p.services[c.key]?.service ?? null])) })),
  providers: providers.map(p => ({ id: p.provider, name: p.name })),
  relations: relations.map(r => ({ ...r, svg: relationSvg(r, { fg: 'var(--fg)', muted: 'var(--muted)', bg: 'var(--surface)', dot: 'var(--line)' }) })),
  example: examples[0] && {
    ...examples[0],
    svg: exampleSvg(examples[0], { fg: 'var(--fg)', muted: 'var(--muted)', bg: 'var(--surface)', family: id => `var(--f-${id})`, font: 'var(--mono)' })
  }
};
const tpl = readFileSync(join(ROOT, 'scripts/catalog.template.html'), 'utf8');
out.set('docs/index.html', tpl.replace('/*__NIMBO_DATA__*/null', JSON.stringify(data).replace(/</g, '\\u003c')));

// ---------------------------------------------------------------- escribir o comprobar
const generatedDirs = ['icons', 'relations', 'docs/examples'];
if (CHECK) {
  const stale = [...out].filter(([p, s]) => !existsSync(join(ROOT, p)) || readFileSync(join(ROOT, p), 'utf8') !== s).map(([p]) => p);
  const extra = generatedDirs.flatMap(d => listFiles(d)).filter(p => !out.has(p));
  if (stale.length || extra.length) {
    console.error(`Los archivos generados están desactualizados. Corre "npm run build".\n${[...stale, ...extra.map(p => p + ' (sobra)')].slice(0, 20).map(p => '- ' + p).join('\n')}`);
    process.exit(1);
  }
  console.log(`Especificación válida y ${out.size} archivos al día.`);
} else {
  for (const d of generatedDirs) rmSync(join(ROOT, d), { recursive: true, force: true });
  for (const [p, s] of out) { mkdirSync(dirname(join(ROOT, p)), { recursive: true }); writeFileSync(join(ROOT, p), s); }
  console.log(`${components.length} componentes, ${relations.length} relaciones, ${providers.length} proveedores. ${out.size} archivos generados.`);
}
function listFiles(d) {
  const abs = join(ROOT, d);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true }).flatMap(e => e.isDirectory() ? listFiles(`${d}/${e.name}`) : [`${d}/${e.name}`]);
}

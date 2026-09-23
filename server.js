import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeProject, approvedProject, colorFor, sizeFor, radiusFor } from './model.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, 'data');
const projectFile = path.join(dataDir, 'projects.json');
const handoffDir = path.join(root, 'handoffs');
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(handoffDir, { recursive: true });
if (!fs.existsSync(projectFile)) fs.writeFileSync(projectFile, '[]');
const readProjects = () => JSON.parse(fs.readFileSync(projectFile, 'utf8')).map(normalizeProject);
const saveProjects = p => { const next = projectFile + '.next'; fs.writeFileSync(next, JSON.stringify(p, null, 2)); fs.renameSync(next, projectFile); };
const send = (res, code, data) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
const clean = s => String(s || '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60) || 'design';
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaultProject = () => normalizeProject({ id: crypto.randomUUID(), name: 'Untitled design', brief: '', width: 390, height: 844, background: '#f5f7fb', elements: [
  { id: crypto.randomUUID(), type: 'text', x: 30, y: 38, w: 330, h: 34, text: 'YOUR IDEA, IN FOCUS', fontSize: 12, color: '#64748b', weight: '700', radius: 0 },
  { id: crypto.randomUUID(), type: 'text', x: 30, y: 95, w: 330, h: 115, text: 'Make something worth using.', fontSize: 38, color: '#13203a', weight: '700', radius: 0 },
  { id: crypto.randomUUID(), type: 'text', x: 30, y: 230, w: 325, h: 80, text: 'Select an element to edit it. Drag it on the canvas, then save a version when it feels right.', fontSize: 16, color: '#526078', weight: '400', radius: 0 },
  { id: crypto.randomUUID(), type: 'button', x: 30, y: 345, w: 330, h: 56, text: 'Get started', fontSize: 16, color: '#ffffff', background: '#345eea', weight: '700', radius: 14 }
], versions: [], updatedAt: new Date().toISOString() });

function validateProject(p) {
  if (!p || typeof p !== 'object' || typeof p.id !== 'string' || typeof p.name !== 'string') throw Error('Invalid design');
  const normalized = normalizeProject(p);
  if (!normalized.screens.length || normalized.screens.length > 40 || normalized.screens.some(s=>!s.id || !s.name || !Array.isArray(s.elements) || s.elements.length > 250) || JSON.stringify(normalized).length > 10_000_000) throw Error('Design is too large or invalid');
  return normalized;
}
function handoffHtml(p) {
  const safeColor = value => /^#[0-9a-f]{6}$/i.test(String(value)) ? value : 'transparent';
  const safeFont = String(p.designSystem.typography.family || 'Arial, sans-serif').replace(/[^a-zA-Z0-9 ,'-]/g,'');
  const screens = p.screens.map(s => {
    const items = s.elements.map(e => `<div style="position:absolute;left:${Number(e.x)||0}px;top:${Number(e.y)||0}px;width:${Number(e.w)||100}px;height:${Number(e.h)||40}px;box-sizing:border-box;overflow:hidden;display:${e.type==='button'?'flex':'block'};align-items:center;justify-content:center;padding:${e.type==='button'?'0 12px':'0'};font:${escapeHtml(e.weight||'400')} ${Number(sizeFor(p,e))||16}px ${safeFont};line-height:1.18;color:${safeColor(colorFor(p,e,'color')||'#111827')};background:${safeColor(colorFor(p,e,'background')||'transparent')};border-radius:${Number(radiusFor(p,e))||0}px;white-space:pre-wrap">${escapeHtml(e.text||'')}</div>`).join('\n');
    return `<section><h2>${escapeHtml(s.name)}</h2><div class="screen" style="width:${Number(s.width)||390}px;height:${Number(s.height)||844}px;background:${safeColor(s.backgroundToken ? p.designSystem.colors[s.backgroundToken] : s.background)}">${items}</div></section>`;
  }).join('\n');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(p.name)}</title><style>body{margin:0;background:#e9edf4;padding:30px;font-family:Arial,sans-serif;color:#24324b}main{display:flex;gap:30px;align-items:flex-start;flex-wrap:wrap}h1{font-size:22px}h2{font-size:14px}.screen{position:relative;box-shadow:0 20px 70px #17213933;overflow:hidden}</style><h1>${escapeHtml(p.name)} · Approved preview</h1><main>${screens}</main></html>`;
}
function handoffBrief(p, version) {
  const b=p.briefFields;
  return `# ${p.name}\n\nApproved design version: ${version}\nExported: ${new Date().toISOString()}\n\n## Brief\n- Goal: ${b.goal || 'Unspecified'}\n- Audience: ${b.audience || 'Unspecified'}\n- Layout: ${b.layout || 'Unspecified'}\n- Content: ${b.content || 'Unspecified'}\n\n## Design system\n${JSON.stringify(p.designSystem,null,2)}\n\n## Screens\n${p.screens.map(s=>`### ${s.name} (${s.width} × ${s.height})\n${s.elements.map(e=>`- ${e.type}: “${String(e.text||'').replace(/\n/g,' ')}” at (${e.x}, ${e.y}), ${e.w} × ${e.h}`).join('\n')}\n${s.comments.filter(c=>!c.resolved).map(c=>`- Open note on ${c.elementId}: ${c.text}`).join('\n')}`).join('\n')}\n\n## Implementation instructions\nImplement every approved screen using design.json, the shared design system, and preview.html. Reuse components and tokens across screens. Preserve content and hierarchy. Compare each rendered screen to its approved preview size and check the exported preview before calling the work complete. Treat unspecified behavior as a question, not a business rule.\n`;
}
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost');
    if (u.pathname.startsWith('/api/')) {
      if (req.method === 'GET' && u.pathname === '/api/projects') return send(res, 200, readProjects());
      if (req.method === 'GET' && u.pathname.match(/^\/api\/projects\/[^/]+\/preview$/)) {
        const id=u.pathname.split('/')[3]; const p=readProjects().find(x=>x.id===id); if(!p) return send(res,404,{error:'Design not found'});
        const version=p.versions.at(-1); if(!version) return send(res,400,{error:'Save a version before preview'});
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}); return res.end(handoffHtml(approvedProject(p,version)));
      }
      let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 2_000_000) throw Error('Request is too large'); }
      const body = raw ? JSON.parse(raw) : {};
      if (req.method === 'POST' && u.pathname === '/api/projects') { const p = defaultProject(); const all = readProjects(); all.unshift(p); saveProjects(all); return send(res, 201, p); }
      if (req.method === 'PUT' && u.pathname.startsWith('/api/projects/')) {
        const id = u.pathname.split('/')[3]; const all = readProjects(); const index = all.findIndex(p => p.id === id); if (index < 0) return send(res, 404, {error:'Design not found'});
        const p = validateProject(body); if (p.id !== id) throw Error('Design ID mismatch'); p.updatedAt = new Date().toISOString(); all[index] = p; saveProjects(all); return send(res, 200, p);
      }
      if (req.method === 'POST' && u.pathname.match(/^\/api\/projects\/[^/]+\/handoff$/)) {
        const id = u.pathname.split('/')[3]; const p = readProjects().find(x => x.id === id); if (!p) return send(res, 404, {error:'Design not found'});
        const approved = (p.versions || []).at(-1); if (!approved) return send(res, 400, {error:'Save a version before handoff'});
        const version = approved.label; const design = {...approvedProject(p,approved), approvedVersion: version}; const folder = path.join(handoffDir, clean(p.name) + '-' + clean(id)); fs.mkdirSync(folder, {recursive:true});
        fs.writeFileSync(path.join(folder,'design.json'), JSON.stringify(design,null,2)); fs.writeFileSync(path.join(folder,'preview.html'), handoffHtml(design)); fs.writeFileSync(path.join(folder,'IMPLEMENT.md'), handoffBrief(design,version));
        return send(res, 200, {folder, previewUrl:`http://127.0.0.1:${port}/api/projects/${id}/preview`, prompt:`Implement the approved design in ${folder} using IMPLEMENT.md, design.json, and preview.html. Build every screen using the shared design system and compare each result with the approved preview.`});
      }
      return send(res, 404, {error:'Unknown API route'});
    }
    const file = path.resolve(root, '.' + (u.pathname === '/' ? '/index.html' : u.pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory() || !['.html','.js','.css','.svg'].includes(path.extname(file))) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {'Content-Type':(mime[path.extname(file)]||'text/plain')+'; charset=utf-8'}); fs.createReadStream(file).pipe(res);
  } catch (e) { send(res, 400, {error:e.message}); }
});
const port = Number(process.env.PORT)||4177;
server.listen(port, '127.0.0.1', () => console.log(`Open Design Studio: http://127.0.0.1:${port}`));

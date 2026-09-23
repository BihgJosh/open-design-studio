import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const getPort = () => new Promise((resolve, reject) => {
  const s = net.createServer(); s.once('error', reject); s.listen(0, '127.0.0.1', () => { const port = s.address().port; s.close(() => resolve(port)); });
});

test('exports the saved version, not later draft edits', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-design-studio-'));
  fs.copyFileSync(path.join(root, 'server.js'), path.join(dir, 'server.js'));
  fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}');
  const port = await getPort();
  const child = spawn(process.execPath, ['server.js'], { cwd: dir, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  t.after(async () => { child.kill(); await new Promise(resolve => { if (child.exitCode !== null) resolve(); else child.once('exit', resolve); }); fs.rmSync(dir, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i=0; i<40; i++) { try { if ((await fetch(base + '/api/projects')).ok) { ready=true; break; } } catch {} await new Promise(r => setTimeout(r, 50)); }
  assert.ok(ready, 'server started');
  const created = await (await fetch(base + '/api/projects', { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' })).json();
  created.name = 'Test design';
  created.versions = [{ label:'Approved', at:new Date().toISOString(), snapshot: { width:created.width, height:created.height, background:created.background, brief:'Approved brief', elements:structuredClone(created.elements) } }];
  created.brief = 'Unapproved draft';
  const updated = await fetch(base + '/api/projects/' + created.id, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(created) });
  assert.equal(updated.status, 200);
  const response = await fetch(base + '/api/projects/' + created.id + '/handoff', { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' });
  assert.equal(response.status, 200);
  const { folder } = await response.json();
  const design = JSON.parse(fs.readFileSync(path.join(folder, 'design.json'), 'utf8'));
  assert.equal(design.brief, 'Approved brief');
  assert.match(fs.readFileSync(path.join(folder, 'IMPLEMENT.md'), 'utf8'), /Approved design version: Approved/);
  assert.ok(fs.existsSync(path.join(folder, 'preview.html')));
});

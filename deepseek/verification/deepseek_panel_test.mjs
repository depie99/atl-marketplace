// Render the shipped DSH browser factory against a slot/connection contract
// fixture, with a real ATL server. This does not claim a full DSH host run.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';
import { chromium } from 'playwright';

const installed = path.resolve(process.argv[2] || '../atl-marketplace/deepseek');
const reactModules = path.resolve('.tmp-ui-review/deepseek-host/node_modules');
const { verifyPluginRelease } = await import(pathToFileURL(path.join(installed, 'runtime/lib/plugin-release.mjs')));
verifyPluginRelease(installed);
const { apply } = await import(pathToFileURL(path.join(installed, 'plugins/deepseek.mjs')));
const routes = new Map(), cleanups = [], definitions = new Map();
const ctx = { effect(fn) { const cleanup = fn(); if (typeof cleanup === 'function') cleanups.push(cleanup); }, tools: { register(tool) { definitions.set(tool.name, tool); } }, connection: { fetch: { register(route) { routes.set(route.path, route); return async () => routes.delete(route.path); } } }, inject(keys, fn) { fn(ctx); } };
apply(ctx);
assert.ok(definitions.has('atl_start'));
assert.ok(routes.has('/api/atl/open'));
const project = fs.mkdtempSync(path.join(os.tmpdir(), 'atl-deepseek-panel-'));
const client = fs.readFileSync(path.join(installed, 'plugin-ui/deepseek-client.js'), 'utf8');
const fixture = buildSync({ stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';window.fixtureReact=React;window.fixtureRoot=createRoot;`, resolveDir: reactModules }, bundle: true, write: false, format: 'iife', platform: 'browser' }).outputFiles[0].text;
const shell = `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${fixture.replaceAll('</script', '<\\/script')}</script><script>
const registrations=[];window.__ModuleLoader__={load(entry){window.atl=entry.factory(name=>{if(name==='react')return window.fixtureReact;throw Error(name)})}};
</script><script>${client.replaceAll('</script', '<\\/script')}</script><script>
const root=fixtureRoot(document.getElementById('root'));const slots={inject(name,fn){return fn()},register(meta,component){registrations.push({meta,component});return()=>{}}};
let active='plugins';const layout={selectPanel(id){active=id;render()}};atl.apply({slots,layout});
function render(){const entry=registrations.find(r=>active==='plugins'?r.meta.name==='plugins.bundle.config':r.meta.name==='main'&&r.meta.key===active);root.render(fixtureReact.createElement('main',{style:{height:'100vh'}},fixtureReact.createElement(entry.component)))}render();
</script></body></html>`;
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://fixture');
    if (url.pathname === '/') { res.setHeader('set-cookie', 'fixture_owner=1; HttpOnly; SameSite=Strict; Path=/'); res.setHeader('content-type', 'text/html'); res.end(shell); return; }
    const route = routes.get(url.pathname);
    if (!route || !route.methods.includes(req.method)) { res.writeHead(404); res.end(); return; }
    if (!req.headers.cookie?.includes('fixture_owner=1')) { res.writeHead(401); res.end(); return; }
    let body = ''; for await (const chunk of req) body += chunk;
    const controller = new AbortController(); res.on('close', () => controller.abort());
    const response = await route.fetch(new Request(url.href, { method: req.method, headers: req.headers, signal: controller.signal, ...(!['GET', 'HEAD'].includes(req.method) ? { body } : {}) }));
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) { res.writeHead(500); res.end(error.message); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  assert.equal((await fetch(url + '/api/atl/open', { method: 'POST' })).status, 401);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.getByRole('button', { name: 'Open Control Plane', exact: true }).click();
  await page.getByLabel('Project directory').fill(project);
  await page.getByRole('button', { name: 'Open Control Plane', exact: true }).click();
  const frame = page.frameLocator('iframe[title="ATL Control Plane"]');
  await frame.locator('#mobile [data-page="tasks"]').waitFor({ timeout: 30000 });
  await frame.locator('#mobile [data-page="more"]').click();
  await frame.getByRole('button', { name: /Plan Studio/i }).first().click();
  await frame.locator('#goal').fill('Verify the embedded DeepSeek workspace');
  await frame.locator('#mobile [data-page="tasks"]').click();
  await frame.locator('#newBtn').click();
  await frame.locator('#fTitle').fill('Created inside DeepSeek panel');
  await frame.getByRole('button', { name: 'Create task', exact: true }).click();
  await frame.getByText('Created inside DeepSeek panel', { exact: true }).first().waitFor();
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  await frame.locator('html.light').waitFor();
  await page.setViewportSize({ width: 480, height: 850 });
  await frame.locator('#mobile [data-page="more"]').click();
  await frame.getByRole('button', { name: /Plan Studio/i }).first().click();
  await frame.locator('#goal').waitFor();
  fs.mkdirSync('.tmp-ui-review/deepseek-evidence', { recursive: true });
  await page.screenshot({ path: '.tmp-ui-review/deepseek-evidence/embedded-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: '.tmp-ui-review/deepseek-evidence/embedded-desktop.png', fullPage: true });
  const state = JSON.parse(fs.readFileSync(path.join(project, '.trust/manager/state.json')));
  assert.ok(Object.values(state.tasks).some(task => task.title === 'Created inside DeepSeek panel'));
  assert.deepEqual(errors, []);
  const cookie = 'fixture_owner=1';
  const unknown = await fetch(url + '/api/atl/request', { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ id: 'missing', path: '/api/snapshot' }) });
  assert.equal(unknown.status, 400);
  const external = await fetch(url + '/api/atl/request', { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ id: 'missing', path: 'https://example.com/' }) });
  assert.equal(external.status, 400);
  console.log('PASS: shipped DeepSeek factory, plugin Open action, embedded ATL, Plan Studio, task persistence, theme sync, 480/1280px, expired panel and external-path rejection (DSH contract fixture)');
} finally {
  await browser?.close();
  for (const close of cleanups.reverse()) await close();
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  fs.rmSync(project, { recursive: true, force: true });
}

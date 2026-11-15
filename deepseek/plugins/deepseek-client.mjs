import React, { useState } from 'react';
const h = React.createElement;
const PANEL = 'atl-control-plane';
export const inject = ['slots', 'layout'];

export function AtlPanel() {
  const [project, setProject] = useState('');
  const [panel, setPanel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function open(event) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const response = await fetch(new URL('api/atl/open', document.baseURI), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ project }) });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || `Could not open ATL (${response.status})`);
      setPanel(value);
    } catch (failure) { setError(failure.message); } finally { setBusy(false); }
  }
  const buttonStyle = { border: '1px solid currentColor', borderRadius: 8, padding: '8px 14px', color: 'inherit', background: 'transparent', cursor: 'pointer' };
  if (panel) return h('section', { style: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', flexShrink: 0 } }, h('strong', null, 'ATL'), h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }, title: panel.project }, panel.project), h('button', { type: 'button', style: buttonStyle, onClick: () => setPanel(null) }, 'Change project')),
    h('iframe', { title: 'ATL Control Plane', src: new URL(`api/atl/view?id=${encodeURIComponent(panel.id)}`, document.baseURI).href, style: { border: 0, width: '100%', flex: 1, minHeight: 400 }, allow: 'clipboard-write' }));
  return h('section', { style: { maxWidth: 680, margin: '48px auto', padding: 24, color: 'inherit' } },
    h('h1', null, 'ATL Control Plane'),
    h('p', null, 'Plan work, review tasks and manage runs inside DeepSeek Harness.'),
    h('form', { onSubmit: open },
      h('label', { htmlFor: 'atl-project', style: { display: 'block', marginBottom: 8 } }, 'Project directory'),
      h('input', { id: 'atl-project', value: project, onChange: event => setProject(event.target.value), placeholder: 'C:\\Projects\\my-app', required: true, disabled: busy, style: { width: '100%', padding: 12, border: '1px solid currentColor', borderRadius: 8, background: 'transparent', color: 'inherit', font: 'inherit', marginBottom: 16 } }),
      h('p', { style: { opacity: 0.75 } }, 'Use an absolute directory on the machine running DeepSeek. Opening prepares ATL project state and starts no workers.'),
      h('button', { type: 'submit', disabled: busy || !project.trim(), style: buttonStyle }, busy ? 'Opening…' : 'Open Control Plane'),
      error ? h('p', { role: 'alert' }, error) : null));
}

export function apply(ctx) {
  ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL }, AtlPanel));
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL, order: 15, label: () => 'ATL' }, ({ size = 20 }) => h('span', { 'aria-hidden': true, style: { fontSize: size, fontWeight: 700 } }, '◇')));
  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({ name: 'plugins.bundle.config', key: '@depie99/atl-plugin' }, () => h('section', { style: { padding: '20px 0' } }, h('h2', null, 'ATL Control Plane'), h('p', null, 'Open the embedded workspace to select a project and manage your work.'), h('button', { type: 'button', onClick: () => ctx.layout.selectPanel(PANEL) }, 'Open Control Plane'))));
}

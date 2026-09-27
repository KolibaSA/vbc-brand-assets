export const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VBC National · Brand Assets</title>
  <link rel="stylesheet" href="/app.css">
  <script src="/app.js" defer></script>
</head>
<body>
  <header class="topbar"><div class="shell topbar-inner"><span class="mark">VBC</span><span>National brand assets</span><span id="account" class="account"></span></div></header>
  <main class="shell">
    <div class="intro"><p class="eyebrow">VETERANS BEER CLUB</p><h1>Approved assets, all in one place.</h1><p>National controls the images and templates chapters use. Changes made here become public in the shared repository immediately.</p></div>
    <p id="notice" class="notice" role="status" hidden></p>
    <section aria-labelledby="logos-heading"><div class="section-head"><div><p class="eyebrow">CURRENT ARTWORK</p><h2 id="logos-heading">Logos</h2></div><span class="hint">One current logo per chapter · previous 10 available</span></div><div id="logos" class="logo-grid"><p>Loading logos…</p></div></section>
    <section class="two-col" aria-label="Files and uploads"><div class="panel"><p class="eyebrow">PUBLIC LIBRARY</p><h2>Files</h2><h3>Templates</h3><ul id="templates" class="file-list"></ul><h3>Other assets</h3><ul id="uploads" class="file-list"></ul></div><div class="panel"><p class="eyebrow">NATIONAL ONLY</p><h2>Upload files</h2><p class="muted">Add up to 10 files at once. Each file can be up to 8 MB; 20 MB total. Files publish together.</p><form id="upload-form"><label for="category">Library section</label><select id="category" name="category"><option value="templates">Design templates</option><option value="uploads">Other assets</option></select><label for="files">Choose files</label><input id="files" type="file" name="files" multiple required accept=".png,.jpg,.jpeg,.webp,.pdf,.pptx,.docx"><p class="muted small">Supported: PNG, JPG, WebP, PDF, PowerPoint and Word.</p><button type="submit" class="primary">Publish files</button></form></div></section>
    <p class="footer">Chapter pages can read these public assets. They cannot change this library.</p>
  </main>
  <dialog id="replace-dialog"><form id="replace-form"><div class="dialog-head"><div><p class="eyebrow">REPLACE CURRENT LOGO</p><h2 id="replace-title">Replace logo</h2></div><button type="button" id="close-dialog" class="close" aria-label="Close">×</button></div><p id="replace-help" class="muted"></p><input type="hidden" name="slug" id="replace-slug"><label for="replacement">New logo file</label><input type="file" name="file" id="replacement" required><p class="warning">This replaces the current public logo immediately. The old version stays in history.</p><button type="submit" class="primary">Replace and publish</button></form></dialog>
</body>
</html>`;

export const styles = `:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f2eee7;background:#121716;font-synthesis:none}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 75% 0%,#20382d 0,transparent 31%),#121716}button,input,select{font:inherit}button{cursor:pointer}.shell{width:min(1160px,calc(100% - 40px));margin:auto}.topbar{border-bottom:1px solid #354039;background:#151c19}.topbar-inner{display:flex;align-items:center;gap:14px;height:68px;font-size:14px;font-weight:700;letter-spacing:.02em}.mark{display:grid;place-items:center;width:38px;height:38px;border:1px solid #c99c57;border-radius:50%;color:#e7c68e;font-family:Georgia,serif;font-size:15px}.account{margin-left:auto;color:#a7b3aa;font-size:12px;font-weight:500}.intro{padding:68px 0 42px;max-width:760px}.eyebrow{color:#cfa76e;font-size:11px;letter-spacing:.18em;font-weight:800;margin:0 0 10px;text-transform:uppercase}h1,h2,h3,p{margin-top:0}h1,h2{font-family:Georgia,serif;font-weight:600}h1{font-size:clamp(36px,5vw,58px);line-height:1.08;letter-spacing:-.03em;margin-bottom:18px}h2{font-size:30px;margin-bottom:0}h3{font-size:14px;margin:27px 0 10px}.intro>p:last-child{font-size:17px;line-height:1.65;color:#b6c0b9;max-width:630px}.section-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}.hint,.muted{color:#a5b2a9}.hint{font-size:13px}.logo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:15px}.logo-card,.panel{background:#1c2520;border:1px solid #38463b;border-radius:15px}.logo-card{padding:16px}.logo-image{height:142px;display:flex;align-items:center;justify-content:center;background:#29332c;border-radius:9px;margin-bottom:14px}.logo-image img{max-height:123px;max-width:90%;object-fit:contain}.logo-card h3{font-family:Georgia,serif;font-size:19px;margin:0 0 11px;min-height:45px}.card-actions{display:flex;gap:8px;flex-wrap:wrap}.button-link,button.secondary,button.primary{border-radius:8px;padding:8px 11px;text-decoration:none;font-size:12px;font-weight:700}.button-link,button.secondary{background:#27352c;border:1px solid #526b55;color:#dce8dc}.button-link:hover,button.secondary:hover{background:#344739}.primary{background:#c59b5e;border:1px solid #d5ae76;color:#1b211b;padding:11px 15px;font-size:14px}.primary:hover{background:#dfb775}.primary:disabled{opacity:.65;cursor:wait}.history{border-top:1px solid #415046;padding:11px 0 0;margin:13px 0 0;list-style:none}.history li{margin:7px 0;font-size:12px}.history a{color:#dfbd89}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:58px 0 36px}.panel{padding:27px}.file-list{padding:0;margin:0;list-style:none}.file-list li{padding:9px 0;border-bottom:1px solid #344138;overflow-wrap:anywhere}.file-list a{color:#debd8d;text-decoration:none}.file-list a:hover{text-decoration:underline}.file-list .empty{color:#839088}label{display:block;font-weight:700;font-size:13px;margin:20px 0 8px}select,input[type=file]{width:100%;border:1px solid #586a5b;background:#27352b;color:#fff;border-radius:9px;padding:12px}input[type=file]::file-selector-button{border:0;border-radius:5px;padding:7px 10px;margin-right:10px;background:#c59b5e;color:#161b16}.small{font-size:12px;line-height:1.5}form .primary{margin-top:17px}.notice{padding:13px 17px;border-radius:9px;background:#21472f;border:1px solid #4a9a65;margin-bottom:25px}.notice.error{background:#56302d;border-color:#a65f56}.footer{border-top:1px solid #364339;padding:25px 0 40px;color:#87958c;font-size:12px}dialog{border:1px solid #58705b;border-radius:15px;color:#f2eee7;background:#1b2520;box-shadow:0 25px 90px #0009;width:min(460px,calc(100% - 32px));padding:25px}dialog::backdrop{background:#000b}.dialog-head{display:flex;justify-content:space-between;gap:10px}.dialog-head h2{font-size:27px}.close{align-self:start;border:0;background:none;color:#ddd;font-size:27px;line-height:1}.warning{border-left:3px solid #c59b5e;padding-left:12px;color:#e5cda8;font-size:13px;line-height:1.5;margin:20px 0 0}@media(max-width:720px){.two-col{grid-template-columns:1fr}.hint{display:none}.intro{padding-top:48px}.account{max-width:38%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}`;

export const script = `let data;
const byId = (id) => document.getElementById(id);
const notice = (message, error = false) => { const node = byId('notice'); node.hidden = false; node.textContent = message; node.className = error ? 'notice error' : 'notice'; node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
async function api(path, options) { const response = await fetch(path, options); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Request failed'); return body; }
function publicUrl(path) { return data.base + path + '?v=' + data.head; }
function button(label, className, onClick) { const node = document.createElement('button'); node.type = 'button'; node.className = className; node.textContent = label; node.addEventListener('click', onClick); return node; }
function renderLogos() {
  const grid = byId('logos'); grid.replaceChildren();
  for (const asset of [data.national, ...data.chapters]) {
    const card = document.createElement('article'); card.className = 'logo-card';
    const imageBox = document.createElement('div'); imageBox.className = 'logo-image';
    const image = document.createElement('img'); image.src = publicUrl(asset.logo); image.alt = asset.name + ' logo'; image.loading = 'lazy'; imageBox.append(image);
    const name = document.createElement('h3'); name.textContent = asset.name;
    const actions = document.createElement('div'); actions.className = 'card-actions';
    const replace = button('Replace', 'secondary', () => openReplace(asset)); replace.disabled = !data.canPublish; actions.append(replace);
    actions.append(button('History', 'secondary', () => showHistory(asset, card)));
    const link = document.createElement('a'); link.className = 'button-link'; link.href = publicUrl(asset.logo); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'View file'; actions.append(link);
    card.append(imageBox, name, actions); grid.append(card);
  }
}
async function showHistory(asset, card) {
  const prior = card.querySelector('.history'); if (prior) { prior.remove(); return; }
  try {
    const versions = await api('/api/history?path=' + encodeURIComponent(asset.logo));
    const list = document.createElement('ul'); list.className = 'history';
    if (!versions.length) { const item = document.createElement('li'); item.textContent = 'No older versions yet.'; list.append(item); }
    versions.forEach((version) => { const item = document.createElement('li'); const link = document.createElement('a'); link.href = version.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = new Date(version.date).toLocaleDateString() + ' · ' + version.sha.slice(0, 7); item.append(link); list.append(item); });
    card.append(list);
  } catch (error) { notice(error.message, true); }
}
function openReplace(asset) {
  byId('replace-slug').value = asset.slug;
  byId('replace-title').textContent = asset.name;
  const ext = asset.slug !== 'national' && asset.status === 'national-logo-fallback' ? 'png' : asset.logo.split('.').pop();
  byId('replace-help').textContent = 'Choose a .' + ext + ' image. The existing public file will be replaced at its current address.';
  byId('replacement').accept = '.' + ext;
  byId('replacement').value = '';
  byId('replace-dialog').showModal();
}
function renderFiles(id, files) {
  const list = byId(id); list.replaceChildren();
  if (!files.length) { const item = document.createElement('li'); item.className = 'empty'; item.textContent = 'No files published yet.'; list.append(item); return; }
  files.forEach((path) => { const item = document.createElement('li'); const link = document.createElement('a'); link.href = publicUrl(path); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = path.split('/').pop(); item.append(link); list.append(item); });
}
async function load() {
  data = await api('/api/assets'); byId('account').textContent = data.email; renderLogos(); renderFiles('templates', data.templates); renderFiles('uploads', data.uploads);
  byId('upload-form').querySelector('button[type=submit]').disabled = !data.canPublish;
  if (!data.canPublish) notice('The library is ready to browse. Publishing will be enabled after the repository credential is configured.');
}
async function submit(form, path, success) {
  const button = form.querySelector('button[type=submit]'); button.disabled = true;
  try { await api(path, { method: 'POST', body: new FormData(form) }); await load(); form.reset(); if (path === '/api/replace') byId('replace-dialog').close(); notice(success); }
  catch (error) { notice(error.message, true); }
  finally { button.disabled = false; }
}
byId('upload-form').addEventListener('submit', (event) => { event.preventDefault(); submit(event.currentTarget, '/api/upload', 'Files published successfully.'); });
byId('replace-form').addEventListener('submit', (event) => { event.preventDefault(); submit(event.currentTarget, '/api/replace', 'Logo replaced and published.'); });
byId('close-dialog').addEventListener('click', () => byId('replace-dialog').close());
load().catch((error) => notice(error.message, true));`;

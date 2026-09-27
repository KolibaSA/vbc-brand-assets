import { ApiError, RAW, getFiles, getSnapshot, github, publish } from './git.mjs';
import { cleanFilename, prepareFiles, validateBytes, validateCount } from './validation.mjs';
import { html, script, styles } from './ui.mjs';

const HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; img-src 'self' https://raw.githubusercontent.com; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};

function respond(body, status = 200, contentType = 'application/json; charset=utf-8') {
  return new Response(body, { status, headers: { ...HEADERS, 'Content-Type': contentType } });
}

function json(value, status = 200) {
  return respond(JSON.stringify(value), status);
}

function allowed(email, env) {
  return new Set((env.ALLOWED_EMAILS || '').split(',').map((entry) => entry.trim().toLowerCase()).filter(Boolean)).has(email.toLowerCase());
}

async function identity(ctx, env) {
  if (!ctx.access) throw new ApiError('Sign-in is required', 403);
  const person = await ctx.access.getIdentity();
  const email = person?.email;
  if (typeof email !== 'string' || !allowed(email, env)) throw new ApiError('This account is not authorized', 403);
  return email;
}

function assertSameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) throw new ApiError('Invalid request origin', 403);
  const length = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(length) && length > 25 * 1024 * 1024) throw new ApiError('Upload is too large', 413);
}

function readFile(form) {
  const file = form.get('file');
  validateCount(file ? [file] : []);
  return file;
}

async function listAssets(env) {
  const snapshot = await getSnapshot(env);
  const paths = await getFiles(env, snapshot.tree);
  const manifest = snapshot.manifest;
  return {
    head: snapshot.head,
    base: `${RAW}/main/`,
    national: { name: 'VBC National', slug: 'national', logo: manifest.nationalLogo },
    chapters: Object.entries(manifest.chapters).map(([slug, value]) => ({ slug, ...value })),
    templates: paths.filter((path) => path.startsWith('templates/') && !path.endsWith('README.md')),
    uploads: paths.filter((path) => path.startsWith('uploads/')),
  };
}

async function history(env, searchParams) {
  const path = searchParams.get('path');
  const snapshot = await getSnapshot(env);
  const approved = new Set([
    snapshot.manifest.nationalLogo,
    ...Object.values(snapshot.manifest.chapters).map((chapter) => chapter.logo),
  ]);
  if (!approved.has(path)) throw new ApiError('Unknown logo', 404);
  const commits = await github(env, `/commits?path=${encodeURIComponent(path)}&per_page=11`);
  return commits.slice(1, 11).map((commit) => ({
    sha: commit.sha,
    date: commit.commit.author.date,
    url: `${RAW}/${commit.sha}/${path}`,
  }));
}

async function replaceLogo(request, env) {
  const form = await request.formData();
  const slug = form.get('slug');
  const file = readFile(form);
  const snapshot = await getSnapshot(env);
  const manifest = snapshot.manifest;
  let path;
  if (slug === 'national') {
    path = manifest.nationalLogo;
  } else {
    if (typeof slug !== 'string' || !Object.hasOwn(manifest.chapters, slug)) throw new ApiError('Unknown chapter', 404);
    const chapter = manifest.chapters[slug];
    path = chapter.status === 'national-logo-fallback'
      ? `logos/chapters/${slug}.png`
      : chapter.logo;
  }
  const filename = cleanFilename(file.name);
  if (filename.split('.').pop() !== path.split('.').pop()) {
    throw new ApiError(`This logo must be a .${path.split('.').pop()} file`, 400);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  validateBytes(filename, bytes);
  const changes = [{ path, bytes }];
  if (slug !== 'national' && manifest.chapters[slug].status === 'national-logo-fallback') {
    manifest.chapters[slug].logo = path;
    delete manifest.chapters[slug].status;
    changes.push({ path: 'manifest.json', bytes: new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`) });
  }
  const sha = await publish(env, snapshot, changes, `Replace ${slug} logo`);
  return { sha, path, url: `${RAW}/main/${path}` };
}

async function uploadFiles(request, env) {
  const form = await request.formData();
  const category = form.get('category');
  if (category !== 'templates' && category !== 'uploads') throw new ApiError('Choose a valid category', 400);
  const files = form.getAll('files');
  const snapshot = await getSnapshot(env);
  const existing = await getFiles(env, snapshot.tree);
  const changes = await prepareFiles(files, category, existing);
  const manifest = snapshot.manifest;
  manifest[category] = [...new Set([...(manifest[category] || []), ...changes.map((change) => change.path)])].sort();
  changes.push({ path: 'manifest.json', bytes: new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`) });
  const sha = await publish(env, snapshot, changes, `Add ${changes.length - 1} ${category} asset(s)`);
  return { sha, paths: changes.slice(0, -1).map((change) => change.path) };
}

export default {
  async fetch(request, env, ctx) {
    try {
      const email = await identity(ctx, env);
      const url = new URL(request.url);
      if (request.method === 'GET' && url.pathname === '/') return respond(html, 200, 'text/html; charset=utf-8');
      if (request.method === 'GET' && url.pathname === '/app.js') return respond(script, 200, 'text/javascript; charset=utf-8');
      if (request.method === 'GET' && url.pathname === '/app.css') return respond(styles, 200, 'text/css; charset=utf-8');
      if (request.method === 'GET' && url.pathname === '/api/assets') return json({ email, ...(await listAssets(env)) });
      if (request.method === 'GET' && url.pathname === '/api/history') return json(await history(env, url.searchParams));
      if (request.method === 'POST') {
        assertSameOrigin(request);
        let result;
        if (url.pathname === '/api/replace') result = await replaceLogo(request, env);
        else if (url.pathname === '/api/upload') result = await uploadFiles(request, env);
        else throw new ApiError('Not found', 404);
        console.log(JSON.stringify({ event: 'asset_published', email, sha: result.sha }));
        return json(result, 201);
      }
      throw new ApiError('Not found', 404);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      if (status >= 500) console.error('Asset portal error', error);
      return json({ error: error instanceof ApiError ? error.message : 'Unexpected error' }, status);
    }
  },
};

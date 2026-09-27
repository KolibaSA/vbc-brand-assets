import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/worker.mjs';
import { github, publish } from '../src/git.mjs';
import { cleanFilename, prepareFiles, validateBytes } from '../src/validation.mjs';

test('portal refuses requests without Cloudflare Access identity', async () => {
  const response = await worker.fetch(new Request('https://assets.example.org/'), {}, {});
  assert.equal(response.status, 403);
});

test('portal refuses people outside National allowlist', async () => {
  const response = await worker.fetch(new Request('https://assets.example.org/'), {
    ALLOWED_EMAILS: 'national@example.org',
  }, { access: { getIdentity: async () => ({ email: 'chapter@example.org' }) } });
  assert.equal(response.status, 403);
});

test('portal serves UI only for an authorized Access identity', async () => {
  const response = await worker.fetch(new Request('https://assets.example.org/'), {
    ALLOWED_EMAILS: 'National@Example.org',
  }, { access: { getIdentity: async () => ({ email: 'national@example.org' }) } });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /National brand assets/);
});

test('publishing rejects cross-origin requests', async () => {
  const response = await worker.fetch(new Request('https://assets.example.org/api/upload', {
    method: 'POST',
    headers: { Origin: 'https://bad.example.org' },
    body: new FormData(),
  }), { ALLOWED_EMAILS: 'national@example.org' }, {
    access: { getIdentity: async () => ({ email: 'national@example.org' }) },
  });
  assert.equal(response.status, 403);
});

test('filenames are constrained to one safe repository segment', () => {
  assert.equal(cleanFilename('Chapter Flyer 2026.PDF'), 'chapter-flyer-2026.pdf');
  assert.throws(() => cleanFilename('../bad.html'));
});

test('logo file signature must match the extension', () => {
  assert.doesNotThrow(() => validateBytes('badge.png', Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])));
  assert.throws(() => validateBytes('badge.png', Uint8Array.from([0xff, 0xd8, 0xff])));
});

test('bulk upload rejects an existing filename before publishing', async () => {
  const file = new File([Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'Flyer.PNG');
  await assert.rejects(() => prepareFiles([file], 'templates', ['templates/flyer.png']), /already exists/);
});

test('public assets remain browseable without a publishing credential', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ ok: true });
  try {
    assert.deepEqual(await github({}, '/contents/manifest.json'), { ok: true });
    await assert.rejects(() => github({}, '/git/blobs', { method: 'POST', body: '{}' }), /Publishing is not configured/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('publication creates one commit and never force-updates main', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  const replies = [{ sha: 'blob' }, { sha: 'tree' }, { sha: 'commit' }, { object: { sha: 'commit' } }];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify(replies.shift()), { status: 200 });
  };
  try {
    const sha = await publish({ GITHUB_TOKEN: 'test-token' }, { head: 'previous', tree: 'old-tree' }, [
      { path: 'logos/chapters/yolo.png', bytes: Uint8Array.from([1, 2, 3]) },
    ], 'Replace yolo logo');
    assert.equal(sha, 'commit');
    assert.equal(calls.length, 4);
    assert.match(calls[1].options.body, /"base_tree":"old-tree"/);
    assert.match(calls[2].options.body, /"parents":\["previous"\]/);
    assert.deepEqual(JSON.parse(calls[3].options.body), { sha: 'commit', force: false });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

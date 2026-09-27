const REPO = 'KolibaSA/vbc-brand-assets';
const API = `https://api.github.com/repos/${REPO}`;
export const RAW = `https://raw.githubusercontent.com/${REPO}`;

export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export async function github(env, path, options = {}) {
  if (!env.GITHUB_TOKEN && options.method && options.method !== 'GET') {
    throw new ApiError('Publishing is not configured', 503);
  }
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
      'User-Agent': 'vbc-national-asset-portal',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!response.ok) {
    if (response.status === 409 || response.status === 422) {
      throw new ApiError('The repository changed while publishing. Refresh and try again.', 409);
    }
    throw new ApiError(`GitHub request failed (${response.status})`, 502);
  }
  return response.json();
}

export function decodeBase64(base64) {
  const binary = atob(base64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

export function encodeBase64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

export async function getSnapshot(env) {
  const ref = await github(env, '/git/ref/heads/main');
  const head = ref.object.sha;
  const [manifestFile, commit] = await Promise.all([
    github(env, `/contents/manifest.json?ref=${head}`),
    github(env, `/git/commits/${head}`),
  ]);
  return {
    head,
    tree: commit.tree.sha,
    manifest: JSON.parse(decodeBase64(manifestFile.content)),
  };
}

export async function getFiles(env, treeSha) {
  const result = await github(env, `/git/trees/${treeSha}?recursive=1`);
  if (result.truncated) throw new ApiError('The asset list is too large to display safely', 502);
  return result.tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path);
}

export async function publish(env, snapshot, changes, message) {
  const tree = [];
  for (const change of changes) {
    const blob = await github(env, '/git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content: encodeBase64(change.bytes), encoding: 'base64' }),
    });
    tree.push({ path: change.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const nextTree = await github(env, '/git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: snapshot.tree, tree }),
  });
  const commit = await github(env, '/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: nextTree.sha, parents: [snapshot.head] }),
  });
  await github(env, '/git/refs/heads/main', {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  return commit.sha;
}

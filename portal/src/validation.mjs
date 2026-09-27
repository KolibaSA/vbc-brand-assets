import { ApiError } from './git.mjs';

const MAX_FILE = 8 * 1024 * 1024;
const MAX_TOTAL = 20 * 1024 * 1024;
const MAX_FILES = 10;

const extensions = new Set(['png', 'jpg', 'jpeg', 'webp', 'pdf', 'pptx', 'docx']);

export function cleanFilename(name) {
  const parts = name.normalize('NFKD').toLowerCase().split('.');
  const ext = parts.pop();
  if (!extensions.has(ext)) throw new ApiError(`Unsupported file type: ${name}`, 400);
  const stem = parts.join('-').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  if (!stem) throw new ApiError(`Invalid filename: ${name}`, 400);
  return `${stem}.${ext}`;
}

export function validateCount(files) {
  if (files.length < 1 || files.length > MAX_FILES) {
    throw new ApiError(`Choose 1–${MAX_FILES} files`, 400);
  }
  if (files.some((file) => !file || typeof file.arrayBuffer !== 'function')) {
    throw new ApiError('Only files can be uploaded', 400);
  }
  if (files.some((file) => file.size < 1 || file.size > MAX_FILE)) {
    throw new ApiError('Each file must be 8 MB or smaller', 400);
  }
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL) {
    throw new ApiError('Uploads must total 20 MB or less', 400);
  }
}

export function validateBytes(filename, bytes) {
  const ext = filename.split('.').pop();
  const starts = (...signature) => signature.every((value, index) => bytes[index] === value);
  const ascii = (offset, value) => value.split('').every((char, index) => bytes[offset + index] === char.charCodeAt(0));
  let valid = false;
  if (ext === 'png') valid = starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (ext === 'jpg' || ext === 'jpeg') valid = starts(0xff, 0xd8, 0xff);
  if (ext === 'webp') valid = ascii(0, 'RIFF') && ascii(8, 'WEBP');
  if (ext === 'pdf') valid = ascii(0, '%PDF-');
  if (ext === 'pptx' || ext === 'docx') valid = starts(0x50, 0x4b, 0x03, 0x04);
  if (!valid) throw new ApiError(`File contents do not match .${ext}`, 400);
}

export async function prepareFiles(files, prefix, existing) {
  validateCount(files);
  const changes = [];
  const paths = new Set(existing);
  for (const file of files) {
    const filename = cleanFilename(file.name);
    const path = `${prefix}/${filename}`;
    if (paths.has(path)) throw new ApiError(`${filename} already exists. Rename the file to upload a new version.`, 409);
    paths.add(path);
    const bytes = new Uint8Array(await file.arrayBuffer());
    validateBytes(filename, bytes);
    changes.push({ path, bytes });
  }
  return changes;
}

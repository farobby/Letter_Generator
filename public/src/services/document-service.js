import { APP_CONFIG } from '../config.js';

// Contract: POST JSON -> a genuine DOCX binary, or JSON { error: string }.
export async function generateDocx(payload) {
  const response = await fetch(APP_CONFIG.documentEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Generator Word gagal (HTTP ${response.status}).`);
  }
  const type = response.headers.get('content-type') || '';
  if (!type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    throw new Error('Server tidak mengembalikan dokumen DOCX yang sesuai.');
  }
  return response.blob();
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

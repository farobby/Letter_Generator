import { listSppg } from '../services/sppg-repository.js';
import { validateLetter } from '../domain/letter-validation.js';
import { renderRevocation } from '../templates/revocation.js';
import { renderGeneric } from '../templates/generic.js';
import { generateDocx, downloadBlob } from '../services/document-service.js';
import { saveDraft } from '../services/draft-service.js';
import { escapeHtml, escapeRecord } from '../utils/html.js';

const field = id => document.getElementById(id);

function readForm() {
  const jenis = field('jenis').value;
  let kejadian = field('kejadian').value;
  // If the user selected a specific suspend type, override the hidden kejadian field
  if (jenis === 'suspend-kf') kejadian = 'KF';
  if (jenis === 'suspend-km') kejadian = 'KM';

  return {
    jenis, idsText: field('ids').value,
    tanggal: field('tgl').value, nomor: field('nomor').value,
    kejadian, kategori: field('kategori').value,
  };
}

function notice(message, type = 'err') {
  field('val').innerHTML = `<div class="notice ${type}" role="status">${escapeHtml(message)}</div>`;
}

function clearPreview() {
  field('wordPreview').innerHTML = '';
  field('selected').innerHTML = '';
  field('val').innerHTML = '';
}

function prepareLetter() {
  const input = readForm();
  const result = validateLetter(input, listSppg());
  if (!result.valid) {
    clearPreview();
    notice(result.errors.join(' '));
    return null;
  }
  return { input, ...result, payload: { ...input, ids: result.ids } };
}

function preview() {
  const result = prepareLetter();
  if (!result) return;
  const records = result.selected.map(escapeRecord);
  field('selected').innerHTML = `<table><thead><tr><th>ID</th><th>Nama</th><th>Surat Pemberhentian</th></tr></thead>
    <tbody>${records.map(record => `<tr><td>${record.id}</td><td>${record.nama}</td><td>${record.suspendNo || '-'}</td></tr>`).join('')}</tbody></table>`;
  
  if (result.input.jenis === 'cabut') {
    field('wordPreview').innerHTML = renderRevocation(result.selected, result.input);
  } else {
    field('wordPreview').innerHTML = renderGeneric(result.selected, result.input);
  }
  
  notice('Validasi berhasil. Pratinjau menggunakan data formulir saat ini.', 'ok');
}

function syncFields() {
  const jenis = field('jenis').value;
  const isSuspend = jenis === 'suspend-kf' || jenis === 'suspend-km';
  field('suspendFields').style.display = isSuspend ? 'block' : 'none';
  field('cabutNote').style.display = jenis === 'cabut' ? 'block' : 'none';
  field('durasi').value = `${field('kategori').value} hari kalender`;
}

export function initLetters() {
  document.querySelectorAll('#surat input, #surat textarea, #surat select').forEach(element => {
    element.addEventListener('input', clearPreview);
    element.addEventListener('change', () => { clearPreview(); syncFields(); });
  });
  document.querySelector('[data-action="preview"]').addEventListener('click', preview);
  const exportButton = document.querySelector('[data-action="downloadDocx"]');
  exportButton.addEventListener('click', async () => {
    const result = prepareLetter();
    if (!result) return;
    if (result.input.jenis !== 'cabut') {
      notice('Ekspor Word untuk jenis surat ini belum tersedia.');
      return;
    }
    exportButton.disabled = true;
    try {
      const blob = await generateDocx(result.payload);
      downloadBlob(blob, 'Pencabutan_Pemberhentian_Operasional_Sementara.docx');
      notice('Dokumen Word berhasil diunduh.', 'ok');
    } catch (error) { notice(error.message); }
    finally { exportButton.disabled = false; }
  });
  document.querySelector('[data-action="saveDraft"]').addEventListener('click', async () => {
    const result = prepareLetter();
    if (!result) return;
    try {
      const saved = await saveDraft(result.payload);
      notice(saved.message, saved.persisted ? 'ok' : '');
    } catch (error) { notice(error.message); }
  });
  syncFields();
  preview();
}

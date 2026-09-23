export function parseIds(text = '') {
  return [...new Set(text.split(/[\n,;\s]+/).map(id => id.trim().toUpperCase()).filter(Boolean))];
}

// Shared gate for preview, simulated draft, and export. No DOM dependency.
export function validateLetter(input, records) {
  const ids = parseIds(input.idsText);
  const selected = ids.map(id => records.find(record => record.id === id)).filter(Boolean);
  const missing = ids.filter(id => !records.some(record => record.id === id));
  const errors = [];
  if (!['cabut', 'suspend-kf', 'suspend-km', 'teguran', 'eskalasi'].includes(input.jenis)) errors.push('Jenis surat tidak valid.');
  if (!ids.length) errors.push('Masukkan minimal 1 ID SPPG.');
  if (missing.length) errors.push(`ID tidak ditemukan: ${missing.join(', ')}`);
  const date = new Date(`${input.tanggal}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.tanggal || '') ||
      Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== input.tanggal) {
    errors.push('Tanggal surat tidak valid.');
  }
  if (input.jenis === 'cabut') {
    const invalid = selected.filter(record => record.status !== 'suspend');
    if (invalid.length) errors.push(`Tidak ada pemberhentian aktif untuk: ${invalid.map(x => x.id).join(', ')}`);
    const noReference = selected.filter(record => record.status === 'suspend' && !record.suspendNo?.trim());
    if (noReference.length) errors.push(`Nomor surat pemberhentian belum tersedia: ${noReference.map(x => x.id).join(', ')}`);
  }
  if (input.jenis === 'suspend-kf' || input.jenis === 'suspend-km') {
    const invalid = selected.filter(record => record.status === 'suspend');
    if (invalid.length) errors.push(`Sudah berstatus pemberhentian sementara: ${invalid.map(x => x.id).join(', ')}`);
  }
  return { valid: errors.length === 0, ids, selected, errors };
}

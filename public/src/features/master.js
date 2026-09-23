import { searchSppg } from '../services/sppg-repository.js';
import { escapeRecord } from '../utils/html.js';
import { badge } from '../ui/components.js';

export function initMaster() {
  const input = document.getElementById('masterQ');
  const render = () => {
    const records = searchSppg(input.value).map(escapeRecord);
    document.getElementById('masterTable').innerHTML = `
      <thead><tr><th>ID</th><th>Nama SPPG</th><th>Yayasan</th><th>Kab/Kota</th><th>Provinsi</th><th>Status</th></tr></thead>
      <tbody>${records.map(record => `<tr>
        <td><b>${record.id}</b></td><td>${record.nama}</td><td>${record.yayasan}</td>
        <td>${record.kab}</td><td>${record.prov}</td><td>${badge(record)}</td>
      </tr>`).join('') || '<tr><td colspan="6">SPPG tidak ditemukan.</td></tr>'}</tbody>`;
  };
  input.addEventListener('input', render);
  render();
}

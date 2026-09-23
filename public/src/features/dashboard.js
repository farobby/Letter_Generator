import { searchSppg, listSppg } from '../services/sppg-repository.js';
import { escapeRecord } from '../utils/html.js';
import { badge } from '../ui/components.js';

export function initDashboard() {
  const input = document.getElementById('dashQ');

  const updateStats = () => {
    const records = listSppg();
    const operasional = records.filter(r => r.status === 'operasional').length;
    const suspend = records.filter(r => r.status === 'suspend').length;
    const openedSuspend = records.filter(r => r.status === 'operasional' && r.suspendNo && r.suspendNo !== '-').length;
    const operElem = document.getElementById('operasionalCount');
    const suspendElem = document.getElementById('suspendCount');
    const openedElem = document.getElementById('openedSuspendCount');
    if (operElem) operElem.textContent = operasional;
    if (suspendElem) suspendElem.textContent = suspend;
    if (openedElem) openedElem.textContent = openedSuspend;
  };

  const search = () => {
    const records = searchSppg(input.value).map(escapeRecord);
    document.getElementById('dashOut').innerHTML = records.length ? records.map(record => `
      <div style="padding:11px 0;border-top:1px solid #edf0f4">
        <b>${record.nama}</b><div class="hint">${record.id} • ${record.kab}, ${record.prov} • ${badge(record)}</div>
      </div>`).join('') : '<div class="notice err">SPPG tidak ditemukan.</div>';
  };
  document.querySelector('[data-action="dashSearch"]').addEventListener('click', search);
  input.addEventListener('keydown', event => { if (event.key === 'Enter') search(); });
  // Initialize stats on load
  updateStats();
}

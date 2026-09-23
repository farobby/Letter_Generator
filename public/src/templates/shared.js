import { APP_CONFIG } from '../config.js';

export function header() {
  return `<div class="word-head">
<img src="${APP_CONFIG.logoUrl}">
<div>
<div class="agency">BADAN GIZI NASIONAL <em>(NATIONAL NUTRITION AGENCY)</em>
</div>
<div class="addr">Jalan Kebon Sirih No.1 RT.1 RW.7 Kebon Sirih, Kec. Menteng,<br>Kota Jakarta Pusat, Daerah Khusus Jakarta 10340</div>
</div>
</div>
<div class="lines">
</div>`;
}

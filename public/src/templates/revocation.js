import { header } from './shared.js';
import { fmtDate } from '../utils/date.js';
import { escapeHtml, escapeRecord } from '../utils/html.js';
import { APP_CONFIG } from '../config.js';

function provLabel(records) {
  const provinces = [...new Set(records.map(record => record.prov))];
  return provinces.length === 1 ? `di Provinsi ${provinces[0]}` : 'di Wilayah I';
}

function portrait1(records, context) {
  const date = fmtDate(context.tanggal);
  const nom = escapeHtml(context.nomor) || '${nomor_naskah}';
  const prov = provLabel(records);
  return `
<div class="paper portrait">${header()}<div class="meta">
<div>Nomor</div>
<div>:</div>
<div>${nom}</div>
<div class="date">Jakarta, ${date}</div>
<div>Sifat</div>
<div>:</div>
<div>Segera</div>
<div>
</div>
<div>Lampiran</div>
<div>:</div>
<div>1 (satu) Berkas</div>
<div>
</div>
<div>Hal</div>
<div>:</div>
<div>Pencabutan Pemberhentian Operasional Sementara</div>
<div>
</div>
</div>
<div class="recipient">Yth.<br>Para Kepala Satuan Pelayanan Pemenuhan Gizi (SPPG)<br>(Daftar SPPG Terlampir)<br>${prov}</div>
<div class="bodyword">
<ol>
<li>
<div>Dasar</div>
<div class="sublist">
<div>
<span>a.</span>
<span>Keputusan Kepala Badan Gizi Nasional Nomor 401.1 Tahun 2025 tentang Petunjuk Teknis Tata Kelola Penyelenggaraan Program Makan Bergizi Gratis (MBG) Tahun 2026;</span>
</div>
<div>
<span>b.</span>
<span>Keputusan Kepala Badan Gizi Nasional Republik Indonesia Nomor 63486 Tahun 2026 tentang Petunjuk Teknis Pengenaan Sanksi pada Satuan Pelayanan Pemenuhan Gizi;</span>
</div>
<div>
<span>c.</span>
<span>Surat Deputi Bidang Pemantauan dan Pengawasan hal Pemberhentian Operasional Sementara (terlampir);</span>
</div>
<div>
<span>d.</span>
<span>Surat Pernyataan Telah Selesai SLHS yang diterbitkan oleh Yayasan (terlampir).</span>
</div>
</div>
</li>
<li class="just">SPPG terlampir telah dikonfirmasi <b>memenuhi data dukung pemenuhan SLHS</b> sebagai <b>persyaratan pencabutan pemberhentian operasional sementara.</b>
</li>
<li class="just">Terhitung mulai dari tanggal surat ini dikeluarkan, status <b>Pemberhentian Operasional Sementara DICABUT</b> dan dinyatakan dapat beroperasi kembali secara normal dengan segala hak operasionalnya sesuai peraturan perundang-undangan yang berlaku.</li>
<li class="just">Dalam rangka penegakan integritas dan tata kelola pemerintahan yang bersih, seluruh jajaran Kedeputian Bidang Pemantauan dan Pengawasan dalam menjalankan tugas dan fungsinya <b>tidak menerima dan tidak meminta imbalan, hadiah, atau gratifikasi dalam bentuk apapun.</b> Seluruh layanan dan proses administrasi dilaksanakan secara profesional, transparan, dan bebas dari biaya.</li>
</ol>
</div>
</div>`;
}

function portrait2() {
  return `
<div class="paper portrait">
<div class="pgno">- 2 -</div>
<div class="bodyword">
<ol start="5">
<li class="just">Demikian Surat Pencabutan Pemberhentian Operasional Sementara ini disampaikan untuk segera ditindaklanjuti.</li>
</ol>
</div>
<div class="siggrid">
<div>
</div>
<div class="sig">Deputi&nbsp;&nbsp;&nbsp;&nbsp; Bidang&nbsp;&nbsp;&nbsp;&nbsp; Pemantauan&nbsp;&nbsp;&nbsp;&nbsp; dan<br>Pengawasan,<div class="space">
</div>Dr. Ketut Sumedana</div>
</div>
<div class="tembusan">Tembusan Yth.:<br>1.&nbsp;&nbsp; Kepala Badan Gizi Nasional;<br>2.&nbsp;&nbsp; Wakil Kepala Badan Gizi Nasional;<br>3.&nbsp;&nbsp; Sekretaris Utama Badan Gizi Nasional;<br>4.&nbsp;&nbsp; Deputi Bidang Penyediaan dan Penyaluran;<br>5.&nbsp;&nbsp; Inspektur Utama;<br>6.&nbsp;&nbsp; Kepala Kantor Pelayanan Pemenuhan Gizi (KPPG) Medan;<br>7.&nbsp;&nbsp; Kepala Kantor Pelayanan Pemenuhan Gizi (KPPG) Bandar Lampung;<br>8.&nbsp;&nbsp; Pejabat Pembuat Komitmen (PPK) Program MBG.</div>
</div>`;
}

function annexPage(rows, last, startNo, context) {
  const date = fmtDate(context.tanggal);
  const nom = escapeHtml(context.nomor) || '${nomor_naskah}';
  return `
<div class="paper landscape">
<div class="annex-head">Lampiran Surat Deputi Bidang<br>Pemantauan dan Pengawasan<br>Nomor&nbsp;&nbsp;&nbsp;&nbsp;: ${nom}<br>Tanggal&nbsp;&nbsp;: ${date}</div>
<div class="annex-title">DAFTAR SPPG YANG DICABUT PEMBERHENTIAN OPERASIONAL SEMENTARA</div>
<table class="annex-table">
<thead>
<tr>
<th style="width:42px">No.</th>
<th>Nama SPPG</th>
<th style="width:120px">ID SPPG</th>
<th>Nama Yayasan</th>
<th style="width:150px">Tanggal<br>Operasional</th>
<th style="width:155px">Kab/Kota</th>
<th style="width:190px">Nomor Surat<br>Pemberhentian Ops<br>Sementara</th>
</tr>
</thead>
<tbody>${rows.map((x,i)=>`<tr>
<td>${startNo+i}.</td>
<td>${x.nama}</td>
<td>${x.id}</td>
<td>${x.yayasan}</td>
<td>${x.tgl}</td>
<td>${x.kab}</td>
<td>${x.suspendNo}</td>
</tr>`).join('')}</tbody>
</table>${last?`<div class="annex-sig">Deputi&nbsp;&nbsp;&nbsp;&nbsp; Bidang&nbsp;&nbsp;&nbsp;&nbsp; Pemantauan&nbsp;&nbsp;&nbsp;&nbsp; dan<br>Pengawasan,<div class="space">
</div>Dr. Ketut Sumedana</div>`:''}</div>`;
}

export function renderRevocation(records, context) {
  const a = records.map(escapeRecord);
  let html = portrait1(a, context) + portrait2();
  for (let i = 0; i < a.length; i += APP_CONFIG.annexRowsPerPage) {
    const part = a.slice(i, i + APP_CONFIG.annexRowsPerPage);
    html += annexPage(part, i + APP_CONFIG.annexRowsPerPage >= a.length, i + 1, context);
  }
  return html;
}

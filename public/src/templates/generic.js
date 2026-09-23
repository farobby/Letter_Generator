import { header } from './shared.js';
import { fmtDate } from '../utils/date.js';
import { escapeHtml } from '../utils/html.js';

export function renderGeneric(records, input) {
  const { jenis, tanggal, nomor, kategori } = input;
  const date = fmtDate(tanggal);
  const nom = escapeHtml(nomor) || '${nomor_naskah}';
  const names = records.map(record => escapeHtml(record.nama)).join(', ');
  
  let title = '';
  let hal = '';
  let content = '';

  if (jenis === 'teguran') {
    title = 'Surat Teguran';
    hal = 'Teguran Pelanggaran SPPG';
    content = `
      <li class="just">Memperhatikan laporan hasil pemantauan dan pengawasan di lapangan, ditemukan bahwa SPPG Saudara <b>belum sepenuhnya mematuhi</b> standar operasional prosedur yang berlaku.</li>
      <li class="just">Melalui surat ini, kami memberikan <b>teguran keras</b> kepada SPPG Saudara agar segera melakukan perbaikan dan menyesuaikan operasional sesuai dengan pedoman yang ditetapkan.</li>
      <li class="just">Apabila dalam waktu dekat tidak terdapat perbaikan, maka akan dikenakan sanksi lanjutan berupa pemberhentian operasional sementara.</li>`;
  } else if (jenis === 'suspend-kf') {
    title = 'Pemberhentian Operasional Sementara';
    hal = 'Pemberhentian Operasional Sementara (Kejadian Fatal)';
    content = `
      <li class="just">Berdasarkan hasil investigasi dan laporan insiden di lapangan, telah terjadi pelanggaran berat/<b>Kejadian Fatal (KF)</b> pada SPPG Saudara yang sangat membahayakan penerima manfaat.</li>
      <li class="just">Dengan ini, kami memutuskan untuk menjatuhkan sanksi <b>Pemberhentian Operasional Sementara</b> kepada SPPG Saudara selama <b>${kategori} hari kalender</b> terhitung sejak tanggal surat ini ditetapkan.</li>
      <li class="just">Selama masa pemberhentian, SPPG dilarang melakukan kegiatan penyediaan makanan dan wajib melakukan pembenahan internal (SLHS).</li>`;
  } else if (jenis === 'suspend-km') {
    title = 'Pemberhentian Operasional Sementara';
    hal = 'Pemberhentian Operasional Sementara (Kejadian Menonjol)';
    content = `
      <li class="just">Memperhatikan laporan terkait kinerja SPPG Saudara, ditemukan adanya <b>Kejadian Menonjol (KM)</b> yang menyalahi petunjuk teknis pelaksanaan program.</li>
      <li class="just">Berdasarkan pedoman sanksi, kami memberikan sanksi <b>Pemberhentian Operasional Sementara</b> selama <b>${kategori} hari kalender</b>.</li>
      <li class="just">Seluruh aktivitas operasional dihentikan hingga SPPG Saudara berhasil melengkapi dokumen pemenuhan SLHS dan diverifikasi kembali oleh tim kami.</li>`;
  } else if (jenis === 'eskalasi') {
    title = 'Surat Eskalasi';
    hal = 'Eskalasi Pelanggaran Berat SPPG';
    content = `
      <li class="just">Sehubungan dengan berulangnya pelanggaran operasional dan tidak diindahkannya teguran serta sanksi sebelumnya, kami menyampaikan <b>Eskalasi</b> penanganan kasus ini.</li>
      <li class="just">Kami merekomendasikan pencabutan izin tetap atau penyerahan penanganan kasus ini kepada aparat/otoritas berwenang untuk ditindaklanjuti secara hukum.</li>
      <li class="just">Keputusan akhir akan diumumkan setelah proses peninjauan oleh Pimpinan Pusat selesai.</li>`;
  }

  return `
<div class="paper portrait">
  ${header()}
  <div class="meta">
    <div>Nomor</div><div>:</div><div>${nom}</div>
    <div class="date">Jakarta, ${date}</div>
    <div>Sifat</div><div>:</div><div>Segera</div><div></div>
    <div>Lampiran</div><div>:</div><div>-</div><div></div>
    <div>Hal</div><div>:</div><div>${hal}</div><div></div>
  </div>
  
  <div class="recipient">Yth.<br>Kepala SPPG ${names}<br>di Tempat</div>
  
  <div class="bodyword">
    <ol>
      ${content}
      <li class="just">Demikian ${title} ini disampaikan untuk segera ditindaklanjuti.</li>
    </ol>
  </div>
  
  <div class="siggrid">
    <div></div>
    <div class="sig">Deputi&nbsp;&nbsp;&nbsp;&nbsp; Bidang&nbsp;&nbsp;&nbsp;&nbsp; Pemantauan&nbsp;&nbsp;&nbsp;&nbsp; dan<br>Pengawasan,<div class="space"></div>Dr. Ketut Sumedana</div>
  </div>
</div>`;
}

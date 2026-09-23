import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLetter, parseIds } from '../public/src/domain/letter-validation.js';
import { listSppg } from '../public/src/services/sppg-repository.js';
import { renderRevocation } from '../public/src/templates/revocation.js';

const base = { jenis: 'cabut', idsText: 'QSZNOIZE', tanggal: '2026-09-20', nomor: '' };
const validate = changes => validateLetter({ ...base, ...changes }, listSppg());

test('IDs are normalized and deduplicated; unknown IDs stop the whole request', () => {
  assert.deepEqual(parseIds('qsznoize, QSZNOIZE;\nDP7MZKFO'), ['QSZNOIZE', 'DP7MZKFO']);
  assert.equal(validate({ idsText: 'QSZNOIZE UNKNOWN' }).valid, false);
  assert.equal(validate({ idsText: '' }).valid, false);
});
test('status rules prevent invalid revocations and duplicate suspensions', () => {
  assert.equal(validate({}).valid, true);
  assert.equal(validate({ idsText: 'FHRJNHQV' }).valid, false);
  assert.equal(validate({ jenis: 'suspend' }).valid, false);
  assert.equal(validate({ jenis: 'suspend', idsText: 'FHRJNHQV' }).valid, true);
  const records = listSppg().map(x => ({ ...x, suspendNo: '' }));
  assert.equal(validateLetter(base, records).valid, false);
});
test('invalid dates and letter types are blocked', () => {
  for (const tanggal of ['', '2026-02-30', 'invalid']) assert.equal(validate({ tanggal }).valid, false);
  assert.equal(validate({ jenis: 'unknown' }).valid, false);
});
test('annex splits at six rows; sequential numbering and last-page signature survive refactor', () => {
  const records = listSppg().filter(x => x.status === 'suspend');
  const html = renderRevocation(records, base);
  assert.equal((html.match(/class="paper portrait"/g) || []).length, 2);
  assert.equal((html.match(/class="paper landscape"/g) || []).length, 2);
  assert.equal((html.match(/class="annex-sig"/g) || []).length, 1);
  assert.match(html, /<td>7\.<\/td>/);
  for (const record of records) assert.ok(html.includes(record.id));
});
test('form and record text cannot inject markup into the preview', () => {
  const html = renderRevocation([{ ...listSppg()[0], nama: '<img onerror=alert(1)>' }], { ...base, nomor: '<script>bad</script>' });
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img onerror'));
  assert.ok(html.includes('&lt;script&gt;'));
});

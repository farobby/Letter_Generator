// Extension point: replace with persisted storage/API. No false save success.
export async function saveDraft(_payload) {
  return { persisted: false, message: 'Simulasi draf. Data belum disimpan; hubungkan penyimpanan untuk mengaktifkan fitur ini.' };
}

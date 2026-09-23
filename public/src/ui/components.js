export function badge(record) {
  return record.status === 'suspend'
    ? '<span class="badge sus">Pemberhentian Sementara</span>'
    : '<span class="badge op">Operasional</span>';
}

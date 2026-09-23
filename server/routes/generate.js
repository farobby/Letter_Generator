// Replace this handler when the original DOCX template and generator are available.
// Never rename HTML to .docx: the client expects a genuine OOXML document.
export function handleGenerate(_request, response) {
  response.writeHead(501, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify({
    error: 'Generator Word belum terhubung. Template DOCX dan backend pembuat surat belum disertakan dalam paket ini.',
  }));
}

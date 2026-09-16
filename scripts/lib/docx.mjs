/**
 * A minimal .docx writer.
 *
 * python-docx is not installed here and the package must not depend on a
 * network fetch to build, so this writes the format directly: a .docx is a zip
 * of three XML parts, and for a document that is only headings and paragraphs
 * that is genuinely all it needs to be.
 *
 * Word, Pages, LibreOffice and Google Docs all open the result.
 */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const style = (id, name, size, bold, color, spaceBefore) =>
  `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/>` +
  `<w:pPr><w:spacing w:before="${spaceBefore}" w:after="120"/></w:pPr>` +
  `<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="${size}"/>` +
  (bold ? '<w:b/>' : '') + (color ? `<w:color w:val="${color}"/>` : '') + `</w:rPr></w:style>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
${style('Title', 'Title', 56, true, '0E2A5C', 0)}
${style('Heading1', 'heading 1', 32, true, '1F4E9C', 360)}
${style('Heading2', 'heading 2', 24, true, '555555', 280)}
${style('Normal', 'Normal', 22, false, null, 0)}
${style('Quote', 'Quote', 24, false, '1F4E9C', 80)}
${style('Caption', 'caption', 18, false, '777777', 0)}
</w:styles>`;

/**
 * blocks: [{style: 'Title'|'Heading1'|'Heading2'|'Normal'|'Quote'|'Caption', text}]
 */
export const writeDocx = (file, blocks) => {
  const body = blocks.map((b) => {
    const s = b.style ?? 'Normal';
    const ind = s === 'Quote' ? '<w:ind w:left="454"/>' : '';
    return `<w:p><w:pPr><w:pStyle w:val="${s}"/>${ind}</w:pPr>` +
      `<w:r><w:t xml:space="preserve">${esc(b.text)}</w:t></w:r></w:p>`;
  }).join('');

  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>
<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>`;

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-'));
  fs.mkdirSync(path.join(tmp, '_rels'));
  fs.mkdirSync(path.join(tmp, 'word', '_rels'), {recursive: true});
  fs.writeFileSync(path.join(tmp, '[Content_Types].xml'), CONTENT_TYPES);
  fs.writeFileSync(path.join(tmp, '_rels', '.rels'), RELS);
  fs.writeFileSync(path.join(tmp, 'word', 'document.xml'), document);
  fs.writeFileSync(path.join(tmp, 'word', 'styles.xml'), STYLES);
  fs.writeFileSync(path.join(tmp, 'word', '_rels', 'document.xml.rels'), DOC_RELS);

  fs.rmSync(file, {force: true});
  // [Content_Types].xml must be the first entry in the archive.
  const zip = (args) => {
    const r = spawnSync('zip', args, {cwd: tmp});
    if (r.status !== 0) throw new Error(`zip failed: ${r.stderr}`);
  };
  zip(['-qX0', file, '[Content_Types].xml']);
  zip(['-qrX', file, '_rels', 'word']);
  fs.rmSync(tmp, {recursive: true, force: true});
  return file;
};

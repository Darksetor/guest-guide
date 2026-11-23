#!/usr/bin/env node
/* =========================================================
   Generates the permanent, static QR Code of the Guest Guide.
   No installation needed (only Node.js).

   Usage:
     node tools/generate-qr.js https://YOUR-USER.github.io/casa-sao-nuno/

   Output:
     qr-code/qrcode.png  (2400 × 2400 px, print quality)
     qr-code/qrcode.svg  (vector, for professional printing)
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const qrcode = require('../assets/js/qrcode-generator.js');

const url = process.argv[2];
if (!url || !/^https:\/\/[^\s]+$/i.test(url)) {
  console.error('Please give the full https address, e.g.\n  node tools/generate-qr.js https://YOUR-USER.github.io/casa-sao-nuno/');
  process.exit(1);
}

const INK = [0x2E, 0x29, 0x24];   // warm near-black (excellent scan contrast)
const BG = [0xFF, 0xFF, 0xFF];
const QUIET = 4;                  // quiet zone in modules (standard)
const PNG_SIZE = 2400;

qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
const qr = qrcode(0, 'Q');        // auto version, 25% error correction
qr.addData(url, 'Byte');
qr.make();
const n = qr.getModuleCount();
const total = n + QUIET * 2;

/* ---------- SVG ---------- */
let d = '';
for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (qr.isDark(r, c)) d += `M${c + QUIET} ${r + QUIET}h1v1h-1z`;
  }
}
const hex = '#' + INK.map((v) => v.toString(16).padStart(2, '0')).join('');
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="100mm" height="100mm" shape-rendering="crispEdges">
<title>Casa São Nuno Guest Guide — ${url}</title>
<rect width="${total}" height="${total}" fill="#FFFFFF"/>
<path fill="${hex}" d="${d}"/>
</svg>
`;

/* ---------- PNG (minimal encoder) ---------- */
const scale = Math.floor(PNG_SIZE / total);
const size = scale * total;
const rowLen = size * 3 + 1;
const raw = Buffer.alloc(rowLen * size);
for (let y = 0; y < size; y++) {
  raw[y * rowLen] = 0; // filter: none
  const mr = Math.floor(y / scale) - QUIET;
  for (let x = 0; x < size; x++) {
    const mc = Math.floor(x / scale) - QUIET;
    const dark = mr >= 0 && mc >= 0 && mr < n && mc < n && qr.isDark(mr, mc);
    const col = dark ? INK : BG;
    const o = y * rowLen + 1 + x * 3;
    raw[o] = col[0]; raw[o + 1] = col[1]; raw[o + 2] = col[2];
  }
}
const crcTable = new Int32Array(256).map((_, k) => {
  let c = k;
  for (let i = 0; i < 8; i++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const phys = Buffer.alloc(9); // 300 dpi
phys.writeUInt32BE(11811, 0); phys.writeUInt32BE(11811, 4); phys[8] = 1;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  chunk('IHDR', ihdr),
  chunk('pHYs', phys),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

const outDir = path.join(__dirname, '..', 'qr-code');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'qrcode.svg'), svg);
fs.writeFileSync(path.join(outDir, 'qrcode.png'), png);
fs.writeFileSync(path.join(outDir, 'qrcode-url.txt'), url + '\n');
console.log(`QR Code created for ${url}\n  qr-code/qrcode.png (${size}×${size}px)\n  qr-code/qrcode.svg`);

/** Minimal WAV header reader/writer - enough for the mono PCM piper produces. */
import fs from 'node:fs';

export const readWavInfo = (file) => {
  const fd = fs.openSync(file, 'r');
  const head = Buffer.alloc(4096);
  const read = fs.readSync(fd, head, 0, 4096, 0);
  fs.closeSync(fd);
  if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error(`${file} is not a RIFF/WAVE file`);
  }
  let offset = 12;
  let fmt = null;
  let dataSize = null;
  while (offset + 8 <= read) {
    const id = head.toString('ascii', offset, offset + 4);
    const size = head.readUInt32LE(offset + 4);
    if (id === 'fmt ') {
      fmt = {
        channels: head.readUInt16LE(offset + 10),
        sampleRate: head.readUInt32LE(offset + 12),
        bitsPerSample: head.readUInt16LE(offset + 22),
      };
    } else if (id === 'data') {
      dataSize = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }
  if (!fmt || dataSize === null) throw new Error(`Could not parse ${file}`);
  const bytesPerFrame = (fmt.bitsPerSample / 8) * fmt.channels;
  return {...fmt, dataSize, duration: dataSize / bytesPerFrame / fmt.sampleRate};
};

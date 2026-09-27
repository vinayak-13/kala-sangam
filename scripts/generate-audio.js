const fs = require('fs');
const path = require('path');

function createWavFile(filepath, durationSec = 6) {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * durationSec;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * (bitsPerSample / 8);

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate harmonized acoustic drone (D3 146.83Hz + A3 220Hz + D4 293.66Hz)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin((Math.PI * i) / numSamples);
    const wave =
      0.5 * Math.sin(2 * Math.PI * 146.83 * t) +
      0.3 * Math.sin(2 * Math.PI * 220.0 * t) +
      0.2 * Math.sin(2 * Math.PI * 293.66 * t);
    const sample = Math.floor(wave * envelope * 24000);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, sample)), 44 + i * 2);
  }

  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, buffer);
  console.log('Created audio file:', filepath);
}

const targets = [
  'C:/Users/Admin/.gemini/antigravity-ide/scratch/kala-sangam/public/audio/seed/sunil_tarpa_explanation.webm',
  'C:/Users/Admin/.gemini/antigravity-ide/scratch/kala-sangam/public/audio/seed/sunil_tarpa_explanation.wav',
  'C:/Users/Admin/Downloads/ss/public/audio/seed/sunil_tarpa_explanation.webm',
  'C:/Users/Admin/Downloads/ss/public/audio/seed/sunil_tarpa_explanation.wav',
];

targets.forEach((t) => createWavFile(t));

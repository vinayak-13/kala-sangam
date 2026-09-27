const fs = require('fs');
const https = require('https');
const path = require('path');

const data = JSON.parse(fs.readFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/6f83306e-3c68-4449-9596-e9da68bbd02c/.system_generated/steps/11/output.txt', 'utf8'));
const scratchDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/6f83306e-3c68-4449-9596-e9da68bbd02c/scratch';
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

data.screens.forEach((screen, i) => {
  if (screen.htmlCode && screen.htmlCode.downloadUrl) {
    const title = screen.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filePath = path.join(scratchDir, `screen_${i}_${title}.html`);
    https.get(screen.htmlCode.downloadUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let content = '';
      res.on('data', c => content += c);
      res.on('end', () => {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Saved HTML:', filePath);
      });
    }).on('error', err => console.error('Error:', err));
  }
});

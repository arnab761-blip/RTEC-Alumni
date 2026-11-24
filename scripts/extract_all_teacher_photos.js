import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { Jimp } from 'jimp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const pdfPath = 'C:/Users/HP/.gemini/antigravity/brain/7230cad8-4281-4827-9a08-5c4047f16497/.user_uploaded/media_1795529446461_93bda770.pdf';
const teachersDir = path.join(projectRoot, 'public', 'images', 'teachers');

if (!fs.existsSync(teachersDir)) {
  fs.mkdirSync(teachersDir, { recursive: true });
}

const fileMap = {
  12: 'principal_saifur_rahman.jpg',
  11: 'asst_prof_ronju_mia.jpg',
  10: 'asst_prof_asif_hossain.jpg',
  9: 'lecturer_sabbir_ahmed.jpg',
  8: 'lecturer_mahmudul_hasan.jpg',
  7: 'foreman_israk_hossain.jpg',
  6: 'lecturer_saidur_rahman.jpg',
  5: 'lecturer_shafiqul_islam.jpg',
  4: 'instructor_palash_sarkar.jpg',
  3: 'instructor_nuruzzaman_rana.jpg',
  2: 'instructor_touhidur_rahman.jpg',
  1: 'instructor_mushriful_islam.jpg'
};

async function extractAndCrop() {
  const str = fs.readFileSync(pdfPath, 'binary');
  const regex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match;
  let pageIdx = 0;

  while ((match = regex.exec(str)) !== null) {
    const raw = Buffer.from(match[1], 'binary');
    try {
      const uncompressed = zlib.inflateSync(raw);
      if (uncompressed.length > 50000 && uncompressed[0] === 0xFF && uncompressed[1] === 0xD8) {
        pageIdx++;
        const filename = fileMap[pageIdx];
        if (filename) {
          console.log(`Processing Page ${pageIdx} -> ${filename}...`);
          const img = await Jimp.read(uncompressed);
          // Crop photo box
          img.crop({ x: 52, y: 252, w: 446, h: 542 });
          const outPath = path.join(teachersDir, filename);
          await img.write(outPath);
          console.log(`✓ Saved ${filename} (${img.bitmap.width}x${img.bitmap.height})`);
        }
      }
    } catch (e) {}
  }

  console.log('All 12 teacher photos extracted and cropped successfully!');
}

extractAndCrop().catch(err => {
  console.error('Extraction error:', err);
});

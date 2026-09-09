const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets', 'images');
const OUT_DIR = path.join(ASSETS, 'markers');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SIZE = 96; // px, @3x-equivalent for a ~32pt marker
const categories = {
  restaurant: { color: '#B5562E', icon: 'categoryIcons/restaurant.svg' },
  cafe: { color: '#8C6D3F', icon: 'categoryIcons/cafe.svg' },
  museum: { color: '#5C7A8A', icon: 'categoryIcons/museum.svg' },
  park: { color: '#6B8754', icon: 'categoryIcons/park.svg' },
};

// Simple rounded teardrop pin path in a 32x40 box.
function pinSvg({ fill, stroke, strokeWidth }) {
  return `
  <svg width="${SIZE}" height="${SIZE * 1.25}" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 1 C24.28 1 31 7.72 31 16 C31 24 21 33.5 16.9 38.2 C16.4 38.8 15.6 38.8 15.1 38.2 C11 33.5 1 24 1 16 C1 7.72 7.72 1 16 1 Z"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="${strokeWidth}"
    />
  </svg>`;
}

async function tintedIconBuffer(svgPath, color, size) {
  const svg = fs.readFileSync(path.join(ASSETS, svgPath), 'utf8');
  const raw = await sharp(Buffer.from(svg)).resize(size, size).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const { data, info } = raw;
  const [r, g, b] = [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
  ];
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    // keep alpha (data[i+3]) as-is from the source glyph
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

async function generate(name, config) {
  const iconSize = Math.round(SIZE * 0.4);
  const iconOffset = { top: Math.round(SIZE * 0.22), left: Math.round((SIZE - iconSize) / 2) };

  // Visited: solid filled pin, white icon.
  const filledPin = await sharp(Buffer.from(pinSvg({ fill: config.color, stroke: config.color, strokeWidth: 0 })))
    .png()
    .toBuffer();
  const whiteIcon = await tintedIconBuffer(config.icon, '#FFFFFF', iconSize);
  await sharp(filledPin)
    .composite([{ input: whiteIcon, ...iconOffset }])
    .toFile(path.join(OUT_DIR, `${name}-visited.png`));

  // Not visited: white/hollow pin, colored outline + colored icon.
  const outlinePin = await sharp(Buffer.from(pinSvg({ fill: '#FFFFFF', stroke: config.color, strokeWidth: 3 })))
    .png()
    .toBuffer();
  const coloredIcon = await tintedIconBuffer(config.icon, config.color, iconSize);
  await sharp(outlinePin)
    .composite([{ input: coloredIcon, ...iconOffset }])
    .toFile(path.join(OUT_DIR, `${name}-not-visited.png`));

  console.log(`generated markers for ${name}`);
}

(async () => {
  for (const [name, config] of Object.entries(categories)) {
    await generate(name, config);
  }
  console.log('done');
})();

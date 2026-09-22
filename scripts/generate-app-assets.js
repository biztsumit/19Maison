/* eslint-disable no-console */
// Regenerates the launcher icons and splash artwork from the Figma-exported logo.
//
// Sources (committed, exported from Figma):
//   assets/figma/wordmark.svg    - "19 MAISON" as vector paths, gold gradient
//   assets/figma/logo-splash.png - the splash lockup as rendered in the design
//
// Run: node scripts/generate-app-assets.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const FIGMA = path.join(ROOT, 'assets', 'figma');
const OUT = path.join(ROOT, 'assets', 'images');

// Brand black. The Figma splash frame is pure #000000, not the #0A0A0A used by
// the dark seller surfaces.
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };

// The wordmark reads "19 MAISON"; "MAISON" begins at x≈155 in the 639-wide
// viewBox, so the monogram is everything left of that.
const MONOGRAM_CROP_RATIO = 152 / 639;

const square = (size) => ({
  create: { width: size, height: size, channels: 4, background: BLACK },
});

const transparentSquare = (size) => ({
  create: {
    width: size,
    height: size,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
});

async function monogram({ density = 600 } = {}) {
  // Rasterise first: metadata() on an SVG reports its declared size, not the
  // density-scaled raster, so the crop must be measured on the rendered bitmap.
  const rendered = await sharp(path.join(FIGMA, 'wordmark.svg'), { density }).png().toBuffer();
  const { width, height } = await sharp(rendered).metadata();
  const cropWidth = Math.round(width * MONOGRAM_CROP_RATIO);

  // Two pipelines on purpose: sharp applies trim before extract within a single
  // pipeline, which shrinks the height and puts the extract out of bounds.
  const cut = await sharp(rendered)
    .extract({ left: 0, top: 0, width: cropWidth, height })
    .png()
    .toBuffer();

  // Tighten to the glyph bounds so padding is predictable.
  return sharp(cut).trim().png().toBuffer();
}

// Recolours artwork to flat white for the Android monochrome layer, by keeping the
// artwork's alpha channel and replacing its colour. A composite with blend 'in'
// fills the whole canvas instead of masking, so the alpha is joined explicitly.
async function toWhite(buffer) {
  const { width, height } = await sharp(buffer).metadata();
  const alpha = await sharp(buffer).ensureAlpha().extractChannel('alpha').toBuffer();
  const white = await sharp({
    create: { width, height, channels: 3, background: '#FFFFFF' },
  })
    .png()
    .toBuffer();

  return sharp(white).joinChannel(alpha).png().toBuffer();
}

async function placeOn(base, art, size, coverage) {
  // `coverage` is the fraction of the canvas width the artwork should occupy.
  const target = Math.round(size * coverage);
  const scaled = await sharp(art).resize({ width: target }).png().toBuffer();
  const { height } = await sharp(scaled).metadata();

  return sharp(base)
    .composite([
      {
        input: scaled,
        left: Math.round((size - target) / 2),
        top: Math.round((size - height) / 2),
      },
    ])
    .png()
    .toBuffer();
}

// The hero band is 205pt tall in a 428pt frame. The studio shot is near-square
// (2000x2116) with the eyewear sitting low and right, so a default centre crop
// into that band would show empty backdrop and cut the subject off. Anchor the
// crop to the bottom edge instead: the product stays in frame and the dark
// left half is left clear for the overlay card.
const HERO_RATIO = 205 / 428;
const HERO_WIDTH = 1284; // 428pt at @3x; the source is far larger than needed.

async function heroFallback() {
  const src = path.join(OUT, 'hero-banner.png');
  const { width, height } = await sharp(src).metadata();
  const cropHeight = Math.min(height, Math.round(width * HERO_RATIO));
  const band = await sharp(src)
    .extract({ left: 0, top: height - cropHeight, width, height: cropHeight })
    .png()
    .toBuffer();
  return sharp(band)
    .resize(HERO_WIDTH, Math.round(HERO_WIDTH * HERO_RATIO))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

// Android 12+ draws the splash icon through a circular mask: the image is treated
// as a 1024-square whose visible area is roughly the inner two thirds. The
// "19 MAISON" lockup is 7.3:1, so dropping it in raw left only the middle few
// letters showing. Centring it on a square canvas at a width that fits inside that
// circle keeps the whole wordmark. iOS applies no mask and keeps the tight lockup.
const SPLASH_CANVAS = 1024;
const SPLASH_SAFE_WIDTH = 0.62; // chord of the mask circle, with margin

async function androidSplash() {
  const lockup = await sharp(path.join(FIGMA, 'logo-splash.png')).trim().png().toBuffer();
  const { width, height } = await sharp(lockup).metadata();
  const targetW = Math.round(SPLASH_CANVAS * SPLASH_SAFE_WIDTH);
  const targetH = Math.round((targetW * height) / width);
  const scaled = await sharp(lockup).resize(targetW, targetH).png().toBuffer();

  return sharp(transparentSquare(SPLASH_CANVAS))
    .composite([
      {
        input: scaled,
        left: Math.round((SPLASH_CANVAS - targetW) / 2),
        top: Math.round((SPLASH_CANVAS - targetH) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const mark = await monogram();
  const written = [];

  const write = async (name, buffer) => {
    fs.writeFileSync(path.join(OUT, name), buffer);
    const meta = await sharp(buffer).metadata();
    written.push(`${name.padEnd(30)} ${meta.width}x${meta.height}`);
  };

  // iOS / general launcher icon: opaque, monogram at 52% width.
  await write(
    'icon.png',
    await sharp(await placeOn(square(1024), mark, 1024, 0.52))
      .flatten({ background: BLACK })
      .png()
      .toBuffer(),
  );

  // Android adaptive icon. The outer ~25% of each edge can be masked away, so the
  // foreground sits well inside the safe area.
  await write('android-icon-foreground.png', await placeOn(transparentSquare(1024), mark, 1024, 0.38));
  await write(
    'android-icon-background.png',
    await sharp(square(1024)).png().toBuffer(),
  );
  await write(
    'android-icon-monochrome.png',
    await placeOn(transparentSquare(1024), await toWhite(mark), 1024, 0.38),
  );

  await write(
    'favicon.png',
    await sharp(await placeOn(square(196), mark, 196, 0.56)).png().toBuffer(),
  );

  // Splash: the full lockup on transparent, drawn over the black splash colour.
  await write(
    'splash-icon.png',
    await sharp(path.join(FIGMA, 'logo-splash.png')).trim().png().toBuffer(),
  );

  // Hero slider fallback, used when /homepage returns no usable hero imagery.
  await write('hero-fallback.png', await heroFallback());

  // Android 12+ masks the splash icon to a circle; iOS does not.
  await write('splash-icon-android.png', await androidSplash());

  console.log('Generated:\n  ' + written.join('\n  '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

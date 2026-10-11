import fs from 'fs';
import path from 'path';

const MOTOGP_SEASON_UUID = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const MOTOGP_CATEGORY_UUID = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Official 2026 F1 Media Assets scraped directly from https://www.formula1.com/en/drivers
const F1_OFFICIAL_ASSETS = {
  antonelli: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01numberwhitefrless.webp'
  },
  russell: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/mercedes/georus01/2026mercedesgeorus01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/mercedes/georus01/2026mercedesgeorus01numberwhitefrless.webp'
  },
  hamilton: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/ferrari/lewham01/2026ferrarilewham01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/ferrari/lewham01/2026ferrarilewham01numberwhitefrless.webp'
  },
  leclerc: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/ferrari/chalec01/2026ferrarichalec01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/ferrari/chalec01/2026ferrarichalec01numberwhitefrless.webp'
  },
  max_verstappen: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/redbullracing/maxver01/2026redbullracingmaxver01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/redbullracing/maxver01/2026redbullracingmaxver01numberwhitefrless.webp'
  },
  norris: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/mclaren/lannor01/2026mclarenlannor01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/mclaren/lannor01/2026mclarenlannor01numberwhitefrless.webp'
  },
  piastri: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/mclaren/oscpia01/2026mclarenoscpia01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/mclaren/oscpia01/2026mclarenoscpia01numberwhitefrless.webp'
  },
  hadjar: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/redbullracing/isahad01/2026redbullracingisahad01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/redbullracing/isahad01/2026redbullracingisahad01numberwhitefrless.webp'
  },
  lawson: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/racingbulls/lialaw01/2026racingbullslialaw01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/racingbulls/lialaw01/2026racingbullslialaw01numberwhitefrless.webp'
  },
  gasly: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/alpine/piegas01/2026alpinepiegas01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/alpine/piegas01/2026alpinepiegas01numberwhitefrless.webp'
  },
  arvid_lindblad: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/racingbulls/arvlin01/2026racingbullsarvlin01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/racingbulls/arvlin01/2026racingbullsarvlin01numberwhitefrless.webp'
  },
  colapinto: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/alpine/fracol01/2026alpinefracol01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/alpine/fracol01/2026alpinefracol01numberwhitefrless.webp'
  },
  bearman: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/haasf1team/olibea01/2026haasf1teamolibea01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/haasf1team/olibea01/2026haasf1teamolibea01numberwhitefrless.webp'
  },
  bortoleto: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/audi/gabbor01/2026audigabbor01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/audi/gabbor01/2026audigabbor01numberwhitefrless.webp'
  },
  hulkenberg: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/audi/nichul01/2026audinichul01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/audi/nichul01/2026audinichul01numberwhitefrless.webp'
  },
  ocon: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/haasf1team/estoco01/2026haasf1teamestoco01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/haasf1team/estoco01/2026haasf1teamestoco01numberwhitefrless.webp'
  },
  alonso: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/astonmartin/feralo01/2026astonmartinferalo01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/astonmartin/feralo01/2026astonmartinferalo01numberwhitefrless.webp'
  },
  sainz: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/williams/carsai01/2026williamscarsai01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/williams/carsai01/2026williamscarsai01numberwhitefrless.webp'
  },
  albon: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/williams/alealb01/2026williamscarsai01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/williams/alealb01/2026williamscarsai01numberwhitefrless.webp'
  },
  stroll: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/astonmartin/lanstr01/2026astonmartinlanstr01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/astonmartin/lanstr01/2026astonmartinlanstr01numberwhitefrless.webp'
  },
  bottas: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/cadillac/valbot01/2026cadillacvalbot01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/cadillac/valbot01/2026cadillacvalbot01numberwhitefrless.webp'
  },
  perez: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/cadillac/serper01/2026cadillacserper01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2026/cadillac/serper01/2026cadillacserper01numberwhitefrless.webp'
  },
  tsunoda: {
    cutoutUrl: 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/v1740000001/common/f1/2024/rb/yuktsu01/2024rbyuktsu01right.webp',
    numberGraphicUrl: 'https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/2024/rb/yuktsu01/2024rbyuktsu01numberwhitefrless.webp'
  }
};

async function main() {
  console.log('🏎️ Updating official assets: F1 (formula1.com) & MotoGP (motogp.com)...');
  const dataPath = path.resolve('src/data/scrapedData.json');
  const existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // 1. F1 Official Assets from formula1.com
  existing.f1_2026.driverStandings = existing.f1_2026.driverStandings.map((ds) => {
    const driverId = ds.Driver.driverId;
    const asset = F1_OFFICIAL_ASSETS[driverId];
    if (asset) {
      ds.Driver.avatarUrl = asset.cutoutUrl;
      ds.Driver.cutoutUrl = asset.cutoutUrl;
      ds.Driver.numberGraphicUrl = asset.numberGraphicUrl;
      console.log(`  ✓ F1: ${ds.Driver.givenName} ${ds.Driver.familyName} -> official formula1.com asset set`);
    }
    return ds;
  });

  // 2. MotoGP Photos from Pulselive API
  try {
    const motogpStandingsRes = await fetch(
      `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${MOTOGP_SEASON_UUID}&categoryUuid=${MOTOGP_CATEGORY_UUID}`
    );
    const motogpStandings = await motogpStandingsRes.json();
    const motogpPhotoMap = {};

    for (const item of motogpStandings.classification) {
      const riderName = item.rider.full_name;
      const riderUuid = item.rider.riders_api_uuid;
      try {
        const riderRes = await fetch(`https://api.pulselive.motogp.com/motogp/v1/riders/${riderUuid}`);
        if (riderRes.ok) {
          const rData = await riderRes.json();
          const c2026 = rData.career?.find((c) => c.season === 2026) || rData.career?.[0];
          const pngCutout = c2026?.pictures?.profile?.main || null;
          const portrait = rData.biography?.media?.picture || rData.current_career?.media?.picture || null;
          motogpPhotoMap[riderName.toLowerCase()] = {
            cutout: pngCutout || portrait,
            avatar: portrait || pngCutout
          };
          console.log(`  ✓ MotoGP: ${riderName} -> profile set`);
        }
        await sleep(60);
      } catch (e) {
        console.warn(`  ! Could not fetch photo for ${riderName}:`, e.message);
      }
    }

    existing.motogp_2026.driverStandings = existing.motogp_2026.driverStandings.map((d) => {
      const key = d.name.toLowerCase();
      const p = motogpPhotoMap[key];
      if (p) {
        if (p.cutout) d.cutoutUrl = p.cutout;
        if (p.avatar) d.avatarUrl = p.avatar;
      }
      return d;
    });
  } catch (err) {
    console.warn('MotoGP fetch warning:', err.message);
  }

  existing.scrapedAt = new Date().toISOString();
  fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log('✅ Successfully updated official assets for both F1 and MotoGP!');
}

main();

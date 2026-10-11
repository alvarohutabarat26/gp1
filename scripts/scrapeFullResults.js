import fs from 'fs';
import path from 'path';

const MOTOGP_SEASON_UUID = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const MOTOGP_CATEGORY_UUID = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

const F1_NATIONALITY_TO_ISO = {
  italian: 'it',
  british: 'gb',
  monegasque: 'mc',
  dutch: 'nl',
  australian: 'au',
  french: 'fr',
  argentine: 'ar',
  brazilian: 'br',
  german: 'de',
  spanish: 'es',
  thai: 'th',
  japanese: 'jp',
  canadian: 'ca',
  finnish: 'fi',
  mexican: 'mx',
  american: 'us',
  danish: 'dk'
};

const F1_TEAM_COLORS = {
  mercedes: '#00A19B',
  ferrari: '#E80020',
  mclaren: '#FF8000',
  red_bull: '#1E41FF',
  rb: '#1634CB',
  alpine: '#0090FF',
  haas: '#B6BABD',
  audi: '#F50538',
  williams: '#005AFF',
  aston_martin: '#00665E',
  cadillac: '#D4AF37'
};

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, retries = 4, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        console.log(`    Rate limited on ${url}, waiting ${delay * (i + 1)}ms...`);
        await sleep(delay * (i + 1));
        continue;
      }
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(delay * (i + 1));
    }
  }
  return null;
}

async function scrapeF1Results() {
  console.log('🏎️ Scraping official F1 2026 results from Jolpica API...');
  const f1ResultsMap = {}; // round -> { main: [], sprint: [] }
  const F1_SPRINT_ROUNDS = [2, 4, 8, 10]; // Confirmed sprint rounds

  for (let round = 1; round <= 16; round++) {
    try {
      const json = await fetchWithRetry(`https://api.jolpi.ca/ergast/f1/2026/${round}/results.json`);
      if (json) {
        const race = json.MRData?.RaceTable?.Races?.[0];
        if (race && race.Results) {
          f1ResultsMap[round] = {
            main: race.Results.map((r) => {
              const nat = (r.Driver?.nationality || '').toLowerCase();
              const iso = F1_NATIONALITY_TO_ISO[nat] || 'gb';
              const teamId = r.Constructor?.constructorId || 'mercedes';
              const teamColor = F1_TEAM_COLORS[teamId] || '#E80020';

              let timeOrGap = r.Time?.time || r.status || '-';
              if (r.position !== '1' && r.Time?.time && !r.Time.time.startsWith('+')) {
                timeOrGap = `+${r.Time.time}`;
              }

              return {
                position: parseInt(r.position, 10),
                driverName: `${r.Driver.givenName} ${r.Driver.familyName}`,
                driverNumber: parseInt(r.number || r.Driver.permanentNumber, 10),
                countryCode: iso,
                nationality: r.Driver.nationality,
                team: r.Constructor.name,
                teamColor,
                timeOrGap,
                points: parseFloat(r.points),
                status: r.status,
                fastestLap: r.FastestLap?.rank === '1'
              };
            }),
            sprint: []
          };
          console.log(`  ✓ F1 Round ${round} (${race.raceName}): ${race.Results.length} drivers`);
        }
      }
      await sleep(250);

      // Check sprint if this round is a sprint weekend
      if (F1_SPRINT_ROUNDS.includes(round)) {
        const sprintJson = await fetchWithRetry(`https://api.jolpi.ca/ergast/f1/2026/${round}/sprint.json`);
        if (sprintJson) {
          const sprintRace = sprintJson.MRData?.RaceTable?.Races?.[0];
          if (sprintRace && sprintRace.SprintResults && sprintRace.SprintResults.length > 0) {
            f1ResultsMap[round].sprint = sprintRace.SprintResults.map((r) => {
              const nat = (r.Driver?.nationality || '').toLowerCase();
              const iso = F1_NATIONALITY_TO_ISO[nat] || 'gb';
              const teamId = r.Constructor?.constructorId || 'mercedes';
              const teamColor = F1_TEAM_COLORS[teamId] || '#E80020';
              let timeOrGap = r.Time?.time || r.status || '-';
              if (r.position !== '1' && r.Time?.time && !r.Time.time.startsWith('+')) {
                timeOrGap = `+${r.Time.time}`;
              }

              return {
                position: parseInt(r.position, 10),
                driverName: `${r.Driver.givenName} ${r.Driver.familyName}`,
                driverNumber: parseInt(r.number || r.Driver.permanentNumber, 10),
                countryCode: iso,
                nationality: r.Driver.nationality,
                team: r.Constructor.name,
                teamColor,
                timeOrGap,
                points: parseFloat(r.points),
                status: r.status
              };
            });
            console.log(`    ⚡ Sprint Round ${round}: ${sprintRace.SprintResults.length} drivers`);
          }
        }
        await sleep(250);
      }
    } catch (err) {
      console.warn(`Error scraping F1 round ${round}:`, err);
    }
  }

  return f1ResultsMap;
}

async function scrapeMotoGPResults() {
  console.log('🏍️ Scraping official MotoGP 2026 results from Pulselive API...');
  const motogpResultsMap = {}; // round or short_name -> { main: [], sprint: [] }

  try {
    const eventsRes = await fetch(
      `https://api.pulselive.motogp.com/motogp/v1/results/events?seasonUuid=${MOTOGP_SEASON_UUID}`
    );
    const events = await eventsRes.json();

    const championshipEvents = [
      { round: 1, short_name: 'THA' },
      { round: 2, short_name: 'BRA' },
      { round: 3, short_name: 'USA' },
      { round: 4, short_name: 'SPA' },
      { round: 5, short_name: 'FRA' },
      { round: 6, short_name: 'CAT' },
      { round: 7, short_name: 'ITA' },
      { round: 8, short_name: 'HUN' },
      { round: 9, short_name: 'CZE' },
      { round: 10, short_name: 'NED' },
      { round: 11, short_name: 'GER' },
      { round: 12, short_name: 'GBR' },
      { round: 13, short_name: 'ARA' },
      { round: 14, short_name: 'RSM' },
      { round: 15, short_name: 'AUT' },
      { round: 16, short_name: 'JPN' },
      { round: 17, short_name: 'INA' }
    ];

    for (const item of championshipEvents) {
      const eventObj = events.find((e) => e.short_name === item.short_name);
      if (!eventObj) continue;

      const sessionsRes = await fetch(
        `https://api.pulselive.motogp.com/motogp/v1/results/sessions?eventUuid=${eventObj.id}&categoryUuid=${MOTOGP_CATEGORY_UUID}`
      );
      const sessions = await sessionsRes.json();
      await sleep(100);

      const racSession = sessions.find((s) => s.type === 'RAC' && s.status === 'FINISHED');
      const sprSession = sessions.find((s) => s.type === 'SPR' && s.status === 'FINISHED');

      motogpResultsMap[item.round] = { main: [], sprint: [] };

      if (racSession) {
        const racRes = await fetch(
          `https://api.pulselive.motogp.com/motogp/v1/results/session/${racSession.id}/classification`
        );
        const racData = await racRes.json();
        const list = racData.classification || [];
        motogpResultsMap[item.round].main = list.map((c) => {
          const iso = (c.rider.country?.iso || 'es').toLowerCase();
          const teamName = c.team?.name || 'MotoGP Team';
          let timeOrGap = c.time || '-';
          if (c.position !== 1 && c.gap?.first) {
            timeOrGap = `+${c.gap.first}s`;
          } else if (c.status && c.status !== 'INSTND' && c.position > 15) {
            timeOrGap = c.status;
          }

          return {
            position: c.position,
            driverName: c.rider.full_name,
            driverNumber: c.rider.number,
            countryCode: iso,
            nationality: c.rider.country?.name || 'Spain',
            team: teamName,
            timeOrGap,
            points: c.points,
            status: c.status
          };
        });
        console.log(`  ✓ MotoGP Round ${item.round} (${item.short_name}) Grand Prix: ${list.length} riders`);
        await sleep(100);
      }

      if (sprSession) {
        const sprRes = await fetch(
          `https://api.pulselive.motogp.com/motogp/v1/results/session/${sprSession.id}/classification`
        );
        const sprData = await sprRes.json();
        const list = sprData.classification || [];
        motogpResultsMap[item.round].sprint = list.map((c) => {
          const iso = (c.rider.country?.iso || 'es').toLowerCase();
          const teamName = c.team?.name || 'MotoGP Team';
          let timeOrGap = c.time || '-';
          if (c.position !== 1 && c.gap?.first) {
            timeOrGap = `+${c.gap.first}s`;
          } else if (c.status && c.status !== 'INSTND' && c.position > 15) {
            timeOrGap = c.status;
          }

          return {
            position: c.position,
            driverName: c.rider.full_name,
            driverNumber: c.rider.number,
            countryCode: iso,
            nationality: c.rider.country?.name || 'Spain',
            team: teamName,
            timeOrGap,
            points: c.points,
            status: c.status
          };
        });
        console.log(`    ⚡ Sprint Round ${item.round} (${item.short_name}): ${list.length} riders`);
        await sleep(100);
      }
    }
  } catch (err) {
    console.error('Error scraping MotoGP results:', err);
  }

  return motogpResultsMap;
}

async function main() {
  const f1Map = await scrapeF1Results();
  const motogpMap = await scrapeMotoGPResults();

  const dataPath = path.resolve('src/data/scrapedData.json');
  const existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Attach to F1 races
  existing.f1_2026.races = existing.f1_2026.races.map((r) => {
    const res = f1Map[r.round];
    if (res) {
      if (res.main && res.main.length > 0) {
        r.fullResults = res.main;
      }
      if (res.sprint && res.sprint.length > 0) {
        r.sprintFullResults = res.sprint;
      }
    }
    return r;
  });

  // Attach to MotoGP races
  existing.motogp_2026.races = existing.motogp_2026.races.map((r) => {
    const res = motogpMap[r.round];
    if (res) {
      if (res.main && res.main.length > 0) {
        r.fullResults = res.main;
      }
      if (res.sprint && res.sprint.length > 0) {
        r.sprintFullResults = res.sprint;
      }
    }
    return r;
  });

  existing.scrapedAt = new Date().toISOString();
  fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log('✅ Successfully updated scrapedData.json with official full race results for F1 and MotoGP!');
}

main();

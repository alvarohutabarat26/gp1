import fs from 'fs';

async function checkF1() {
  const urls = [
    'https://api.jolpi.ca/ergast/f1/2026/driverStandings.json',
    'https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json',
    'https://api.jolpi.ca/ergast/f1/current/driverStandings.json',
    'https://api.jolpi.ca/ergast/f1/2026.json',
    'https://api.jolpi.ca/ergast/f1/2026/results.json?limit=100'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(url, '-> Status:', res.status);
      if (res.ok) {
        const d = await res.json();
        console.log('Sample:', JSON.stringify(d).slice(0, 300));
        fs.writeFileSync(`scripts/f1_${url.split('?')[0].split('/').pop()}`, JSON.stringify(d, null, 2));
      }
    } catch (e) {
      console.log('Err:', e.message);
    }
  }
}

checkF1();

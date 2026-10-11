import fs from 'fs';

async function testEndpoints() {
  const endpoints = [
    'https://api.pulselive.motogp.com/motogp/v1/results/standings?season=2026',
    'https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonYear=2026',
    'https://api.pulselive.motogp.com/motogp/v1/results/standings?year=2026&category=motogp',
    'https://api.pulselive.motogp.com/motogp/v1/results/seasons',
    'https://api.pulselive.motogp.com/motogp/v2/standings?seasonYear=2026'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        headers: {
          'Origin': 'https://www.motogp.com',
          'Referer': 'https://www.motogp.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      console.log(ep, '-> Status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Data keys:', Object.keys(data));
        fs.writeFileSync('scripts/pulselive_sample.json', JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log(ep, 'Error:', e.message);
    }
  }
}

testEndpoints();

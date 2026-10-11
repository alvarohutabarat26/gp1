import fs from 'fs';

const seasonUuid = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const categoryUuid = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

async function testStandings() {
  const urls = [
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?season=${seasonUuid}&category=${categoryUuid}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/riders?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/teams?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/constructors?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'Origin': 'https://www.motogp.com',
          'Referer': 'https://www.motogp.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      console.log(url, '-> Status:', res.status);
      if (res.ok) {
        const d = await res.json();
        console.log('Success! Items count:', Array.isArray(d) ? d.length : Object.keys(d));
        fs.writeFileSync('scripts/motogp_official_standings.json', JSON.stringify(d, null, 2));
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

testStandings();

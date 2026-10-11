import fs from 'fs';

const seasonUuid = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const categoryUuid = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

async function checkTeamsAndConstructors() {
  const tests = [
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/team?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/constructor?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&type=team`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&type=constructor`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&standingType=team`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&standingType=constructor`
  ];

  for (const url of tests) {
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
        console.log('Keys/count:', Object.keys(d));
        fs.writeFileSync(`scripts/pulselive_${url.split('?')[0].split('/').pop() || 'test'}.json`, JSON.stringify(d, null, 2));
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

checkTeamsAndConstructors();

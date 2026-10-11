import fs from 'fs';

const seasonId = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';

async function test() {
  const urls = [
    `https://api.pulselive.motogp.com/motogp/v1/results/categories?seasonUuid=${seasonId}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/events?seasonUuid=${seasonId}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonId}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/season/${seasonId}`,
    `https://api.pulselive.motogp.com/motogp/v2/standings?seasonUuid=${seasonId}`
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
        console.log('Result sample:', JSON.stringify(d).slice(0, 300));
        fs.writeFileSync('scripts/pulselive_response.json', JSON.stringify(d, null, 2));
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

test();

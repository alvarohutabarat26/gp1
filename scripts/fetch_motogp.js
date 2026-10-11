import fs from 'fs';

async function run() {
  try {
    const res = await fetch('https://www.motogp.com/en/world-standing/2026/motogp/championship-standings', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('HTML length:', text.length);

    // Look for __NEXT_DATA__
    const nextDataMatch = text.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      console.log('Found __NEXT_DATA__!');
      const json = JSON.parse(nextDataMatch[1]);
      fs.writeFileSync('scripts/motogp_next_data.json', JSON.stringify(json, null, 2));
      console.log('Saved motogp_next_data.json');
    } else {
      // Look for api calls or json endpoints in HTML
      const matches = text.match(/https:\/\/[^"'\s]+\/(?:api|standings|results)[^"'\s]*/g);
      console.log('Matched endpoints:', matches?.slice(0, 10));
      fs.writeFileSync('scripts/motogp_page.html', text);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();

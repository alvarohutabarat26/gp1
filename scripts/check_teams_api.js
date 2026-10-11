import fs from 'fs';

const seasonUuid = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const categoryUuid = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

async function checkTeamStandings() {
  const tests = [
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/teams?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&standing_type=team`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&standing_type=constructor`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/season/${seasonUuid}/category/${categoryUuid}/teams`,
    `https://api.pulselive.motogp.com/motogp/v1/results/standings/season/${seasonUuid}/category/${categoryUuid}/constructors`
  ];

  for (const url of tests) {
    try {
      const res = await fetch(url);
      console.log(url, '->', res.status);
      if (res.ok) {
        const d = await res.json();
        console.log('Sample:', JSON.stringify(d).slice(0, 200));
      }
    } catch (e) {
      console.log('Err:', e.message);
    }
  }
}

checkTeamStandings();

import fs from 'fs';

const seasonUuid = 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e';
const categoryUuid = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';

async function printAll() {
  const teamRes = await fetch(`https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&type=team`);
  const teamData = await teamRes.json();
  console.log('=== OFFICIAL MOTOGP 2026 TEAMS STANDINGS ===');
  teamData.classification.forEach(t => {
    console.log(`${t.position}. ${t.team?.name || t.name}: ${t.points} pts`);
  });

  const constrRes = await fetch(`https://api.pulselive.motogp.com/motogp/v1/results/standings?seasonUuid=${seasonUuid}&categoryUuid=${categoryUuid}&type=constructor`);
  const constrData = await constrRes.json();
  console.log('\n=== OFFICIAL MOTOGP 2026 CONSTRUCTORS STANDINGS ===');
  constrData.classification.forEach(c => {
    console.log(`${c.position}. ${c.constructor?.name || c.name}: ${c.points} pts`);
  });
}

printAll();

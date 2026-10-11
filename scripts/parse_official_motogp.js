import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/motogp_official_standings.json', 'utf8'));

console.log('Sample item structure:');
console.log(JSON.stringify(data.classification[0], null, 2));

console.log('\n--- FULL OFFICIAL MOTOGP 2026 STANDINGS ---');
data.classification.forEach(r => {
  console.log(`${r.position}. #${r.rider?.number} ${r.rider?.full_name} (${r.rider?.country?.iso}) - ${r.team?.name} (${r.constructor?.name}): ${r.points} pts | Podiums: ${r.podiums}`);
});

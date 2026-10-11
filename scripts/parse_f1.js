import fs from 'fs';

const f1 = JSON.parse(fs.readFileSync('scripts/f1_driverStandings.json', 'utf8'));
const list = f1.MRData.StandingsTable.StandingsLists[0].DriverStandings;
console.log('=== REALTIME OFFICIAL F1 2026 DRIVER STANDINGS ===');
list.forEach(d => {
  console.log(`${d.position}. ${d.Driver.givenName} ${d.Driver.familyName} (${d.Constructors[0].name}) - ${d.points} pts | Wins: ${d.wins}`);
});

const f1c = JSON.parse(fs.readFileSync('scripts/f1_constructorStandings.json', 'utf8'));
const clist = f1c.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
console.log('\n=== REALTIME OFFICIAL F1 2026 CONSTRUCTOR STANDINGS ===');
clist.forEach(c => {
  console.log(`${c.position}. ${c.Constructor.name} - ${c.points} pts | Wins: ${c.wins}`);
});

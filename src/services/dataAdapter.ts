import scrapedDataRaw from '../data/scrapedData.json';
import { Driver, Team, Race, NewsArticle } from '../types/motorsport';

export interface ScrapedDataset2026 {
  scrapedAt: string;
  season: string;
  f1_2026: any;
  motogp_2026: any;
  news: any[];
}

const rawData = scrapedDataRaw as ScrapedDataset2026;

const F1_TEAM_COLORS: Record<string, string> = {
  mercedes: '#00A19B',
  ferrari: '#E80020',
  mclaren: '#FF8000',
  red_bull: '#1E41FF',
  rb: '#1634CB',
  alpine: '#0090FF',
  haas: '#B6BABD',
  audi: '#F50538',
  williams: '#005AFF',
  aston_martin: '#00665E',
  cadillac: '#D4AF37'
};

const F1_NATIONALITY_TO_ISO: Record<string, string> = {
  italian: 'it',
  british: 'gb',
  monegasque: 'mc',
  dutch: 'nl',
  australian: 'au',
  french: 'fr',
  argentine: 'ar',
  brazilian: 'br',
  german: 'de',
  spanish: 'es',
  thai: 'th',
  japanese: 'jp',
  canadian: 'ca',
  finnish: 'fi',
  mexican: 'mx',
  american: 'us',
  danish: 'dk'
};

export function get2026F1Drivers(): Driver[] {
  const f1Source = rawData.f1_2026?.driverStandings || [];
  const leaderPts = parseFloat(f1Source[0]?.points || '325');

  const F1_PODIUMS_2026: Record<string, number> = {
    antonelli: 14,
    russell: 9,
    hamilton: 11,
    leclerc: 8,
    max_verstappen: 9,
    norris: 8,
    piastri: 4,
    hadjar: 2,
    lawson: 0,
    gasly: 0,
    arvid_lindblad: 0,
    colapinto: 0,
    bearman: 0,
    bortoleto: 0,
    hulkenberg: 0,
    ocon: 0,
    alonso: 0,
    sainz: 0,
    albon: 0,
    tsunoda: 0,
    stroll: 0,
    bottas: 0,
    perez: 0
  };

  return f1Source.map((ds: any) => {
    const driver = ds.Driver;
    const constructor = ds.Constructors?.[0] || { constructorId: 'mercedes', name: 'Formula 1 Team' };
    const nationality = driver.nationality?.toLowerCase() || 'it';
    const countryCode = F1_NATIONALITY_TO_ISO[nationality] || 'it';
    const teamColor = F1_TEAM_COLORS[constructor.constructorId] || '#E80020';
    const pts = parseFloat(ds.points);
    const gap = ds.position === '1' ? '-' : `-${(leaderPts - pts).toFixed(0)}`;
    const podiumCount = F1_PODIUMS_2026[driver.driverId] ?? Math.max(0, parseInt(ds.wins, 10));

    const driverNumber = parseInt(driver.permanentNumber || ds.position, 10);
    const shortCode = driver.code || driver.familyName.slice(0, 3).toUpperCase();
    const shortNickname = `${shortCode}${driverNumber}`;

    return {
      id: driver.driverId,
      series: 'f1',
      number: driverNumber,
      name: `${driver.givenName} ${driver.familyName}`,
      shortName: shortCode,
      nationality: driver.nationality,
      countryCode,
      flag: countryCode.toUpperCase(),
      team: constructor.name,
      teamColor,
      points: pts,
      position: parseInt(ds.position, 10),
      gap,
      podiums: podiumCount,
      wins: parseInt(ds.wins, 10),
      worldChampionships: driver.driverId === 'hamilton' ? 7 : driver.driverId === 'max_verstappen' ? 4 : driver.driverId === 'alonso' ? 2 : 0,
      bikeOrCar: `${constructor.name} 2026 Chassis`,
      avatarUrl: driver.avatarUrl,
      cutoutUrl: driver.cutoutUrl || driver.avatarUrl,
      numberGraphicUrl: driver.numberGraphicUrl,
      shortNickname,
      bio: `Pembalap resmi Formula 1 musim 2026 untuk tim ${constructor.name}. Saat ini bertengger di peringkat P${ds.position} dengan perolehan ${ds.points} poin.`
    };
  });
}

export function get2026F1Teams(): Team[] {
  const f1Source = rawData.f1_2026?.constructorStandings || [];
  const allDrivers = get2026F1Drivers();

  return f1Source.map((cs: any) => {
    const constr = cs.Constructor;
    const color = F1_TEAM_COLORS[constr.constructorId] || '#E80020';
    const teamDrivers = allDrivers
      .filter((d) => d.team.toLowerCase().includes(constr.name.toLowerCase()) || constr.name.toLowerCase().includes(d.team.toLowerCase()))
      .map((d) => d.name);

    return {
      id: constr.constructorId,
      series: 'f1',
      name: constr.name,
      fullName: `${constr.name} Formula One Team`,
      base: constr.nationality,
      country: constr.nationality,
      countryCode: constr.nationality.toLowerCase().slice(0, 2),
      flag: constr.nationality.slice(0, 2).toUpperCase(),
      teamPrincipal: 'FIA Official Team Principal',
      powerUnitOrBike: `${constr.name} 2026 Power Unit`,
      color,
      secondaryColor: '#000000',
      points: parseFloat(cs.points),
      position: parseInt(cs.position, 10),
      drivers: teamDrivers
    };
  });
}

export function get2026MotoGPDrivers(): Driver[] {
  const source = rawData.motogp_2026?.driverStandings || [];
  const leaderPts = source[0]?.points || 343;

  return source.map((r: any) => {
    const gapVal = r.gap || (r.position === 1 ? '-' : `-${(leaderPts - r.points).toFixed(0)}`);
    const parts = r.name.split(' ');
    const initials = parts.map((p: string) => p[0]).join('').toUpperCase();
    const shortNickname = r.shortNickname || `${initials}${r.number}`;

    return {
      id: 'motogp-' + r.name.toLowerCase().replace(/\s+/g, '-'),
      series: 'motogp',
      number: r.number,
      name: r.name,
      shortName: r.name.split(' ').pop()?.slice(0, 3).toUpperCase() || 'MGP',
      nationality: r.country.toUpperCase(),
      countryCode: r.country,
      flag: r.country.toUpperCase(),
      team: r.team,
      teamColor: r.team.includes('Ducati Lenovo') ? '#CC0000' :
                 r.team.includes('Aprilia') ? '#111111' :
                 r.team.includes('Trackhouse') ? '#1B365D' :
                 r.team.includes('Red Bull KTM Factory') ? '#FF6600' :
                 r.team.includes('VR46') ? '#FFEB00' :
                 r.team.includes('Gresini') ? '#87CEEB' :
                 r.team.includes('Tech3') ? '#EE1C25' :
                 r.team.includes('Yamaha') ? '#002B7F' :
                 r.team.includes('Repsol Honda') ? '#FF5500' : '#008542',
      points: r.points,
      position: r.position,
      gap: gapVal,
      podiums: typeof r.podiums === 'number' ? r.podiums : 0,
      wins: typeof r.wins === 'number' ? r.wins : 0,
      last3Positions: r.last3Positions,
      sprintWins: r.sprintWins,
      worldChampionships: r.worldChampionships || 0,
      bikeOrCar: r.bike,
      avatarUrl: r.avatarUrl,
      cutoutUrl: r.cutoutUrl || r.avatarUrl,
      shortNickname,
      bio: `Pembalap resmi kelas premier FIM MotoGP World Championship musim 2026 membela tim ${r.team} dengan motor ${r.bike}. Bertengger di posisi P${r.position} dengan ${r.points} poin.`
    };
  });
}

export function get2026MotoGPTeams(): Team[] {
  const source = rawData.motogp_2026?.teamStandings || [];

  return source.map((t: any) => ({
    id: 'team-' + t.name.toLowerCase().replace(/\s+/g, '-'),
    series: 'motogp',
    name: t.name,
    fullName: `${t.name} Racing Team 2026`,
    base: 'Eropa / FIM MotoGP',
    country: 'Internasional',
    countryCode: 'it',
    flag: 'IT',
    teamPrincipal: 'Team Principal',
    powerUnitOrBike: 'MotoGP Prototype 1000cc',
    color: t.color || '#FF6600',
    secondaryColor: '#FFFFFF',
    points: t.points,
    position: t.position,
    drivers: t.drivers || []
  }));
}

export function get2026Races(): Race[] {
  const f1RacesRaw = rawData.f1_2026?.races || [];
  const motogpRacesRaw = rawData.motogp_2026?.races || [];

  // F1 converted
  const f1Races: Race[] = f1RacesRaw.map((r: any) => {
    const isCompleted = r.status === 'completed';
    const isLive = r.status === 'live';
    const raceDay = r.raceDate ? r.raceDate.split('T')[0] : r.startDate || r.date;

    const defaultF1Sessions = r.isSprintWeekend
      ? [
          { name: 'Practice 1 (FP1)', code: 'FP1', date: r.startDate || raceDay, targetTimeISO: `${r.startDate || raceDay}T08:30:00Z`, utcTime: '08:30 UTC', wibTime: '15:30 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
          { name: 'Sprint Qualifying', code: 'S_QUAL', date: r.startDate || raceDay, targetTimeISO: `${r.startDate || raceDay}T12:30:00Z`, utcTime: '12:30 UTC', wibTime: '19:30 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
          { name: 'Tissot Sprint Race', code: 'SPRINT', date: raceDay, targetTimeISO: `${raceDay}T09:00:00Z`, utcTime: '09:00 UTC', wibTime: '16:00 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
          { name: 'Grand Prix Qualifying', code: 'QUAL', date: raceDay, targetTimeISO: `${raceDay}T13:00:00Z`, utcTime: '13:00 UTC', wibTime: '20:00 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
          { name: 'Grand Prix Main Race', code: 'RACE', date: raceDay, targetTimeISO: r.raceDate || `${raceDay}T12:00:00Z`, utcTime: '12:00 UTC', wibTime: '19:00 WIB', status: isCompleted ? 'completed' : 'upcoming' }
        ]
      : [
          { name: 'Practice 1', code: 'FP1', date: r.startDate || raceDay, targetTimeISO: `${r.startDate || raceDay}T10:30:00Z`, utcTime: '10:30 UTC', wibTime: '17:30 WIB', status: isCompleted ? 'completed' : 'upcoming' },
          { name: 'Practice 2', code: 'FP2', date: r.startDate || raceDay, targetTimeISO: `${r.startDate || raceDay}T14:00:00Z`, utcTime: '14:00 UTC', wibTime: '21:00 WIB', status: isCompleted ? 'completed' : 'upcoming' },
          { name: 'Practice 3', code: 'FP3', date: raceDay, targetTimeISO: `${raceDay}T10:30:00Z`, utcTime: '10:30 UTC', wibTime: '17:30 WIB', status: isCompleted ? 'completed' : 'upcoming' },
          { name: 'Qualifying', code: 'QUAL', date: raceDay, targetTimeISO: `${raceDay}T14:00:00Z`, utcTime: '14:00 UTC', wibTime: '21:00 WIB', status: isCompleted ? 'completed' : 'upcoming' },
          { name: 'Grand Prix Main Race', code: 'RACE', date: raceDay, targetTimeISO: r.raceDate || `${raceDay}T12:00:00Z`, utcTime: '12:00 UTC', wibTime: '19:00 WIB', status: isCompleted ? 'completed' : 'upcoming' }
        ];

    return {
      id: `f1-${r.round}`,
      series: 'f1',
      round: typeof r.round === 'number' ? r.round : parseInt(r.round, 10),
      name: r.name || r.raceName,
      officialName: r.officialName || r.raceName,
      circuit: r.circuit || r.Circuit?.circuitName || 'Formula 1 Circuit',
      city: r.city || r.Circuit?.Location?.locality || '',
      country: r.country || r.Circuit?.Location?.country || '',
      countryCode: r.countryCode || (r.Circuit?.Location?.country || 'gb').toLowerCase().slice(0, 2),
      flag: (r.countryCode || 'gb').toUpperCase(),
      circuitLengthKm: r.circuitLengthKm || 5.0,
      laps: r.laps || 60,
      startDate: r.startDate || r.date,
      raceDate: r.raceDate || `${r.date}T12:00:00Z`,
      isSprintWeekend: r.isSprintWeekend || false,
      status: r.status || (new Date(r.date).getTime() >= new Date('2026-10-10').getTime() ? 'upcoming' : 'completed'),
      sessions: r.sessions || defaultF1Sessions,
      sprintResult: r.sprintResult,
      result: r.result,
      fullResults: r.fullResults,
      sprintFullResults: r.sprintFullResults
    };
  });

  // MotoGP converted
  const motogpRaces: Race[] = motogpRacesRaw.map((r: any) => {
    const isCompleted = r.status === 'completed';
    const isLive = r.status === 'live';
    const raceDay = r.raceDate ? r.raceDate.split('T')[0] : r.startDate || r.date;

    const defaultMotoGPSessions = [
      { name: 'Free Practice 1 (FP1)', code: 'FP1', date: r.startDate || raceDay, targetTimeISO: `${r.startDate || raceDay}T02:45:00Z`, utcTime: '02:45 UTC', wibTime: '09:45 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
      { name: 'Practice (Pre-Qualifying)', code: 'PRAC', date: r.startDate || raceDay, targetTimeISO: `${r.startDate || raceDay}T07:00:00Z`, utcTime: '07:00 UTC', wibTime: '14:00 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
      { name: 'Qualifying 1 & 2', code: 'QUAL', date: raceDay, targetTimeISO: `${raceDay}T02:50:00Z`, utcTime: '02:50 UTC', wibTime: '09:50 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
      { name: 'Tissot Sprint Race', code: 'SPRINT', date: raceDay, targetTimeISO: `${raceDay}T07:00:00Z`, utcTime: '07:00 UTC', wibTime: '14:00 WIB', status: isCompleted || isLive ? 'completed' : 'upcoming' },
      { name: 'Grand Prix Main Race', code: 'RACE', date: raceDay, targetTimeISO: r.raceDate || `${raceDay}T07:00:00Z`, utcTime: '07:00 UTC', wibTime: '14:00 WIB', status: isCompleted ? 'completed' : 'upcoming' }
    ];

    return {
      id: `motogp-${r.round}`,
      series: 'motogp',
      round: r.round,
      name: r.name,
      officialName: r.officialName || r.name,
      circuit: r.circuit,
      city: r.city,
      country: r.country,
      countryCode: r.countryCode || 'es',
      flag: (r.countryCode || 'es').toUpperCase(),
      circuitLengthKm: r.circuitLengthKm || 4.31,
      laps: r.laps || 27,
      startDate: r.startDate || r.date,
      raceDate: r.raceDate || `${r.date}T07:00:00Z`,
      isSprintWeekend: true, // MotoGP ALWAYS has Sprint races!
      status: r.status || 'upcoming',
      sessions: r.sessions || defaultMotoGPSessions,
      sprintResult: r.sprintResult,
      result: r.result,
      fullResults: r.fullResults,
      sprintFullResults: r.sprintFullResults
    };
  });

  return [...f1Races, ...motogpRaces];
}

export function get2026News(): NewsArticle[] {
  const newsRaw = rawData.news || [];
  return newsRaw.map((n: any, idx: number) => ({
    id: n.id || `news-${idx}`,
    series: n.series || 'both',
    title: n.title,
    excerpt: n.excerpt || n.title,
    content: `${n.excerpt}\n\nBerita ini disinkronisasi langsung dari feed resmi ${n.source}. Klik tautan resmi untuk membaca liputan mendalam.`,
    category: n.category || 'Paddock News',
    author: n.source || 'Motorsport Correspondent',
    date: n.date || 'Oktober 2026',
    readTime: '3 mnt baca',
    source: n.source || 'Official Feed',
    link: n.link
  }));
}

export const SCRAPED_TIMESTAMP_2026 = rawData.scrapedAt;

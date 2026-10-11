export type SeriesType = 'f1' | 'motogp';

export interface SessionSchedule {
  name: string;
  code?: string;
  date: string;
  targetTimeISO?: string;
  utcTime: string;
  wibTime: string;
  status?: 'completed' | 'live' | 'upcoming';
  winnerOrPole?: string;
}

export interface Race {
  id: string;
  series: SeriesType;
  round: number;
  name: string;
  officialName: string;
  circuit: string;
  city: string;
  country: string;
  countryCode?: string;
  flag: string;
  circuitLengthKm: number;
  laps: number;
  startDate: string;
  raceDate: string; // ISO of Main Race
  isSprintWeekend: boolean;
  status: 'upcoming' | 'live' | 'completed';
  sessions: SessionSchedule[];
  sprintResult?: {
    winner: string;
    winnerTeam?: string;
    p2: string;
    p3: string;
    gap?: string;
  };
  result?: {
    winner: string;
    winnerTeam: string;
    p2: string;
    p3: string;
    fastestLap?: string;
    gap?: string;
  };
  fullResults?: RaceResultEntry[];
  sprintFullResults?: RaceResultEntry[];
}

export interface RaceResultEntry {
  position: number;
  driverName: string;
  driverNumber?: number;
  countryCode?: string;
  nationality?: string;
  team: string;
  teamColor?: string;
  timeOrGap: string;
  points: number;
  status?: string;
  fastestLap?: boolean;
}

export interface Driver {
  id: string;
  series: SeriesType;
  number: number;
  name: string;
  shortName: string;
  nationality: string;
  countryCode?: string;
  flag: string;
  team: string;
  teamColor: string;
  points: number;
  position: number;
  podiums: number;
  wins: number;
  worldChampionships: number;
  bikeOrCar: string;
  bio: string;
  avatarUrl?: string;
  cutoutUrl?: string;
  numberGraphicUrl?: string;
  shortNickname?: string;
  gap?: string;
  last3Positions?: string;
  sprintWins?: number;
  sprintPodiums?: number;
}

export interface Team {
  id: string;
  series: SeriesType;
  name: string;
  fullName: string;
  base: string;
  country: string;
  countryCode?: string;
  flag: string;
  teamPrincipal: string;
  powerUnitOrBike: string;
  color: string;
  secondaryColor: string;
  points: number;
  position: number;
  drivers: string[];
}

export interface NewsArticle {
  id: string;
  series: SeriesType | 'both';
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  source: string;
  link?: string;
}

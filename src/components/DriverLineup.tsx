import React, { useState } from 'react';
import { Users, Star, Car, Bike, ChevronRight } from 'lucide-react';
import { Driver, Team, SeriesType } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';

interface DriverLineupProps {
  drivers: Driver[];
  teams: Team[];
  selectedSeries: SeriesType | 'all';
  onSelectSeries?: (series: SeriesType | 'all') => void;
  searchQuery: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectDriver: (driver: Driver) => void;
}

function splitDriverName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { firstName: '', lastName: fullName };
  }
  const lastName = parts.pop() || '';
  const firstName = parts.join(' ');
  return { firstName, lastName };
}

const RiderCard: React.FC<{
  driver: Driver;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectDriver: (driver: Driver) => void;
}> = ({ driver, isFavorite, onToggleFavorite, onSelectDriver }) => {
  const isF1 = driver.series === 'f1';
  const teamColor = driver.teamColor || (isF1 ? '#e10600' : '#ff5500');
  const { firstName, lastName } = splitDriverName(driver.name);
  const nickname = driver.shortNickname || `${driver.shortName}${driver.number}`;

  const [imgError, setImgError] = useState(false);
  const [useCutout, setUseCutout] = useState(true);

  const currentImg = useCutout && driver.cutoutUrl
    ? driver.cutoutUrl
    : driver.avatarUrl;

  const handleImgError = () => {
    if (useCutout && driver.avatarUrl && driver.avatarUrl !== driver.cutoutUrl) {
      setUseCutout(false);
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      onClick={() => onSelectDriver(driver)}
      className="group relative bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
      style={{
        boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Team Color Top Accent Strip */}
      <div
        className="absolute top-0 inset-x-0 h-1.5 group-hover:h-2 transition-all duration-300 z-30"
        style={{ backgroundColor: teamColor }}
      />

      {/* Ambient Radial Team Glow */}
      <div
        className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${teamColor} 0%, transparent 65%)`
        }}
      />

      {/* Watermark Nickname (e.g. MM93, JM89) */}
      <div
        className="absolute top-3 left-4 text-[11px] font-mono font-black tracking-widest uppercase select-none pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity z-10"
        style={{ color: teamColor }}
      >
        {nickname}
      </div>

      {/* Giant Ghost Number or Official Number Graphic */}
      {driver.numberGraphicUrl ? (
        <div className="absolute top-2 right-2 w-28 h-24 sm:w-32 sm:h-28 pointer-events-none select-none z-0 transition-all duration-300 group-hover:scale-105 opacity-20 group-hover:opacity-35 flex items-center justify-end">
          <img
            src={driver.numberGraphicUrl}
            alt={`#${driver.number}`}
            className="w-full h-full object-contain object-right filter brightness-125"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="absolute top-4 right-3 text-7xl sm:text-8xl font-black font-mono tracking-tighter select-none pointer-events-none transition-all duration-300 group-hover:scale-105 z-0"
          style={{
            color: teamColor,
            opacity: 0.12,
            lineHeight: 1
          }}
        >
          {driver.number}
        </div>
      )}

      {/* Top Floating Header: Number Badge, Series Badge & Favorite Star */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-5">
        <div className="flex items-center gap-2">
          <span
            className="text-2xl sm:text-3xl font-black font-mono tracking-tighter drop-shadow-sm"
            style={{ color: teamColor }}
          >
            #{driver.number}
          </span>
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              isF1
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
            }`}
          >
            {isF1 ? 'F1' : 'MotoGP'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(driver.id);
          }}
          className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-amber-400 transition-all border border-slate-800/60 shadow-sm"
          title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : ''
            }`}
          />
        </button>
      </div>

      {/* HERO IMAGE CONTAINER: Official Rider Face / Bust Cutout */}
      <div className="relative h-64 sm:h-72 w-full flex items-end justify-center overflow-hidden z-10 px-4">
        {!imgError && currentImg ? (
          <img
            src={currentImg}
            alt={driver.name}
            className={`h-full w-auto max-w-[92%] transition-transform duration-500 ease-out group-hover:scale-105 z-10 ${
              useCutout && driver.cutoutUrl
                ? 'object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] filter contrast-[1.03]'
                : 'object-cover object-top rounded-2xl shadow-lg border border-slate-800/50'
            }`}
            loading="lazy"
            onError={handleImgError}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 z-10">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center font-black font-mono text-3xl border-2 mb-2"
              style={{
                backgroundColor: `${teamColor}20`,
                borderColor: teamColor,
                color: teamColor
              }}
            >
              {driver.shortName || driver.number}
            </div>
            <span className="text-xs text-slate-400 font-mono">Official Profile</span>
          </div>
        )}

        {/* Bottom smooth fade mask so the image seamlessly integrates into the info area */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* RIDER INFO BLOCK: Inspired directly by motogp.com/en/riders/motogp */}
      <div className="relative z-20 bg-slate-950/95 p-4 sm:p-5 border-t border-slate-800/80 flex flex-col justify-between flex-1">
        <div>
          {/* Nationality & Country Flag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <CountryFlag
              country={driver.countryCode || driver.nationality}
              className="w-4 h-3 rounded-xs shrink-0"
            />
            <span className="truncate">{driver.nationality}</span>
          </div>

          {/* Rider Name: First name in subtle tracking uppercase, Surname in HUGE BOLD */}
          <div className="mt-0.5">
            {firstName && (
              <span className="block text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase leading-tight truncate">
                {firstName}
              </span>
            )}
            <span className="block text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors uppercase leading-none mt-0.5 truncate">
              {lastName}
            </span>
          </div>

          {/* Team Name with Team Color Bullet */}
          <div className="mt-2.5 flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: teamColor }}
            />
            <span
              className="text-xs font-bold truncate"
              style={{ color: teamColor }}
            >
              {driver.team}
            </span>
          </div>

          {/* Vehicle / Bike Specs */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800/60 font-mono">
            {isF1 ? (
              <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            ) : (
              <Bike className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span className="truncate">{driver.bikeOrCar}</span>
          </div>

          {/* Stats Bar (Poin, Posisi, Menang) */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 text-center">
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Poin</span>
              <span className="text-sm font-black font-mono text-amber-400">{driver.points}</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Posisi</span>
              <span className="text-sm font-black font-mono text-slate-200">P{driver.position}</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Menang</span>
              <span className="text-sm font-black font-mono text-slate-200">{driver.wins}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectDriver(driver);
          }}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all border border-slate-800 group-hover:border-slate-700"
        >
          <span>Profil Lengkap</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export const DriverLineup: React.FC<DriverLineupProps> = ({
  drivers,
  teams,
  selectedSeries,
  onSelectSeries,
  searchQuery,
  favorites,
  onToggleFavorite,
  onSelectDriver
}) => {
  const [activeView, setActiveView] = useState<'drivers' | 'teams'>('drivers');
  const [activeSeries, setActiveSeries] = useState<SeriesType | 'all'>(selectedSeries);

  React.useEffect(() => {
    setActiveSeries(selectedSeries);
  }, [selectedSeries]);

  const handleSeriesChange = (series: SeriesType | 'all') => {
    setActiveSeries(series);
    if (onSelectSeries) {
      onSelectSeries(series);
    }
  };

  const f1DriversCount = drivers.filter((d) => d.series === 'f1').length;
  const motogpDriversCount = drivers.filter((d) => d.series === 'motogp').length;

  // Filter drivers
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSeries = activeSeries === 'all' || driver.series === activeSeries;
    const matchesSearch =
      searchQuery === '' ||
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.number.toString().includes(searchQuery);
    return matchesSeries && matchesSearch;
  });

  // Filter teams
  const filteredTeams = teams.filter((team) => {
    const matchesSeries = activeSeries === 'all' || team.series === activeSeries;
    const matchesSearch =
      searchQuery === '' ||
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.powerUnitOrBike.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeries && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Grid Lineup Pembalap & Tim Resmi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar resmi pembalap dan motor/mobil balap dari database kejuaraan dunia FIA & FIM.
          </p>
        </div>

        {/* Dual Controls: Series Selector & View Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Series Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold shadow-inner">
            <button
              onClick={() => handleSeriesChange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSeries === 'all'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Semua</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-400">
                {drivers.length}
              </span>
            </button>
            <button
              onClick={() => handleSeriesChange('f1')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSeries === 'f1'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Formula 1</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/80 text-slate-300">
                {f1DriversCount}
              </span>
            </button>
            <button
              onClick={() => handleSeriesChange('motogp')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSeries === 'motogp'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-950/50'
                  : 'text-slate-400 hover:text-orange-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>MotoGP</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/80 text-slate-300">
                {motogpDriversCount}
              </span>
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold shadow-inner">
            <button
              onClick={() => setActiveView('drivers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'drivers'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pembalap ({filteredDrivers.length})
            </button>
            <button
              onClick={() => setActiveView('teams')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'teams'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tim ({filteredTeams.length})
            </button>
          </div>
        </div>
      </div>

      {/* DRIVERS VIEW */}
      {activeView === 'drivers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredDrivers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
              <p className="text-slate-400 text-sm">Tidak ditemukan pembalap yang cocok.</p>
            </div>
          ) : (
            filteredDrivers.map((driver) => (
              <RiderCard
                key={driver.id}
                driver={driver}
                isFavorite={favorites.includes(driver.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectDriver={onSelectDriver}
              />
            ))
          )}
        </div>
      )}

      {/* TEAMS VIEW */}
      {activeView === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => {
            const isF1 = team.series === 'f1';
            return (
              <div
                key={team.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: team.color }}
                />

                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isF1
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}
                  >
                    {isF1 ? 'F1 Constructor' : 'MotoGP Factory'}
                  </span>
                  <span className="text-sm font-black font-mono text-amber-400">
                    Posisi #{team.position}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mt-3">{team.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{team.fullName}</p>

                <div className="space-y-2 mt-4 text-xs">
                  <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 p-2 rounded-lg">
                    <span className="text-slate-500">Pabrikan:</span>
                    <span className="font-semibold text-slate-200">{team.powerUnitOrBike}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 p-2 rounded-lg">
                    <span className="text-slate-500">Total Poin:</span>
                    <span className="font-mono font-bold text-amber-400">{team.points} pts</span>
                  </div>
                </div>

                {team.drivers.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] uppercase font-bold text-slate-500 block mb-1.5">
                      Pembalap:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {team.drivers.map((driverName, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium border border-slate-700/60"
                        >
                          {driverName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

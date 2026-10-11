import React, { useState } from 'react';
import { Users, Star, Car, Bike, ChevronRight, Shield } from 'lucide-react';
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
  const teamColor = driver.teamColor || (isF1 ? '#e10600' : '#0070c0');
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
      className="paddock-panel-interactive rounded overflow-hidden cursor-pointer flex flex-col justify-between group relative border border-[#1f232f]"
    >
      {/* Team Color Top Accent Strip */}
      <div
        className="absolute top-0 inset-x-0 h-1.5 group-hover:h-2 transition-all z-30"
        style={{ backgroundColor: teamColor }}
      />

      {/* Watermark Nickname */}
      <div
        className="absolute top-3 left-3 text-[11px] font-mono font-black tracking-widest uppercase select-none pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity z-10"
        style={{ color: teamColor }}
      >
        {nickname}
      </div>

      {/* Giant Ghost Number Graphic */}
      {driver.numberGraphicUrl ? (
        <div className="absolute top-2 right-2 w-28 h-24 pointer-events-none select-none z-0 transition-all group-hover:scale-105 opacity-20 group-hover:opacity-35 flex items-center justify-end">
          <img
            src={driver.numberGraphicUrl}
            alt={`#${driver.number}`}
            className="w-full h-full object-contain object-right filter brightness-125"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="absolute top-3 right-3 text-7xl font-racing font-black tracking-tighter select-none pointer-events-none transition-all group-hover:scale-105 z-0"
          style={{
            color: teamColor,
            opacity: 0.15,
            lineHeight: 1
          }}
        >
          {driver.number}
        </div>
      )}

      {/* Top Floating Header: Driver Number & Favorite Star */}
      <div className="relative z-20 flex items-center justify-between p-3.5 pt-4">
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-racing font-black tracking-tight"
            style={{ color: teamColor }}
          >
            #{driver.number}
          </span>
          <span
            className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded ${
              isF1
                ? 'bg-red-950/60 text-red-300 border border-red-500/30'
                : 'bg-sky-950/60 text-sky-300 border border-sky-500/30'
            }`}
          >
            {isF1 ? 'F1' : 'MOTOGP'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(driver.id);
          }}
          className="p-1.5 rounded bg-[#0b0d12] hover:bg-[#181c26] text-slate-400 hover:text-amber-400 transition-all border border-[#1f2434]"
          title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : ''
            }`}
          />
        </button>
      </div>

      {/* HERO IMAGE CONTAINER: Official Rider Face / Bust Cutout */}
      <div className="relative h-60 w-full flex items-end justify-center overflow-hidden z-10 px-3">
        {!imgError && currentImg ? (
          <img
            src={currentImg}
            alt={driver.name}
            className={`h-full w-auto max-w-[92%] transition-transform duration-300 ease-out group-hover:scale-105 z-10 ${
              useCutout && driver.cutoutUrl
                ? 'object-contain object-bottom drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)] filter contrast-[1.03]'
                : 'object-cover object-top rounded shadow-md border border-[#1c202d]'
            }`}
            loading="lazy"
            onError={handleImgError}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 z-10">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-racing font-black text-2xl border-2 mb-2"
              style={{
                backgroundColor: `${teamColor}15`,
                borderColor: teamColor,
                color: teamColor
              }}
            >
              {driver.shortName || driver.number}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">OFFICIAL PROFILE</span>
          </div>
        )}

        {/* Bottom smooth fade mask so the image seamlessly integrates into the info area */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0a0c10] to-transparent pointer-events-none z-10" />
      </div>

      {/* RIDER INFO BLOCK: Clean, high-density racing typography */}
      <div className="relative z-20 bg-[#0a0c10] p-3.5 border-t border-[#1c202d] flex flex-col justify-between flex-1">
        <div>
          {/* Nationality & Country Flag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-tech font-semibold mb-1">
            <CountryFlag
              country={driver.countryCode || driver.nationality}
              className="w-3.5 h-2.5 rounded-xs shrink-0"
            />
            <span className="truncate">{driver.nationality}</span>
          </div>

          {/* Rider Name: First name in subtle tracking uppercase, Surname in HUGE BOLD */}
          <div className="mt-0.5">
            {firstName && (
              <span className="block text-xs font-tech font-semibold tracking-wider text-slate-400 uppercase leading-tight truncate">
                {firstName}
              </span>
            )}
            <span className="block text-2xl font-racing font-black tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase leading-none mt-0.5 truncate">
              {lastName}
            </span>
          </div>

          {/* Team Name with Livery Bullet */}
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: teamColor }}
            />
            <span
              className="text-xs font-racing font-bold uppercase truncate"
              style={{ color: teamColor }}
            >
              {driver.team}
            </span>
          </div>

          {/* Vehicle / Bike Specs */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#12151d] px-2 py-1 rounded border border-[#1f2432] font-mono">
            {isF1 ? (
              <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            ) : (
              <Bike className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span className="truncate">{driver.bikeOrCar}</span>
          </div>

          {/* Telemetry Stats Strip (Poin, Posisi, Menang) */}
          <div className="grid grid-cols-3 gap-1.5 mt-2.5 text-center font-mono">
            <div className="bg-[#12151d] p-1.5 rounded border border-[#1e2330]">
              <span className="text-[9px] text-slate-500 font-bold uppercase block">POIN</span>
              <span className="text-sm font-racing font-black text-amber-400">{driver.points}</span>
            </div>
            <div className="bg-[#12151d] p-1.5 rounded border border-[#1e2330]">
              <span className="text-[9px] text-slate-500 font-bold uppercase block">POSISI</span>
              <span className="text-sm font-racing font-black text-white">P{driver.position}</span>
            </div>
            <div className="bg-[#12151d] p-1.5 rounded border border-[#1e2330]">
              <span className="text-[9px] text-slate-500 font-bold uppercase block">MENANG</span>
              <span className="text-sm font-racing font-black text-white">{driver.wins}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectDriver(driver);
          }}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#141822] text-xs font-racing font-bold tracking-wider uppercase text-slate-200 hover:bg-[#1e2332] hover:text-white transition-all border border-[#232838]"
        >
          <span>PROFIL DETAIL</span>
          <ChevronRight className="w-3.5 h-3.5" />
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
    <div className="space-y-5 font-tech">
      {/* Header controls */}
      <div className="paddock-panel p-4 rounded flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-[#232838]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase text-white bg-emerald-600 rounded">
              OFFICIAL ENTRY LIST
            </span>
            <span className="text-xs font-mono text-slate-400">MUSIM RESMI 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-racing font-black text-white uppercase tracking-tight mt-1">
            GRID LINEUP PEMBALAP & TIM RESMI
          </h2>
        </div>

        {/* Dual Controls: Series Selector & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto font-racing font-bold text-xs">
          {/* Series Selector */}
          <div className="flex items-center bg-[#0a0c10] p-0.5 rounded border border-[#232838]">
            <button
              onClick={() => handleSeriesChange('all')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeSeries === 'all'
                  ? 'bg-[#232838] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEMUA ({drivers.length})
            </button>
            <button
              onClick={() => handleSeriesChange('f1')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeSeries === 'f1'
                  ? 'bg-[#e10600] text-white shadow-xs'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              F1 ({f1DriversCount})
            </button>
            <button
              onClick={() => handleSeriesChange('motogp')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeSeries === 'motogp'
                  ? 'bg-[#0070c0] text-white shadow-xs'
                  : 'text-slate-400 hover:text-sky-400'
              }`}
            >
              MOTOGP ({motogpDriversCount})
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-[#0a0c10] p-0.5 rounded border border-[#232838]">
            <button
              onClick={() => setActiveView('drivers')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeView === 'drivers'
                  ? 'bg-[#232838] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PEMBALAP ({filteredDrivers.length})
            </button>
            <button
              onClick={() => setActiveView('teams')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeView === 'teams'
                  ? 'bg-[#232838] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TIM ({filteredTeams.length})
            </button>
          </div>
        </div>
      </div>

      {/* DRIVERS VIEW */}
      {activeView === 'drivers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDrivers.length === 0 ? (
            <div className="col-span-full text-center py-12 paddock-panel rounded border border-[#232838]">
              <p className="text-slate-400 text-sm font-mono">TIDAK DITEMUKAN PEMBALAP YANG SESUAI.</p>
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
                className="paddock-panel-interactive rounded p-4 relative overflow-hidden border border-[#1f232f]"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: team.color }}
                />

                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                      isF1
                        ? 'bg-red-950/60 text-red-300 border border-red-500/30'
                        : 'bg-sky-950/60 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {isF1 ? 'F1 CONSTRUCTOR' : 'MOTOGP FACTORY'}
                  </span>
                  <span className="text-sm font-racing font-black text-amber-400">
                    POSISI #{team.position}
                  </span>
                </div>

                <h3 className="text-2xl font-racing font-black text-white mt-2 uppercase tracking-tight">{team.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-tech">{team.fullName}</p>

                <div className="space-y-1.5 mt-3 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300 bg-[#0b0d12] p-2 rounded border border-[#1c202d]">
                    <span className="text-slate-500">PABRIKAN:</span>
                    <span className="font-semibold text-white">{team.powerUnitOrBike}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 bg-[#0b0d12] p-2 rounded border border-[#1c202d]">
                    <span className="text-slate-500">TOTAL POIN:</span>
                    <span className="font-bold text-amber-400">{team.points} PTS</span>
                  </div>
                </div>

                {team.drivers.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#1a1f2c]">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                      PEMBALAP RESMI:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.drivers.map((driverName, idx) => (
                        <span
                          key={idx}
                          className="bg-[#12151d] text-slate-200 text-xs px-2 py-0.5 rounded font-racing font-bold uppercase border border-[#232838]"
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

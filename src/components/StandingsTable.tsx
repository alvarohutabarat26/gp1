import React, { useState } from 'react';
import { Trophy, Award } from 'lucide-react';
import { Driver, Team, SeriesType } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';
import { DriverAvatar } from './DriverAvatar';

interface StandingsTableProps {
  f1Drivers: Driver[];
  f1Teams: Team[];
  motogpDrivers: Driver[];
  motogpTeams: Team[];
  selectedSeries: SeriesType | 'all';
  onSelectDriver: (driver: Driver) => void;
  season: string;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  f1Drivers,
  f1Teams,
  motogpDrivers,
  motogpTeams,
  selectedSeries,
  onSelectDriver,
  season
}) => {
  const [standingsType, setStandingsType] = useState<'drivers' | 'constructors'>('drivers');
  const [activeSeries, setActiveSeries] = useState<SeriesType>(
    selectedSeries === 'motogp' ? 'motogp' : 'f1'
  );

  React.useEffect(() => {
    if (selectedSeries !== 'all') {
      setActiveSeries(selectedSeries);
    }
  }, [selectedSeries]);

  const currentDrivers = (activeSeries === 'f1' ? f1Drivers : motogpDrivers)
    .slice()
    .sort((a, b) => b.points - a.points);

  const currentTeams = (activeSeries === 'f1' ? f1Teams : motogpTeams)
    .slice()
    .sort((a, b) => b.points - a.points);

  const leaderPoints =
    standingsType === 'drivers'
      ? currentDrivers[0]?.points || 1
      : currentTeams[0]?.points || 1;

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Klasemen Kejuaraan Dunia Resmi (Musim {season})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Data poin dan statistik resmi tanpa manipulasi bersumber dari FIA Formula 1 & FIM MotoGP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedSeries === 'all' && (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveSeries('f1')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSeries === 'f1'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Formula 1
              </button>
              <button
                onClick={() => setActiveSeries('motogp')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSeries === 'motogp'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MotoGP
              </button>
            </div>
          )}

          {/* Standings Category Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setStandingsType('drivers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                standingsType === 'drivers'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pembalap ({currentDrivers.length})
            </button>
            <button
              onClick={() => setStandingsType('constructors')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                standingsType === 'constructors'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Konstruktor / Tim
            </button>
          </div>
        </div>
      </div>

      {/* DRIVERS STANDINGS TABLE */}
      {standingsType === 'drivers' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-xs uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-2 sm:px-4 w-10 sm:w-14 text-center">Pos</th>
                  <th className="py-3 px-2.5 sm:px-4">Pembalap</th>
                  <th className="py-3 px-3 sm:px-4 hidden sm:table-cell">Tim</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden md:table-cell">Selisih</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">Menang</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden lg:table-cell">Podium</th>
                  {activeSeries === 'motogp' && (
                    <th className="py-3 px-2 sm:px-3 text-center hidden xl:table-cell">3 Terakhir</th>
                  )}
                  <th className="py-3 px-2.5 sm:px-4 text-right">Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {currentDrivers.map((driver, index) => {
                  const isLeader = index === 0;

                  return (
                    <tr
                      key={driver.id}
                      onClick={() => onSelectDriver(driver)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        isLeader ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Position */}
                      <td className="py-3 px-2 sm:px-4 text-center font-mono font-black">
                        {isLeader ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs shadow-sm">
                            🏆 1
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-xs sm:text-sm">{index + 1}</span>
                        )}
                      </td>

                      {/* Driver info */}
                      <td className="py-3 px-2.5 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <DriverAvatar driver={driver} size="xs" className="shrink-0 shadow-sm sm:w-10 sm:h-10" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <CountryFlag country={driver.countryCode || driver.nationality} className="w-3.5 h-2.5 sm:w-4 sm:h-2.5 rounded-xs shrink-0" />
                              <span className="font-bold text-white hover:text-amber-300 transition-colors truncate text-xs sm:text-sm max-w-[125px] sm:max-w-none">
                                {driver.name}
                              </span>
                              <span
                                className="text-[11px] sm:text-xs font-mono font-bold shrink-0"
                                style={{ color: driver.teamColor || '#f59e0b' }}
                              >
                                #{driver.number}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 sm:hidden flex items-center gap-1.5 mt-0.5 truncate max-w-[145px]">
                              <span className="truncate">{driver.team}</span>
                              {driver.gap && driver.gap !== '-' && (
                                <span className="text-slate-500 font-mono text-[10px] shrink-0">({driver.gap})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="py-3.5 px-3 sm:px-4 hidden sm:table-cell">
                        <span className="text-xs text-slate-300 font-semibold flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: driver.teamColor }}
                          />
                          <span className="truncate">{driver.team}</span>
                        </span>
                      </td>

                      {/* Gap */}
                      <td className="py-3.5 px-2 sm:px-3 text-center font-mono text-xs hidden md:table-cell">
                        {isLeader || driver.gap === '-' || !driver.gap ? (
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Leader
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold">
                            {driver.gap}
                          </span>
                        )}
                      </td>

                      {/* Wins */}
                      <td className="py-3.5 px-2 sm:px-3 text-center font-mono text-xs hidden sm:table-cell">
                        <span className="font-bold text-white">{driver.wins}</span>
                        {typeof driver.sprintWins === 'number' && driver.sprintWins > 0 ? (
                          <span className="text-[10px] text-amber-400 block font-normal">
                            +{driver.sprintWins} spr
                          </span>
                        ) : null}
                      </td>

                      {/* Podiums */}
                      <td className="py-3.5 px-2 sm:px-3 text-center font-mono text-slate-300 text-xs hidden lg:table-cell">
                        <span className="font-bold text-white">{driver.podiums}</span>
                      </td>

                      {/* Last 3 Positions (MotoGP specific) */}
                      {activeSeries === 'motogp' && (
                        <td className="py-3.5 px-2 sm:px-3 text-center font-mono text-xs hidden xl:table-cell">
                          <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                            {driver.last3Positions?.trim() ? driver.last3Positions : '- - -'}
                          </span>
                        </td>
                      )}

                      {/* Points */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-black text-amber-400 text-base">
                        {driver.points} <span className="text-xs text-slate-500 font-normal">PTS</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONSTRUCTORS STANDINGS TABLE */}
      {standingsType === 'constructors' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-xs uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-2 sm:px-4 w-10 sm:w-14 text-center">Pos</th>
                  <th className="py-3 px-2.5 sm:px-4">Konstruktor / Tim</th>
                  <th className="py-3 px-3 sm:px-4 hidden sm:table-cell">Mesin / Motor</th>
                  <th className="py-3 px-2 sm:px-3 text-center hidden md:table-cell">Selisih</th>
                  <th className="py-3 px-4 w-40 hidden lg:table-cell">Rasio Poin</th>
                  <th className="py-3 px-2.5 sm:px-4 text-right">Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {currentTeams.map((team, index) => {
                  const percentage = Math.max(5, Math.round((team.points / leaderPoints) * 100));
                  const isLeader = index === 0;
                  const gap = isLeader ? 'Leader' : `-${(leaderPoints - team.points).toFixed(0)}`;

                  return (
                    <tr
                      key={team.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isLeader ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-2 sm:px-4 text-center font-mono font-black">
                        {isLeader ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs shadow-sm">
                            🏆 1
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-xs sm:text-sm">{index + 1}</span>
                        )}
                      </td>

                      <td className="py-3 px-2.5 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <span
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-md shrink-0 shadow-sm"
                            style={{ backgroundColor: team.color }}
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-white text-xs sm:text-sm block truncate">{team.name}</span>
                            <span className="text-[10px] text-slate-400 block sm:hidden truncate">{team.powerUnitOrBike}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 sm:px-4 text-xs text-slate-300 hidden sm:table-cell">
                        {team.powerUnitOrBike}
                      </td>

                      {/* Gap */}
                      <td className="py-3.5 px-2 sm:px-3 text-center font-mono text-xs hidden md:table-cell">
                        {isLeader ? (
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Leader
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold">{gap}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: team.color
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-2.5 sm:px-4 text-right font-mono font-black text-amber-400 text-sm sm:text-base">
                        {team.points} <span className="text-[10px] sm:text-xs text-slate-500 font-normal">PTS</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

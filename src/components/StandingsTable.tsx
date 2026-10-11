import React, { useState } from 'react';
import { Trophy, Award, Shield, Flag } from 'lucide-react';
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

  const isF1 = activeSeries === 'f1';

  return (
    <div className="space-y-5 font-tech">
      {/* Official Classification Header Controls */}
      <div className="paddock-panel p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#232838]">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white rounded-md ${isF1 ? 'bg-[#e10600]' : 'bg-[#0070c0]'}`}>
              {isF1 ? 'FIA Formula 1' : 'FIM MotoGP'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Musim Resmi {season}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Klasemen Kejuaraan Dunia Resmi
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedSeries === 'all' && (
            <div className="flex items-center bg-[#0a0c10] p-0.5 rounded-lg border border-[#232838] text-xs font-semibold">
              <button
                onClick={() => setActiveSeries('f1')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeSeries === 'f1'
                    ? 'bg-[#e10600] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Formula 1
              </button>
              <button
                onClick={() => setActiveSeries('motogp')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeSeries === 'motogp'
                    ? 'bg-[#0070c0] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MotoGP
              </button>
            </div>
          )}

          {/* Standings Category Toggle */}
          <div className="flex items-center bg-[#0a0c10] p-0.5 rounded-lg border border-[#232838] text-xs font-semibold">
            <button
              onClick={() => setStandingsType('drivers')}
              className={`px-3 py-1 rounded-md transition-all ${
                standingsType === 'drivers'
                  ? 'bg-[#232838] text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pembalap ({currentDrivers.length})
            </button>
            <button
              onClick={() => setStandingsType('constructors')}
              className={`px-3 py-1 rounded-md transition-all ${
                standingsType === 'constructors'
                  ? 'bg-[#232838] text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Konstruktor ({currentTeams.length})
            </button>
          </div>
        </div>
      </div>

      {/* DRIVERS STANDINGS TABLE */}
      {standingsType === 'drivers' && (
        <div className="paddock-panel rounded-xl overflow-hidden border border-[#232838]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0c10] text-xs uppercase tracking-wider text-slate-400 border-b border-[#232838] font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-14 text-center">Pos</th>
                  <th className="py-2.5 px-3">Pembalap</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Tim & Konstruktor</th>
                  <th className="py-2.5 px-3 text-center hidden md:table-cell">Selisih</th>
                  <th className="py-2.5 px-3 text-center hidden sm:table-cell">Menang</th>
                  <th className="py-2.5 px-3 text-center hidden lg:table-cell">Podium</th>
                  {activeSeries === 'motogp' && (
                    <th className="py-2.5 px-3 text-center hidden xl:table-cell">Form Terakhir</th>
                  )}
                  <th className="py-2.5 px-4 text-right">Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#191d29] font-medium">
                {currentDrivers.map((driver, index) => {
                  const pos = index + 1;
                  const isP1 = pos === 1;
                  const isP2 = pos === 2;
                  const isP3 = pos === 3;

                  return (
                    <tr
                      key={driver.id}
                      onClick={() => onSelectDriver(driver)}
                      className="hover:bg-[#151822] cursor-pointer transition-colors group"
                    >
                      {/* Position Badge */}
                      <td className="py-3 px-3 text-center font-mono">
                        {isP1 ? (
                          <span className="inline-block bg-amber-400 text-black font-racing font-black text-sm px-2 py-0.5 rounded shadow-xs">
                            P1
                          </span>
                        ) : isP2 ? (
                          <span className="inline-block bg-slate-200 text-black font-racing font-black text-sm px-2 py-0.5 rounded shadow-xs">
                            P2
                          </span>
                        ) : isP3 ? (
                          <span className="inline-block bg-amber-700 text-white font-racing font-black text-sm px-2 py-0.5 rounded shadow-xs">
                            P3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold font-mono text-xs">
                            {pos}
                          </span>
                        )}
                      </td>

                      {/* Driver Info with Solid Team Livery Stripe */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {/* 4px Livery Bar */}
                          <span
                            className="w-1 h-9 rounded-full shrink-0"
                            style={{ backgroundColor: driver.teamColor || '#e10600' }}
                          />

                          <DriverAvatar driver={driver} size="xs" className="shrink-0" />

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <CountryFlag country={driver.countryCode || driver.nationality} className="w-3.5 h-2.5 rounded-xs shrink-0 shadow-xs" />
                              <span className="font-racing font-black text-base text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight truncate">
                                {driver.name}
                              </span>
                              <span
                                className="font-mono text-xs font-black shrink-0"
                                style={{ color: driver.teamColor || '#f59e0b' }}
                              >
                                #{driver.number}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 sm:hidden flex items-center gap-1.5 mt-0.5 truncate">
                              <span className="truncate">{driver.team}</span>
                              {driver.gap && driver.gap !== '-' && (
                                <span className="text-slate-500 font-mono text-[10px] shrink-0">({driver.gap})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-300 font-semibold flex items-center gap-2 truncate">
                          <span className="truncate">{driver.team}</span>
                        </span>
                      </td>

                      {/* Gap */}
                      <td className="py-3 px-3 text-center font-mono text-xs hidden md:table-cell">
                        {isP1 || driver.gap === '-' || !driver.gap ? (
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                            LEADER
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold">
                            {driver.gap}
                          </span>
                        )}
                      </td>

                      {/* Wins */}
                      <td className="py-3 px-3 text-center font-mono text-xs hidden sm:table-cell">
                        <span className="font-bold text-white text-sm">{driver.wins}</span>
                        {typeof driver.sprintWins === 'number' && driver.sprintWins > 0 ? (
                          <span className="text-[10px] text-amber-400 block">
                            +{driver.sprintWins} spr
                          </span>
                        ) : null}
                      </td>

                      {/* Podiums */}
                      <td className="py-3 px-3 text-center font-mono text-slate-300 text-xs hidden lg:table-cell">
                        <span className="font-bold text-white text-sm">{driver.podiums}</span>
                      </td>

                      {/* Last 3 Positions (MotoGP specific) */}
                      {activeSeries === 'motogp' && (
                        <td className="py-3 px-3 text-center font-mono text-xs hidden xl:table-cell">
                          <span className="text-slate-400 bg-[#0a0c10] px-2 py-0.5 rounded border border-[#1f2432] text-[11px]">
                            {driver.last3Positions?.trim() ? driver.last3Positions : '- - -'}
                          </span>
                        </td>
                      )}

                      {/* Points Total */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-racing font-black text-xl sm:text-2xl text-white tabular-nums">
                          {driver.points}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase ml-1">PTS</span>
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
        <div className="paddock-panel rounded-xl overflow-hidden border border-[#232838]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0c10] text-xs uppercase tracking-wider text-slate-400 border-b border-[#232838] font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-14 text-center">Pos</th>
                  <th className="py-2.5 px-3">Konstruktor / Tim Balap</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Power Unit / Mesin</th>
                  <th className="py-2.5 px-3 text-center hidden md:table-cell">Selisih</th>
                  <th className="py-2.5 px-4 w-44 hidden lg:table-cell">Barometer Poin</th>
                  <th className="py-2.5 px-4 text-right">Total Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#191d29] font-medium">
                {currentTeams.map((team, index) => {
                  const percentage = Math.max(5, Math.round((team.points / leaderPoints) * 100));
                  const pos = index + 1;
                  const isP1 = pos === 1;
                  const isP2 = pos === 2;
                  const isP3 = pos === 3;
                  const gap = isP1 ? 'LEADER' : `-${(leaderPoints - team.points).toFixed(0)}`;

                  return (
                    <tr
                      key={team.id}
                      className="hover:bg-[#151822] transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-mono">
                        {isP1 ? (
                          <span className="inline-block bg-amber-400 text-black font-racing font-black text-sm px-2 py-0.5 rounded shadow-xs">
                            P1
                          </span>
                        ) : isP2 ? (
                          <span className="inline-block bg-slate-200 text-black font-racing font-black text-sm px-2 py-0.5 rounded shadow-xs">
                            P2
                          </span>
                        ) : isP3 ? (
                          <span className="inline-block bg-amber-700 text-white font-racing font-black text-sm px-2 py-0.5 rounded shadow-xs">
                            P3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold font-mono text-xs">{pos}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-1.5 h-9 rounded-full shrink-0"
                            style={{ backgroundColor: team.color }}
                          />
                          <div className="min-w-0">
                            <span className="font-racing font-black text-base text-white block uppercase tracking-tight truncate">
                              {team.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block sm:hidden truncate font-tech">
                              {team.powerUnitOrBike}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-xs text-slate-300 hidden sm:table-cell font-mono">
                        {team.powerUnitOrBike}
                      </td>

                      <td className="py-3 px-3 text-center font-mono text-xs hidden md:table-cell">
                        {isP1 ? (
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                            LEADER
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold">{gap}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="w-full bg-[#0a0c10] rounded h-2 overflow-hidden border border-[#232838]">
                          <div
                            className="h-full rounded transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: team.color
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-racing font-black text-xl sm:text-2xl text-white tabular-nums">
                          {team.points}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase ml-1">PTS</span>
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

import React, { useState, useEffect } from 'react';
import { X, Trophy, Award, ShieldCheck, Flame, Timer } from 'lucide-react';
import { Race, RaceResultEntry } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';

interface RaceResultModalProps {
  race: Race | null;
  onClose: () => void;
}

export const RaceResultModal: React.FC<RaceResultModalProps> = ({ race, onClose }) => {
  const hasMainResults = Boolean(race?.fullResults && race.fullResults.length > 0);
  const hasSprintResults = Boolean(race?.sprintFullResults && race.sprintFullResults.length > 0);

  const [activeTab, setActiveTab] = useState<'main' | 'sprint'>('main');

  useEffect(() => {
    if (hasMainResults) {
      setActiveTab('main');
    } else if (hasSprintResults) {
      setActiveTab('sprint');
    }
  }, [hasMainResults, hasSprintResults]);

  useEffect(() => {
    if (!race) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [race]);

  if (!race) return null;

  const activeResults: RaceResultEntry[] =
    activeTab === 'sprint'
      ? race.sprintFullResults || []
      : race.fullResults || [];

  const isF1 = race.series === 'f1';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto font-tech"
    >
      <div
        className="relative w-full max-w-4xl bg-[#0e1017] border border-[#232838] rounded shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#090b10] p-4 sm:p-5 border-b border-[#1f2434]">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <CountryFlag
                country={race.countryCode || race.country || 'gb'}
                className="w-8 h-5.5 sm:w-10 sm:h-7 rounded-xs shadow-md shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                  <span
                    className={`font-black uppercase px-2 py-0.5 rounded text-white ${
                      isF1 ? 'bg-[#e10600]' : 'bg-[#0070c0]'
                    }`}
                  >
                    {isF1 ? 'FIA FORMULA 1' : 'FIM MOTOGP'} • R{String(race.round).padStart(2, '0')}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    OFFICIAL CLASSIFICATION
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-racing font-black text-white mt-1 uppercase tracking-tight">
                  {race.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-tech">
                  <span>{race.circuit}</span>
                  <span>•</span>
                  <span>{race.city}, {race.country}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-[#141722] hover:bg-[#1d2230] rounded border border-[#232838] transition-all shrink-0"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher if Sprint exists */}
          {hasSprintResults && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1a1f2c] font-racing text-xs font-bold uppercase tracking-wider">
              {hasMainResults && (
                <button
                  onClick={() => setActiveTab('main')}
                  className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                    activeTab === 'main'
                      ? 'bg-[#e10600] text-white shadow-xs'
                      : 'bg-[#12151d] text-slate-400 hover:text-white border border-[#202534]'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-white" />
                  GRAND PRIX MAIN RACE
                </button>
              )}
              <button
                onClick={() => setActiveTab('sprint')}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === 'sprint'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-[#12151d] text-slate-400 hover:text-white border border-[#202534]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-white" />
                SPRINT RACE
              </button>
            </div>
          )}
        </div>

        {/* Modal Body: Race Classification Table */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {activeResults.length === 0 ? (
            <div className="py-16 text-center space-y-3 font-mono">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300 uppercase">
                DATA HASIL DETAIL SESI SEDANG DIPROSES
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {activeTab === 'main' && !hasMainResults && hasSprintResults
                  ? 'Balapan utama (Grand Prix) belum tuntas. Silakan lihat tab Sprint Race untuk sesi yang telah rampung.'
                  : 'Hasil balapan resmi akan ditampilkan segera setelah sesi diverifikasi oleh race control.'}
              </p>
            </div>
          ) : (
            <div className="bg-[#0a0c10] border border-[#232838] rounded overflow-hidden">
              <div className="px-4 py-2.5 bg-[#0f121a] border-b border-[#232838] flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  OFFICIAL RACE CLASSIFICATION ({activeResults.length} DRIVERS)
                </span>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  FINAL RESULT
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0c0e14] text-[11px] uppercase font-racing tracking-wider text-slate-400 border-b border-[#232838]">
                    <tr>
                      <th className="py-2 px-3 w-12 text-center">POS</th>
                      <th className="py-2 px-3">PEMBALAP & TIM</th>
                      <th className="py-2 px-3 text-center">WAKTU / SELISIH</th>
                      <th className="py-2 px-4 text-right">POIN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181c28] font-medium">
                    {activeResults.map((entry) => {
                      const pos = entry.position;
                      const isP1 = pos === 1;
                      const isP2 = pos === 2;
                      const isP3 = pos === 3;

                      return (
                        <tr
                          key={`${entry.position}-${entry.driverName}`}
                          className="hover:bg-[#131620] transition-colors"
                        >
                          {/* Position Badge */}
                          <td className="py-2.5 px-3 text-center font-mono">
                            {isP1 ? (
                              <span className="inline-block bg-amber-400 text-black font-racing font-black text-xs px-2 py-0.5 rounded shadow-xs">
                                P1
                              </span>
                            ) : isP2 ? (
                              <span className="inline-block bg-slate-200 text-black font-racing font-black text-xs px-2 py-0.5 rounded shadow-xs">
                                P2
                              </span>
                            ) : isP3 ? (
                              <span className="inline-block bg-amber-700 text-white font-racing font-black text-xs px-2 py-0.5 rounded shadow-xs">
                                P3
                              </span>
                            ) : (
                              <span className="text-slate-400 font-bold font-mono text-xs">
                                {pos}
                              </span>
                            )}
                          </td>

                          {/* Driver Info: Flag, Name, Team & Number */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2 sm:gap-2.5">
                              <CountryFlag
                                country={entry.countryCode || entry.nationality || 'gb'}
                                className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs shrink-0 shadow-xs"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <span className="font-racing font-black text-base text-white uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">
                                    {entry.driverName}
                                  </span>
                                  {entry.fastestLap && (
                                    <span
                                      className="inline-flex items-center text-[9px] font-mono font-bold text-purple-400 bg-purple-950/60 px-1 py-0.2 rounded border border-purple-500/30 shrink-0"
                                      title="Fastest Lap"
                                    >
                                      ⚡ FL
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate max-w-[160px] sm:max-w-none font-tech">
                                  <span className="truncate">{entry.team}</span>
                                  {entry.driverNumber && (
                                    <>
                                      <span>•</span>
                                      <span className="font-mono font-bold text-slate-300 shrink-0">
                                        #{entry.driverNumber}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Waktu (Time / Gap) */}
                          <td className="py-2.5 px-3 text-center font-mono text-xs">
                            {isP1 ? (
                              <span className="font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                                {entry.timeOrGap}
                              </span>
                            ) : entry.timeOrGap.includes('DNF') || entry.timeOrGap.includes('Ret') ? (
                              <span className="text-rose-400 font-semibold">
                                {entry.timeOrGap}
                              </span>
                            ) : (
                              <span className="text-slate-300 font-medium">
                                {entry.timeOrGap}
                              </span>
                            )}
                          </td>

                          {/* Poin */}
                          <td className="py-2.5 px-4 text-right">
                            {entry.points > 0 ? (
                              <span className="font-racing font-black text-lg text-white">
                                {entry.points} <span className="text-[10px] font-mono text-slate-500 font-normal">PTS</span>
                              </span>
                            ) : (
                              <span className="font-mono text-xs text-slate-600">
                                0
                              </span>
                            )}
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

        {/* Modal Footer */}
        <div className="bg-[#090b10] p-3.5 border-t border-[#1f2434] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Timer className="w-3.5 h-3.5 text-slate-500" />
            Waktu terverifikasi pencatatan resmi timing official.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-[#1a1e2a] hover:bg-[#252b3c] text-white font-racing font-bold text-xs uppercase tracking-wider rounded border border-[#272d3f] transition-all"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};

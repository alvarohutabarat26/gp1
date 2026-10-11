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
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 border-b border-slate-800">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <CountryFlag
                country={race.countryCode || race.country || 'gb'}
                className="w-8 h-5.5 sm:w-10 sm:h-7 rounded-xs shadow-md shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                      isF1 ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                    }`}
                  >
                    {isF1 ? 'FORMULA 1' : 'MOTOGP'} • ROUND {race.round}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Hasil Resmi & Terverifikasi
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {race.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{race.circuit}</span>
                  <span>•</span>
                  <span>{race.city}, {race.country}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all shrink-0"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher if Sprint exists */}
          {hasSprintResults && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
              {hasMainResults && (
                <button
                  onClick={() => setActiveTab('main')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'main'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  Grand Prix Main Race
                </button>
              )}
              <button
                onClick={() => setActiveTab('sprint')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'sprint'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Sprint Race
              </button>
            </div>
          )}
        </div>

        {/* Modal Body: Google-style Race Classification Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeResults.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">
                Data Hasil Detail Sesi Sedang Diproses
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {activeTab === 'main' && !hasMainResults && hasSprintResults
                  ? 'Balapan utama (Grand Prix) belum dimulai atau belum tuntas. Silakan lihat tab Sprint Race untuk hasil sesi yang sudah selesai.'
                  : 'Hasil balapan resmi akan ditampilkan segera setelah sesi diverifikasi oleh race control.'}
              </p>
            </div>
          ) : (
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl overflow-hidden shadow-inner">
              <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Urutan Klasifikasi Akhir ({activeResults.length} Pembalap)
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  FINAL
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-[11px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-2 sm:px-4 w-10 sm:w-14 text-center">Pos</th>
                      <th className="py-2.5 px-2.5 sm:px-4">Pembalap</th>
                      <th className="py-2.5 px-2 sm:px-4 text-center">Waktu</th>
                      <th className="py-2.5 px-2.5 sm:px-4 text-right">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-medium">
                    {activeResults.map((entry, idx) => {
                      const isPodium = entry.position <= 3;
                      const isWinner = entry.position === 1;

                      return (
                        <tr
                          key={`${entry.position}-${entry.driverName}`}
                          className={`hover:bg-slate-800/40 transition-colors ${
                            isWinner
                              ? 'bg-amber-500/5'
                              : isPodium
                              ? 'bg-slate-900/50'
                              : ''
                          }`}
                        >
                          {/* Position */}
                          <td className="py-2.5 px-2 sm:px-4 text-center font-mono font-black">
                            {isWinner ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs shadow-sm">
                                1
                              </span>
                            ) : entry.position === 2 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 border border-slate-400/40 text-[11px] sm:text-xs">
                                2
                              </span>
                            ) : entry.position === 3 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-400 border border-amber-600/40 text-[11px] sm:text-xs">
                                3
                              </span>
                            ) : (
                              <span className="text-slate-400 font-bold text-xs sm:text-sm">
                                {entry.position}
                              </span>
                            )}
                          </td>

                          {/* Driver Info: Flag, Name, Team & Number (Google format) */}
                          <td className="py-2.5 px-2.5 sm:px-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <CountryFlag
                                country={entry.countryCode || entry.nationality || 'gb'}
                                className="w-4 h-3 sm:w-5 sm:h-3.5 rounded-xs shrink-0 shadow-xs"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <span className="font-bold text-white text-xs sm:text-sm truncate max-w-[125px] sm:max-w-none">
                                    {entry.driverName}
                                  </span>
                                  {entry.fastestLap && (
                                    <span
                                      className="inline-flex items-center text-[9px] sm:text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1 sm:px-1.5 py-0.2 rounded border border-purple-500/30 shrink-0"
                                      title="Fastest Lap"
                                    >
                                      ⚡ FL
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate max-w-[145px] sm:max-w-none">
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
                          <td className="py-2.5 px-2 sm:px-4 text-center font-mono text-[11px] sm:text-sm">
                            {isWinner ? (
                              <span className="font-bold text-amber-400 bg-amber-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-amber-500/20">
                                {entry.timeOrGap}
                              </span>
                            ) : entry.timeOrGap.includes('DNF') || entry.timeOrGap.includes('Ret') ? (
                              <span className="text-rose-400 font-semibold text-[10px] sm:text-xs">
                                {entry.timeOrGap}
                              </span>
                            ) : (
                              <span className="text-slate-300 font-medium">
                                {entry.timeOrGap}
                              </span>
                            )}
                          </td>

                          {/* Poin (Points Awarded) */}
                          <td className="py-2.5 px-2.5 sm:px-4 text-right font-mono font-bold text-xs sm:text-sm">
                            {entry.points > 0 ? (
                              <span className="text-amber-400">
                                {entry.points}
                              </span>
                            ) : (
                              <span className="text-slate-600 font-normal">
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
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-slate-500" />
            Waktu disesuaikan dengan pencatatan resmi race timing official.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

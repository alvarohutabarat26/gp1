import React, { useState } from 'react';
import { Trophy, Calendar, Newspaper, Users, ChevronRight, Flag, ExternalLink, CheckCircle, Flame, Zap } from 'lucide-react';
import { HeroCountdown } from './HeroCountdown';
import { CountryFlag } from './CountryFlag';
import { DriverAvatar } from './DriverAvatar';
import { Race, Driver, NewsArticle, SeriesType } from '../types/motorsport';
import { RaceResultModal } from './RaceResultModal';

interface OverviewProps {
  f1NextRace: Race;
  motogpNextRace: Race;
  recentRaces: Race[];
  topF1Drivers: Driver[];
  topMotoGPDrivers: Driver[];
  latestNews: NewsArticle[];
  selectedSeries: SeriesType | 'all';
  setActiveTab: (tab: string) => void;
  onSelectDriver: (driver: Driver) => void;
  onReadArticle: (article: NewsArticle) => void;
  onViewRaceResult?: (race: Race) => void;
  timezone: string;
  season: string;
}

export const Overview: React.FC<OverviewProps> = ({
  f1NextRace,
  motogpNextRace,
  recentRaces,
  topF1Drivers,
  topMotoGPDrivers,
  latestNews,
  selectedSeries,
  setActiveTab,
  onSelectDriver,
  onReadArticle,
  onViewRaceResult,
  timezone,
  season
}) => {
  const [selectedResultRace, setSelectedResultRace] = useState<Race | null>(null);

  return (
    <div className="space-y-8">
      {/* Hero Countdown Section */}
      <HeroCountdown
        f1NextRace={f1NextRace}
        motogpNextRace={motogpNextRace}
        selectedSeries={selectedSeries}
        onViewSchedule={() => setActiveTab('calendar')}
        timezone={timezone}
      />

      {/* Grid: Championship Leaders & Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Top Championship Leaders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Klasemen Teratas (Musim {season})
              </h2>
              <span className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Data Resmi Bersumber Langsung dari FIA & FIM
              </span>
            </div>
            <button
              onClick={() => setActiveTab('standings')}
              className="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              Lihat Lengkap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* F1 Top 3 */}
            {(selectedSeries === 'all' || selectedSeries === 'f1') && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Formula 1 Drivers
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">Poin</span>
                </div>

                <div className="divide-y divide-slate-800/60 mt-2">
                  {topF1Drivers.slice(0, 3).map((driver, idx) => (
                    <div
                      key={driver.id}
                      onClick={() => onSelectDriver(driver)}
                      className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono font-bold w-4 ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <DriverAvatar driver={driver} size="xs" className="shrink-0" />
                        <CountryFlag country={driver.countryCode || driver.nationality} className="w-4 h-2.5 rounded-xs shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white block truncate max-w-[120px]">
                            {driver.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {driver.team}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-amber-400">
                        {driver.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MotoGP Top 3 */}
            {(selectedSeries === 'all' || selectedSeries === 'motogp') && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase text-orange-500">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    MotoGP Riders
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">Poin</span>
                </div>

                <div className="divide-y divide-slate-800/60 mt-2">
                  {topMotoGPDrivers.slice(0, 3).map((driver, idx) => (
                    <div
                      key={driver.id}
                      onClick={() => onSelectDriver(driver)}
                      className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-mono font-bold w-4 ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <DriverAvatar driver={driver} size="xs" className="shrink-0" />
                        <CountryFlag country={driver.countryCode || driver.nationality} className="w-4 h-2.5 rounded-xs shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white block truncate max-w-[120px]">
                            {driver.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {driver.team}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-amber-400">
                        {driver.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Completed Grand Prix Results */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-emerald-400" />
                Hasil Balapan Nyata & Podium
              </h3>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                Semua Balapan <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {recentRaces.length === 0 ? (
              <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center">
                <p className="text-xs text-slate-400 font-medium">
                  Memuat data podium resmi sesi balapan terkini...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentRaces.map((race) => {
                  const isF1 = race.series === 'f1';
                  const hasMainResult = Boolean(race.result);
                  const hasSprintResult = Boolean(race.sprintResult);

                  return (
                    <div
                      key={race.id}
                      className="p-3.5 bg-slate-950/80 border border-slate-800/90 hover:border-slate-700/80 rounded-xl transition-all flex flex-col justify-between"
                    >
                      {/* Card Header: Flag, Name, Round, Badges */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] gap-2 pb-2 border-b border-slate-800/60">
                          <span className="flex items-center gap-2 font-bold text-slate-200 min-w-0">
                            <CountryFlag country={race.countryCode || race.country} className="w-4 h-3 rounded-xs shrink-0" />
                            <span className="truncate">{race.name}</span>
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              R{race.round}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                isF1 ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                              }`}
                            >
                              {isF1 ? 'F1' : 'MotoGP'}
                            </span>
                          </div>
                        </div>

                        {/* Main Grand Prix Result */}
                        {hasMainResult && race.result && (
                          <div className="mt-2.5 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                <CheckCircle className="w-2.5 h-2.5" />
                                GP Selesai
                              </span>
                              {race.result.gap && (
                                <span className="font-mono text-slate-400 text-[10px]">
                                  Gap {race.result.gap}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-0.5">
                              <span className="text-slate-400 font-semibold flex items-center gap-1">
                                🥇 Pemenang:
                              </span>
                              <div className="text-right">
                                <span className="font-bold text-amber-400 block truncate max-w-[170px]">
                                  {race.result.winner}
                                </span>
                                {race.result.winnerTeam && (
                                  <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
                                    {race.result.winnerTeam}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 border-t border-slate-900">
                              <span className="text-slate-500 font-medium">Podium:</span>
                              <span className="text-slate-300 font-medium truncate max-w-[170px] text-right">
                                🥈 {race.result.p2} <br className="sm:hidden" /> 🥉 {race.result.p3}
                              </span>
                            </div>

                            {race.result.fastestLap && (
                              <div className="text-[10px] text-slate-500 font-mono text-right truncate">
                                ⚡ FL: {race.result.fastestLap}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sprint Race Result (when main race hasn't concluded or sprint is primary) */}
                        {!hasMainResult && hasSprintResult && race.sprintResult && (
                          <div className="mt-2.5 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                <Flame className="w-2.5 h-2.5" />
                                Sprint Selesai
                              </span>
                              <span className="text-[10px] font-bold text-sky-400">
                                Main Race Hari Ini
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-0.5">
                              <span className="text-slate-400 font-semibold flex items-center gap-1">
                                ⚡ Juara Sprint:
                              </span>
                              <div className="text-right">
                                <span className="font-bold text-amber-400 block truncate max-w-[170px]">
                                  {race.sprintResult.winner}
                                </span>
                                {race.sprintResult.winnerTeam && (
                                  <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
                                    {race.sprintResult.winnerTeam}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 border-t border-slate-900">
                              <span className="text-slate-500 font-medium">Podium:</span>
                              <span className="text-slate-300 font-medium truncate max-w-[170px] text-right">
                                🥈 {race.sprintResult.p2} <br className="sm:hidden" /> 🥉 {race.sprintResult.p3}
                              </span>
                            </div>

                            {race.sprintResult.gap && (
                              <div className="text-[10px] text-slate-500 font-mono text-right truncate">
                                Gap: {race.sprintResult.gap}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Lihat Hasil button */}
                        <div className="mt-3 pt-2 border-t border-slate-900 flex justify-end">
                          <button
                            onClick={() => {
                              if (onViewRaceResult) onViewRaceResult(race);
                              setSelectedResultRace(race);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm border border-emerald-500/30 cursor-pointer"
                          >
                            <Trophy className="w-3 h-3 text-amber-300" />
                            <span>Lihat Hasil Lengkap</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Breaking Live News from RSS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-rose-400" />
              Feed Berita Asli (BBC & Crash.net)
            </h2>
            <button
              onClick={() => setActiveTab('news')}
              className="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              Semua Berita <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {latestNews.slice(0, 4).map((article) => (
              <div
                key={article.id}
                onClick={() => onReadArticle(article)}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 cursor-pointer transition-all hover:bg-slate-800/40 group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-bold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {article.category}
                  </span>
                  <span className="text-slate-500">{article.source}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Race Result Modal */}
      {selectedResultRace && (
        <RaceResultModal
          race={selectedResultRace}
          onClose={() => setSelectedResultRace(null)}
        />
      )}
    </div>
  );
};

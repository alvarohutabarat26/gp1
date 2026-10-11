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
    <div className="space-y-7 font-tech">
      {/* Official Hero Countdown Telemetry Console */}
      <HeroCountdown
        f1NextRace={f1NextRace}
        motogpNextRace={motogpNextRace}
        selectedSeries={selectedSeries}
        onViewSchedule={() => setActiveTab('calendar')}
        timezone={timezone}
      />

      {/* Grid: Championship Leaders & Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (7 cols): Top Championship Leaders & Recent Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#1d2230]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase text-white bg-amber-600 rounded">
                  OFFICIAL LEADERBOARD
                </span>
                <span className="text-xs font-mono text-slate-400">MUSIM {season}</span>
              </div>
              <h2 className="text-2xl font-racing font-black text-white uppercase tracking-tight mt-0.5">
                KLASEMEN TERTINGGI KEJUARAAN DUNIA
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('standings')}
              className="text-xs font-racing font-bold tracking-wider uppercase text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              KLASEMEN PENUH <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* F1 Top 3 */}
            {(selectedSeries === 'all' || selectedSeries === 'f1') && (
              <div className="paddock-panel rounded p-3.5 border border-[#232838]">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#1c212e]">
                  <span className="flex items-center gap-1.5 font-racing font-black text-xs uppercase tracking-wider text-[#e10600]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e10600]"></span>
                    FORMULA 1 TOP 3
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">POIN</span>
                </div>

                <div className="divide-y divide-[#171b26] mt-1.5">
                  {topF1Drivers.slice(0, 3).map((driver, idx) => (
                    <div
                      key={driver.id}
                      onClick={() => onSelectDriver(driver)}
                      className="py-2 flex items-center justify-between cursor-pointer hover:bg-[#141822] px-1.5 rounded transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-black w-4 ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <DriverAvatar driver={driver} size="xs" className="shrink-0" />
                        <CountryFlag country={driver.countryCode || driver.nationality} className="w-3.5 h-2.5 rounded-xs shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-racing font-bold uppercase text-white group-hover:text-amber-400 transition-colors block truncate max-w-[110px]">
                            {driver.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {driver.team}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-racing font-black text-amber-400 tabular-nums">
                        {driver.points} <span className="text-[9px] font-mono text-slate-500 font-normal">PTS</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MotoGP Top 3 */}
            {(selectedSeries === 'all' || selectedSeries === 'motogp') && (
              <div className="paddock-panel rounded p-3.5 border border-[#232838]">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#1c212e]">
                  <span className="flex items-center gap-1.5 font-racing font-black text-xs uppercase tracking-wider text-[#0070c0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0070c0]"></span>
                    MOTOGP TOP 3
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">POIN</span>
                </div>

                <div className="divide-y divide-[#171b26] mt-1.5">
                  {topMotoGPDrivers.slice(0, 3).map((driver, idx) => (
                    <div
                      key={driver.id}
                      onClick={() => onSelectDriver(driver)}
                      className="py-2 flex items-center justify-between cursor-pointer hover:bg-[#141822] px-1.5 rounded transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-black w-4 ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <DriverAvatar driver={driver} size="xs" className="shrink-0" />
                        <CountryFlag country={driver.countryCode || driver.nationality} className="w-3.5 h-2.5 rounded-xs shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-racing font-bold uppercase text-white group-hover:text-amber-400 transition-colors block truncate max-w-[110px]">
                            {driver.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {driver.team}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-racing font-black text-amber-400 tabular-nums">
                        {driver.points} <span className="text-[9px] font-mono text-slate-500 font-normal">PTS</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Completed Grand Prix Results */}
          <div className="paddock-panel rounded p-4 border border-[#232838]">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#1c212e]">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">OFFICIAL CLASSIFICATION</span>
                <h3 className="text-lg font-racing font-black text-white uppercase tracking-tight block">
                  HASIL GRAND PRIX & PODIUM TERBARU
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-racing font-bold tracking-wider uppercase text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                SEMUA HASIL <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {recentRaces.length === 0 ? (
              <div className="p-6 bg-[#0a0c10] border border-[#1a1f2c] rounded text-center">
                <p className="text-xs text-slate-400 font-mono">
                  MEMUAT DATA PODIUM RESMI SESI TERKINI...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                {recentRaces.map((race) => {
                  const isF1 = race.series === 'f1';
                  const hasMainResult = Boolean(race.result);
                  const hasSprintResult = Boolean(race.sprintResult);

                  return (
                    <div
                      key={race.id}
                      className="p-3 bg-[#0c0e14] border border-[#1f2432] rounded flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Flag, Name, Round, Badges */}
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#181c26]">
                          <span className="flex items-center gap-1.5 font-bold text-white min-w-0">
                            <CountryFlag country={race.countryCode || race.country} className="w-3.5 h-2.5 rounded-xs shrink-0" />
                            <span className="truncate font-racing uppercase tracking-tight">{race.name}</span>
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded shrink-0 ${
                              isF1 ? 'bg-[#e10600] text-white' : 'bg-[#0070c0] text-white'
                            }`}
                          >
                            R{race.round}
                          </span>
                        </div>

                        {/* Main Grand Prix Result */}
                        {hasMainResult && race.result && (
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">P1 WINNER:</span>
                              <span className="font-racing font-black text-amber-400 uppercase text-sm truncate max-w-[160px]">
                                {race.result.winner}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-slate-500">PODIUM:</span>
                              <span className="text-slate-300 truncate max-w-[160px]">
                                P2 {race.result.p2} • P3 {race.result.p3}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Sprint Result */}
                        {!hasMainResult && hasSprintResult && race.sprintResult && (
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-amber-400">SPRINT WIN:</span>
                              <span className="font-racing font-black text-amber-400 uppercase text-sm truncate max-w-[160px]">
                                {race.sprintResult.winner}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-slate-500">PODIUM:</span>
                              <span className="text-slate-300 truncate max-w-[160px]">
                                P2 {race.sprintResult.p2} • P3 {race.sprintResult.p3}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-3 pt-2 border-t border-[#181c26] flex justify-end">
                        <button
                          onClick={() => {
                            if (onViewRaceResult) onViewRaceResult(race);
                            setSelectedResultRace(race);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-racing font-bold uppercase tracking-wider transition-all"
                        >
                          <Trophy className="w-3 h-3 text-amber-300" />
                          <span>HASIL RACE LENGKAP</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Breaking Live News from RSS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1d2230]">
            <div>
              <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">PADDOCK PRESS</span>
              <h2 className="text-2xl font-racing font-black text-white uppercase tracking-tight block">
                BERITA RESMI & TEKNIS
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('news')}
              className="text-xs font-racing font-bold tracking-wider uppercase text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              SEMUA BERITA <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {latestNews.slice(0, 4).map((article) => (
              <div
                key={article.id}
                onClick={() => onReadArticle(article)}
                className="paddock-panel-interactive rounded p-3.5 cursor-pointer transition-all group border border-[#1f232f]"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-bold uppercase text-rose-400 bg-rose-950/50 px-1.5 py-0.2 rounded border border-rose-600/30">
                    {article.category}
                  </span>
                  <span className="text-slate-500">{article.source}</span>
                </div>
                <h3 className="text-sm font-tech font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
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

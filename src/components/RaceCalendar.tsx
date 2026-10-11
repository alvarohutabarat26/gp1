import React, { useState } from 'react';
import { Calendar, Clock, Trophy, MapPin, ChevronDown, ChevronUp, CheckCircle, Flame, Info, Flag } from 'lucide-react';
import { Race, SeriesType } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';
import { RaceResultModal } from './RaceResultModal';

interface RaceCalendarProps {
  races: Race[];
  selectedSeries: SeriesType | 'all';
  onSelectSeries?: (series: SeriesType | 'all') => void;
  searchQuery: string;
  onSelectCircuit: (race: Race) => void;
  onViewRaceResult?: (race: Race) => void;
  timezone: string;
}

export const RaceCalendar: React.FC<RaceCalendarProps> = ({
  races,
  selectedSeries,
  onSelectSeries,
  searchQuery,
  onSelectCircuit,
  onViewRaceResult,
  timezone
}) => {
  const [activeSeries, setActiveSeries] = useState<SeriesType | 'all'>(selectedSeries);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [expandedRaceId, setExpandedRaceId] = useState<string | null>(null);
  const [selectedResultRace, setSelectedResultRace] = useState<Race | null>(null);

  React.useEffect(() => {
    setActiveSeries(selectedSeries);
  }, [selectedSeries]);

  const handleSeriesChange = (series: SeriesType | 'all') => {
    setActiveSeries(series);
    if (onSelectSeries) {
      onSelectSeries(series);
    }
  };

  const f1Count = races.filter((r) => r.series === 'f1').length;
  const motogpCount = races.filter((r) => r.series === 'motogp').length;

  const filteredRaces = races.filter((race) => {
    const matchesSeries = activeSeries === 'all' || race.series === activeSeries;
    const matchesStatus = filterStatus === 'all' || race.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.circuit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeries && matchesStatus && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedRaceId(expandedRaceId === id ? null : id);
  };

  return (
    <div className="space-y-5 font-tech">
      {/* Top Filter and Controls Bar */}
      <div className="paddock-panel p-4 rounded flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-[#232838]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase text-white bg-sky-600 rounded">
              OFFICIAL 2026 CALENDAR
            </span>
            <span className="text-xs font-mono text-slate-400">WAKTU {timezone}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-racing font-black text-white uppercase tracking-tight mt-1">
            KALENDER BALAPAN RESMI & JADWAL SESI
          </h2>
        </div>

        {/* Dual Filter Group: Series Selector & Status Selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto font-racing font-bold text-xs">
          {/* Series Filter */}
          <div className="flex items-center bg-[#0a0c10] p-0.5 rounded border border-[#232838]">
            <button
              onClick={() => handleSeriesChange('all')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeSeries === 'all'
                  ? 'bg-[#232838] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEMUA ({races.length})
            </button>
            <button
              onClick={() => handleSeriesChange('f1')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeSeries === 'f1'
                  ? 'bg-[#e10600] text-white shadow-xs'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              F1 ({f1Count})
            </button>
            <button
              onClick={() => handleSeriesChange('motogp')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                activeSeries === 'motogp'
                  ? 'bg-[#0070c0] text-white shadow-xs'
                  : 'text-slate-400 hover:text-sky-400'
              }`}
            >
              MOTOGP ({motogpCount})
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-[#0a0c10] p-0.5 rounded border border-[#232838]">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                filterStatus === 'all'
                  ? 'bg-[#232838] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEMUA
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                filterStatus === 'upcoming'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AKAN DATANG
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded transition-all uppercase ${
                filterStatus === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SELESAI
            </button>
          </div>
        </div>
      </div>

      {/* Race List Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredRaces.length === 0 ? (
          <div className="text-center py-12 paddock-panel rounded border border-[#232838]">
            <p className="text-slate-400 text-sm font-mono">TIDAK ADA BALAPAN YANG SESUAI DENGAN PENCARIAN.</p>
          </div>
        ) : (
          filteredRaces.map((race) => {
            const isF1 = race.series === 'f1';
            const isExpanded = expandedRaceId === race.id;

            return (
              <div
                key={race.id}
                className="paddock-panel-interactive rounded overflow-hidden border border-[#1f232f]"
              >
                {/* Main Card Header */}
                <div className="p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3.5">
                    {/* Series Badge & Round */}
                    <div className="flex flex-col items-center justify-center min-w-[54px] p-2 rounded bg-[#0a0c10] border border-[#1e2330] text-center font-racing">
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                          isF1 ? 'bg-[#e10600] text-white' : 'bg-[#0070c0] text-white'
                        }`}
                      >
                        {isF1 ? 'F1' : 'MOTOGP'}
                      </span>
                      <span className="text-sm font-black text-white mt-0.5 leading-none">
                        R{String(race.round).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Race Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <CountryFlag country={race.countryCode || race.country} className="w-4 h-3 rounded-xs shrink-0 shadow-xs" />
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">{race.country}</span>
                        {race.isSprintWeekend && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-400 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-600/30 uppercase">
                            <Flame className="w-2.5 h-2.5" />
                            SPRINT
                          </span>
                        )}
                        {race.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-500/30 uppercase">
                            <CheckCircle className="w-2.5 h-2.5" />
                            SELESAI
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-sky-400 bg-sky-950/50 px-1.5 py-0.2 rounded border border-sky-500/30 uppercase">
                            <Clock className="w-2.5 h-2.5" />
                            UPCOMING
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-racing font-black text-white mt-1 uppercase tracking-tight hover:text-amber-400 transition-colors">
                        {race.name}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-tech">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span>{race.circuit}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right side: Result snippet & Action buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between w-full md:w-auto gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-[#1c202c]">
                    {race.result ? (
                      <div className="text-left md:text-right font-mono">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                          <Trophy className="w-3.5 h-3.5 shrink-0" />
                          <span>P1: {race.result.winner}</span>
                        </div>
                        {race.result.p2 && race.result.p3 && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Podium: {race.result.p2} & {race.result.p3}
                          </span>
                        )}
                      </div>
                    ) : race.sprintResult ? (
                      <div className="text-left md:text-right font-mono">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Sprint: {race.sprintResult.winner}</span>
                        </div>
                        {race.sprintResult.p2 && race.sprintResult.p3 && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Podium: {race.sprintResult.p2} & {race.sprintResult.p3}
                          </span>
                        )}
                      </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto font-racing font-bold text-xs uppercase tracking-wider">
                      {Boolean(
                        (race.fullResults && race.fullResults.length > 0) ||
                        (race.sprintFullResults && race.sprintFullResults.length > 0) ||
                        race.result ||
                        race.sprintResult
                      ) && (
                        <button
                          onClick={() => {
                            if (onViewRaceResult) onViewRaceResult(race);
                            setSelectedResultRace(race);
                          }}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs cursor-pointer active:scale-95"
                          title="Lihat Urutan Klasifikasi Hasil Balapan Lengkap"
                        >
                          <Trophy className="w-3 h-3 text-amber-300 shrink-0" />
                          <span>HASIL RACE</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectCircuit(race)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded bg-[#161a24] text-slate-300 hover:bg-[#202534] hover:text-white transition-all border border-[#232838] active:scale-95"
                        title="Info Sirkuit"
                      >
                        <Info className="w-3 h-3 shrink-0" />
                        <span>INFO TRACK</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(race.id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded bg-[#161a24] text-slate-200 hover:bg-[#202534] transition-all border border-[#232838] active:scale-95"
                      >
                        <span>{isExpanded ? 'TUTUP SESI' : 'DETAIL SESI'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Session Schedule Breakdown */}
                {isExpanded && (
                  <div className="border-t border-[#1c202d] bg-[#0a0c10] p-4">
                    <div className="flex items-center justify-between mb-3 font-mono text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-400">
                        JADWAL RESMI SESI AKHIR PEKAN ({timezone})
                      </span>
                      <span className="text-slate-500">
                        {race.circuitLengthKm} KM • {race.laps} LAPS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono">
                      {race.sessions.map((session, index) => (
                        <div
                          key={index}
                          className="bg-[#10131b] border border-[#1d2230] rounded p-2.5 hover:border-slate-600 transition-all"
                        >
                          <span className="text-xs font-bold text-slate-200 block truncate uppercase">
                            {session.name}
                          </span>
                          <span className="text-sm font-racing font-black text-amber-400 block mt-0.5">
                            {session.wibTime}
                          </span>
                          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                            <span>{session.date}</span>
                            <span className="text-[10px] text-slate-600">{session.utcTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Race Results Modal */}
      {selectedResultRace && (
        <RaceResultModal
          race={selectedResultRace}
          onClose={() => setSelectedResultRace(null)}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Calendar, Clock, Trophy, MapPin, ChevronDown, ChevronUp, CheckCircle, Flame, Info } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            Kalender Balapan Resmi & Jadwal Sesi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Jadwal sesi latihan, kualifikasi, sprint, dan balapan utama disesuaikan ke waktu <strong>{timezone}</strong>.
          </p>
        </div>

        {/* Dual Filter Group: Series Selector & Status Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* 1. Series Filter (F1 vs MotoGP vs Semua) */}
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
                {races.length}
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
                {f1Count}
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
                {motogpCount}
              </span>
            </button>
          </div>

          {/* 2. Status Filter (Akan Datang vs Selesai) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold shadow-inner">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Status
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'upcoming'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Akan Datang
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>

      {/* Race List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRaces.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Tidak ada balapan yang sesuai dengan filter pencarian.</p>
          </div>
        ) : (
          filteredRaces.map((race) => {
            const isF1 = race.series === 'f1';
            const isExpanded = expandedRaceId === race.id;

            return (
              <div
                key={race.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all shadow-md"
              >
                {/* Main Card Header */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Series Badge & Round */}
                    <div className="flex flex-col items-center justify-center min-w-[58px] p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span
                        className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isF1
                            ? 'bg-red-600 text-white'
                            : 'bg-orange-600 text-white'
                        }`}
                      >
                        {isF1 ? 'F1' : 'MotoGP'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300 mt-1">
                        R{race.round}
                      </span>
                    </div>

                    {/* Race Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <CountryFlag country={race.countryCode || race.country} className="w-5 h-3.5 rounded-xs" />
                        <span className="text-xs font-bold text-slate-400">{race.country}</span>
                        {race.isSprintWeekend && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Flame className="w-2.5 h-2.5" />
                            Sprint
                          </span>
                        )}
                        {race.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                            <Clock className="w-2.5 h-2.5" />
                            Akan Datang
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mt-1 hover:text-red-400 transition-colors">
                        {race.name}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{race.circuit}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right side: Result snippet & Action buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    {race.result ? (
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                          <Trophy className="w-3.5 h-3.5 shrink-0" />
                          <span>Juara: {race.result.winner}</span>
                        </div>
                        {race.result.p2 && race.result.p3 && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Podium: {race.result.p2} & {race.result.p3}
                          </span>
                        )}
                      </div>
                    ) : race.sprintResult ? (
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Sprint: {race.sprintResult.winner}</span>
                        </div>
                        {race.sprintResult.p2 && race.sprintResult.p3 && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Podium: {race.sprintResult.p2} & {race.sprintResult.p3}
                          </span>
                        )}
                      </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                      {/* Lihat Hasil button (for completed races or races with results) */}
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
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 border border-emerald-500/40 cursor-pointer active:scale-95"
                          title="Lihat Urutan Klasifikasi Hasil Balapan Lengkap"
                        >
                          <Trophy className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span>Lihat Hasil</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectCircuit(race)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 hover:text-white transition-all border border-slate-700/60 active:scale-95"
                        title="Info Sirkuit"
                      >
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span>Info Track</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(race.id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 sm:py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700/60 active:scale-95"
                      >
                        <span>{isExpanded ? 'Tutup Sesi' : 'Detail Sesi'}</span>
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
                  <div className="border-t border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Jadwal Lengkap Sesi Balap ({timezone})
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {race.circuitLengthKm} km • {race.laps} Laps
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {race.sessions.map((session, index) => (
                        <div
                          key={index}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-all"
                        >
                          <span className="text-xs font-bold text-slate-300 block truncate">
                            {session.name}
                          </span>
                          <span className="text-sm font-mono font-black text-amber-400 block mt-1">
                            {session.wibTime}
                          </span>
                          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                            <span>{session.date}</span>
                            <span className="font-mono text-[10px] text-slate-600">{session.utcTime}</span>
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

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Flame, CheckCircle, ChevronRight, Zap, Timer } from 'lucide-react';
import { Race, SeriesType, SessionSchedule } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';

interface HeroCountdownProps {
  f1NextRace: Race;
  motogpNextRace: Race;
  selectedSeries: SeriesType | 'all';
  onViewSchedule: () => void;
  timezone: string;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  f1NextRace,
  motogpNextRace,
  selectedSeries,
  onViewSchedule,
  timezone
}) => {
  const [activeRaceSeries, setActiveRaceSeries] = useState<SeriesType>(
    selectedSeries === 'motogp' ? 'motogp' : 'motogp'
  );

  useEffect(() => {
    if (selectedSeries !== 'all') {
      setActiveRaceSeries(selectedSeries);
    }
  }, [selectedSeries]);

  const activeRace = activeRaceSeries === 'f1' ? f1NextRace : motogpNextRace;

  const defaultSessionIndex = Math.max(
    0,
    activeRace.sessions.findIndex((s) => s.status === 'upcoming' || s.code === 'RACE')
  );

  const [selectedSessionIdx, setSelectedSessionIdx] = useState<number>(defaultSessionIndex);

  useEffect(() => {
    const nextIdx = activeRace.sessions.findIndex((s) => s.status === 'upcoming' || s.code === 'RACE');
    setSelectedSessionIdx(nextIdx >= 0 ? nextIdx : activeRace.sessions.length - 1);
  }, [activeRace]);

  const targetSession: SessionSchedule = activeRace.sessions[selectedSessionIdx] || activeRace.sessions[activeRace.sessions.length - 1];

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const targetTimeStr = targetSession.targetTimeISO || activeRace.raceDate;
      const targetDate = new Date(targetTimeStr).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetSession, activeRace]);

  const isF1 = activeRace.series === 'f1';

  return (
    <div className="relative paddock-panel rounded-xl overflow-hidden border border-[#232838] transition-all">
      {/* Main Container */}
      <div className="relative p-4 sm:p-6 z-10">
        {/* Paddock Telemetry Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#1c212e]">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 bg-[#141822] text-slate-200 px-2.5 py-1 rounded-md border border-[#262c3e] font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Status Lintasan: Green Flag
            </span>

            <span className="text-slate-600 hidden sm:inline">•</span>

            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-600/30 text-xs">
              <Zap className="w-3.5 h-3.5" />
              {isF1 ? 'Format F1 Sprint Weekend' : 'Format MotoGP Sprint Weekend'}
            </span>
          </div>

          {/* Series Switcher Toggle */}
          {selectedSeries === 'all' && (
            <div className="flex items-center bg-[#0a0c10] rounded-lg p-0.5 border border-[#232838] text-xs font-semibold">
              <button
                onClick={() => setActiveRaceSeries('motogp')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeRaceSeries === 'motogp'
                    ? 'bg-[#0070c0] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MotoGP
              </button>
              <button
                onClick={() => setActiveRaceSeries('f1')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeRaceSeries === 'f1'
                    ? 'bg-[#e10600] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Formula 1
              </button>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center mt-5">
          {/* Left Column: Race Name, Circuit, & Blueprint Specs */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CountryFlag country={activeRace.countryCode || activeRace.country} className="w-6 h-4 rounded-xs shrink-0 shadow-xs" />
              <span className="text-xs font-semibold text-slate-400">
                Putaran ke-{activeRace.round} • {activeRace.country}
              </span>
              <span className="text-[11px] font-bold bg-[#e10600] text-white px-2 py-0.5 rounded-md">
                Race Utama Hari Ini
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {activeRace.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{activeRace.circuit}, {activeRace.city}</span>
            </p>

            {/* Circuit Technical Specs */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-[#0b0d13] border border-[#1e2330] p-2.5 rounded-lg">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Panjang Sirkuit</span>
                <span className="text-base sm:text-lg font-bold text-white font-mono">{activeRace.circuitLengthKm} <span className="text-xs font-normal text-slate-400">km</span></span>
              </div>
              <div className="bg-[#0b0d13] border border-[#1e2330] p-2.5 rounded-lg">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Total Lap</span>
                <span className="text-base sm:text-lg font-bold text-white font-mono">{activeRace.laps} <span className="text-xs font-normal text-slate-400">lap</span></span>
              </div>
              <div className="bg-[#0b0d13] border border-[#1e2330] p-2.5 rounded-lg">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Hasil Sprint</span>
                <span className="text-sm sm:text-base font-bold text-amber-400 truncate block">
                  {activeRace.sprintResult ? activeRace.sprintResult.winner : 'Selesai'}
                </span>
              </div>
            </div>

            {/* Session Selector (FP1, Q1, Q2, Sprint, Race) */}
            <div className="mt-4 pt-3.5 border-t border-[#1a1f2b]">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  Pilih sesi untuk countdown ({timezone}):
                </span>
                <span className="text-slate-400">
                  Sesi: <strong className="text-amber-400 font-bold">{targetSession.name}</strong>
                </span>
              </div>

              {/* Session pills bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
                {activeRace.sessions.map((session, idx) => {
                  const isSelected = selectedSessionIdx === idx;
                  const isDone = session.status === 'completed';
                  const isMainRace = session.code === 'RACE';

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSessionIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg shrink-0 transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#e10600] text-white border-red-500 shadow-md shadow-red-950/60 font-bold'
                          : isDone
                          ? 'bg-[#0b0d12] text-slate-400 border-[#1c202d] hover:border-slate-600'
                          : isMainRace
                          ? 'bg-[#220d0d] text-red-300 border-red-800/80 hover:bg-red-900/40 font-semibold'
                          : 'bg-[#12151d] text-slate-300 border-[#232838] hover:text-white'
                      }`}
                    >
                      {isDone && <CheckCircle className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />}
                      {isMainRace && <Flame className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-red-400 animate-pulse'}`} />}
                      <span>{session.code || session.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Session Callout Strip */}
              <div className="mt-2.5 p-2.5 bg-[#0b0d12] border border-[#1c202d] rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{targetSession.name}</span>
                  <span className="text-[11px] text-slate-400">
                    Jadwal: {targetSession.date} • {targetSession.wibTime}
                  </span>
                </div>
                {targetSession.winnerOrPole ? (
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    Pemenang: {targetSession.winnerOrPole}
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    Mulai Hari Ini
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Timing Board Countdown Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full bg-[#0a0c10] border border-[#232838] rounded-xl p-4 sm:p-5 relative">
              {/* Header: Countdown Title */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c202c]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-xs font-bold text-slate-300">
                    Hitung Mundur Sesi
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                  WIB (UTC+7)
                </span>
              </div>

              {/* Session Name Title */}
              <div className="text-center mb-3">
                <span className="text-lg sm:text-xl font-bold text-amber-400 block">
                  {targetSession.name}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Waktu Mulai: <strong className="text-white font-semibold">{targetSession.wibTime}</strong>
                </span>
              </div>

              {/* 4 Precision Digital Timing Digit Boxes */}
              <div className="grid grid-cols-4 gap-2 my-3">
                <div className="timing-box p-2.5 text-center rounded-lg border border-[#232838]">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block leading-none font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mt-1.5">Hari</span>
                </div>
                <div className="timing-box p-2.5 text-center rounded-lg border border-[#232838]">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block leading-none font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mt-1.5">Jam</span>
                </div>
                <div className="timing-box p-2.5 text-center rounded-lg border border-[#232838]">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block leading-none font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mt-1.5">Menit</span>
                </div>
                <div className="timing-box p-2.5 text-center rounded-lg border border-[#232838]">
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-500 block leading-none font-mono animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mt-1.5">Detik</span>
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-3 py-2 px-3 bg-[#11131a] rounded-lg border border-[#1f2432] text-center text-xs">
                {timeLeft.isPast ? (
                  <span className="text-emerald-400 font-bold">✓ Sesi ini telah selesai diselenggarakan</span>
                ) : (
                  <span className="text-slate-300">
                    Jadwal Resmi: <strong className="text-white font-semibold">{targetSession.date} • {targetSession.wibTime}</strong>
                  </span>
                )}
              </div>

              {/* View Full Weekend Button */}
              <button
                onClick={onViewSchedule}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold bg-[#e10600] hover:bg-[#b80500] text-white transition-all shadow-md shadow-red-950/60 active:scale-98"
              >
                <span>Lihat Seluruh Jadwal Akhir Pekan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

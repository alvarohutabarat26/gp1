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
    selectedSeries === 'motogp' ? 'motogp' : 'motogp' // Default to MotoGP or user preference
  );

  useEffect(() => {
    if (selectedSeries !== 'all') {
      setActiveRaceSeries(selectedSeries);
    }
  }, [selectedSeries]);

  const activeRace = activeRaceSeries === 'f1' ? f1NextRace : motogpNextRace;

  // Selected session for countdown: default to the upcoming session (e.g. Main Race)
  const defaultSessionIndex = Math.max(
    0,
    activeRace.sessions.findIndex((s) => s.status === 'upcoming' || s.code === 'RACE')
  );

  const [selectedSessionIdx, setSelectedSessionIdx] = useState<number>(defaultSessionIndex);

  // Keep selected session in sync when race changes
  useEffect(() => {
    const nextIdx = activeRace.sessions.findIndex((s) => s.status === 'upcoming' || s.code === 'RACE');
    setSelectedSessionIdx(nextIdx >= 0 ? nextIdx : activeRace.sessions.length - 1);
  }, [activeRace]);

  const targetSession: SessionSchedule = activeRace.sessions[selectedSessionIdx] || activeRace.sessions[activeRace.sessions.length - 1];

  // Dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      // Use targetTimeISO if present, otherwise fallback to raceDate
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
      {/* Background Glows */}
      <div 
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors ${
          isF1 ? 'bg-red-600' : 'bg-orange-500'
        }`}
      />
      <div 
        className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors ${
          isF1 ? 'bg-amber-500' : 'bg-sky-500'
        }`}
      />

      <div className="relative p-4 sm:p-8 lg:p-10 z-10">
        {/* Header bar: Live Spotlight Status & Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isF1 ? 'bg-red-400' : 'bg-orange-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isF1 ? 'bg-red-500' : 'bg-orange-500'}`}></span>
            </span>
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-wider sm:tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 animate-pulse" />
              <span className="hidden sm:inline">RACE WEEKEND LIVE SPOTLIGHT (11 OKTOBER 2026)</span>
              <span className="sm:hidden">LIVE SPOTLIGHT 2026</span>
            </span>

            {/* Sprint format pill */}
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-500/30">
              <Zap className="w-3 h-3 text-amber-400" />
              {isF1 ? 'F1 Sprint Weekend' : 'MotoGP Sprint Format'}
            </span>
          </div>

          {/* Series Switcher */}
          {selectedSeries === 'all' && (
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveRaceSeries('motogp')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all ${
                  activeRaceSeries === 'motogp'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏍️ MotoGP
              </button>
              <button
                onClick={() => setActiveRaceSeries('f1')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all ${
                  activeRaceSeries === 'f1'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏎️ F1
              </button>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center mt-5 sm:mt-6">
          {/* Left Column: Race Name, Circuit, & Badges */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <CountryFlag country={activeRace.countryCode || activeRace.country} className="w-7 h-5 sm:w-8 sm:h-5.5 rounded-xs shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-400">
                Round {activeRace.round} • {activeRace.country}
              </span>
              <span className="text-[10px] sm:text-xs bg-red-600 text-white font-mono font-black px-2 py-0.5 rounded-full animate-pulse">
                HARI INI MAIN RACE
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {activeRace.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{activeRace.circuit}, {activeRace.city}</span>
            </p>

            {/* Quick Circuit Specs */}
            <div className="grid grid-cols-3 gap-2 pt-1 sm:pt-2">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 sm:px-3.5 sm:py-2 text-center sm:text-left">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider block font-bold truncate">Panjang Lintasan</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-slate-200">{activeRace.circuitLengthKm} km</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 sm:px-3.5 sm:py-2 text-center sm:text-left">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider block font-bold truncate">Jumlah Lap</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-slate-200">{activeRace.laps} Laps</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 sm:px-3.5 sm:py-2 text-center sm:text-left">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider block font-bold truncate">Sprint Kemarin</span>
                <span className="text-xs sm:text-sm font-bold text-amber-400 truncate block">
                  {activeRace.sprintResult ? activeRace.sprintResult.winner : 'Selesai'}
                </span>
              </div>
            </div>

            {/* SESSIONS ACCORDION / SELECTOR (User requested: FP1, Practice, FP2, Q1, Q2, Sprint, Main Race countdown!) */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  Pilih Sesi untuk Countdown ({timezone}):
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Sesi terpilih: <strong className="text-amber-400">{targetSession.name}</strong>
                </span>
              </div>

              {/* Session pills bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {activeRace.sessions.map((session, idx) => {
                  const isSelected = selectedSessionIdx === idx;
                  const isDone = session.status === 'completed';
                  const isMainRace = session.code === 'RACE';

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSessionIdx(idx)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                          : isDone
                          ? 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
                          : isMainRace
                          ? 'bg-red-600/30 text-red-200 border-red-500/50 hover:bg-red-600/40'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                      }`}
                    >
                      {isDone && <CheckCircle className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />}
                      {isMainRace && <Flame className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-orange-400 animate-pulse'}`} />}
                      <span>{session.code || session.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected session details callout */}
              <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-200 block">{targetSession.name}</span>
                  <span className="text-[11px] text-slate-400">
                    Jadwal: {targetSession.date} • {targetSession.wibTime}
                  </span>
                </div>
                {targetSession.winnerOrPole ? (
                  <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    Pemenang: {targetSession.winnerOrPole}
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                    SIAP DIMULAI HARI INI
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Countdown Timer to Selected Session */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 text-center shadow-xl relative overflow-hidden">
              {/* Prominent, Large Session Countdown Title */}
              <div className="flex flex-col items-center justify-center gap-1.5 mb-3 sm:mb-4 bg-slate-950/90 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl border border-slate-800 shadow-inner">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 font-mono">
                    HITUNG MUNDUR SESI
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black tracking-tight text-amber-400 font-sans uppercase text-center leading-tight">
                  {targetSession.name}
                </h3>
              </div>

              {/* 4 Countdown Digits */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 my-2 sm:my-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 sm:p-3">
                  <span className="text-xl sm:text-3xl font-black font-mono text-white block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Hari</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 sm:p-3">
                  <span className="text-xl sm:text-3xl font-black font-mono text-white block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Jam</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 sm:p-3">
                  <span className="text-xl sm:text-3xl font-black font-mono text-amber-400 block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Menit</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 sm:p-3">
                  <span className="text-xl sm:text-3xl font-black font-mono text-red-500 block animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Detik</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-950/90 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-200 font-semibold flex items-center justify-center gap-2">
                  {timeLeft.isPast ? (
                    <span className="text-emerald-400 font-bold">✓ Sesi ini telah selesai diselenggarakan!</span>
                  ) : (
                    <span>
                      Start Sesi: <strong className="text-amber-400 font-black text-base">{targetSession.wibTime}</strong>
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={onViewSchedule}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white hover:brightness-110 transition-all shadow-lg shadow-red-500/20 group"
              >
                <span>Lihat Seluruh Sesi Akhir Pekan Ini</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

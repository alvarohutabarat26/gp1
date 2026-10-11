import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Flame, CheckCircle, ChevronRight, Zap, Timer, Radio, Gauge } from 'lucide-react';
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
    <div className="relative paddock-panel overflow-hidden border border-[#232838] transition-all">
      {/* Top Track Kerb Line Accent */}
      <div className={`h-1.5 w-full ${isF1 ? 'kerb-red-white' : 'kerb-blue-white'}`} />

      {/* Main Container */}
      <div className="relative p-4 sm:p-7 z-10">
        {/* Paddock Telemetry Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1c212e]">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 bg-[#141822] text-white px-2.5 py-0.5 rounded border border-[#262c3e] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              TRACK STATUS: GREEN FLAG
            </span>

            <span className="text-slate-500 hidden sm:inline">|</span>

            <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/30">
              <Zap className="w-3 h-3" />
              {isF1 ? 'F1 SPRINT FORMAT' : 'MOTOGP SPRINT WEEKEND'}
            </span>
          </div>

          {/* Series Switcher Toggle */}
          {selectedSeries === 'all' && (
            <div className="flex items-center bg-[#0a0c10] rounded p-0.5 border border-[#232838] font-racing text-xs font-bold">
              <button
                onClick={() => setActiveRaceSeries('motogp')}
                className={`px-3 py-1 rounded transition-all uppercase ${
                  activeRaceSeries === 'motogp'
                    ? 'bg-[#0070c0] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MOTOGP
              </button>
              <button
                onClick={() => setActiveRaceSeries('f1')}
                className={`px-3 py-1 rounded transition-all uppercase ${
                  activeRaceSeries === 'f1'
                    ? 'bg-[#e10600] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FORMULA 1
              </button>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center mt-5">
          {/* Left Column: Race Name, Circuit, & Blueprint Specs */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <CountryFlag country={activeRace.countryCode || activeRace.country} className="w-7 h-4.5 rounded-xs shrink-0 shadow-xs" />
              <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                ROUND {String(activeRace.round).padStart(2, '0')} • {activeRace.country}
              </span>
              <span className="text-[10px] font-mono font-black bg-[#e10600] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                MAIN EVENT
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-racing font-black italic text-white tracking-tight leading-none uppercase">
              {activeRace.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 font-tech">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{activeRace.circuit}, {activeRace.city}</span>
            </p>

            {/* Technical Circuit Blueprint Strip */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-[#0b0d13] border border-[#1e2330] p-2.5 rounded">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">PANJANG LINTASAN</span>
                <span className="text-base sm:text-lg font-racing font-black text-white">{activeRace.circuitLengthKm} <span className="text-xs font-mono font-normal text-slate-400">KM</span></span>
              </div>
              <div className="bg-[#0b0d13] border border-[#1e2330] p-2.5 rounded">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">TOTAL LAP</span>
                <span className="text-base sm:text-lg font-racing font-black text-white">{activeRace.laps} <span className="text-xs font-mono font-normal text-slate-400">LAPS</span></span>
              </div>
              <div className="bg-[#0b0d13] border border-[#1e2330] p-2.5 rounded">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">HASIL SPRINT</span>
                <span className="text-sm sm:text-base font-racing font-black text-amber-400 truncate block">
                  {activeRace.sprintResult ? activeRace.sprintResult.winner : 'COMPLETED'}
                </span>
              </div>
            </div>

            {/* Session Selector (FP1, Q1, Q2, Sprint, Race) */}
            <div className="mt-4 pt-3 border-t border-[#1a1f2b]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  PILIH SESI COUNTDOWN ({timezone}):
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Sesi: <strong className="text-amber-400">{targetSession.name}</strong>
                </span>
              </div>

              {/* Session pills bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-racing text-xs font-bold tracking-wider uppercase">
                {activeRace.sessions.map((session, idx) => {
                  const isSelected = selectedSessionIdx === idx;
                  const isDone = session.status === 'completed';
                  const isMainRace = session.code === 'RACE';

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSessionIdx(idx)}
                      className={`px-3 py-1.5 rounded shrink-0 transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#e10600] text-white border-red-500 shadow-md shadow-red-950/60'
                          : isDone
                          ? 'bg-[#0b0d12] text-slate-400 border-[#1c202d] hover:border-slate-600'
                          : isMainRace
                          ? 'bg-[#220d0d] text-red-300 border-red-800/80 hover:bg-red-900/40'
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
              <div className="mt-2.5 p-2.5 bg-[#0b0d12] border border-[#1c202d] rounded flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-white block uppercase tracking-wide">{targetSession.name}</span>
                  <span className="text-[11px] text-slate-400">
                    Jadwal: {targetSession.date} • {targetSession.wibTime}
                  </span>
                </div>
                {targetSession.winnerOrPole ? (
                  <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    P1: {targetSession.winnerOrPole}
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    LIVE RACE DAY
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Timing Board Countdown Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full bg-[#0a0c10] border border-[#232838] rounded p-4 sm:p-5 relative">
              {/* Header: Digital Timing Board Title */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c202c]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    OFFICIAL TIMING COUNTDOWN
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.2 rounded border border-emerald-500/20">
                  LIVE WIB
                </span>
              </div>

              {/* Session Name Title */}
              <div className="text-center mb-3">
                <span className="text-lg sm:text-2xl font-racing font-black text-amber-400 uppercase tracking-tight block">
                  {targetSession.name}
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  WAKTU MULAI: <strong className="text-white">{targetSession.wibTime}</strong>
                </span>
              </div>

              {/* 4 Precision Digital Timing Digit Boxes */}
              <div className="grid grid-cols-4 gap-2 my-3 font-mono">
                <div className="timing-box p-2 text-center rounded border border-[#232838]">
                  <span className="text-2xl sm:text-4xl font-racing font-black text-white block leading-none">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mt-1">HARI</span>
                </div>
                <div className="timing-box p-2 text-center rounded border border-[#232838]">
                  <span className="text-2xl sm:text-4xl font-racing font-black text-white block leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mt-1">JAM</span>
                </div>
                <div className="timing-box p-2 text-center rounded border border-[#232838]">
                  <span className="text-2xl sm:text-4xl font-racing font-black text-amber-400 block leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mt-1">MENIT</span>
                </div>
                <div className="timing-box p-2 text-center rounded border border-[#232838]">
                  <span className="text-2xl sm:text-4xl font-racing font-black text-red-500 block leading-none animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mt-1">DETIK</span>
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-3 py-2 px-3 bg-[#11131a] rounded border border-[#1f2432] text-center font-mono text-xs">
                {timeLeft.isPast ? (
                  <span className="text-emerald-400 font-bold">✓ SESI SELESAI DISELENGGARAKAN</span>
                ) : (
                  <span className="text-slate-300">
                    Jadwal Resmi: <strong className="text-white">{targetSession.date} • {targetSession.wibTime}</strong>
                  </span>
                )}
              </div>

              {/* View Full Weekend Button */}
              <button
                onClick={onViewSchedule}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded font-racing text-sm font-bold tracking-wider uppercase bg-[#e10600] hover:bg-[#b80500] text-white transition-all shadow-md shadow-red-950/60 active:scale-98"
              >
                <span>LIHAT SELURUH JADWAL AKHIR PEKAN</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

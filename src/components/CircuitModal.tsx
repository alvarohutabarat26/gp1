import React from 'react';
import { X, MapPin } from 'lucide-react';
import { Race } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';

interface CircuitModalProps {
  race: Race | null;
  onClose: () => void;
  timezone: string;
}

export const CircuitModal: React.FC<CircuitModalProps> = ({ race, onClose, timezone }) => {
  React.useEffect(() => {
    if (!race) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [race]);

  if (!race) return null;

  const totalDistance = (race.circuitLengthKm * race.laps).toFixed(2);
  const isF1 = race.series === 'f1';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-8 overflow-y-auto">
          <div className="flex items-center gap-3">
            <CountryFlag country={race.countryCode || race.country} className="w-8 h-5 rounded-xs" />
            <div>
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Round {race.round} • {isF1 ? 'Formula 1 Grand Prix' : 'MotoGP Grand Prix'}
              </span>
              <h2 className="text-2xl font-black text-white">{race.circuit}</h2>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{race.city}, {race.country}</span>
          </p>

          {/* Circuit Stats Grid */}
          <div className="grid grid-cols-3 gap-3 my-5 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Panjang Lintasan</span>
              <span className="text-base font-black font-mono text-white">{race.circuitLengthKm} km</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Jumlah Lap</span>
              <span className="text-base font-black font-mono text-white">{race.laps} Laps</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Jarak Tempuh</span>
              <span className="text-base font-black font-mono text-amber-400">{totalDistance} km</span>
            </div>
          </div>

          {/* Session breakdown list */}
          <div>
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block mb-2">
              Rangkaian Waktu Sesi Balap ({timezone}):
            </span>
            <div className="space-y-2">
              {race.sessions.map((session, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-slate-200">{session.name}</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400 block">{session.wibTime}</span>
                    <span className="text-[10px] text-slate-500">{session.date} ({session.utcTime})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl font-bold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

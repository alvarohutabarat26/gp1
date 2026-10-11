import React from 'react';
import { X, Trophy, Star, Car, Bike } from 'lucide-react';
import { Driver } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';
import { DriverAvatar } from './DriverAvatar';

interface DriverModalProps {
  driver: Driver | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  driver,
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  React.useEffect(() => {
    if (!driver) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [driver]);

  if (!driver) return null;

  const isF1 = driver.series === 'f1';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top team color banner */}
        <div
          className="h-2.5 sm:h-3 w-full shrink-0"
          style={{ backgroundColor: driver.teamColor }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-8 overflow-y-auto">
          {/* Driver Header */}
          <div className="flex items-center gap-3 sm:gap-5">
            <DriverAvatar
              driver={driver}
              size="lg"
              className="shadow-2xl ring-2 sm:ring-4 ring-slate-800 sm:w-24 sm:h-24"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <CountryFlag country={driver.countryCode || driver.nationality} className="w-5 h-3.5 rounded-xs shrink-0" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                  {driver.nationality} • {isF1 ? 'F1 Driver' : 'MotoGP Rider'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1 truncate">
                {driver.name}
              </h2>

              <p
                className="text-xs sm:text-sm font-bold mt-0.5 truncate"
                style={{ color: driver.teamColor }}
              >
                {driver.team}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span
                className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tighter"
                style={{ color: driver.teamColor }}
              >
                #{driver.number}
              </span>
            </div>
          </div>

          {/* Bio text */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {driver.bio}
            </p>
          </div>

          {/* Machine & Specifications */}
          <div className="mt-4 flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300">
            {isF1 ? (
              <Car className="w-4 h-4 text-slate-400 shrink-0" />
            ) : (
              <Bike className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className="text-slate-400">Kendaraan:</span>
            <span className="font-mono font-bold text-slate-100">{driver.bikeOrCar}</span>
          </div>

          {/* Career Stats Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Poin Resmi</span>
              <span className="text-xl font-black font-mono text-amber-400">{driver.points}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Posisi</span>
              <span className="text-xl font-black font-mono text-white">P{driver.position}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Kemenangan</span>
              <span className="text-xl font-black font-mono text-white">{driver.wins}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Podium</span>
              <span className="text-xl font-black font-mono text-white">{driver.podiums}</span>
            </div>
          </div>

          {driver.worldChampionships > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{driver.worldChampionships} Gelar Juara Dunia Championship</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => onToggleFavorite(driver.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
                isFavorite
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-slate-950' : ''}`} />
              <span>{isFavorite ? 'Tersimpan di Favorit' : 'Jadikan Pembalap Favorit'}</span>
            </button>

            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-bold text-xs bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

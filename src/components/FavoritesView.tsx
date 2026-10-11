import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Driver, Race } from '../types/motorsport';
import { CountryFlag } from './CountryFlag';

interface FavoritesViewProps {
  favoriteIds: string[];
  allDrivers: Driver[];
  races: Race[];
  onToggleFavorite: (id: string) => void;
  onSelectDriver: (driver: Driver) => void;
  onGoToDrivers: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  allDrivers,
  onToggleFavorite,
  onSelectDriver,
  onGoToDrivers
}) => {
  const favoriteDrivers = allDrivers.filter((d) => favoriteIds.includes(d.id));
  const suggestions = allDrivers.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Grid Favorit Saya
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau khusus pembalap jagoanmu di satu layar tanpa terdistraksi.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          {favoriteDrivers.length} Pembalap Terpilih
        </span>
      </div>

      {favoriteDrivers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Belum Ada Pembalap Favorit</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Kamu bisa menandai pembalap favoritmu dengan menekan ikon bintang ⭐ di halaman Pembalap & Tim. Coba tambahkan jagoanmu sekarang:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => onToggleFavorite(s.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              >
                <CountryFlag country={s.countryCode || s.nationality} className="w-4 h-3 rounded-xs" />
                <span className="font-bold">{s.name}</span>
                <span className="text-[10px] text-amber-400 font-mono">#{s.number}</span>
                <Star className="w-3 h-3 text-slate-400 hover:text-amber-400" />
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={onGoToDrivers}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/20"
            >
              <span>Jelajahi Semua Pembalap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteDrivers.map((driver) => {
            const isF1 = driver.series === 'f1';

            return (
              <div
                key={driver.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: driver.teamColor }}
                />

                <div>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isF1
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}
                    >
                      {isF1 ? 'F1 Driver' : 'MotoGP Rider'}
                    </span>

                    <button
                      onClick={() => onToggleFavorite(driver.id)}
                      className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                      title="Hapus dari favorit"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between mt-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <CountryFlag country={driver.countryCode || driver.nationality} className="w-4 h-3 rounded-xs" />
                        <span>{driver.nationality}</span>
                      </div>
                      <h3 className="text-xl font-black text-white mt-0.5">{driver.name}</h3>
                      <p className="text-xs font-bold" style={{ color: driver.teamColor }}>
                        {driver.team}
                      </p>
                    </div>

                    <span
                      className="text-3xl font-black font-mono tracking-tighter"
                      style={{ color: driver.teamColor }}
                    >
                      #{driver.number}
                    </span>
                  </div>

                  {/* Real Stats summary */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Poin</span>
                      <span className="text-sm font-black font-mono text-amber-400">{driver.points}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Posisi</span>
                      <span className="text-sm font-black font-mono text-white">P{driver.position}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Menang</span>
                      <span className="text-sm font-black font-mono text-slate-200">{driver.wins}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono truncate max-w-[150px]">
                    {driver.bikeOrCar}
                  </span>
                  <button
                    onClick={() => onSelectDriver(driver)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Detail Profil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

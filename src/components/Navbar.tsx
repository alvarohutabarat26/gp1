import React from 'react';
import { Trophy, Calendar, Users, Newspaper, Star, Globe, Search, RefreshCw, Radio } from 'lucide-react';
import { SeriesType } from '../types/motorsport';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSeries: SeriesType | 'all';
  setSelectedSeries: (series: SeriesType | 'all') => void;
  favoritesCount: number;
  timezone: string;
  setTimezone: (tz: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  lastScrapedTime: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedSeries,
  setSelectedSeries,
  favoritesCount,
  timezone,
  setTimezone,
  searchQuery,
  setSearchQuery,
  onRefreshData,
  isRefreshing,
  lastScrapedTime
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md border-b border-[#1f2432] transition-all">
        {/* Top Paddock Status Line */}
        <div className="border-b border-[#181c26] bg-[#06070a] px-3 sm:px-4 py-1 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 font-mono text-[11px]">
              {/* Telemetry live status indicator */}
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 truncate">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">PADDOCK LIVE FEED • 2026 OFFICIAL</span>
                <span className="sm:hidden">LIVE 2026</span>
              </span>

              <span className="hidden md:inline text-slate-500">•</span>
              <span className="hidden md:inline text-slate-400">
                FIA F1 & FIM MotoGP Realtime API ({new Date(lastScrapedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Timezone Switcher */}
              <div className="flex items-center gap-1.5 bg-[#12151d] rounded px-2 py-0.5 border border-[#232838] text-[11px]">
                <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="bg-transparent text-slate-200 font-mono font-bold focus:outline-none cursor-pointer"
                >
                  <option value="WIB" className="bg-[#101218] text-white">WIB (UTC+7)</option>
                  <option value="WITA" className="bg-[#101218] text-white">WITA (UTC+8)</option>
                  <option value="WIT" className="bg-[#101218] text-white">WIT (UTC+9)</option>
                  <option value="UTC" className="bg-[#101218] text-white">UTC / GMT</option>
                </select>
              </div>

              {/* Sync Live Button */}
              <button
                onClick={onRefreshData}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 bg-[#171a23] hover:bg-[#202532] text-slate-300 hover:text-white px-2.5 py-0.5 rounded border border-[#272d3f] text-[11px] font-mono font-semibold transition-all shrink-0 active:scale-95"
                title="Perbarui data 2026 langsung dari server live"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'SYNCING...' : 'SYNC LIVE'}</span>
                <span className="sm:hidden">{isRefreshing ? 'SYNC...' : 'SYNC'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Paddock Header Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Brand Logo & Series Switcher */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3 sm:gap-5">
              <div 
                onClick={() => setActiveTab('overview')} 
                className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
              >
                <img
                  src="/gp1-logo-dark.png"
                  alt="GP1"
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(225,6,0,0.5)]"
                />
                <div className="border-l border-[#262b3a] pl-2.5">
                  <span className="block text-xs sm:text-sm font-racing font-black tracking-widest text-white uppercase leading-none">
                    PADDOCK HUB
                  </span>
                  <span className="block text-[9px] font-mono font-semibold tracking-wider text-red-500 uppercase leading-none mt-0.5">
                    WORLD CHAMPIONSHIP
                  </span>
                </div>
              </div>

              {/* Series Switcher */}
              <div className="flex items-center bg-[#0d0f14] p-0.5 rounded-lg border border-[#202533] shrink-0 text-xs font-semibold">
                <button
                  onClick={() => setSelectedSeries('all')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedSeries === 'all'
                      ? 'bg-[#222735] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedSeries('f1')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                    selectedSeries === 'f1'
                      ? 'bg-[#e10600] text-white shadow-md shadow-red-900/40'
                      : 'text-slate-400 hover:text-red-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>F1 2026</span>
                </button>
                <button
                  onClick={() => setSelectedSeries('motogp')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                    selectedSeries === 'motogp'
                      ? 'bg-[#0070c0] text-white shadow-md shadow-sky-900/40'
                      : 'text-slate-400 hover:text-sky-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>MotoGP</span>
                </button>
              </div>
            </div>

            {/* Precision Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari driver, tim balap, sirkuit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0f14] border border-[#202533] rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#e10600] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Racing Navigation Tabs */}
          <nav className="flex items-center gap-1 mt-2.5 pt-1.5 border-t border-[#181c26] overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-[#181c26] text-white font-bold border-b-2 border-[#e10600]'
                  : 'text-slate-400 hover:text-white hover:bg-[#10131a]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'calendar'
                  ? 'bg-[#181c26] text-white font-bold border-b-2 border-[#e10600]'
                  : 'text-slate-400 hover:text-white hover:bg-[#10131a]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              Jadwal Balap
            </button>

            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'drivers'
                  ? 'bg-[#181c26] text-white font-bold border-b-2 border-[#e10600]'
                  : 'text-slate-400 hover:text-white hover:bg-[#10131a]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Lineup 2026
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'standings'
                  ? 'bg-[#181c26] text-white font-bold border-b-2 border-[#e10600]'
                  : 'text-slate-400 hover:text-white hover:bg-[#10131a]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              Klasemen
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'news'
                  ? 'bg-[#181c26] text-white font-bold border-b-2 border-[#e10600]'
                  : 'text-slate-400 hover:text-white hover:bg-[#10131a]'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              Berita Paddock
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ml-auto ${
                activeTab === 'favorites'
                  ? 'bg-[#181c26] text-amber-300 font-bold border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-[#10131a]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 shrink-0 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span>Grid Favorit</span>
              {favoritesCount > 0 && (
                <span className="bg-amber-400 text-black font-black text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Tactile Mobile Bottom Navigation Bar (No AI slop, razor sharp) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0a0c10]/95 backdrop-blur-md border-t border-[#1f2432] px-1 py-1 font-racing">
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
              activeTab === 'overview'
                ? 'text-amber-400 font-bold bg-[#171b24]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('calendar');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
              activeTab === 'calendar'
                ? 'text-sky-400 font-bold bg-[#171b24]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Jadwal</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('drivers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
              activeTab === 'drivers'
                ? 'text-emerald-400 font-bold bg-[#171b24]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Lineup</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('standings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
              activeTab === 'standings'
                ? 'text-purple-400 font-bold bg-[#171b24]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Klasemen</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('news');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
              activeTab === 'news'
                ? 'text-rose-400 font-bold bg-[#171b24]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Berita</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('favorites');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
              activeTab === 'favorites'
                ? 'text-amber-300 font-bold bg-[#171b24]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Favorit</span>
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1.5 w-3.5 h-3.5 bg-amber-400 text-black font-black text-[9px] rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

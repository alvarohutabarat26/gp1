import React from 'react';
import { Trophy, Calendar, Users, Newspaper, Star, Globe, Search, RefreshCw, CheckCircle2 } from 'lucide-react';
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
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        {/* Top Banner: Verification badge & 2026 Season Info */}
        <div className="border-b border-slate-800/50 bg-slate-900/60 px-3 sm:px-4 py-1.5 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px] truncate">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Musim Resmi 2026 (Live FIA F1 & FIM MotoGP)</span>
                <span className="sm:hidden">Live F1 & MotoGP 2026</span>
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden md:inline text-slate-400 text-[11px]">
                Data Real-Time Scraping & Jolpica API ({new Date(lastScrapedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Timezone */}
              <div className="flex items-center gap-1 bg-slate-800/80 rounded-md px-1.5 sm:px-2 py-0.5 border border-slate-700/60">
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-[11px] sm:text-xs"
                >
                  <option value="WIB" className="bg-slate-900 text-slate-100">WIB (UTC+7)</option>
                  <option value="WITA" className="bg-slate-900 text-slate-100">WITA (UTC+8)</option>
                  <option value="WIT" className="bg-slate-900 text-slate-100">WIT (UTC+9)</option>
                  <option value="UTC" className="bg-slate-900 text-slate-100">UTC / GMT</option>
                </select>
              </div>

              {/* Live refresh button */}
              <button
                onClick={onRefreshData}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 sm:px-2.5 py-0.5 rounded-md border border-slate-700 text-[11px] font-medium transition-colors shrink-0"
                title="Perbarui data 2026 dari live API"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Live 2026'}</span>
                <span className="sm:hidden">{isRefreshing ? 'Sync...' : 'Sync'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Logo & Category Selector */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-4">
              <div 
                onClick={() => setActiveTab('overview')} 
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
              >
                <img
                  src="/gp1-logo-dark.png"
                  alt="GP1"
                  className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(238,28,37,0.4)]"
                />
                <div className="border-l border-slate-800 pl-2 hidden xs:block">
                  <span className="block text-[11px] sm:text-xs font-black tracking-widest text-slate-200 uppercase font-mono leading-none">
                    PADDOCK HUB
                  </span>
                  <span className="block text-[8px] sm:text-[9px] font-bold tracking-widest text-emerald-400 uppercase leading-none mt-1">
                    OFFICIAL 2026
                  </span>
                </div>
              </div>

              {/* Quick Series Switcher Buttons */}
              <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner shrink-0">
                <button
                  onClick={() => setSelectedSeries('all')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSeries === 'all'
                      ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedSeries('f1')}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSeries === 'f1'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-400'
                      : 'text-slate-400 hover:text-red-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="hidden sm:inline">F1 2026</span>
                  <span className="sm:hidden">F1</span>
                </button>
                <button
                  onClick={() => setSelectedSeries('motogp')}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSeries === 'motogp'
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400'
                      : 'text-slate-400 hover:text-orange-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <span className="hidden sm:inline">MotoGP 2026</span>
                  <span className="sm:hidden">MotoGP</span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari driver, tim, sirkuit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs px-1"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Desktop & scrollable mobile top bar) */}
          <nav className="flex items-center gap-1 sm:gap-2 mt-2.5 pt-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg transition-all shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white font-bold border-b-2 border-red-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              Overview 2026
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg transition-all shrink-0 ${
                activeTab === 'calendar'
                  ? 'bg-slate-800 text-white font-bold border-b-2 border-red-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
              Jadwal Balap
            </button>

            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg transition-all shrink-0 ${
                activeTab === 'drivers'
                  ? 'bg-slate-800 text-white font-bold border-b-2 border-red-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              Lineup 2026
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg transition-all shrink-0 ${
                activeTab === 'standings'
                  ? 'bg-slate-800 text-white font-bold border-b-2 border-red-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Trophy className="w-4 h-4 text-purple-400 shrink-0" />
              Klasemen
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg transition-all shrink-0 ${
                activeTab === 'news'
                  ? 'bg-slate-800 text-white font-bold border-b-2 border-red-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Newspaper className="w-4 h-4 text-rose-400 shrink-0" />
              Berita Live
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg transition-all shrink-0 ml-auto ${
                activeTab === 'favorites'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900/50'
              }`}
            >
              <Star className={`w-4 h-4 shrink-0 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Grid Favorit</span>
              <span className="sm:hidden">Favorit</span>
              {favoritesCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Modern Mobile Bottom Navigation Bar (Smartphones / Touch screen) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-1 py-1 shadow-[0_-8px_25px_rgba(0,0,0,0.7)]">
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'text-amber-400 font-bold bg-amber-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('calendar');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              activeTab === 'calendar'
                ? 'text-sky-400 font-bold bg-sky-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Jadwal</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('drivers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              activeTab === 'drivers'
                ? 'text-emerald-400 font-bold bg-emerald-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Lineup</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('standings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              activeTab === 'standings'
                ? 'text-purple-400 font-bold bg-purple-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Klasemen</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('news');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              activeTab === 'news'
                ? 'text-rose-400 font-bold bg-rose-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 tracking-tight">Berita</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('favorites');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              activeTab === 'favorites'
                ? 'text-amber-300 font-bold bg-amber-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Favorit</span>
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1.5 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

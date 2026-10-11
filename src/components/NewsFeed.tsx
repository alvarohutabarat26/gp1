import React, { useState } from 'react';
import { Newspaper, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { NewsArticle, SeriesType } from '../types/motorsport';

interface NewsFeedProps {
  articles: NewsArticle[];
  selectedSeries: SeriesType | 'all';
  searchQuery: string;
  onReadArticle: (article: NewsArticle) => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  articles,
  selectedSeries,
  searchQuery,
  onReadArticle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = articles.filter((article) => {
    const matchesSeries =
      selectedSeries === 'all' ||
      article.series === selectedSeries ||
      article.series === 'both';
    const matchesCategory =
      selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeries && matchesCategory && matchesSearch;
  });

  const categories = ['all', 'F1 Official News', 'MotoGP Report'];

  return (
    <div className="space-y-6">
      {/* Header controls: Categories */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-rose-400" />
            Live Scraped Motorsport News
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Berita nyata yang disinkronisasi langsung dari feed resmi <strong>BBC Sport Formula 1</strong> dan <strong>Crash.net MotoGP</strong>.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Semua Berita' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Tidak ada artikel yang cocok dengan pencarian.</p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isF1 = article.series === 'f1';
            const isMotoGP = article.series === 'motogp';

            return (
              <div
                key={article.id}
                onClick={() => onReadArticle(article)}
                className="group bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
              >
                {/* Series Accent border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5 ${
                    isF1 ? 'bg-red-500' : isMotoGP ? 'bg-orange-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                  }`}
                />

                <div>
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between text-xs mt-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isF1
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isMotoGP
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {isF1 ? 'F1' : isMotoGP ? 'MotoGP' : 'Motorsport'}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {article.category}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {article.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-400 transition-colors mt-3 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                {/* Footer metadata & read action */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {article.link && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                        title="Buka artikel asli di sumber"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <span className="text-rose-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 font-bold text-xs">
                      Baca <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

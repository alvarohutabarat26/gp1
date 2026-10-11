import React from 'react';
import { X, Clock, User, Share2, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types/motorsport';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  React.useEffect(() => {
    if (!article) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [article]);

  if (!article) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-8 overflow-y-auto">
          {/* Metadata badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-rose-500/20 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30 text-[11px]">
              {article.category}
            </span>
            <span className="text-slate-400 font-medium">
              {article.date} • {article.readTime}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 leading-snug">
            {article.title}
          </h2>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 border-b border-slate-800/80 pb-4">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Ditulis oleh: <strong className="text-slate-300">{article.author}</strong></span>
            <span>• Sumber: <strong className="text-slate-300">{article.source}</strong></span>
          </div>

          {/* Excerpt callout */}
          <div className="my-5 p-4 rounded-2xl bg-slate-950 border-l-4 border-rose-500 text-sm text-slate-300 font-medium italic">
            "{article.excerpt}"
          </div>

          {/* Article Full Body */}
          <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
            <p>{article.content}</p>
            <p className="text-slate-400 text-xs mt-4">
              Paddock Hub terus memperbarui informasi langsung dari sirkuit dan siaran resmi FIA / Dorna Sports. Pantau terus jadwal balapan di tab Jadwal Balap untuk mengikuti aksi langsungnya.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Kategori: {article.series.toUpperCase()}</span>
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl font-bold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

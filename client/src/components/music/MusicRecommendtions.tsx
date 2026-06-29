
import type { ReactNode } from 'react';

interface MusicRecommendationsProps {
  title: string;
  emptyMessage: string;
  content: ReactNode | null;
}

const MusicRecommendations = ({ title, emptyMessage, content }: MusicRecommendationsProps) => {
  return (
    <section
      className="rounded-3xl border max-h-50 md:max-h-90 border-white/15 bg-black/10 p-4 shadow-sm
        shadow-black/10 backdrop-blur-sm">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      {content ? content : (
        <div
          className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-6
            text-sm text-white/55">
          {emptyMessage}
        </div>
      )}
    </section>
  );
};

export default MusicRecommendations;

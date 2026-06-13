import { useState, type ChangeEvent } from 'react';
import { changeCardVisibility } from '../../services/card/cardService';

export const CardVisibility = () => {
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE');

  const handleVisibilityChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextVisibility = event.target.checked ? 'PUBLIC' : 'PRIVATE';
    const previousVisibility = visibility;

    setVisibility(nextVisibility);

    try {
      await changeCardVisibility(nextVisibility);
    } catch {
      setVisibility(previousVisibility);
    }
  };
  return (
    <label
      className="w-full inline-flex items-center justify-between gap-4 cursor-pointer p-4 px-5">
      <input
        type="checkbox"
        name="visibility"
        value={visibility}
        className="sr-only peer"
        checked={visibility === 'PUBLIC'}
        onChange={e => void handleVisibilityChange(e)}
      />
      <div className="min-w-0 flex-1 select-none">
        <p className="text-md font-semibold text-heading mb-1">Display cards publicly</p>
        <p className="text-md font-normal text-body">
          By enabling this option, your cards will be visible to everyone.
        </p>
      </div>
      <div
        className="shrink-0 relative w-16 h-9 bg-(--color-medium) rounded-full peer
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
        peer-checked:after:border-buffer after:content-[''] after:absolute after:top-1
        after:inset-s-1 after:bg-white after:rounded-full after:h-7 after:w-7
        after:transition-all peer-checked:bg-green-600/70 peer-checked:ring-white/20
        peer-checked:ring-1 after:shadow-sm">
      </div>
    </label>
  );
};

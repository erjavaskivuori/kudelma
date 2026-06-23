import { useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import {
  useGetArtworksQuery,
  useGetBooksQuery,
  useGetColorsQuery,
  useGetKeywordsQuery,
  useGetRecipesQuery,
  useGetWeatherQuery
} from '../../services/api';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import type { Item } from '../../../../shared/types/feed';
import { normalizeColorRange, updateColorRange } from '../../utils/colorManager';
import FeedItem from '../../components/feed/FeedItem';
import { useAppSelector } from '../../hooks/useAppStore';
import Selection from '../../components/feed/Selection';
import TopMusicSection from '../../components/music/MusicContainer';
import { storeColorRange } from '../../services/colorStorage';

const SuggestionsFeed = () => {
  const { coords, isLoading: isLocationLoading, error: locationError } = useGeoLocation();
  const { data: weather, isLoading: isWeatherLoading } = useGetWeatherQuery(
    coords ?? { lat: 0, lon: 0 },
    { skip: !coords }
  );

  const { data: keywords, isLoading: isKeywordsLoading } = useGetKeywordsQuery(
    weather!,
    { skip: !weather }
  );
  const { data: palette, isLoading: isPaletteLoading } = useGetColorsQuery(
    keywords?.colors ?? [],
    { skip: !keywords?.colors }
  );
  const { data: artworks, isLoading: isArtworksLoading } = useGetArtworksQuery(
    keywords?.art ?? [],
    { skip: !keywords?.art }
  );
  const { data: books, isLoading: isBooksLoading } = useGetBooksQuery(
    keywords?.books ?? [],
    { skip: !keywords?.books }
  );
  const { data: recipes, isLoading: isRecipesLoading } = useGetRecipesQuery(
    keywords?.recipes ?? [],
    { skip: !keywords?.recipes }
  );

  const { book, artwork, recipe } = useAppSelector(state => state.favoriteSelection);

  useEffect(() => {
    if (palette && palette.length === 5) {
      updateColorRange(palette);
      storeColorRange(normalizeColorRange(palette));
    }
  }, [palette]);

  if (locationError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-white">
        <div
          className="max-w-md rounded-3xl border border-white/15 bg-white/10 px-6 py-8
            backdrop-blur-sm"
        >
          <h2 className="text-2xl font-semibold">Location needed</h2>
          <p className="mt-3 text-sm text-white/75">{locationError}</p>
        </div>
      </div>
    );
  }

  const isSuggestionsLoading =
    isLocationLoading ||
    !coords ||
    isWeatherLoading ||
    !weather ||
    isKeywordsLoading ||
    !keywords ||
    isPaletteLoading ||
    !palette ||
    isArtworksLoading ||
    isBooksLoading ||
    isRecipesLoading;

  if (isSuggestionsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-white">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/15
          bg-white/10 px-8 py-10 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20
            border-t-white" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Preparing your feed</h2>
            <p className="mt-2 text-sm text-white/70">
              Fetching weather, themes, and recommendations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const itemList: Item[] = [
    ...(artwork
      ? []
      : artworks?.map(artwork => ({ type: 'artwork' as const, data: artwork })) ?? []),
    ...(book
      ? []
      : books?.map(book => ({ type: 'book' as const, data: book })) ?? []),
    ...(recipe
      ? []
      : recipes?.map(recipe => ({ type: 'recipe' as const, data: recipe })) ?? [])
  ];

  itemList.sort(() => Math.random() - 0.5); // Shuffle items

  return (
    <>
      <TopMusicSection />
      <div className="justify-center flex">
        <Masonry columns={{ xs: 2, sm: 3, lg: 4 }} spacing={2}>
          {itemList.map(item => (
            <div key={item.data.id} className="break-inside-avoid">
              <FeedItem item={item} />
            </div>
          ))}
        </Masonry>
      </div>
      <div className="sticky bottom-4 flex justify-center">
        <Selection weather={weather} />
      </div>
    </>
  );
};

export default SuggestionsFeed;

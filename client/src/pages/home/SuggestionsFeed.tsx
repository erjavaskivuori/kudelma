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
import { updateColorRange } from '../../utils/colorManager';
import FeedItem from '../../components/feed/FeedItem';
import { useAppSelector } from '../../hooks/useAppStore';
import Selection from '../../components/feed/Selection';

const SuggestionsFeed = () => {
  const coords = useGeoLocation();
  const { data: weather } = useGetWeatherQuery(coords!, { skip: !coords });

  const { data: keywords } = useGetKeywordsQuery(weather!, { skip: !weather });
  const { data: palette } = useGetColorsQuery(keywords?.colors ?? [], {
    skip: !keywords?.colors
  });
  const { data: artworks } = useGetArtworksQuery(keywords?.art ?? [], { skip: !keywords?.art });
  const { data: books } = useGetBooksQuery(keywords?.books ?? [], { skip: !keywords?.books });
  const { data: recipes } = useGetRecipesQuery(keywords?.recipes ?? [], {
    skip: !keywords?.recipes
  });

  useEffect(() => {
    if (palette && palette.length === 5) {
      updateColorRange(palette);
    }
  }, [palette]);

  const { book, artwork, recipe } = useAppSelector(state => state.favoriteSelection);

  const itemList: Item[] = [
    ...(artwork
      ? []
      : artworks?.map(artwork => ({ type: 'artwork' as const, data: artwork })) ?? []),
    ...(book ? [] : books?.map(book => ({ type: 'book' as const, data: book })) ?? []),
    ...(recipe ? [] : recipes?.map(recipe => ({ type: 'recipe' as const, data: recipe })) ?? [])
  ];

  itemList.sort(() => Math.random() - 0.5); // Shuffle items

  return (
    <>
      <Masonry columns={{ xs: 2, sm: 3, lg: 4 }} spacing={2}>
        {itemList.map((item) => (
          <div key={item.data.id} className="break-inside-avoid">
            <FeedItem item={item} />
          </div>
        ))}
      </Masonry>
      <div className="flex sticky bottom-4 justify-center ">
        <Selection />
      </div>
    </>
  );
};

export default SuggestionsFeed;

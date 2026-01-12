import { useEffect } from 'react';
import {
  useGetKeywordsQuery,
  useGetColorsQuery,
  useGetArtworksQuery,
  useGetBooksQuery,
  useGetRecipesQuery,
  useGetWeatherQuery
} from '../../services/api';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import type { Item } from '../../../../shared/types/feed';
import { updateColorRange } from '../../utils/colorManager';
import Masonry from '../../components/Masonry';

const SuggestionsFeed = () => {
  const coords = useGeoLocation();
  const { data: weather } = useGetWeatherQuery(coords!, { skip: !coords });

  const { data: keywords } = useGetKeywordsQuery(weather!, { skip: !weather });
  const { data: palette } = useGetColorsQuery(keywords?.colors || [], {
    skip: !keywords?.colors
  });
  const { data: artworks } = useGetArtworksQuery(keywords?.art || [], { skip: !keywords?.art });
  const { data: books } = useGetBooksQuery(keywords?.books || [], { skip: !keywords?.books });
  const { data: recipes } = useGetRecipesQuery(keywords?.recipes || [], {
    skip: !keywords?.recipes
  });

  useEffect(() => {
    if (palette && palette.length === 5) {
      updateColorRange(palette);
    }
  }, [palette]);

  const itemList: Item[] = [
    ...(artworks?.map(artwork => ({ type: 'artwork' as const, data: artwork })) ?? []),
    ...(books?.map(book => ({ type: 'book' as const, data: book })) ?? []),
    ...(recipes?.map(recipe => ({ type: 'recipe' as const, data: recipe })) ?? [])
    ];

  return <Masonry items={itemList} />;
};

export default SuggestionsFeed;

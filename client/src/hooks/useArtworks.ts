import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from './common';
import type { UseArtworksReturn } from '../../../shared/types/art';
import {
  fetchArtworks,
  selectArtworks,
  selectArtworksLoading,
  selectArtworksError
} from '../reducers/artworkSlice';
import { selectKeywords } from '../reducers/keywordSlice';

export const useArtworks = (): UseArtworksReturn => {
  const keywords = useAppSelector(selectKeywords);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectArtworksLoading);
  const error = useAppSelector(selectArtworksError);
  const artworks = useAppSelector(selectArtworks);

  const shouldFetch = useMemo(() => {
    if (artworks) return false;
    return true;
  }, [artworks]);

  useEffect(() => {
    if (shouldFetch && keywords) {
      void dispatch(fetchArtworks(keywords.art));
    }
  }, [shouldFetch, dispatch, keywords]);

  return {
    artworks,
    loading,
    error,
  };
};

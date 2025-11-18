import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from './common';
import type { UseKeywordsReturn } from '../../../shared/types/keywords';
import {
  fetchKeywords,
  selectKeywords,
  selectKeywordsLoading,
  selectKeywordsError
} from '../reducers/keywordSlice';
import { selectWeatherData } from '../reducers/weatherSlice';

export const useKeywords = (): UseKeywordsReturn => {
  const weather = useAppSelector(selectWeatherData);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectKeywordsLoading);
  const error = useAppSelector(selectKeywordsError);
  const keywords = useAppSelector(selectKeywords);

  const shouldFetch = useMemo(() => {
    if (!weather || keywords) return false;
    return true;
  }, [weather, keywords]);

  useEffect(() => {
    if (shouldFetch) {
      void dispatch(fetchKeywords());
    }
  }, [shouldFetch, dispatch]);

  return {
    keywords,
    loading,
    error,
  };
};

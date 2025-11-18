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
    if (keywords) return false;
    return true;
  }, [keywords]);

  useEffect(() => {
    if (shouldFetch && weather) {
      void dispatch(fetchKeywords(weather));
    }
  }, [shouldFetch, dispatch, weather]);

  return {
    keywords,
    loading,
    error,
  };
};

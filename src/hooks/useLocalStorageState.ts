import { useEffect, useState } from 'react';

export enum StoreKey {
  SORT = 'sortBy',
  SORTING = 'sorting',
  FLEXJAR_ARENABRUK_FEEDBACK_DATE = 'flexjarArenabrukFeedbackDate',
}

export const useLocalStorageState = <T>(key: StoreKey, initialState: T) => {
  const item = localStorage.getItem(key);
  const [state, setState] = useState<T>(() => {
    try {
      return item === null ? initialState : JSON.parse(item);
    } catch (error) {
      return initialState;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);
  return [state, setState] as const;
};

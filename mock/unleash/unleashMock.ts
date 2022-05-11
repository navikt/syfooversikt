import { ToggleNames } from '@/data/unleash/types/unleash_types';

export const unleashMock = Object.values(ToggleNames).reduce(
  (accumulator, toggleName) => {
    return { ...accumulator, [toggleName]: true };
  },
  {}
);

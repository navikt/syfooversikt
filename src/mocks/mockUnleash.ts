import { ToggleNames } from '@/data/unleash/types/unleash_types';
import { UNLEASH_ROOT } from '@/apiConstants';
import { http, HttpResponse } from 'msw';

export const mockUnleash = http.get(`${UNLEASH_ROOT}/toggles`, () =>
  HttpResponse.json(unleashMock)
);

export const unleashMock = Object.values(ToggleNames).reduce(
  (accumulator, toggleName) => {
    return { ...accumulator, [toggleName]: true };
  },
  {}
);

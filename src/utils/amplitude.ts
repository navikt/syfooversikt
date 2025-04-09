import * as amplitude from '@amplitude/analytics-browser';
import { isProd } from '@/utils/miljoUtil';

/**
 See documentation for naming guidelines: https://github.com/navikt/analytics-taxonomy
 Other documentation on Aksel: https://aksel.nav.no/god-praksis/artikler/mal-brukeratferd-med-amplitude
 */
export enum EventType {
  PageView = 'besøk',
  Navigation = 'navigere',
  OptionSelected = 'alternativ valgt',
  ButtonClick = 'knapp trykket',
  SortingColumn = 'kolonne sortert på',
  AmountDisplayed = 'antall vist',
  AmountChanged = 'antall endret',
  ErrorMessageShowed = 'feilmelding vist',
}

type EventPageView = {
  type: EventType.PageView;
  data: {
    url: string;
    sidetittel: string;
  };
};

type Navigation = {
  type: EventType.Navigation;
  data: {
    fromUrl: string;
    lenketekst: string;
    destinasjon: string;
  };
};

type OptionSelected = {
  type: EventType.OptionSelected;
  data: {
    url: string;
    tekst: string;
    option: string;
  };
};

type EventButtonClick = {
  type: EventType.ButtonClick;
  data: {
    url: string;
    tekst: string;
  };
};

type EventSortingColumn = {
  type: EventType.SortingColumn;
  data: {
    url: string;
    kolonne: string;
    retning: string;
  };
};

type EventAmountDisplayed = {
  type: EventType.AmountDisplayed;
  data: {
    url: string;
    antall: number;
    handling: string;
  };
};

type EventAmountChanged = {
  type: EventType.AmountChanged;
  data: {
    url: string;
    antall: number;
    handling: string;
  };
};

type ErrorMessageShowed = {
  type: EventType.ErrorMessageShowed;
  data: {
    url: string;
    handling: string;
    feilmelding: string;
  };
};

type Event =
  | EventPageView
  | Navigation
  | OptionSelected
  | EventButtonClick
  | EventSortingColumn
  | EventAmountDisplayed
  | ErrorMessageShowed
  | EventAmountChanged;

export const logEvent = (event: Event) =>
  amplitude.track(event.type, { ...event.data });

const getApiKey = () => {
  return isProd()
    ? 'e4b68538f8d185f0ee2d913d8e51bd39'
    : 'c7bcaaf5d0fddda592412234dd3da1ba';
};

amplitude.init(getApiKey(), undefined, {
  serverUrl: 'https://amplitude.nav.no/collect',
  defaultTracking: true,
});

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

type Event = EventPageView | Navigation | OptionSelected;

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

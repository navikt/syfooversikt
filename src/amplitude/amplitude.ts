import amplitude from 'amplitude-js';

export const texts = {
  click: 'Klikker på:',
};

const combineEventData = (eventData?: Record<string, string>) => {
  return {
    team: 'iSyfo',
    app: 'Syfooversikt',
    ...eventData,
  };
};

export const initAmplitude = () => {
  amplitude?.getInstance().init('default', '', {
    apiEndpoint: 'amplitude.nav.no/collect-auto',
    saveEvents: false,
    includeUtm: true,
    includeReferrer: false,
    platform: window.location.toString(),
  });
};

export const setAmplitudeUserProperties = (valgtEnhet: string) => {
  amplitude.getInstance().setUserProperties({
    valgtEnhet: valgtEnhet,
  });
};

export const trackEvent = (
  eventName: string,
  eventData?: Record<string, string>
) => {
  amplitude?.getInstance().logEvent(eventName, combineEventData(eventData));
};

export const trackOnClick = (
  elementName: string,
  eventData?: Record<string, string>
) => {
  const trackingName = `${texts.click} ${elementName}`;
  amplitude?.getInstance().logEvent(trackingName, combineEventData(eventData));
};

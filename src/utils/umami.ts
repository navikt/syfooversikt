export async function setIdentifier(veilederident: string) {
  const maskedVeilederident = await hashId(veilederident);
  await umami.identify(maskedVeilederident);
}

async function hashId(id: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(id);

  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 40);
}

function beforeSendHandler(type: any, payload: any) {
  if (payload.id != null) {
    return payload;
  }
  return null;
}

// Make the function globally accessible to make "data-before-send" in umami script work
(window as any).beforeSendHandler = beforeSendHandler;

enum EventType {
  ModalApnet = 'modal åpnet',
  ModalLukket = 'modal lukket',
}

type ModalApnet = {
  type: EventType.ModalApnet;
  data: {
    tittel: string;
  };
};

type ModalLukket = {
  type: EventType.ModalLukket;
  data: {
    tittel: string;
  };
};

type Event = ModalApnet | ModalLukket;

function trackEvent(event: Event) {
  umami.track(event.type, { ...event.data });
}

export function trackModalApnet(tittel: string) {
  trackEvent({
    type: EventType.ModalApnet,
    data: {
      tittel: tittel,
    },
  });
}

export function trackModalLukket(tittel: string) {
  trackEvent({
    type: EventType.ModalLukket,
    data: {
      tittel: tittel,
    },
  });
}

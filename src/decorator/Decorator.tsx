import React, { useLayoutEffect, useRef } from 'react';
import { decoratorConfig } from './decoratorConfig';
import { linkToNewHostAndPath, Subdomain } from '@/utils/miljoUtil';
import { useAktivBruker } from '@/data/modiacontext/useAktivBruker';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext.tsx';

const Decorator = () => {
  const aktivEnhet = useAktivEnhet();
  const aktivBruker = useAktivBruker();
  const decoratorRef = useRef<InternarbeidsflateDecoratorElement>(null);

  useLayoutEffect(() => {
    const handlePersonsokSubmit = (nyttFnr: string) => {
      aktivBruker.mutate(nyttFnr, {
        onSuccess: () => {
          window.location.href = linkToNewHostAndPath(
            Subdomain.SYFOMODIAPERSON,
            `/sykefravaer`
          );
        },
      });
    };

    const decoratorElement = decoratorRef.current;
    if (!decoratorElement) return;

    const onEnhetChanged = (event: CustomEvent<EnhetChangedDetail>) => {
      const { enhet } = event.detail;
      if (enhet) aktivEnhet.handleAktivEnhetChanged(enhet);
    };

    const onFnrChanged = (event: CustomEvent<FnrChangedDetail>) => {
      const { fnr } = event.detail;
      if (fnr) handlePersonsokSubmit(fnr);
    };

    decoratorElement.addEventListener('fnr-changed', onFnrChanged);
    decoratorElement.addEventListener('enhet-changed', onEnhetChanged);

    return () => {
      decoratorElement.removeEventListener('fnr-changed', onFnrChanged);
      decoratorElement.removeEventListener('enhet-changed', onEnhetChanged);
    };
  });

  return (
    <internarbeidsflate-decorator
      ref={decoratorRef}
      app-name={decoratorConfig.appName}
      fetch-active-enhet-on-mount={String(
        decoratorConfig.fetchActiveEnhetOnMount
      )}
      show-enheter={String(decoratorConfig.showEnheter)}
      show-search-area={String(decoratorConfig.showSearchArea)}
      show-hotkeys={String(decoratorConfig.showHotkeys)}
      enable-hotkeys={String(decoratorConfig.enableHotkeys)}
      environment={decoratorConfig.environment}
      url-format={decoratorConfig.urlFormat}
      proxy={decoratorConfig.proxy}
      fnr-sync-mode={decoratorConfig.fnrSyncMode}
    />
  );
};

export default Decorator;

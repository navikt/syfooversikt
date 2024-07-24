import React, { useCallback } from 'react';
import NAVSPA from '@navikt/navspa';
import { DecoratorProps } from './decoratorProps';
import decoratorConfig from './decoratorConfig';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { useAktivBruker } from '@/data/modiacontext/useAktivBruker';
import { fullNaisUrlDefault } from '@/utils/miljoUtil';

const InternflateDecorator = NAVSPA.importer<DecoratorProps>(
  'internarbeidsflate-decorator-v3'
);

const Decorator = () => {
  const { handleAktivEnhetChanged } = useAktivEnhet();
  const aktivBruker = useAktivBruker();

  const handlePersonsokSubmit = (nyttFnr: string) => {
    aktivBruker.mutate(nyttFnr, {
      onSuccess: () => {
        const host = 'syfomodiaperson';
        const path = `/sykefravaer`;
        window.location.href = fullNaisUrlDefault(host, path);
      },
    });
  };

  const handleChangeEnhet = (nyEnhet: string) => {
    handleAktivEnhetChanged(nyEnhet);
  };

  const config = useCallback(decoratorConfig, [
    handlePersonsokSubmit,
    handleChangeEnhet,
  ])(handlePersonsokSubmit, handleChangeEnhet);

  return <InternflateDecorator {...config} />;
};

export default Decorator;

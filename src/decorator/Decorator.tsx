import React, { useCallback } from 'react';
import NAVSPA from '@navikt/navspa';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';
import { useAktivBruker } from '@/data/modiacontext/useAktivBruker';
import { fullNaisUrlDefault } from '@/utils/miljoUtil';
import { DecoratorPropsV3 } from '@/decorator/decoratorProps';
import { lagConfigV3 } from '@/decorator/decoratorConfig';

const InternflateDecoratorV3 = NAVSPA.importer<DecoratorPropsV3>(
  'internarbeidsflate-decorator-v3'
);

const Decorator = () => {
  const { aktivEnhet, handleAktivEnhetChanged } = useAktivEnhet();
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

  const config = useCallback(lagConfigV3, [
    handlePersonsokSubmit,
    handleChangeEnhet,
    aktivEnhet,
  ])(handlePersonsokSubmit, handleChangeEnhet, aktivEnhet);

  return <InternflateDecoratorV3 {...config} />;
};

export default Decorator;

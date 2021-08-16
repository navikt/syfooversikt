import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import NAVSPA from '@navikt/navspa';
import { DecoratorProps } from './decoratorProps';
import decoratorConfig from './decoratorConfig';
import { fullNaisUrlDefault } from '@/utils/miljoUtil';
import { setAktivEnhetHentet } from '@/store/veilederenheter/veilederenheter_actions';

const InternflateDecorator = NAVSPA.importer<DecoratorProps>(
  'internarbeidsflatefs'
);

const Decorator = () => {
  const dispatch = useDispatch();

  const handlePersonsokSubmit = (nyttFnr: string) => {
    const host = 'syfomodiaperson';
    const path = `/sykefravaer/${nyttFnr}`;
    window.location.href = fullNaisUrlDefault(host, path);
  };

  const handleChangeEnhet = (nyEnhet: string) => {
    dispatch(setAktivEnhetHentet(nyEnhet));
  };

  const config = useCallback(decoratorConfig, [
    handlePersonsokSubmit,
    handleChangeEnhet,
  ])(handlePersonsokSubmit, handleChangeEnhet);

  return <InternflateDecorator {...config} />;
};

export default Decorator;

import React, { Component } from 'react';
import styled from 'styled-components';
import Toolbar from './toolbar/Toolbar';
import Personliste from './Personliste';
import { VeilederArbeidstaker } from '../store/veilederArbeidstaker/veilederArbeidstakerTypes';
import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { Veilederenhet } from '../store/veilederenheter/veilederenheterTypes';
import { Veilederinfo } from '../store/veilederinfo/veilederinfoTypes';

interface  SokeresultatState {
  markertePersoner: string[];
  alleMarkert: boolean;
}

interface SokeresultatProps {
  aktivEnhet: Veilederenhet;
  aktivVeilederinfo: Veilederinfo;
  personregister: PersonregisterState;
  tildelVeileder: (liste: VeilederArbeidstaker[]) => void;
}

const lagListe = (markertePersoner: string[], veilederIdent: string, enhet: string): VeilederArbeidstaker[] => {
  return markertePersoner.map( (fnr: string) => ({
    veilederIdent,
    fnr,
    enhet,
  }));
};

const SokeresultatContainer = styled.div`
  flex: 3;
`;

class Sokeresultat extends Component<SokeresultatProps, SokeresultatState> {
  constructor(props: SokeresultatProps) {
    super(props);
    this.state = {
      markertePersoner: [],
      alleMarkert: false,
    };
    this.checkboxHandler = this.checkboxHandler.bind(this);
    this.checkAllHandler = this.checkAllHandler.bind(this);
  }

  checkboxHandler =  (fnr: string ) => {
    this.setState((prevState) => {
      const markertePersoner: string[] = personErIkkeMarkert(prevState, fnr)
        ? [...prevState.markertePersoner, fnr]
        :  fjernMarkertPerson(prevState, fnr);

      const alleMarkert = markertePersoner.length === Object.keys(this.props.personregister).length;
      return { markertePersoner, alleMarkert };
    });
  }

  checkAllHandler = (checked: boolean ) => {
    const {
      personregister,
    } = this.props;

    const fnrListe = Object.keys(personregister);

    const markertePersoner = checked
      ? fnrListe
      : [];
    const alleMarkert = checked;
    this.setState(() => ({
      markertePersoner,
      alleMarkert,
    }));
  }

  buttonHandler =  () => {
    const {
      aktivEnhet,
      aktivVeilederinfo,
      tildelVeileder,
    } = this.props;
    const veilederArbeidstakerListe = lagListe(this.state.markertePersoner, aktivVeilederinfo.ident, aktivEnhet.enhetId);
    tildelVeileder(veilederArbeidstakerListe);
  }
  render() {
    const {
      personregister,
    } = this.props;

    const {
        alleMarkert,
    } = this.state;

    return (<SokeresultatContainer>
      <Toolbar buttonHandler={this.buttonHandler}/>
      <Personliste
        alleMarkert={alleMarkert}
        personregister={personregister}
        checkboxHandler={this.checkboxHandler}
        markertePersoner={this.state.markertePersoner}
        checkAllHandler={this.checkAllHandler}
      />
    </SokeresultatContainer>);
  }
}

const personErIkkeMarkert = (prevState: any, fnr: string) => {
  return prevState.markertePersoner.findIndex((markertPerson: string) => {
    return markertPerson === fnr;}
  ) === -1;
};

const fjernMarkertPerson = (prevState: any, fnr: string) => {
  return prevState.markertePersoner.filter((markertPerson: string) => {
    return markertPerson !== fnr;
  });
};

export default Sokeresultat;

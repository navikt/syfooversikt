import React, { Component, ReactElement } from 'react';
import styled from 'styled-components';
import Personliste from './Personliste';
import { VeilederArbeidstaker } from '../store/veilederArbeidstaker/veilederArbeidstakerTypes';
import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { VeilederinfoDTO } from '../store/veilederinfo/veilederinfoTypes';
import { Veileder } from '../store/veiledere/veiledereTypes';
import { OverviewTabType } from '../konstanter';
import ToolbarWrapper from './toolbar/ToolbarWrapper';

interface SokeresultatState {
  markertePersoner: string[];
  alleMarkert: boolean;
  startItem: number;
  endItem: number;
  currentTabType: OverviewTabType;
}

interface SokeresultatProps {
  aktivEnhetId: string;
  aktivVeilederinfo?: VeilederinfoDTO;
  personregister: PersonregisterState;
  tildelVeileder: (liste: VeilederArbeidstaker[]) => void;
  veiledere: Veileder[];
  tabType: OverviewTabType;
}

const lagListe = (
  markertePersoner: string[],
  veilederIdent: string,
  enhet: string
): VeilederArbeidstaker[] => {
  return markertePersoner.map((fnr: string) => ({
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
      currentTabType: props.tabType,
      startItem: 0,
      endItem: 0,
    };
    this.checkboxHandler = this.checkboxHandler.bind(this);
    this.checkAllHandler = this.checkAllHandler.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  checkboxHandler = (fnr: string): void => {
    this.setState((prevState) => {
      const markertePersoner: string[] = personErIkkeMarkert(prevState, fnr)
        ? [...prevState.markertePersoner, fnr]
        : fjernMarkertPerson(prevState, fnr);

      const alleMarkert =
        markertePersoner.length ===
        Object.keys(this.props.personregister).length;
      return { markertePersoner, alleMarkert };
    });
  };

  componentDidUpdate(
    prevProps: SokeresultatProps,
    currentState: SokeresultatState
  ): void {
    if (this.props.tabType !== currentState.currentTabType) {
      this.setState({
        alleMarkert: false,
        markertePersoner: [],
        currentTabType: this.props.tabType,
      });
    }

    const currentRegisterLength = Object.keys(this.props.personregister).length;
    const previousRegisterLength = Object.keys(prevProps.personregister).length;

    if (
      currentState.markertePersoner.length > 0 &&
      currentRegisterLength !== previousRegisterLength
    ) {
      this.setState({
        markertePersoner: [],
        alleMarkert: false,
      });
    }
  }

  checkAllHandler = (checked: boolean): void => {
    const { personregister } = this.props;

    const fnrListe = Object.keys(personregister);

    const markertePersoner = checked ? fnrListe : [];
    const alleMarkert = checked;
    this.setState(() => ({
      markertePersoner,
      alleMarkert,
    }));
  };

  buttonHandler = (veilederIdent: string): void => {
    const { aktivEnhetId, tildelVeileder } = this.props;
    const veilederArbeidstakerListe = lagListe(
      this.state.markertePersoner,
      veilederIdent,
      aktivEnhetId
    );
    tildelVeileder(veilederArbeidstakerListe);
  };

  onPageChange = (startItem: number, endItem: number): void => {
    this.setState({
      endItem,
      startItem,
    });
  };

  render(): ReactElement {
    const {
      personregister,
      veiledere,
      aktivVeilederinfo,
      tabType,
    } = this.props;

    const { alleMarkert, markertePersoner, startItem, endItem } = this.state;

    const allFnr = Object.keys(personregister);

    return (
      <SokeresultatContainer>
        <ToolbarWrapper
          numberOfItemsTotal={allFnr.length}
          onPageChange={this.onPageChange}
          tabType={tabType}
          aktivVeilederInfo={aktivVeilederinfo}
          alleMarkert={alleMarkert}
          buttonHandler={this.buttonHandler}
          checkAllHandler={this.checkAllHandler}
          veiledere={veiledere}
          markertePersoner={markertePersoner}
        />
        <Personliste
          personregister={personregister}
          startItem={startItem}
          endItem={endItem}
          checkboxHandler={this.checkboxHandler}
          markertePersoner={markertePersoner}
          veiledere={veiledere}
        />
      </SokeresultatContainer>
    );
  }
}

const personErIkkeMarkert = (prevState: any, fnr: string) => {
  return (
    prevState.markertePersoner.findIndex((markertPerson: string) => {
      return markertPerson === fnr;
    }) === -1
  );
};

const fjernMarkertPerson = (prevState: any, fnr: string) => {
  return prevState.markertePersoner.filter((markertPerson: string) => {
    return markertPerson !== fnr;
  });
};

export default Sokeresultat;

import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { AlertStripeMedMelding } from '../components/AlertStripeMedMelding';
import { ApplicationState } from '../store';
import { OVERSIKT_VISNING_TYPE } from '../konstanter';
import AppSpinner from '../components/AppSpinner';
import Sokeresultat from '../components/Sokeresultat';
import { hentPersonInfoForespurt } from '../store/personInfo/personInfo_actions';
import { Fodselsnummer } from '../store/personInfo/personInfoTypes';
import { hentPersonoversiktForespurt } from '../store/personoversikt/personoversikt_actions';
import { pushVeilederArbeidstakerForespurt } from '../store/veilederArbeidstaker/veilederArbeidstaker_actions';
import { hentVeilederenheter } from '../store/veilederenheter/veilederenheter_actions';
import { VeilederArbeidstaker } from '../store/veilederArbeidstaker/veilederArbeidstakerTypes';
import { Veilederenhet } from '../store/veilederenheter/veilederenheterTypes';
import { Veilederinfo } from '../store/veilederinfo/veilederinfoTypes';
import SokeresultatFilter, { HendelseTypeFilters } from '../components/HendelseTypeFilter';
import { filtrerPersonregister, Filterable, filtrerPaaFodelsnummerEllerNavn } from '../utils/hendelseFilteringUtils';
import TekstFilter from '../components/TekstFilter';

const tekster = {
  overskrifter: {
    enhetensOversikt: 'Personer med hendelser',
    minOversikt: 'Denne fanen er under utvikling',
    veilederoversikt: 'Denne fanen er under utvikling',
  },
  feil: {
    hentingFeilet: 'Det skjedde en feil: Kunne ikke hente liste over personer',
  },
};

interface OversiktProps {
  type: string;
}

interface StateProps {
  aktivEnhet: Veilederenhet;
  aktivVeilederinfo: Veilederinfo;
  personregister: PersonregisterState;
  henterAlt: boolean;
  noeErHentet: boolean;
  altFeilet: boolean;
}

interface DispatchProps {
  actions: {
    hentPersonInfoForespurt: typeof hentPersonInfoForespurt;
    hentPersonoversiktForespurt: typeof hentPersonoversiktForespurt;
    tildelVeileder: typeof pushVeilederArbeidstakerForespurt;
    hentVeilederenheter: typeof hentVeilederenheter;
  };
}

interface OversiktContainerState {
    hendelseTypeFilter?: HendelseTypeFilters;
    tekstFilter: string;
}

export type OversiktContainerProps = OversiktProps & StateProps & DispatchProps;

class OversiktCont extends Component<OversiktContainerProps, OversiktContainerState> {

  constructor(props: OversiktContainerProps) {
    super(props);
    this.state = {
        hendelseTypeFilter: undefined,
        tekstFilter: '',
    };
    this.onHendelsesTypeChange = this.onHendelsesTypeChange.bind(this);
    this.onTekstFilterChange = this.onTekstFilterChange.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.hentVeilederenheter();
  }

  componentDidUpdate() {
    const { actions } = this.props;
    actions.hentPersonoversiktForespurt();
  }

  onHendelsesTypeChange = (filter: HendelseTypeFilters) => {
    this.setState({ hendelseTypeFilter: filter });
  }

  onTekstFilterChange = (tekstFilter: string) => {
      this.setState({ tekstFilter });
  }

  render() {
    const {
      type,
      henterAlt,
      noeErHentet,
      altFeilet,
      actions,
      aktivEnhet,
      aktivVeilederinfo,
      personregister,
    } = this.props;

    const filtrertListe = new Filterable<PersonregisterState>(personregister)
        .applyFilter((v) => filtrerPersonregister(v, this.state.hendelseTypeFilter))
        .applyFilter((v) => filtrerPaaFodelsnummerEllerNavn(v, this.state.tekstFilter))
        .value;

    return (
      <div className="oversiktContainer">
        {altFeilet && OVERSIKT_VISNING_TYPE.ENHETENS_OVERSIKT &&
          AlertStripeMedMelding(
            tekster.feil.hentingFeilet,
            'oversiktContainer__alertstripe'
          )}
        <OversiktHeader type={type} />
        {henterAlt && <AppSpinner />}
        {noeErHentet && type === OVERSIKT_VISNING_TYPE.ENHETENS_OVERSIKT && (
          <div className="oversiktContainer__innhold">
            <div className="sokeresultatFilter">
                <TekstFilter className="sokeresultatFilter__panel" onFilterChange={this.onTekstFilterChange} />
                <SokeresultatFilter className="sokeresultatFilter__panel" onFilterChange={this.onHendelsesTypeChange} />
            </div>
            <Sokeresultat
              tildelVeileder={actions.tildelVeileder}
              aktivEnhet={aktivEnhet}
              aktivVeilederinfo={aktivVeilederinfo}
              personregister={filtrertListe}
            />
          </div>
        )}
      </div>
    );
  }
}

const OversiktHeader = (oversiktsType: OversiktProps) => {
  const { type } = oversiktsType;
  return (<div>
      {type === OVERSIKT_VISNING_TYPE.ENHETENS_OVERSIKT && (<h2>{tekster.overskrifter.enhetensOversikt}</h2>)}
    </div>);
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    hentPersonInfoForespurt: (fnrListe: Fodselsnummer[]) => dispatch(hentPersonInfoForespurt(fnrListe)),
    hentPersonoversiktForespurt: () => dispatch(hentPersonoversiktForespurt()),
    hentVeilederenheter: () => dispatch(hentVeilederenheter()),
    tildelVeileder: (liste: VeilederArbeidstaker[]) =>
      dispatch(pushVeilederArbeidstakerForespurt(liste)),
  },
});

const mapStateToProps = ({ personoversikt, personregister, veilederenheter, veilederinfo }: ApplicationState, oversiktProps: OversiktProps) => ({
  personregister,
  oversiktProps,
  aktivEnhet: veilederenheter.aktivEnhet,
  aktivVeilederinfo: veilederinfo.data,
  henterAlt: veilederenheter.henter || veilederinfo.henter || personoversikt.henter,
  noeErHentet: veilederenheter.hentet && veilederinfo.hentet && personoversikt.hentet,
  altFeilet: veilederenheter.hentingFeilet || veilederinfo.hentingFeilet || personoversikt.hentingFeilet,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OversiktCont);

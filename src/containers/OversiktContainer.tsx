import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { AlertStripeMedMelding } from '../components/AlertStripeMedMelding';
import { ApplicationState } from '../store';
import { OVERSIKT_VISNING_TYPE } from '../konstanter';
import AppSpinner from '../components/AppSpinner';
import Sokeresultat from '../components/Sokeresultat';
import { hentEnhetensMoterForespurt } from '../store/enhetensMoter/enhetensMoter_actions';
import { hentPersonInfoForespurt } from '../store/personInfo/personInfo_actions';
import { Fodselsnummer } from '../store/personInfo/personInfoTypes';
import { hentPersonoversiktForespurt } from '../store/personoversikt/personoversikt_actions';
import { pushVeilederArbeidstakerForespurt } from '../store/veilederArbeidstaker/veilederArbeidstaker_actions';
import { hentVeilederenheter } from '../store/veilederenheter/veilederenheter_actions';
import { VeilederArbeidstaker } from '../store/veilederArbeidstaker/veilederArbeidstakerTypes';
import { Veilederenhet } from '../store/veilederenheter/veilederenheterTypes';
import { Veilederinfo } from '../store/veilederinfo/veilederinfoTypes';
import SokeresultatFilter, { HendelseTypeFilters } from '../components/SokeresultatFilter';
import { isNullOrUndefined } from 'util';

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
    hentEnhetensMoterForespurt: typeof hentEnhetensMoterForespurt;
    hentPersonInfoForespurt: typeof hentPersonInfoForespurt;
    hentPersonoversiktForespurt: typeof hentPersonoversiktForespurt;
    tildelVeileder: typeof pushVeilederArbeidstakerForespurt;
    hentVeilederenheter: typeof hentVeilederenheter;
  };
}

interface OversiktContainerState {
    filter?: HendelseTypeFilters;
}

export type OversiktContainerProps = OversiktProps & StateProps & DispatchProps;

const filtrerPersonregister = (personregister: PersonregisterState, filter?: HendelseTypeFilters): PersonregisterState => {
    if (!filter) return personregister;
    const erTomtFilter = Object.keys(filter).filter((key) => ((filter as any)[key] === true)).length === 0;
    const nyttFiltrertPersonregister = erTomtFilter
        ? personregister
        : Object.keys(personregister).reduce((cv, fnr) => {
            const pd = personregister[fnr];
            if (filter.onskerMote && pd.harMotebehovUbehandlet) {
                cv[fnr] = pd;
            } else if (filter.svartMote && pd.harMote) {
                cv[fnr] = pd;
            } else if (filter.ufordeltBruker && isNullOrUndefined(pd.tildeltVeilederIdent)) {
                cv[fnr] = pd;
            }
            return cv;
        }, {} as PersonregisterState);
    return nyttFiltrertPersonregister;
  };

class OversiktCont extends Component<OversiktContainerProps, OversiktContainerState> {

  constructor(props: OversiktContainerProps) {
    super(props);
    this.state = {
        filter: undefined,
    };
    this.onHendelsesTypeChange = this.onHendelsesTypeChange.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.hentVeilederenheter();
  }

  componentDidUpdate() {
    const { actions } = this.props;
    actions.hentEnhetensMoterForespurt();
    actions.hentPersonoversiktForespurt();
  }

  onHendelsesTypeChange = (filter: HendelseTypeFilters) => {
    this.setState({ filter });
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
    } = this.props;
    return (
      <div className="oversiktContainer">
        {altFeilet &&
          OVERSIKT_VISNING_TYPE.ENHETENS_OVERSIKT &&
          AlertStripeMedMelding(
            tekster.feil.hentingFeilet,
            'oversiktContainer__alertstripe'
          )}
        <OversiktHeader type={type} />
        {henterAlt && <AppSpinner />}
        {noeErHentet && type === OVERSIKT_VISNING_TYPE.ENHETENS_OVERSIKT && (
          <div style={{display: 'flex'}}>
            <SokeresultatFilter onValgteElementerChange={this.onHendelsesTypeChange} />
            <Sokeresultat
              tildelVeileder={actions.tildelVeileder}
              aktivEnhet={aktivEnhet}
              aktivVeilederinfo={aktivVeilederinfo}
              personregister={filtrerPersonregister(this.props.personregister, this.state.filter)}
            />
          </div>
        )}
      </div>
    );
  }
}

const OversiktHeader = (oversiktsType: OversiktProps) => {
  const { type } = oversiktsType;
  return (
    <div>
      {type === OVERSIKT_VISNING_TYPE.ENHETENS_OVERSIKT && (
        <h2>{tekster.overskrifter.enhetensOversikt}</h2>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: {
    hentEnhetensMoterForespurt: () => dispatch(hentEnhetensMoterForespurt()),
    hentPersonInfoForespurt: (fnrListe: Fodselsnummer[]) =>
      dispatch(hentPersonInfoForespurt(fnrListe)),
    hentPersonoversiktForespurt: () => dispatch(hentPersonoversiktForespurt()),
    hentVeilederenheter: () => dispatch(hentVeilederenheter()),
    tildelVeileder: (liste: VeilederArbeidstaker[]) =>
      dispatch(pushVeilederArbeidstakerForespurt(liste)),
  },
});

const mapStateToProps = (
  {
    personoversikt,
    enhetensMoter,
    personregister,
    veilederenheter,
    veilederinfo,
  }: ApplicationState,
  oversiktProps: OversiktProps
) => ({
  personregister,
  oversiktProps,
  aktivEnhet: veilederenheter.aktivEnhet,
  aktivVeilederinfo: veilederinfo.data,
  henterAlt:
    veilederenheter.henter ||
    veilederinfo.henter ||
    (personoversikt.henter && enhetensMoter.henter),
  noeErHentet:
    veilederenheter.hentet &&
    veilederinfo.hentet &&
    (personoversikt.hentet || enhetensMoter.hentet),
  altFeilet:
    veilederenheter.hentingFeilet ||
    veilederinfo.hentingFeilet ||
    (personoversikt.hentingFeilet && enhetensMoter.hentingFeilet),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OversiktCont);

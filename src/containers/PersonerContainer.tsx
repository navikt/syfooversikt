import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { hentPersonNavnForespurt } from '../store/personNavn/personNavn_actions';
import { MotebehovSvar } from '../store/enhetensMotebehov/enhetensMotebehovTypes';
import { ApplicationState } from '../store';
import Toolbar from '../components/toolbar/Toolbar';
import Personliste from '../components/Personliste';
import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { Fodselsnummer } from '../store/personNavn/personNavnTypes';

interface PersonerProps {
  svarListe: MotebehovSvar[];
}

interface StateProps {
  personregister: PersonregisterState;
}

interface DispatchProps {
  actions: {
    hentPersonNavnForespurt: typeof hentPersonNavnForespurt;
  };
}

type PersonlisteContainerProps = PersonerProps & StateProps & DispatchProps;

class PersonerContainer extends Component<PersonlisteContainerProps> {
  componentDidMount() {
    const {
      actions,
      svarListe,
    } = this.props;
    actions.hentPersonNavnForespurt(hentFodselsnummerFraMotebehovSvar(svarListe));
  }

  render() {
    const {
      svarListe,
      personregister,
    } = this.props;
    const fnrListe = hentFnrFraFodselsnummer(hentFodselsnummerFraMotebehovSvar(svarListe));
    return (<div>
      <Toolbar />
      <Personliste
        fnrListe={fnrListe}
        personregister={personregister}
      />
    </div>);
  }
}

const hentFodselsnummerFraMotebehovSvar = (svarListe: MotebehovSvar[]) => {
  return svarListe.map((motebehovSvar) => {
    return {fnr: motebehovSvar.fnr};
  });
};

const hentFnrFraFodselsnummer = (fodselsnummerListe: Fodselsnummer[]) => {
  return fodselsnummerListe.map((fodselsnummer) => {
    return fodselsnummer.fnr;
  });
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: PersonerProps) => ({
  actions: {
    hentPersonNavnForespurt: () => dispatch(hentPersonNavnForespurt(hentFodselsnummerFraMotebehovSvar(ownProps.svarListe))),
  },
});

const mapStateToProps = ({ personregister }: ApplicationState, ownProps: PersonerProps) => ({
  personregister,
  ownProps,
});

const PersonlisteContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonerContainer);

export default PersonlisteContainer;
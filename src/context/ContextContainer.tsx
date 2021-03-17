import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../store';
import { CONTEXT_EVENT_TYPE } from '../konstanter';
import { AlertStripeRod } from '../components/AlertStripeAdvarsel';
import {
  hentAktivEnhet,
  pushModiaContext,
} from '../store/modiacontext/modiacontext_actions';
import { HentAktivEnhetData } from '../store/modiacontext/modiacontextTypes';
import { hentVeilederinfo } from '../store/veilederinfo/veilederinfo_actions';
import { VeilederinfoState } from '../store/veilederinfo/veilederinfoTypes';
import { opprettWebsocketConnection } from './contextHolder';
import { config } from '../global';
import ChangeEnhetModal from './ChangeEnhetModal';

const tekster = {
  feil: {
    hentVeilederIdentFeilet: 'Det skjedde en feil: Vi fant ikke din ident',
  },
};

interface StateProps {
  veilederinfo: VeilederinfoState;
}

interface DispatchProps {
  doHentEnhet: typeof hentAktivEnhet;
}

type ContextContainerProps = StateProps & DispatchProps;

const Context = () => {
  const veilederinfo = useSelector(
    (state: ApplicationState) => state.veilederinfo
  );
  const dispatch = useDispatch();
  const doHentEnhet = (data: HentAktivEnhetData) =>
    dispatch(hentAktivEnhet(data));

  const [changedEnhet, setChangedEnhet] = useState(false);
  const [previousEnhet, setPreviousEnhet] = useState('');
  const [nextEnhet, setNextEnhet] = useState('');

  const opprettWSConnection = (props: ContextContainerProps) => {
    const ident = veilederinfo.data.ident;

    opprettWebsocketConnection(ident, (wsCallback) => {
      if (wsCallback.data === CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET) {
        doHentEnhet({
          callback: (aktivEnhet) => {
            if (config.config.initiellEnhet !== aktivEnhet) {
              setPreviousEnhet(config.config.initiellEnhet);
              setChangedEnhet(true);
              setNextEnhet(aktivEnhet);
            }
          },
        });
      }
    });
  };

  const updateEnhet = (enhet: string) => {
    config.config.initiellEnhet = enhet;
    dispatch(
      pushModiaContext({
        verdi: enhet,
        eventType: CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET,
      })
    );
    if ((window as any).renderDecoratorHead) {
      (window as any).renderDecoratorHead(config);
    }
    setPreviousEnhet('');
    setNextEnhet('');
    setChangedEnhet(false);
  };

  const keepEnhet = () => {
    if (previousEnhet !== '') {
      updateEnhet(previousEnhet);
    }
  };

  const changeEnhet = () => {
    if (nextEnhet !== '') {
      updateEnhet(nextEnhet);
    }
  };

  useEffect(() => {
    dispatch(hentVeilederinfo());
  }, []);

  useEffect(() => {
    if (veilederinfo.hentet) {
      opprettWSConnection({ doHentEnhet, veilederinfo });
    }
  }, [veilederinfo.hentet]);

  return (
    <div className="contextContainer">
      <ChangeEnhetModal
        isOpen={changedEnhet}
        keepEnhet={keepEnhet}
        changeEnhet={changeEnhet}
      />
      {veilederinfo.hentingFeilet &&
        AlertStripeRod(
          tekster.feil.hentVeilederIdentFeilet,
          'contextContainer__alertstripe'
        )}
    </div>
  );
};

export default Context;

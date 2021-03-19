import * as redux from 'react-redux';

interface Window {
  initialReduxState: any;
}

declare let config: {
  config: {
    dataSources: {
      veileder: string;
      enheter: string;
    };
    initiellEnhet: string;
    toggles: {
      visEnhetVelger: boolean;
      visVeileder: boolean;
      visSokefelt: boolean;
      toggleSendEventVedEnEnhet: boolean;
    };
    applicationName: string;
    handlePersonsokSubmit(nyttFnr: string): void;
    handleChangeEnhet(data: string): void;
  };
};

declare module 'react-redux' {
  // disse kan fjernes når react-redux oppdaterer sine type definitions
  export function useDispatch(): any;
  export function useSelector(selector: (state: any) => any): any;
}

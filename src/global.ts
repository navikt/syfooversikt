import { erHerokuApp, erLokal } from './utils/miljoUtil';

interface Config {
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
    handlePersonsokSubmit?: (data: string) => unknown;
    handleChangeEnhet?: (data: string) => unknown;
  };
}

export const config: Config = {
  config: {
    dataSources: {
      veileder: `${process.env.REACT_APP_SYFOMOTEADMIN_ROOT}/internad/veilederinfo`,
      enheter: `${process.env.REACT_APP_SYFOMOTEADMIN_ROOT}/internad/veilederinfo/enheter`,
    },
    initiellEnhet: erLokal() || erHerokuApp() ? '0316' : '',
    toggles: {
      visEnhetVelger: true,
      visVeileder: true,
      visSokefelt: true,
      toggleSendEventVedEnEnhet: false,
    },
    applicationName: 'Sykefraværsoppfølging',
    handlePersonsokSubmit: undefined,
    handleChangeEnhet: undefined,
  },
};

export const setEventHandlersOnConfig = (
  handlePersonsokSubmit: (fnr: string) => unknown,
  handleChangeEnhet: (data: string) => unknown
): void => {
  config.config.handlePersonsokSubmit = handlePersonsokSubmit;
  config.config.handleChangeEnhet = handleChangeEnhet;
};

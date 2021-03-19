import { erHerokuApp, erLokal } from './utils/miljoUtil';

export const config: any = {
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
    handlePersonsokSubmit: undefined,
    applicationName: 'Sykefraværsoppfølging',
    handleChangeEnhet: undefined,
  },
};

export const setEventHandlersOnConfig = (
  handlePersonsokSubmit: (fnr: string) => any,
  handleChangeEnhet: (data: string) => any
): void => {
  (config.config as any).handlePersonsokSubmit = handlePersonsokSubmit;
  (config.config as any).handleChangeEnhet = handleChangeEnhet;
};

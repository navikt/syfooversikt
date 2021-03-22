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

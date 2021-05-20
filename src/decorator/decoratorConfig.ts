import { DecoratorProps, EnhetDisplay, FnrDisplay } from './decoratorProps';

const RESET_VALUE = '\u0000';

const decoratorConfig = (
  setFnr: (fnr: string) => void,
  setEnhet: (enhet: string) => void
): DecoratorProps => {
  return {
    appname: 'Sykefraværsoppfølging',
    fnr: {
      initialValue: undefined,
      display: FnrDisplay.SOKEFELT,
      ignoreWsEvents: true,
      skipModal: true,
      onChange: (value) => {
        if (value) {
          setFnr(value);
        }
      },
    },
    enhet: {
      initialValue: undefined,
      display: EnhetDisplay.ENHET_VALG,
      onChange(value): void {
        if (value) {
          setEnhet(value);
        }
      },
    },
    toggles: {
      visVeileder: true,
    },
    useProxy: true,
  };
};

export default decoratorConfig;

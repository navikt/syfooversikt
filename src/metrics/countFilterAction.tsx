import { post } from '@/api';
import { HendelseTekster } from '@/components/HendelseTypeFilter';

export const CounterFilterActionTypes = {
  VEILEDER_SOK: 'veiledersok',
  COMPANY_FILTER: 'virksomheter',
  BIRTHDAY_FILTER: 'fodselsdato',
  ...HendelseTekster,
};

function* countFilterAction(value: string): Generator {
  let key: string;
  switch (value) {
    case CounterFilterActionTypes.MOTEBEHOV:
      key = 'motebehov';
      break;
    case CounterFilterActionTypes.MOTEPLANLEGGER_SVAR:
      key = 'moteplanlegger';
      break;
    case CounterFilterActionTypes.UFORDELTE_BRUKERE:
      key = 'ufordelte';
      break;
    case CounterFilterActionTypes.IKKE_I_AKTIVITET:
      key = 'ikkeaktivitet';
      break;
    case CounterFilterActionTypes.VEILEDER_SOK:
      key = CounterFilterActionTypes.VEILEDER_SOK;
      break;
    case CounterFilterActionTypes.BIRTHDAY_FILTER:
      key = CounterFilterActionTypes.BIRTHDAY_FILTER;
      break;
    case CounterFilterActionTypes.COMPANY_FILTER:
      key = CounterFilterActionTypes.COMPANY_FILTER;
      break;
    default:
      key = '';
  }
  yield post(`/metrics/actions/filters/${key}`, {});
}

export default countFilterAction;

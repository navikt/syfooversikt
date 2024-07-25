import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';

export interface AktivitetskravDTO {
  status: AktivitetskravStatus;
  vurderinger: AktivitetskravvurderingDTO[];
}

interface AktivitetskravvurderingDTO {
  status: AktivitetskravStatus;
  frist?: Date;
  varsel?: AktivitetskravVarselDTO;
}

interface AktivitetskravVarselDTO {
  svarfrist?: Date;
}

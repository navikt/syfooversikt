import {
  AktivitetskravStatus,
  AvventVurderingArsak,
} from '@/api/types/personoversiktTypes';

export interface AktivitetskravDTO {
  status: AktivitetskravStatus;
  vurderinger: AktivitetskravvurderingDTO[];
}

interface AktivitetskravvurderingDTO {
  status: AktivitetskravStatus;
  frist?: Date;
  varsel?: AktivitetskravVarselDTO;
  arsaker: AvventVurderingArsak[];
}

interface AktivitetskravVarselDTO {
  svarfrist?: Date;
}

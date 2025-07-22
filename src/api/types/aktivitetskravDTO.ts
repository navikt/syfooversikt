import {
  AktivitetskravStatus,
  AvventVurderingArsak,
} from '@/api/types/personoversiktTypes';

export interface AktivitetskravDTO {
  status: AktivitetskravStatus;
  vurderinger: AktivitetskravvurderingDTO[];
}

export interface AktivitetskravvurderingDTO {
  status: AktivitetskravStatus;
  frist?: Date;
  beskrivelse?: string;
  varsel?: AktivitetskravVarselDTO;
  arsaker: AvventVurderingArsak[];
}

interface AktivitetskravVarselDTO {
  svarfrist?: Date;
}

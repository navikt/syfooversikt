export interface DialogmotekandidatDTO {
  uuid: string;
  createdAt: Date;
  personident: string;
  isKandidat: boolean;
  avvent: AvventDTO | null;
}

export interface AvventDTO {
  uuid: string;
  createdAt: Date;
  frist: Date;
  createdBy: string;
  personident: string;
  beskrivelse: string;
}

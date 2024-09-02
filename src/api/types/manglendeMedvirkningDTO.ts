export interface ManglendeMedvirkningDTO {
  varsel: ManglendeMedvirkningVarselDTO | null;
}

interface ManglendeMedvirkningVarselDTO {
  svarfrist: Date;
}

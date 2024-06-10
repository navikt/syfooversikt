import React, { ReactElement } from 'react';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import { PersonData } from '@/api/types/personregisterTypes';
import { Tag } from '@navikt/ds-react';

interface Props {
  personData: PersonData;
}

export const VeilederColumn = ({ personData }: Props): ReactElement => {
  const { data } = useVeiledereQuery();

  const tildeltVeilederIdent = personData.tildeltVeilederIdent;

  if (!tildeltVeilederIdent) {
    return (
      <Tag variant="info" size="small" className="p-1 rounded">
        Ufordelt bruker
      </Tag>
    );
  }

  const tildeltVeileder = data?.find((v) => v.ident === tildeltVeilederIdent);
  const veilederNavn = tildeltVeileder?.fornavn
    ? `${tildeltVeileder.etternavn}, ${tildeltVeileder.fornavn}`
    : tildeltVeilederIdent;

  return (
    <label className="overflow-hidden overflow-ellipsis">{veilederNavn}</label>
  );
};

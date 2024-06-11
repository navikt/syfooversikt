import React, { ReactElement } from 'react';
import { useVeiledereQuery } from '@/data/veiledereQueryHooks';
import { PersonData } from '@/api/types/personregisterTypes';
import { Tag } from '@navikt/ds-react';

const VeilederName = ({ veilederIdent }: { veilederIdent: string }) => {
  const { data } = useVeiledereQuery();
  const tildeltVeileder = data?.find((v) => v.ident === veilederIdent);
  const veilederNavn = tildeltVeileder?.fornavn
    ? `${tildeltVeileder.etternavn}, ${tildeltVeileder.fornavn}`
    : veilederIdent;

  return (
    <label className="overflow-hidden overflow-ellipsis">{veilederNavn}</label>
  );
};

export const VeilederColumn = ({
  personData,
}: {
  personData: PersonData;
}): ReactElement => {
  const tildeltVeilederIdent = personData.tildeltVeilederIdent;

  return tildeltVeilederIdent ? (
    <VeilederName veilederIdent={tildeltVeilederIdent} />
  ) : (
    <Tag variant="info" size="small" className="p-1 rounded">
      Ufordelt bruker
    </Tag>
  );
};

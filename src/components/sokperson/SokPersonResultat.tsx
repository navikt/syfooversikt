import React, { ReactElement } from 'react';
import { useSorting } from '@/hooks/useSorting';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { BodyShort, Box, Table } from '@navikt/ds-react';
import { LinkSyfomodiaperson } from '@/components/LinkSyfomodiaperson';
import { toLastnameFirstnameFormat } from '@/utils/stringUtil';
import { toPersonData } from '@/utils/toPersondata';

const texts = {
  noResults: {
    first: 'Fant ingen sykmeldte personer for søkeparameterne.',
    second:
      'Det kan hende personen ikke er sykmeldt eller at du ikke har tilgang å se personen.',
  },
};

interface Props {
  sokeresultater: PersonOversiktStatusDTO[];
}

export default function SokPersonResultat({
  sokeresultater,
}: Props): ReactElement {
  const { columns: allColumns } = useSorting();
  const columns = allColumns.filter(
    (column) => column.sortKey === 'NAME' || column.sortKey === 'FNR'
  );

  const personer = Object.entries(toPersonData(sokeresultater, []));

  return personer.length === 0 ? (
    <Box>
      <BodyShort>{texts.noResults.first}</BodyShort>
      <BodyShort>{texts.noResults.second}</BodyShort>
    </Box>
  ) : (
    <Table size="small" zebraStripes className="bg-white mt-2">
      <Table.Header>
        <Table.Row>
          {columns.map((col, index) => (
            <Table.ColumnHeader key={index} sortKey={col.sortKey}>
              {col.sortingText}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {personer.map(([fnr, persondata], index) => (
          <Table.Row key={index}>
            <Table.HeaderCell scope="row" textSize="small">
              {persondata.navn.length > 0 && (
                <LinkSyfomodiaperson
                  personData={persondata}
                  personident={fnr}
                  linkText={toLastnameFirstnameFormat(persondata.navn)}
                />
              )}
            </Table.HeaderCell>
            <Table.DataCell textSize="small">
              {persondata.navn.length > 0 ? (
                fnr
              ) : (
                <LinkSyfomodiaperson
                  personData={persondata}
                  personident={fnr}
                  linkText={fnr}
                />
              )}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

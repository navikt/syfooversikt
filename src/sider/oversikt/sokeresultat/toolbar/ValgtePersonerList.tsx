import React from "react";
import { Box, List } from "@navikt/ds-react";
import { useGetPersonstatusQuery } from "@/data/personoversiktHooks";

interface Props {
  selectedPersoner: string[];
}

/**
 * Lists the selected sykmeldte with their fnr and virksomheter.
 */
export default function ValgtePersonerList({ selectedPersoner }: Props) {
  const { data: personoversikt } = useGetPersonstatusQuery();
  const selectedPersonerInfo = personoversikt.filter((person) =>
    selectedPersoner.includes(person.fnr),
  );

  return (
    <Box marginBlock="space-16" asChild>
      <List data-aksel-migrated-v8 as="ul">
        {selectedPersonerInfo.map((person) => {
          const virksomhetList =
            person.latestOppfolgingstilfelle?.virksomhetList;
          const virksomhetText = virksomhetList
            ?.map((v) => v.virksomhetsnavn)
            .join(", ");
          return (
            <List.Item key={person.fnr}>
              <span>
                {`${person.navn} (${person.fnr}). `}
                {virksomhetList?.length ? `Virksomhet: ` : "Uten virksomhet"}
                <b>{virksomhetText}</b>
              </span>
            </List.Item>
          );
        })}
      </List>
    </Box>
  );
}

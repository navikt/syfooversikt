import React, { useState } from "react";
import { virksomhetnummerFromPersonData } from "@/utils/personDataUtil";
import { BodyShort, Button } from "@navikt/ds-react";
import { PersonData } from "@/api/types/personregisterTypes";
import { useVirksomheterQueries } from "@/data/virksomhet/virksomhetQueryHooks";
import { getVirksomhetsnavn } from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { VirksomhetDataCell } from "@/sider/oversikt/sokeresultat/oversikttable/virksomhetDataCell/VirksomhetDataCell.tsx";
import {
  enrichWithJuridiskeVirksomheter,
  getJuridiskEnhetOrganisasjonsnummer,
} from "@/utils/virksomhetUtil";

const TILFELLER_TO_SHOW_DEFAULT = 2;

const texts = {
  showMore: (amount: number) => `Vis ${amount} flere`,
  showFewer: "Vis færre",
  virksomheterError: "Klarte ikke hente virksomheter",
};

interface Props {
  personData: PersonData;
}

export function VirksomhetColumn({ personData }: Props) {
  const [virksomhetExpanded, setVirksomhetExpanded] = useState(false);

  const virksomhetsnummerList = virksomhetnummerFromPersonData(personData);
  const virksomheter = useVirksomheterQueries(virksomhetsnummerList, true);
  const juridiskeVirksomhetsnumre = virksomheter.data
    .map(getJuridiskEnhetOrganisasjonsnummer)
    .filter((nummer) => nummer !== undefined);
  const juridiskeVirksomheter = useVirksomheterQueries(
    juridiskeVirksomhetsnumre,
  );

  if (virksomheter.isPending) {
    return null;
  }

  if (virksomheter.isError) {
    return (
      <BodyShort size="small" className="m-0 italic">
        {texts.virksomheterError}
      </BodyShort>
    );
  }

  const virksomheterSorted = enrichWithJuridiskeVirksomheter(
    virksomheter.data,
    juridiskeVirksomheter.data,
  ).sort((a, b) => {
    const navnA = getVirksomhetsnavn(a);
    const navnB = getVirksomhetsnavn(b);
    return navnA.localeCompare(navnB);
  });
  const showAllVirksomheter =
    virksomhetExpanded ||
    virksomheterSorted.length <= TILFELLER_TO_SHOW_DEFAULT + 1;
  const virksomheterToShow = showAllVirksomheter
    ? virksomheterSorted
    : virksomheterSorted.slice(0, TILFELLER_TO_SHOW_DEFAULT);

  return (
    <div>
      {virksomheterToShow.map((virksomhet, index) => (
        <VirksomhetDataCell key={index} virksomhet={virksomhet} />
      ))}
      {virksomheterSorted.length > TILFELLER_TO_SHOW_DEFAULT + 1 && (
        <Button
          className={"w-fit mt-2"}
          variant={"secondary"}
          size={"xsmall"}
          onClick={() => setVirksomhetExpanded(!virksomhetExpanded)}
        >
          {virksomhetExpanded
            ? texts.showFewer
            : texts.showMore(
                virksomheterSorted.length - TILFELLER_TO_SHOW_DEFAULT,
              )}
        </Button>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { virksomhetnummerFromPersonData } from "@/utils/personDataUtil";
import { BodyShort, Button } from "@navikt/ds-react";
import { PersonData } from "@/api/types/personregisterTypes";
import { useVirksomheterQueries } from "@/data/virksomhet/virksomhetQueryHooks";
import { getVirksomhetsnavn } from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { VirksomhetDataCell } from "@/sider/oversikt/sokeresultat/oversikttable/virksomhetDataCell/VirksomhetDataCell.tsx";
import {
  enrichWithOverordnedeEnheter,
  getOverordnetEnhetOrganisasjonsnummer,
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
  const [isVirksomhetExpanded, setIsVirksomhetExpanded] = useState(false);

  const virksomhetsnummerList = virksomhetnummerFromPersonData(personData);
  const virksomheter = useVirksomheterQueries(virksomhetsnummerList, true);
  const overordnedeEnhetsnumre = virksomheter.data
    .map(getOverordnetEnhetOrganisasjonsnummer)
    .filter((nummer) => nummer !== null);
  const overordnedeEnheter = useVirksomheterQueries(overordnedeEnhetsnumre);

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

  const virksomheterSorted = enrichWithOverordnedeEnheter(
    virksomheter.data,
    overordnedeEnheter.data,
  ).sort((a, b) => {
    const navnA = getVirksomhetsnavn(a);
    const navnB = getVirksomhetsnavn(b);
    return navnA.localeCompare(navnB);
  });
  const isShowingAllVirksomheter =
    isVirksomhetExpanded ||
    virksomheterSorted.length <= TILFELLER_TO_SHOW_DEFAULT + 1;
  const virksomheterToShow = isShowingAllVirksomheter
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
          onClick={() => setIsVirksomhetExpanded(!isVirksomhetExpanded)}
        >
          {isVirksomhetExpanded
            ? texts.showFewer
            : texts.showMore(
                virksomheterSorted.length - TILFELLER_TO_SHOW_DEFAULT,
              )}
        </Button>
      )}
    </div>
  );
}

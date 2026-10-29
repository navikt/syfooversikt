import React, { useState } from "react";
import { virksomhetnummerFromPersonData } from "@/utils/personDataUtil";
import { BodyShort, Button } from "@navikt/ds-react";
import { PersonData } from "@/api/types/personregisterTypes";
import { useVirksomheterQueries } from "@/data/virksomhet/virksomhetQueryHooks";
import { getVirksomhetsnavn } from "@/data/virksomhet/EregVirksomhetsnavn.ts";

const TILFELLER_TO_SHOW_DEFAULT = 2;

const texts = {
  showMore: (amount: number) => `Vis ${amount} flere`,
  showFewer: "Vis færre",
};

interface PersonRadVirksomhetColumnProps {
  personData: PersonData;
}

export const PersonRadVirksomhetColumn = ({
  personData,
}: PersonRadVirksomhetColumnProps) => {
  const [virksomhetExpanded, setVirksomhetExpanded] = useState(false);

  const virksomhetsnummerList = virksomhetnummerFromPersonData(personData);
  const virksomheter = useVirksomheterQueries(virksomhetsnummerList);

  if (virksomheter.isPending || virksomheter.isError) {
    return null;
  }

  const virksomheterSorted = virksomheter.data.sort((a, b) => {
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
        <BodyShort size="small" key={index} className="m-0">
          {getVirksomhetsnavn(virksomhet)}
        </BodyShort>
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
};

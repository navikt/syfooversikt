import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { PersonRadVirksomhetColumn } from "@/sider/oversikt/sokeresultat/oversikttable/PersonRadVirksomhetColumn";
import { PersonData } from "@/api/types/personregisterTypes";
import { virksomhetQueryKeys } from "@/data/virksomhet/virksomhetQueryHooks";
import { EREG_ROOT } from "@/apiConstants";
import { personregister, testdata } from "../data/fellesTestdata";
import { testQueryClient } from "../testQueryClient";
import { mockServer } from "../setup";

const virksomheter = Array.from({ length: 5 }, (_, index) => ({
  virksomhetsnummer: `98765432${index}`,
  navn: { navnelinje1: `Virksomhet ${index + 1}` },
}));
const firstVirksomhet = virksomheter[0]!;
const firstVirksomhetQueryKey = virksomhetQueryKeys.virksomhet(
  firstVirksomhet.virksomhetsnummer,
);
const firstVirksomhetUrl = `${EREG_ROOT}/organisasjon/${firstVirksomhet.virksomhetsnummer}`;

let queryClient = testQueryClient();

function getPersonData(antallVirksomheter: number): PersonData {
  return {
    ...personregister[testdata.fnr1],
    latestOppfolgingstilfelle: {
      oppfolgingstilfelleStart: new Date("2026-01-01"),
      oppfolgingstilfelleEnd: new Date("2026-02-01"),
      varighetUker: 4,
      virksomhetList: virksomheter
        .slice(0, antallVirksomheter)
        .map(({ virksomhetsnummer }) => ({ virksomhetsnummer })),
    },
  };
}

function renderColumn(personData: PersonData) {
  return render(
    <QueryClientProvider client={queryClient}>
      <PersonRadVirksomhetColumn personData={personData} />
    </QueryClientProvider>,
  );
}

describe("PersonRadVirksomhetColumn", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    virksomheter.forEach(({ virksomhetsnummer, navn }) => {
      queryClient.setQueryData(
        virksomhetQueryKeys.virksomhet(virksomhetsnummer),
        { navn },
      );
    });
  });

  describe("inntil tre virksomheter", () => {
    it.each([0, 1, 2, 3])(
      "viser alle %i virksomheter uten utvidelsesknapp",
      (antallVirksomheter) => {
        const personData = getPersonData(antallVirksomheter);

        const { container } = renderColumn(personData);

        expect(container.querySelectorAll("p")).to.have.length(
          antallVirksomheter,
        );
        virksomheter.slice(0, antallVirksomheter).forEach(({ navn }) => {
          expect(screen.getByText(navn.navnelinje1)).to.exist;
        });
        expect(screen.queryByRole("button")).to.not.exist;
      },
    );

    it("viser ingenting når personen mangler oppfølgingstilfelle", () => {
      const personData = {
        ...getPersonData(0),
        latestOppfolgingstilfelle: undefined,
      };

      const { container } = renderColumn(personData);

      expect(container.textContent).to.equal("");
      expect(screen.queryByRole("button")).to.not.exist;
    });
  });

  describe("flere enn tre virksomheter", () => {
    it.each([4, 5])(
      "viser to av %i virksomheter og riktig antall skjulte",
      (antallVirksomheter) => {
        const personData = getPersonData(antallVirksomheter);

        renderColumn(personData);

        expect(screen.getByText("Virksomhet 1")).to.exist;
        expect(screen.getByText("Virksomhet 2")).to.exist;
        virksomheter.slice(2, antallVirksomheter).forEach(({ navn }) => {
          expect(screen.queryByText(navn.navnelinje1)).to.not.exist;
        });
        expect(
          screen.getByRole("button", {
            name: `Vis ${antallVirksomheter - 2} flere`,
          }),
        ).to.exist;
      },
    );

    it("utvider listen og skjuler ekstra virksomheter igjen", async () => {
      const user = userEvent.setup();
      renderColumn(getPersonData(5));

      await user.click(screen.getByRole("button", { name: "Vis 3 flere" }));

      virksomheter.forEach(({ navn }) => {
        expect(screen.getByText(navn.navnelinje1)).to.exist;
      });
      expect(screen.getByRole("button", { name: "Vis færre" })).to.exist;

      await user.click(screen.getByRole("button", { name: "Vis færre" }));

      expect(screen.getByText("Virksomhet 1")).to.exist;
      expect(screen.getByText("Virksomhet 2")).to.exist;
      virksomheter.slice(2).forEach(({ navn }) => {
        expect(screen.queryByText(navn.navnelinje1)).to.not.exist;
      });
      expect(screen.getByRole("button", { name: "Vis 3 flere" })).to.exist;
    });
  });

  describe("lasting og feil", () => {
    it("viser ingenting før alle virksomheter er hentet", async () => {
      queryClient.removeQueries({ queryKey: firstVirksomhetQueryKey });
      mockServer.use(
        http.get(firstVirksomhetUrl, () =>
          HttpResponse.json({ navn: firstVirksomhet.navn }),
        ),
      );

      const { container } = renderColumn(getPersonData(4));

      expect(container.textContent).to.equal("");
      expect(screen.queryByRole("button")).to.not.exist;
      expect(await screen.findByText("Virksomhet 1")).to.exist;
      expect(screen.getByText("Virksomhet 2")).to.exist;
      expect(screen.getByRole("button", { name: "Vis 2 flere" })).to.exist;
    });

    it("viser ingenting hvis henting av en virksomhet feiler", async () => {
      queryClient.removeQueries({ queryKey: firstVirksomhetQueryKey });
      mockServer.use(
        http.get(firstVirksomhetUrl, () =>
          HttpResponse.json({}, { status: 500 }),
        ),
      );

      const { container } = renderColumn(getPersonData(4));
      await waitFor(() => {
        expect(
          queryClient.getQueryState(firstVirksomhetQueryKey)?.status,
        ).to.equal("error");
      });

      expect(container.textContent).to.equal("");
      expect(screen.queryByRole("button")).to.not.exist;
    });
  });
});

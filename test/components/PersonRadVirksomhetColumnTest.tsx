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
import { aktivEnhetMock } from "@/mocks/data/aktivEnhetMock.ts";
import { NotificationProvider } from "@/context/notification/NotificationContext.tsx";
import { AktivEnhetContext } from "@/context/aktivEnhet/AktivEnhetContext";
import { unleashQueryKeys } from "@/data/unleash/unleashQueryHooks";
import { defaultToggles } from "@/data/unleash/types/unleash_types";
import { veiledereQueryKeys } from "@/data/veiledereQueryHooks";
import { veilederMock } from "@/mocks/syfoveileder/veilederMock";

const virksomheter = Array.from({ length: 5 }, (_, index) => ({
  virksomhetsnummer: `98765432${index}`,
  navn: { navnelinje1: `Virksomhet ${index + 1}` },
}));
// The fixture always creates five virksomheter.
const firstVirksomhet = virksomheter[0]!;
const firstVirksomhetQueryKey = virksomhetQueryKeys.virksomhet(
  firstVirksomhet.virksomhetsnummer,
);
const firstVirksomhetUrl = `${EREG_ROOT}/organisasjon/${firstVirksomhet.virksomhetsnummer}`;
const togglesQueryKey = unleashQueryKeys.toggles(
  aktivEnhetMock.aktivEnhet,
  veilederMock.ident,
);

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
    <NotificationProvider>
      <AktivEnhetContext.Provider
        value={{
          aktivEnhet: aktivEnhetMock.aktivEnhet,
          handleAktivEnhetChanged: () => void 0,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <PersonRadVirksomhetColumn personData={personData} />
        </QueryClientProvider>
      </AktivEnhetContext.Provider>
    </NotificationProvider>,
  );
}

describe("PersonRadVirksomhetColumn", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    queryClient.setQueryDefaults(veiledereQueryKeys.veiledereInfo, {
      staleTime: Infinity,
    });
    queryClient.setQueryDefaults(togglesQueryKey, { staleTime: Infinity });
    queryClient.setQueryData(veiledereQueryKeys.veiledereInfo, veilederMock);
    queryClient.setQueryData(togglesQueryKey, {
      ...defaultToggles,
      isBransjerEnabled: true,
    });
    virksomheter.forEach(({ virksomhetsnummer, navn }) => {
      queryClient.setQueryData(
        virksomhetQueryKeys.virksomhet(virksomhetsnummer),
        { navn },
      );
    });
  });

  describe("inntil tre virksomheter", () => {
    it.each([0, 1, 2, 3])(
      "viser alle %i virksomheter med popoverknapper uten listeutvidelse",
      (antallVirksomheter) => {
        const personData = getPersonData(antallVirksomheter);

        const { container } = renderColumn(personData);

        expect(container.querySelectorAll("p")).to.have.length(
          antallVirksomheter,
        );
        virksomheter.slice(0, antallVirksomheter).forEach(({ navn }) => {
          expect(screen.getByText(navn.navnelinje1, { selector: "p" })).to
            .exist;
        });
        expect(
          screen.queryAllByRole("button", { name: "Se virksomhet" }),
        ).to.have.length(antallVirksomheter);
        expect(screen.queryByRole("button", { name: /Vis .* flere/ })).to.not
          .exist;
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

  describe("bransje i popover", () => {
    it.each([
      { isBransjerEnabled: true, hasNaringer: true },
      { isBransjerEnabled: false, hasNaringer: true },
      { isBransjerEnabled: true, hasNaringer: false },
    ])(
      "viser alltid popoverknappen med bransjetoggle=$isBransjerEnabled og naringer=$hasNaringer",
      async ({ isBransjerEnabled, hasNaringer }) => {
        const user = userEvent.setup();
        queryClient.setQueryData(togglesQueryKey, {
          ...defaultToggles,
          isBransjerEnabled,
        });
        queryClient.setQueryData(firstVirksomhetQueryKey, {
          type: "Virksomhet",
          navn: firstVirksomhet.navn,
          organisasjonDetaljer: {
            naeringer: hasNaringer
              ? [
                  {
                    naeringskode: "62.200",
                    bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
                  },
                ]
              : [],
          },
        });
        renderColumn(getPersonData(1));

        await user.click(screen.getByRole("button", { name: "Se virksomhet" }));

        const virksomhetHeading = await screen.findByRole("heading", {
          name: firstVirksomhet.navn.navnelinje1,
        });
        expect(virksomhetHeading).to.exist;
        if (isBransjerEnabled && hasNaringer) {
          expect(await screen.findByRole("heading", { name: "Bransje" })).to
            .exist;
          expect(screen.getByText("IKT-virksomhet")).to.exist;
          expect(screen.getByRole("link", { name: "Les mer om bransjer" })).to
            .exist;
        } else {
          expect(screen.queryByRole("heading", { name: "Bransje" })).to.not
            .exist;
          expect(screen.queryByText("IKT-virksomhet")).to.not.exist;
          expect(screen.queryByRole("link", { name: "Les mer om bransjer" })).to
            .not.exist;
        }
        expect(
          screen
            .getByRole("button", { name: "Se virksomhet" })
            .getAttribute("aria-expanded"),
        ).to.equal("true");
      },
    );
  });

  describe("flere enn tre virksomheter", () => {
    it.each([4, 5])(
      "viser to av %i virksomheter og riktig antall skjulte",
      (antallVirksomheter) => {
        const personData = getPersonData(antallVirksomheter);

        renderColumn(personData);

        expect(screen.getByText("Virksomhet 1", { selector: "p" })).to.exist;
        expect(screen.getByText("Virksomhet 2", { selector: "p" })).to.exist;
        virksomheter.slice(2, antallVirksomheter).forEach(({ navn }) => {
          expect(screen.queryByText(navn.navnelinje1, { selector: "p" })).to.not
            .exist;
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
        expect(screen.getByText(navn.navnelinje1, { selector: "p" })).to.exist;
      });
      expect(screen.getByRole("button", { name: "Vis færre" })).to.exist;

      await user.click(screen.getByRole("button", { name: "Vis færre" }));

      expect(screen.getByText("Virksomhet 1", { selector: "p" })).to.exist;
      expect(screen.getByText("Virksomhet 2", { selector: "p" })).to.exist;
      virksomheter.slice(2).forEach(({ navn }) => {
        expect(screen.queryByText(navn.navnelinje1, { selector: "p" })).to.not
          .exist;
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
      expect(await screen.findByText("Virksomhet 1", { selector: "p" })).to
        .exist;
      expect(screen.getByText("Virksomhet 2", { selector: "p" })).to.exist;
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

      expect(container.textContent).to.equal("Klarte ikke hente virksomheter");
      expect(screen.queryByRole("button")).to.not.exist;
    });
  });
});

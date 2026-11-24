import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { VirksomhetColumn } from "@/sider/oversikt/sokeresultat/oversikttable/VirksomhetColumn.tsx";
import { PersonData } from "@/api/types/personregisterTypes";
import { virksomhetQueryKeys } from "@/data/virksomhet/virksomhetQueryHooks";
import { EREG_ROOT, SYFOPERSON_ROOT } from "@/apiConstants";
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
  true,
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
          <VirksomhetColumn personData={personData} />
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
        virksomhetQueryKeys.virksomhet(virksomhetsnummer, true),
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

  describe("sektor in popover", () => {
    it.each(["JuridiskEnhet", "Organisasjonsledd"])(
      "lazily fetches and displays the matching sector name from %s",
      async (type) => {
        const user = userEvent.setup();
        let requestCount = 0;
        let requestedStandard = "";
        const sektorkode = type === "Organisasjonsledd" ? "6100" : "2100";
        queryClient.setQueryData(firstVirksomhetQueryKey, {
          type: "Virksomhet",
          navn: firstVirksomhet.navn,
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: "987654329" }],
          ...(type === "Organisasjonsledd"
            ? {
                bestaarAvOrganisasjonsledd: [
                  {
                    organisasjonsledd: {
                      type,
                      organisasjonsnummer: "987654330",
                      inngaarIJuridiskEnheter: [
                        { organisasjonsnummer: "987654329" },
                      ],
                    },
                  },
                ],
              }
            : {}),
        });
        queryClient.setQueryData(virksomhetQueryKeys.virksomhet("987654329"), {
          type: "JuridiskEnhet",
          organisasjonsnummer: "987654329",
          juridiskEnhetDetaljer: { sektorkode: "2100" },
        });
        queryClient.setQueryData(virksomhetQueryKeys.virksomhet("987654330"), {
          type: "Organisasjonsledd",
          organisasjonsnummer: "987654330",
          organisasjonsleddDetaljer: { sektorkode: "6100" },
        });
        mockServer.use(
          http.get(
            `${SYFOPERSON_ROOT}/sektorkode/${sektorkode}`,
            ({ request }) => {
              requestCount++;
              requestedStandard =
                new URL(request.url).searchParams.get("standard") ?? "";
              return HttpResponse.json({
                standard: 2012,
                hierarki: [
                  {
                    code: sektorkode,
                    name: "Kodenhet",
                    parentCode: null,
                    level: 1,
                  },
                ],
              });
            },
          ),
        );
        renderColumn(getPersonData(1));

        expect(requestCount).toBe(0);
        await user.click(screen.getByRole("button", { name: "Se virksomhet" }));

        expect(await screen.findByRole("heading", { name: "Sektor" })).to.exist;
        expect(await screen.findByText("Kodenhet")).to.exist;
        expect(requestedStandard).toBe("2012");
        expect(requestCount).toBe(1);
      },
    );

    it.each(["JuridiskEnhet", "Organisasjonsledd"])(
      "keeps the raw sector code from %s and organisation name when lookup fails",
      async (type) => {
        const user = userEvent.setup();
        queryClient.setQueryData(firstVirksomhetQueryKey, {
          type: "Virksomhet",
          navn: firstVirksomhet.navn,
          ...(type === "JuridiskEnhet"
            ? {
                inngaarIJuridiskEnheter: [{ organisasjonsnummer: "987654329" }],
              }
            : {
                bestaarAvOrganisasjonsledd: [
                  {
                    organisasjonsledd: {
                      type,
                      organisasjonsnummer: "987654329",
                    },
                  },
                ],
              }),
        });
        queryClient.setQueryData(virksomhetQueryKeys.virksomhet("987654329"), {
          type,
          organisasjonsnummer: "987654329",
          ...(type === "JuridiskEnhet"
            ? { juridiskEnhetDetaljer: { sektorkode: "9999" } }
            : { organisasjonsleddDetaljer: { sektorkode: "9999" } }),
        });
        mockServer.use(
          http.get(`${SYFOPERSON_ROOT}/sektorkode/9999`, () =>
            HttpResponse.json({}, { status: 502 }),
          ),
        );
        renderColumn(getPersonData(1));

        await user.click(screen.getByRole("button", { name: "Se virksomhet" }));

        expect(await screen.findByText("Klarte ikke hente sektornavn")).to
          .exist;
        expect(screen.getByText("9999")).to.exist;
        expect(
          screen.getByRole("heading", {
            name: firstVirksomhet.navn.navnelinje1,
          }),
        ).to.exist;
      },
    );

    it("does not use the legal entity's sector when the nearest section has no sector code", async () => {
      const user = userEvent.setup();
      let requestCount = 0;
      queryClient.setQueryData(firstVirksomhetQueryKey, {
        type: "Virksomhet",
        navn: firstVirksomhet.navn,
        inngaarIJuridiskEnheter: [{ organisasjonsnummer: "987654330" }],
        bestaarAvOrganisasjonsledd: [
          {
            organisasjonsledd: {
              type: "Organisasjonsledd",
              organisasjonsnummer: "987654329",
            },
          },
        ],
      });
      queryClient.setQueryData(virksomhetQueryKeys.virksomhet("987654329"), {
        type: "Organisasjonsledd",
        organisasjonsnummer: "987654329",
      });
      queryClient.setQueryData(virksomhetQueryKeys.virksomhet("987654330"), {
        type: "JuridiskEnhet",
        organisasjonsnummer: "987654330",
        juridiskEnhetDetaljer: { sektorkode: "6100" },
      });
      mockServer.use(
        http.get(`${SYFOPERSON_ROOT}/sektorkode/*`, () => {
          requestCount++;
          return HttpResponse.json({ standard: 2012, hierarki: [] });
        }),
      );
      renderColumn(getPersonData(1));

      await user.click(screen.getByRole("button", { name: "Se virksomhet" }));

      expect(screen.queryByRole("heading", { name: "Sektor" })).to.not.exist;
      expect(requestCount).toBe(0);
    });
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
    it.each(["JuridiskEnhet", "Organisasjonsledd"])(
      "beholder virksomheten mens overordnet enhet (%s) lastes og hvis oppslaget feiler",
      async (type) => {
        const overordnetEnhetQueryKey =
          virksomhetQueryKeys.virksomhet("987654329");
        let releaseResponse = () => {};
        const responseReady = new Promise<void>((resolve) => {
          releaseResponse = resolve;
        });
        queryClient.setQueryData(firstVirksomhetQueryKey, {
          type: "Virksomhet",
          navn: firstVirksomhet.navn,
          ...(type === "JuridiskEnhet"
            ? {
                inngaarIJuridiskEnheter: [{ organisasjonsnummer: "987654329" }],
              }
            : {
                bestaarAvOrganisasjonsledd: [
                  {
                    organisasjonsledd: {
                      type: "Organisasjonsledd",
                      organisasjonsnummer: "987654329",
                    },
                  },
                ],
              }),
        });
        mockServer.use(
          http.get(`${EREG_ROOT}/organisasjon/987654329`, async () => {
            await responseReady;
            return HttpResponse.json({}, { status: 502 });
          }),
        );

        renderColumn(getPersonData(1));

        try {
          await waitFor(() => {
            expect(
              queryClient.getQueryState(overordnetEnhetQueryKey)?.fetchStatus,
            ).toBe("fetching");
          });
          expect(
            screen.getByText(firstVirksomhet.navn.navnelinje1, {
              selector: "p",
            }),
          ).to.exist;
          expect(screen.getByRole("button", { name: "Se virksomhet" })).to
            .exist;
        } finally {
          releaseResponse();
        }

        await waitFor(() => {
          expect(
            queryClient.getQueryState(overordnetEnhetQueryKey)?.status,
          ).toBe("error");
        });
        expect(
          screen.getByText(firstVirksomhet.navn.navnelinje1, { selector: "p" }),
        ).to.exist;
        expect(screen.queryByText("Klarte ikke hente virksomheter")).to.not
          .exist;
      },
    );

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

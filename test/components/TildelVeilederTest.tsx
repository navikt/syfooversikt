import { beforeEach, describe, expect, it } from "vitest";
import {
  getQueryClientWithMockdata,
  testQueryClient,
} from "../testQueryClient";
import { renderWithRouter } from "../testRenderUtils";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { AktivEnhetContext } from "@/context/aktivEnhet/AktivEnhetContext";
import { aktivEnhetMock } from "@/mocks/data/aktivEnhetMock";
import { routes } from "@/routers/routes";
import React from "react";
import TildelVeilederModal from "@/sider/oversikt/sokeresultat/toolbar/TildelVeileder/TildelVeilederModal";
import TildelVeilederButton from "@/sider/oversikt/sokeresultat/toolbar/TildelVeileder/TildelVeilederButton";
import { veiledereQueryKeys } from "@/data/veiledereQueryHooks";
import { veiledereMock } from "@/mocks/data/veiledereMock";
import { screen } from "@testing-library/react";
import { personoversiktEnhetMock } from "@/mocks/data/personoversiktEnhetMock";
import userEvent from "@testing-library/user-event";
import { getVeilederLabelWithIdent } from "@/utils/veiledereUtils";
import { FeedbackNotification } from "@/sider/oversikt/sokeresultat/toolbar/Toolbar";

let queryClient = testQueryClient();
const aktivEnhet = aktivEnhetMock.aktivEnhet;
const selectedFnr = personoversiktEnhetMock[0]?.fnr || "";
const modalRef = React.createRef<HTMLDialogElement>();
const enabledVeiledere = veiledereMock.filter((veileder) => veileder.enabled);
const veilederToChoose = enabledVeiledere.find(
  (veileder) => veileder.fornavn !== "",
)!; // The mock data contains named, enabled veiledere

function renderWithProviders(children: React.ReactElement) {
  return renderWithRouter(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          {children}
        </AktivEnhetContext.Provider>
      </QueryClientProvider>
    </NotificationProvider>,
    routes.ENHET_OVERSIKT,
  );
}

describe("TildelVeileder", () => {
  beforeEach(() => {
    queryClient = getQueryClientWithMockdata();
    queryClient.setQueriesData(
      { queryKey: veiledereQueryKeys.veiledereForEnhet(aktivEnhet) },
      () => veiledereMock,
    );
  });

  describe("TildelVeilederButton", () => {
    it("viser feilmelding når ingen personer er valgt", async () => {
      let notification: FeedbackNotification | undefined;
      renderWithProviders(
        <TildelVeilederButton
          modalRef={modalRef}
          selectedPersoner={[]}
          setTableFeedbackNotification={(value) => (notification = value)}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Tildel veileder" }),
      );

      expect(notification?.type).to.equal("error");
    });
  });

  describe("TildelVeilederModal", () => {
    const renderModal = (
      setSelectedPersoner: (personer: string[]) => void = () => void 0,
    ) =>
      renderWithProviders(
        <TildelVeilederModal
          ref={modalRef}
          selectedPersoner={[selectedFnr]}
          setSelectedPersoner={setSelectedPersoner}
        />,
      );

    it("viser bare enabled veiledere som valg", async () => {
      renderModal();

      const options = await screen.findAllByRole("option", { hidden: true });

      expect(options).toHaveLength(enabledVeiledere.length);
    });

    it("kan søke på ident", async () => {
      renderModal();

      await userEvent.type(
        await screen.findByRole("combobox", { hidden: true }),
        veilederToChoose.ident,
      );

      expect(
        screen.getByRole("option", {
          name: getVeilederLabelWithIdent(veilederToChoose),
          hidden: true,
        }),
      ).to.exist;
    });

    it("viser feilmelding når man tildeler uten å velge veileder", async () => {
      renderModal();

      await userEvent.click(
        await screen.findByRole("button", {
          name: "Tildel veileder",
          hidden: true,
        }),
      );

      expect(screen.getByText("Du må velge en veileder for å kunne tildele."))
        .to.exist;
    });

    it("sender riktige verdier og tømmer valgte personer når man tildeler", async () => {
      let selectedPersoner: string[] = [selectedFnr];
      renderModal((personer) => (selectedPersoner = personer));

      await userEvent.click(
        await screen.findByRole("option", {
          name: getVeilederLabelWithIdent(veilederToChoose),
          hidden: true,
        }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Tildel veileder", hidden: true }),
      );

      const tildelMutation = queryClient.getMutationCache().getAll()[0];
      expect(tildelMutation?.state.variables).to.deep.equal([
        { veilederIdent: veilederToChoose.ident, fnr: selectedFnr },
      ]);
      expect(selectedPersoner).to.deep.equal([]);
    });
  });
});

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import NotificationBar from "@/components/error/NotificationBar";
import { NotificationContext } from "@/context/notification/NotificationContext";
import {
  FetchVeiledereFailed,
  Notification,
} from "@/context/notification/Notifications";

let notifications: Notification[];

function renderNotificationBar() {
  return render(
    <NotificationContext.Provider
      value={{
        notifications,
        displayNotification: () => void 0,
        clearNotification: () => void 0,
      }}
    >
      <NotificationBar />
    </NotificationContext.Provider>,
  );
}

describe("NotificationBar", () => {
  beforeEach(() => {
    notifications = [FetchVeiledereFailed];
  });

  it("shows the message as a title when no header exists", () => {
    renderNotificationBar();

    expect(
      within(screen.getByRole("alert")).getByRole("heading", {
        level: 3,
        name: `Feil: ${FetchVeiledereFailed.message}`,
      }),
    ).toBeTruthy();
  });

  it("shows the header as a title and the message as content", () => {
    notifications = [{ ...FetchVeiledereFailed, header: "Request failed" }];

    renderNotificationBar();

    const alert = screen.getByRole("alert");
    expect(
      within(alert).getByRole("heading", {
        level: 3,
        name: "Feil: Request failed",
      }),
    ).toBeTruthy();
    expect(within(alert).getByText(FetchVeiledereFailed.message)).toBeTruthy();
  });

  it("dismisses only the chosen notification", async () => {
    notifications = [
      FetchVeiledereFailed,
      {
        ...FetchVeiledereFailed,
        type: "tildelVeilederFailed",
        message: "Assignment failed",
      },
    ];
    renderNotificationBar();

    const firstAlert = screen.getAllByRole("alert")[0];
    if (!firstAlert) {
      throw new Error("Expected the first notification to be visible");
    }
    await userEvent.click(within(firstAlert).getByRole("button"));

    expect(screen.queryByText(FetchVeiledereFailed.message)).toBeNull();
    expect(screen.getByText("Assignment failed")).toBeTruthy();
  });
});

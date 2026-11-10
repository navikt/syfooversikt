import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { defaultErrorTexts } from "@/api/errors";

function ThrowingComponent(): React.ReactElement {
  throw new Error("Expected render error");
}

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Overview content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Overview content")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows a non-dismissible local alert when a child crashes", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    const alert = screen.getByRole("alert");
    expect(
      within(alert).getByRole("heading", {
        level: 2,
        name: `Feil: ${defaultErrorTexts.generalError}`,
      }),
    ).toBeTruthy();
    expect(within(alert).queryByRole("button")).toBeNull();
  });
});

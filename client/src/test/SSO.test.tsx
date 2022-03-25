import React from "react";
import { clearCurrentUser, renderApp } from "./TestUtils";
import { waitFor } from "@testing-library/react";

test("redirect to SSO login when currentUser is null", async () => {
  const replaceMock = jest.fn();

  Object.defineProperty(window, "location", {
    writable: true,
    value: { replace: replaceMock },
  });

  clearCurrentUser();
  renderApp();

  await waitFor(() =>
    expect(replaceMock).toBeCalledWith("https://localhost:3000/login")
  );
});

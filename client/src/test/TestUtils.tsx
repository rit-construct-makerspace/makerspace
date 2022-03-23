import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Routes from "../Routes";
import {
  CurrentUserProvider,
  GET_CURRENT_USER,
} from "../common/CurrentUserProvider";
import React from "react";
import Privilege from "../types/Privilege";

let currentUser: any;
let mocks: any[] = [];

// This is called before every test automatically via setupTests.ts
export function resetMocks() {
  currentUser = {
    id: "123",
    firstName: "John",
    lastName: "Smith",
    email: "jxs1234@rit.edu",
    privilege: Privilege.ADMIN,
    setupComplete: true,
  };

  applyMocks();
}

export function applyMocks() {
  mocks = [
    {
      request: { query: GET_CURRENT_USER },
      result: { data: { currentUser } },
    },
  ];
}

export function editCurrentUser(overrides: any) {
  currentUser = { ...currentUser, ...overrides };
  applyMocks();
}

export function renderApp() {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <CurrentUserProvider>
        <Routes />
      </CurrentUserProvider>
    </MockedProvider>
  );
}

import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import AppRoutes from "../AppRoutes";
import {
  CurrentUserProvider,
  GET_CURRENT_USER,
} from "../common/CurrentUserProvider";
import React from "react";
import Privilege from "../types/Privilege";
import { MemoryRouter } from "react-router-dom";
import { DocumentNode } from "graphql";

let mocks: any[] = [];

// This is called before every test automatically via setupTests.ts
export function resetMocks() {
  mocks = [
    {
      request: { query: GET_CURRENT_USER },
      result: {
        data: {
          currentUser: {
            id: "123",
            firstName: "John",
            lastName: "Smith",
            email: "jxs1234@rit.edu",
            privilege: Privilege.STAFF,
            setupComplete: true,
            holds: [],
          },
        },
      },
    },
  ];
}

export function addQueryMock(
  query: DocumentNode,
  data: object,
  variables: object = {}
) {
  mocks.push({
    request: { query, variables },
    result: { data },
  });
}

export function addMutationMock(
  mutation: DocumentNode,
  variables: object,
  result: object
) {
  const jestMock = jest.fn(() => ({ data: result }));

  mocks.push({
    request: { query: mutation, variables },
    newData: jestMock,
  });

  return jestMock;
}

export function editCurrentUser(overrides: any) {
  Object.assign(mocks[0].result.data.currentUser, overrides);
}

export function clearCurrentUser() {
  mocks[0].result.data.currentUser = null;
}

export function renderApp(url: string = "/") {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={[url]}>
        <CurrentUserProvider>
          <AppRoutes />
        </CurrentUserProvider>
      </MemoryRouter>
    </MockedProvider>
  );
}

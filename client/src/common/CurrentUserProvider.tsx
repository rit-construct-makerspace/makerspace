import React, { createContext, ReactElement, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { PartialUser } from "../queries/getUsers";
import RequestWrapper2 from "./RequestWrapper2";

const loginUrl =
  process.env.REACT_APP_LOGIN_URL ?? "https://localhost:3000/login";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      firstName
      lastName
      privilege
    }
  }
`;

const CurrentUserContext = createContext<PartialUser | undefined>(undefined);

interface CurrentUserProviderProps {
  children: ReactElement;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const result = useQuery(GET_CURRENT_USER);

  // If the current user is null, we need to redirect to SSO login
  if (!result.loading && !result.data.currentUser) {
    window.location.replace(loginUrl);
  }

  return (
    <CurrentUserContext.Provider value={result.data?.currentUser}>
      <RequestWrapper2 result={result} render={() => children} />
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }

  return context;
}

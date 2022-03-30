import React, { createContext, ReactElement, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { PartialUser } from "../queries/getUsers";
import RequestWrapper2 from "./RequestWrapper2";
import { Navigate, useLocation } from "react-router-dom";
import Privilege from "../types/Privilege";

const loginUrl =
  process.env.REACT_APP_LOGIN_URL ?? "https://localhost:3000/login";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      privilege
      setupComplete
      holds {
        removeDate
      }
    }
  }
`;

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  privilege: Privilege;
  setupComplete: boolean;
  hasHold: boolean;
}

const CurrentUserContext = createContext<CurrentUser | undefined>(undefined);

function mapUser(data: any): CurrentUser | undefined {
  if (!data?.currentUser) return undefined;

  const hasHold = data.currentUser.holds.some(
    (hold: { removeDate: string }) => !hold.removeDate
  );

  return {
    ...data.currentUser,
    hasHold,
  };
}

interface CurrentUserProviderProps {
  children: ReactElement;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const result = useQuery(GET_CURRENT_USER);
  const location = useLocation();

  // If the current user is null, redirect to SSO login
  if (!result.loading && !result.data.currentUser) {
    window.location.replace(loginUrl);
    return null;
  }

  // If the user exists but setupComplete is false,
  // redirect to them to the signup form
  if (
    result.data?.currentUser &&
    !result.data.currentUser.setupComplete &&
    !location.pathname.includes("/signup")
  ) {
    return <Navigate to={"/signup"} />;
  }

  return (
    <CurrentUserContext.Provider value={mapUser(result.data)}>
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

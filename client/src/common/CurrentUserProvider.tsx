import React, { createContext, ReactNode, useContext } from "react";
import User from "../types/User";

const CurrentUserContext = createContext<{ user: User } | undefined>(undefined);

interface CurrentUserProviderProps {
  children: ReactNode;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const value = {
    user: {
      id: "12345",
      name: "Jack Loggedin",
      image:
        "https://t3.ftcdn.net/jpg/02/99/04/20/240_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
      role: "Admin",
    },
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
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

import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { CurrentUserProvider } from "./common/CurrentUserProvider";
import Routes from "./Routes";

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL ?? "https://localhost:3000/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});

const theme = createTheme();

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CurrentUserProvider>
          <Routes />
        </CurrentUserProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

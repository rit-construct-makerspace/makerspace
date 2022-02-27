import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Routes from "./Routes";
import { CurrentUserProvider } from "./common/CurrentUserProvider";

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL ?? "https://localhost:3000/graphql",
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

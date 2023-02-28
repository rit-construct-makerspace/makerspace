import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { CurrentUserProvider } from "./common/CurrentUserProvider";
import AppRoutes from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";

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
        <BrowserRouter basename={ process.env.PUBLIC_URL }>
          <CurrentUserProvider>
            <AppRoutes />
          </CurrentUserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

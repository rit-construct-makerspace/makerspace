import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { CurrentUserProvider } from "./common/CurrentUserProvider";
import AppRoutes from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./Theme";

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL ?? "https://localhost:3000/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});


export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter basename={ process.env.PUBLIC_URL }>
          <CurrentUserProvider>
            <AppRoutes />
          </CurrentUserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

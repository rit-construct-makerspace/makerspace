import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, GlobalStyles, ThemeProvider } from "@mui/material";
import { CurrentUserProvider } from "./common/CurrentUserProvider";
import AppRoutes from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL ?? "https://localhost:3000/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F76902',
    },
    secondary: {
      main: '#ACA39A'
    },
    text: {
      secondary: '#ACA39A'
    }
  },
});

darkTheme.applyStyles('dark', {
  background: '#000000'
})


const theme = createTheme();

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={localStorage.getItem("themeMode") == "dark" ? darkTheme : theme}>
        <GlobalStyles styles={localStorage.getItem("themeMode") == "dark" && { 
          body: {background: 'black', color: 'white'},
          a: {color: '#7D55C7'},
          textarea: {color: '#eaeaea'},
          legend: {color: '#eaeaea'}
          }} />
        <BrowserRouter basename={ process.env.PUBLIC_URL }>
          <CurrentUserProvider>
            <AppRoutes />
          </CurrentUserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

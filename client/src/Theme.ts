import { createTheme } from "@mui/material";


export const theme = createTheme({
    palette: {
        primary: {
            main: "#F76902",
            dark: "#F76902",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#7D55C7",
            contrastText: "#FFFFFF",
        },
        mode: localStorage.getItem("themeMode") == "dark" ? "dark" : "light"
    },
    typography: {
        fontFamily: 'Roboto',
    },
})
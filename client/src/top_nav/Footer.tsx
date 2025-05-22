import { AppBar, Link, Stack, Typography, useTheme } from "@mui/material";


export default function Footer() {

    const theme = useTheme();

    return (
        <Stack marginTop="auto" justifyContent="flex-end">
            <AppBar position="static">
                <Stack direction="row" width="auto" padding="25px">
                    <Stack>
                        <Typography variant="h4">Make Something Interesting</Typography>
                        <Typography color="inherit">Contact us: <Link href="mailto:make@rit.edu" underline="hover">make@rit.edu</Link></Typography>
                    </Stack>
                </Stack>
            </AppBar>
        </Stack>
    );
}
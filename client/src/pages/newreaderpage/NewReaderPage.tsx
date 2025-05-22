import { Button, Stack, TextField } from "@mui/material";

export default function NewReaderPage() {
    
    return <Stack direction={"column"}>
        <h1>This will be automatic soon</h1>
        <TextField defaultValue={"Serial Number"}></TextField>
        <Button>Submit</Button>
        <h2>Shlug Key</h2>
        <pre>press submit first</pre>
        <h2>Cert</h2>
        <pre>press submit first</pre>
    </Stack>
}

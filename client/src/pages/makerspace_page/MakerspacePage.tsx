import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function MakerspacePage() {
    const { id } = useParams<{ id: string }>();

    return (
        <Typography variant="h1">WIP {id}</Typography>
    );
}
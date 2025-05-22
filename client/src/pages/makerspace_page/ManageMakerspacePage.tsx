import { useParams } from "react-router-dom";


export default function ManageMakerspacePage() {
    const { makerspaceID } = useParams<{ makerspaceID: string }>();

    return (
        <></>
    );
}
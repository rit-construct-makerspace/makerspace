import { useParams } from "react-router-dom";


export default function UserSettingsPage() {
    const { id } = useParams<{id: string}>();
}
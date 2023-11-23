import React, {useEffect} from "react";
import PrettyModal from "../../../common/PrettyModal";
import Page from "../../Page";
import NewRoom from "./NewRoom";

interface RoomModalProps {
    roomID?: number;
    onClose: () => void;
}

export default function RoomModal({ onClose, roomID }: RoomModalProps) {
    const isNew = roomID === -1;

    return (
        <PrettyModal width={800} open={roomID!==0} onClose={onClose}>
            <NewRoom onClose={onClose}/>
        </PrettyModal>
    );
}
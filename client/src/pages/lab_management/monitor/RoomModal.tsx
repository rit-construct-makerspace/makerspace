import React from "react";
import PrettyModal from "../../../common/PrettyModal";
import NewRoom from "./NewRoom";

interface RoomModalProps {
    roomID?: number;
    onClose: () => void;
}

export default function RoomModal({ onClose, roomID }: RoomModalProps) {

    return (
        <PrettyModal width={800} open={roomID!==0} onClose={onClose}>
            <NewRoom onClose={onClose}/>
        </PrettyModal>
    );
}
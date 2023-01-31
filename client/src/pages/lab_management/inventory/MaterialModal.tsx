import React from "react";
import EditMaterial from "./EditMaterial";
import NewMaterial from "./NewMaterial";
import PrettyModal from "../../../common/PrettyModal";

interface MaterialModalProps {
  itemId: string;
  onClose: () => void;
}

export default function MaterialModal({ onClose, itemId }: MaterialModalProps) {
  const isNewItem = itemId.toLocaleLowerCase() === "new";

  return (
    <PrettyModal width={800} open={!!itemId} onClose={onClose}>
      {isNewItem ? (
        <NewMaterial onClose={onClose} />
      ) : (
        <EditMaterial itemId={itemId} onClose={onClose} />
      )}
    </PrettyModal>
  );
}

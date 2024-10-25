import React, { useEffect, useState } from "react";
import EditMaterial from "./EditMaterial";
import NewMaterial from "./NewMaterial";
import PrettyModal from "../../../common/PrettyModal";

interface MaterialModalProps {
  itemId: string;
  onClose: () => void;
}

export default function MaterialModal({ onClose, itemId }: MaterialModalProps) {
  const isNewItem = itemId.toLocaleLowerCase() === "new";

  const [width, setWidth] = useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);
  const isMobile = width <= 1100;

  return (
    <PrettyModal width={isMobile ? 250 : 800} open={!!itemId} onClose={onClose}>
      {isNewItem ? (
        <NewMaterial onClose={onClose} />
      ) : (
        <EditMaterial itemId={itemId} onClose={onClose} />
      )}
    </PrettyModal>
  );
}

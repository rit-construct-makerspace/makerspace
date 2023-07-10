import { useMutation } from "@apollo/client";
import GET_EQUIPMENTS, { ARCHIVE_EQUIPMENT, GET_ARCHIVED_EQUIPMENTS, GET_ARCHIVED_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import { useNavigate } from "react-router-dom";
import ArchiveButton from "../../../common/ArchiveButton";

interface ArchiveEquipmentButtonProps {
  equipmentID: number;
  appearance: "icon-only" | "small" | "medium" | "large"
}

export default function ArchiveEquipmentButton(props: ArchiveEquipmentButtonProps) {
  const navigate = useNavigate();

  const [archiveEquipment, { loading }] = useMutation(ARCHIVE_EQUIPMENT, {
    variables: { id: props.equipmentID },
    refetchQueries: [
      { query: GET_EQUIPMENTS },
      { query: GET_ARCHIVED_EQUIPMENTS },
      { query: GET_ARCHIVED_EQUIPMENT_BY_ID, variables: { id: props.equipmentID } },
    ],
  });

  const handleClick = async () => {
    await archiveEquipment();
    navigate("/admin/equipment");
  };

  return (
    <ArchiveButton
      appearance={props.appearance}
      handleClick={handleClick}
      loading={loading}
      tooltipText="Archive Equipment"
    />
  );
}

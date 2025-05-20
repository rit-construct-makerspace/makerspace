import { useMutation } from "@apollo/client";
import GET_EQUIPMENTS, { GET_ARCHIVED_EQUIPMENTS, GET_EQUIPMENT_BY_ID, PUBLISH_EQUIPMENT } from "../../../queries/equipmentQueries";
import { useNavigate } from "react-router-dom";
import PublishButton from "../../../common/PublishButton";

interface PublishEquipmentButtonProps {
  equipmentID: number;
  appearance: "icon-only" | "small" | "medium" | "large"
}

export default function PublishEquipmentButton(props: PublishEquipmentButtonProps) {
  const navigate = useNavigate();

  const [publishEquipment, { loading }] = useMutation(PUBLISH_EQUIPMENT, {
    variables: { id: props.equipmentID },
    refetchQueries: [
      { query: GET_EQUIPMENTS },
      { query: GET_ARCHIVED_EQUIPMENTS },
      { query: GET_EQUIPMENT_BY_ID, variables: { id: props.equipmentID } },
    ],
  });

  const handleClick = async () => {
    await publishEquipment();
    navigate("/");
  };

  return (
    <PublishButton
      appearance={props.appearance}
      handleClick={handleClick}
      loading={loading}
      tooltipText="Publish Equipment"
    />
  );
}

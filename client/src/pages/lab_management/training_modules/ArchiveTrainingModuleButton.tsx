import { useMutation } from "@apollo/client";
import GET_EQUIPMENTS, { ARCHIVE_EQUIPMENT, GET_ARCHIVED_EQUIPMENTS, GET_ARCHIVED_EQUIPMENT_BY_ID } from "../../../queries/equipments";
import { useNavigate } from "react-router-dom";
import ArchiveButton from "../../../common/ArchiveButton";
import { ARCHIVE_MODULE, GET_ARCHIVED_MODULE, GET_ARCHIVED_TRAINING_MODULES, GET_TRAINING_MODULES } from "../../../queries/modules";

interface ArchiveTrainingModuleButtonProps {
  moduleID: number;
  appearance: "icon-only" | "small" | "medium" | "large"
}

export default function ArchiveTrainingModuleButton(props: ArchiveTrainingModuleButtonProps) {
  const navigate = useNavigate();

  const [archiveTrainingModule, { loading }] = useMutation(ARCHIVE_MODULE, {
    variables: { id: props.moduleID },
    refetchQueries: [
      { query: GET_TRAINING_MODULES },
      { query: GET_ARCHIVED_TRAINING_MODULES },
      { query: GET_ARCHIVED_MODULE, variables: { id: props.moduleID } },
    ],
  });

  const handleClick = async () => {
    await archiveTrainingModule();
    navigate("/admin/equipment");
  };

  return (
    <ArchiveButton
      appearance={props.appearance}
      handleClick={handleClick}
      loading={loading}
      tooltipText="Archive Module"
    />
  );
}

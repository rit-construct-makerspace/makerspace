import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import ActionButton from "../../../common/ActionButton";
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

interface logsButtonProps {  appearance: "icon-only" | "small" | "medium" | "large"
  id: string;
}

export default function LogsButton(props: logsButtonProps) {
  const navigate = useNavigate();

  const handleClick = async () => {
    navigate("/admin/equipment/logs/" + props.id);
  };

  return (
    <ActionButton 
      tooltipText="View Maintenance Log"
      iconSize={22.5}
      color="primary"
      appearance={props.appearance}
      buttonText="View Maintenance Log"
      handleClick={handleClick}
      loading={false}>
        <SpeakerNotesIcon />
    </ActionButton>
  );
}

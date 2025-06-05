import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";

const CONFIRM_PROMPT =
  "Are you sure you want to delete this announcement? This cannot be undone.";


interface DeleteAnnouncementButtonProps {
    onDelete: () => void;
}

export default function DeleteAnnouncementButton({onDelete}: DeleteAnnouncementButtonProps) {
  const handleClick = () => {
    if (!window.confirm(CONFIRM_PROMPT)) return;
    onDelete()
  };

  return (
    <Button
      variant="contained"
      startIcon={<DeleteOutlineIcon />}
      color="error"
      onClick={handleClick}
    >
      Delete
    </Button>
  );
}

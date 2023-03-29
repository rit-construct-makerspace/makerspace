import ArchiveIcon from "@mui/icons-material/Archive";
import { LoadingButton } from "@mui/lab";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";

interface ArchiveEquipmentButtonProps {
  appearance: "icon-only" | "small" | "medium" | "large";
  handleClick: () => Promise<void>;
  loading: boolean;
  tooltipText: string;
}

export default function ArchiveEquipmentButton(props: ArchiveEquipmentButtonProps) {
  let size: "small" | "medium" | "large";
  switch(props.appearance) {
    case "large":
      size = "large"
      break;
    case "medium":
      size = "medium"
      break;
    default:
      size = "small"
  }

  const iconSize = 25;

  return (
    <Tooltip
      title={props.tooltipText}
      arrow
      PopperProps={{
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, -15],
                },
            },
        ],
    }}
    >
      {
        props.appearance === "icon-only"
          ? (
            <IconButton
              color="error"
              onClick={props.handleClick}>
              {
                props.loading
                  ? <CircularProgress
                  color="error"
                  size={iconSize}
                />
                  : <ArchiveIcon sx={{fontSize: iconSize}} />
              }
            </IconButton>
            )
          : (
              <LoadingButton
                loading={props.loading}
                variant="outlined"
                startIcon={<ArchiveIcon />}
                color="error"
                onClick={props.handleClick}
                loadingPosition="start"
              >
                Archive
              </LoadingButton>
            )
      }
    </Tooltip>
  );
}

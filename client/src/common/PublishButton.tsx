import SendIcon from "@mui/icons-material/Send";
import { LoadingButton } from "@mui/lab";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";

interface PublishEquipmentButtonProps {
  appearance: "icon-only" | "small" | "medium" | "large";
  handleClick: () => Promise<void>;
  loading: boolean;
  tooltipText: string;
}

export default function PublishEquipmentButton(props: PublishEquipmentButtonProps) {
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

  const iconSize = 22.5;

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
                color="success"
                onClick={props.handleClick}>
                {
                  props.loading
                    ? <CircularProgress
                    color="success"
                    size={iconSize}
                  />
                    : <SendIcon sx={{fontSize: iconSize}} />
                }
              </IconButton>
            )
          : (
              <LoadingButton
                  loading={props.loading}
                  variant="outlined"
                  startIcon={<SendIcon />}
                  color="success"
                  onClick={props.handleClick}
                  loadingPosition="start"
                >
                  Publish
                </LoadingButton>
            )
      }
    </Tooltip>
  );
}

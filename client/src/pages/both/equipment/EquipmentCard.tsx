import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import ActionButton from "../../../common/ActionButton";
import SopButton from "../../../common/SopButton";
import { IconStatusBadge } from "../../../common/IconStatusBadge";
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckIcon from '@mui/icons-material/Check';
import { ModuleStatus, moduleStatusMapper } from "../../../common/TrainingModuleUtils";
import { useCurrentUser } from "../../../common/CurrentUserProvider";

interface EquipmentCardProps {
  id: number;
  name: string;
  to: string;
  imageUrl: string;
  sopUrl: string;
  trainingModules: any;
}

export default function EquipmentCard({ id, name, to, imageUrl, sopUrl, trainingModules }: EquipmentCardProps) {
  const navigate = useNavigate();
  const user = useCurrentUser();


  const moduleStatuses: ModuleStatus[] = trainingModules.map(
    moduleStatusMapper(user.passedModules)
  );

  const numNotPassed = moduleStatuses.filter((ms) => ms.status != "Passed" && ms.status != "Expiring Soon").length;

  const hasApprovedAccessCheck: boolean = !!user.accessChecks.find((ac) => Number(ac.equipmentID) == id && ac.approved)

  return (
    <Card sx={{ width: 250, height: 300, backgroundColor: (numNotPassed != 0 || !hasApprovedAccessCheck) ? ((localStorage.getItem("themeMode") == "dark") ? null : "grey.200") : ((localStorage.getItem("themeMode") == "dark") ? "grey.800" : null) }} onClick={() => navigate(to)}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="150"
          image={imageUrl}
        />
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            minHeight="120"
            sx={{ lineHeight: 1, mb: 1 }}
          >
            {name}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            minHeight: 0.12,
            justifyContent: "space-between",
            flexDirection: "row-reverse",
            mt: 0,
            padding: 0.25
          }}>
            <Stack direction={"row"} spacing={2} mr={2}>
              <IconStatusBadge icon={<SchoolIcon />} badgeContent={numNotPassed > 0 ? numNotPassed : <span>&#x2713;</span>} badgeColor={numNotPassed > 0 ? "error" : "success"} tooltipText={`${numNotPassed} Incomplete trainings`} />
              <IconStatusBadge icon={<AssignmentIndIcon />} badgeContent={hasApprovedAccessCheck ? <span>&#x2713;</span> : <span>&#66327;</span>} badgeColor={hasApprovedAccessCheck ? "success" : "error"} tooltipText={hasApprovedAccessCheck ? "In-Person Check Complete." : "In-Person Check Incomplete. Speak to a Maker Mentor."} />
            </Stack>
          {
            sopUrl && sopUrl != ""
              ? <SopButton appearance="icon-only" url={sopUrl} disabled={false} toolTipText="View SOP" buttonText="View SOP"></SopButton>
              : <SopButton appearance="icon-only" url={sopUrl} disabled={true} toolTipText="No SOP" buttonText="No SOP"></SopButton>
          }
        </CardActions>
      </CardActionArea>
    </Card>
  );
}

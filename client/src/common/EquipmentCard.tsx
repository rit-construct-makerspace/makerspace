import { Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import Equipment from "../types/Equipment";
import { useCurrentUser } from "./CurrentUserProvider";
import EditIcon from '@mui/icons-material/Edit';
import { ModuleStatus, moduleStatusMapper } from "./TrainingModuleUtils";
import TrainingModuleRow from "./TrainingModuleRow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import LockClockIcon from '@mui/icons-material/LockClock';

interface EquipmentCardProps {
    equipment: Equipment;
}

export default function EquipmentCard(props: EquipmentCardProps) {
    const user = useCurrentUser();
    const navigate = useNavigate();
    const isPriviledged = user.privilege === "MENTOR" || user.privilege === "STAFF";
    const hasApprovedAccessCheck: boolean = !!user.accessChecks.find((ac) => Number(ac.equipmentID) == props.equipment.id && ac.approved)

    const moduleStatuses = props.equipment.trainingModules.map(
        moduleStatusMapper(user.passedModules, user.trainingHolds)
    );

    return ( 
        <Card sx={{width: "600px", height: "350px"}}> {/* TODO: Add isMobile detection for auto resizing */}
            <Stack>
                <Stack direction="row" height="200px">
                    <Box width="150px" height="200px">
                    <CardMedia
                        component="img"
                        image={(props.equipment.imageUrl == undefined || props.equipment.imageUrl == null || props.equipment.imageUrl == "") ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR + "/" + props.equipment.imageUrl}
                        alt={`Picture of ${props.equipment.name}`}
                        sx={{width: "150px", height: "200px", backgroundColor: "lightgray"}}
                    />
                    </Box>
                    <CardContent sx={{width: "100%", height: "100%"}}>
                        <Stack height="100%">
                            {/* Title & Edit button */}
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="h6">{props.equipment.name}</Typography>
                                {isPriviledged ?
                                    <IconButton aria-label="edit" sx={{width: "40px", height: "40px"}}>
                                        <EditIcon />
                                    </IconButton> :
                                    null
                                }
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" height="100%">
                                {/* Trainings & Access Check */}
                                <Stack width="100%">
                                    {moduleStatuses.map((ms: ModuleStatus) => (
                                        <CardActionArea onClick={() => navigate(`/maker/training/${ms.moduleID}`)}>
                                            <Stack direction="row" spacing={1} alignItems="center" padding="10px" width="100%">
                                                {
                                                    ms.status === "Passed"
                                                    ? <CheckCircleIcon color="success" />
                                                    : ms.status === "Not taken"
                                                    ? <CloseIcon color="error" />
                                                    : ms.status === "Expired"
                                                    ? <WarningIcon color="warning" />
                                                    : ms.status === "Expiring Soon"
                                                    ? <HourglassBottomIcon color="warning" />
                                                    : ms.status === "Locked"
                                                    ? <LockClockIcon color="error" />
                                                    : null
                                                }
                                                <Typography variant="body2">{ms.moduleName}</Typography>
                                            </Stack>
                                        </CardActionArea>
                                    ))}
                                    {
                                        !props.equipment.byReservationOnly
                                        ? <Stack direction={"row"} spacing={1} alignItems="center" padding="10px">
                                            {hasApprovedAccessCheck
                                                ? <CheckCircleIcon color="success" />
                                                : <CloseIcon color="error" />
                                            }
                                            <Typography variant="body2">In-Person Competency Check</Typography>
                                        </Stack>
                                        : null
                                    }
                                </Stack>
                                {/* Num available || by reservation only */}
                                <Box width="120px" height="100%">
                                    {props.equipment.byReservationOnly
                                        ? <Typography variant="subtitle1" ml={1}>
                                            Reservation only. Email <Link to={"mailto:make@rit.edu"} target={"_blank"}>make@rit.edu</Link> to schedule.
                                        </Typography>
                                        : <Stack height="100%" justifyContent="center" alignItems="center">
                                            <Typography variant="subtitle1" align="center" fontWeight="bold">
                                                Machines Available
                                            </Typography>
                                            <Typography variant="subtitle1" align="center">
                                                {`${props.equipment.numAvailable} / ${props.equipment.numAvailable + props.equipment.numInUse}`}
                                            </Typography>
                                        </Stack>
                                    }
                                </Box>
                            </Stack>
                            
                        </Stack>
                    </CardContent>
                </Stack>
                <CardContent>
                    {/* Desc && learn more */}
                    <Typography height="100%" alignSelf="center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porttitor pellentesque ullamcorper. Donec quis tortor tellus. Donec faucibus tellus eu dui lobortis iaculis. <Link to={props.equipment.sopUrl} target="_blank">Learn More</Link>
                    </Typography>
                </CardContent>
            </Stack>
        </Card>
    );
}
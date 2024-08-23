import { gql, useMutation } from "@apollo/client";
import { Button, TableCell, TableRow } from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import { GET_ZONE_HOURS } from "./ZoneHourOptions";
import Privilege from "../../../types/Privilege";
import DeleteIcon from "@mui/icons-material/Delete";

const DELETE_ZONE_HOURS = gql`
  mutation DeleteZoneHours($id: ID!) {
    deleteZoneHours(id: $id) {
      id
    }
  }
`;

function dayOfTheWeekConvert(day: number) {
  switch (day) {
    case 1: return "Sunday";
    case 2: return "Monday";
    case 3: return "Tuesday";
    case 4: return "Wednesday";
    case 5: return "Thursday";
    case 6: return "Friday";
    case 7: return "Saturday";
    default: return "UNKNOWN";
  }
}

interface ZoneHourRowProps {
  id: number;
  zone: string;
  type: string;
  dayOfTheWeek: number;
  time: string;
}

export default function ZoneHourRow({id, zone, type, dayOfTheWeek, time}: ZoneHourRowProps) {
  const [deleteZoneHours] = useMutation(DELETE_ZONE_HOURS);

  const currentUser = useCurrentUser();

  const handleDeleteZoneHoursClicked = () => {
    console.log(id)
    const result = window.confirm(
      `Are you sure you wish to delete this entry? This cannot be undone.`
    );
    if (result) {
      deleteZoneHours({
        variables: { id: id },
        refetchQueries: [{ query: GET_ZONE_HOURS }],
      });
    };
  }

  return(
    <TableRow>
    <TableCell>{zone}</TableCell>
    <TableCell>{type}</TableCell>
    <TableCell>{dayOfTheWeekConvert(Number(dayOfTheWeek))}</TableCell>
    <TableCell>{time}</TableCell>
    <TableCell>
      {currentUser.privilege === Privilege.STAFF &&
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteZoneHoursClicked}
        >
          Delete
        </Button>
      }
    </TableCell>
  </TableRow>
  )
}
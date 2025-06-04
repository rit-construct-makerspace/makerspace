import { Chip } from "@mui/material";
import { isAdmin, isManager, isStaff } from "../../../common/PrivilegeUtils";

interface PrivilegeChipProps {
  user: any;
}

export default function PrivilegeChip(props: PrivilegeChipProps) {

  const label = isAdmin(props.user) ? "Admin" : isManager(props.user) ? "Manager" : isStaff(props.user) ? "Staff" : "";
  if (label === "") return null; // No chip for Makers (and trainers 😢)
  const color = label === "Admin" ? "primary" : label === "Manager" ? "error" : label === "Staff" ? "success" : "error"

  return <Chip label={label} variant="outlined" size="small" color={color} />;
}

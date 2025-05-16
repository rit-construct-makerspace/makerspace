import { AppBar, Stack } from "@mui/material";
import { useCurrentUser } from "../../common/CurrentUserProvider";
import NavLink from "../../top_nav/NavLink";
import SharepointIcon from "../../common/SharepointIcon";
import HandymanIcon from "@mui/icons-material/Handyman";
import InventoryIcon from "@mui/icons-material/Inventory";
import SchoolIcon from "@mui/icons-material/School";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BarChartIcon from '@mui/icons-material/BarChart';
import ArchitectureIcon from '@mui/icons-material/Architecture';

interface StaffBarProps {
    isMobile: boolean;
    zoneID: number;
}

export default function StaffBar(props: StaffBarProps) {
    const user = useCurrentUser();
    const isPriviledged = user.privilege === "MENTOR" || user.privilege === "STAFF";

    if (!isPriviledged) {
        return null;
    }

    if (props.isMobile) {
        return (
            <></>
        );
    } else {
        return (
            <Stack direction="row" justifyContent="space-around" padding="10px 0px">
                <NavLink
                    primary={"Manage Equipment"}
                    to={"/admin/equipment"}
                    icon={<HandymanIcon />}
                />
                <NavLink
                    primary={"Manage Training"}
                    to={"/admin/training"}
                    icon={<SchoolIcon />}
                />
                <NavLink
                    primary={"Material Inventory"}
                    to={"/admin/inventory"}
                    icon={<InventoryIcon />}
                />
                <NavLink
                    primary={"Tool Inventory"}
                    to={"/admin/tools"}
                    icon={<ArchitectureIcon />}
                />
                <NavLink
                    primary={"Storefront"}
                    to={"/admin/storefront"}
                    icon={<StorefrontIcon />}
                />
                <NavLink
                    primary={"Rooms"}
                    to={"/admin/rooms"}
                    icon={<MeetingRoomIcon />}
                />
                <NavLink
                    primary={"Announcements"}
                    to={"/admin/announcements"}
                    icon={<AnnouncementIcon />}
                />
                <NavLink
                    primary={"People"}
                    to={"/admin/people"}
                    icon={<PeopleIcon />}
                />
                <NavLink
                    primary={"History"}
                    to={"/admin/history"}
                    icon={<HistoryIcon />}
                />
                <NavLink
                    primary={"Statistics"}
                    to={"/admin/statistics"}
                    icon={<BarChartIcon />}
                />
                <NavLink
                    primary={"Internal Wiki"}
                    to={"https://rit0.sharepoint.com/sites/shed-makerspace-internal/SitePages/TrainingHome.aspx"}
                    icon={<SharepointIcon />}
                    newTab={true}
                />
            </Stack>
        );
    }
}
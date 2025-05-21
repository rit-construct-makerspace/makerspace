import { AppBar, Box, ButtonBase, IconButton, Stack, Typography } from "@mui/material";
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
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface StaffBarProps {
    isMobile: boolean;
    zoneID: number;
}

export default function StaffBar(props: StaffBarProps) {
    const user = useCurrentUser();
    const isPriviledged = user.privilege === "MENTOR" || user.privilege === "STAFF";

    const [mobileMenu, setMobileMenu] = useState(false);

    if (!isPriviledged) {
        return null;
    }

    const staffNavigation = (
        <Stack
            direction={props.isMobile ? "column" : "row"}
            justifyContent={props.isMobile ? "flex-start" : "space-around"}
            alignItems="center"
            padding="10px 0px"
        >
            {
                mobileMenu
                ? <ButtonBase onClick={() => setMobileMenu(false)} sx={{width: "100%", padding: "10px 0px"}}> 
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography variant="body1" color="grey">Staff Actions</Typography>
                        <KeyboardArrowDownIcon />
                    </Stack>
                </ButtonBase>
                : null
            }
            <NavLink
                primary={"Manage Trainings"}
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
        </Stack>
    );

    return (
        <Box>{
            props.isMobile
            ? mobileMenu
                ? staffNavigation
                : <ButtonBase onClick={() => setMobileMenu(true)} sx={{width: "100%", padding: "10px 0px"}}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography variant="body1" color="grey">Staff Actions</Typography>
                        <MenuIcon />
                    </Stack>
                </ButtonBase>
            : staffNavigation
        }</Box>
    );
}
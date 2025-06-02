import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { useCurrentUser } from "../../common/CurrentUserProvider";
import NavLink from "../../top_nav/NavLink";
import InventoryIcon from "@mui/icons-material/Inventory";
import SchoolIcon from "@mui/icons-material/School";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from '@mui/icons-material/BarChart';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ScannerIcon from '@mui/icons-material/Scanner';

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
                to={`/makerspace/${props.zoneID}/tools`}
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
                primary={"Readers"}
                to={"/admin/readers"}
                icon={<ScannerIcon />}
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
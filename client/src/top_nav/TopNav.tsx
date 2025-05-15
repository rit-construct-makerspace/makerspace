import { AppBar, Avatar, Box, ButtonBase, Container, List, Menu, MenuItem, Stack, Typography, useScrollTrigger } from "@mui/material";
import styled from "styled-components";
import LogoSvg from "../assets/acronym_logo.svg";
import LogoSvgW from "../assets/acronym_logo_w.svg";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import PrinterOsIcon from "../common/PrinterOSIcon";
import SlackIcon from "../common/SlackIcon";
import EventIcon from "@mui/icons-material/Event";
import SharepointIcon from "../common/SharepointIcon";
import NavLink from "./NavLink";
import { useCurrentUser } from "../common/CurrentUserProvider";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from '@mui/icons-material/Settings';
import { stringAvatar } from "../common/avatarGenerator";

const StyledLogo = styled.img`
  margin: 12px;
  &:hover {
    cursor: pointer;
  }
`;

export default function TopNav() {

    const [width, setWidth] = useState<number>(window.innerWidth);
    const isMobile = width <= 1100;

    const navigate = useNavigate();

    const currentUser = useCurrentUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(anchorEl);

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Stack>
            <Box width="100%" height="5%" sx={{flexGrow: 1}}>
                <AppBar sx={{backgroundColor: "white"}} position="static">
                    <Stack component="nav" direction="row" justifyContent="space-between">
                        <StyledLogo width="15%" src={localStorage.getItem("themeMode") == "dark" ? LogoSvgW : LogoSvg} alt="SHED logo" onClick={() => {navigate(`/`);}}/>
                        <NavLink
                            to="https://cloud.3dprinteros.com/ssosaml/rit/auth"
                            primary="3DPrinterOS"
                            icon={<PrinterOsIcon />}
                            newTab={true}
                        />
                        <NavLink
                            to="https://rit.enterprise.slack.com/archives/C0440KNF916"
                            primary="Slack"
                            icon={<SlackIcon />}
                            newTab={true}
                        />
                        <NavLink
                            to="https://rit0.sharepoint.com/:l:/s/shed-makerspace-internal/FLWWXKH1sflHs-h3tbs2ZFABOwYAmWuxffG18ansYFXlfA"
                            primary="Equipment Calendar"
                            icon={<EventIcon />}
                            newTab={true}
                        />
                        <NavLink
                            to="https://rit0.sharepoint.com/sites/shed-makerspace-public"
                            primary="Knowledge Base"
                            icon={<SharepointIcon />}
                            newTab={true}
                        />
                        <ButtonBase onClick={handleUserMenuOpen}>
                            <Stack direction="row" alignItems="center" spacing={2} padding={2}>
                                <Typography variant="body1" color="grey" sx={{ fontWeight: "bold" }}>
                                    {`${currentUser.firstName} ${currentUser.lastName}`}
                                </Typography>
                                <Avatar
                                    alt="Profile picture"
                                    {...stringAvatar(`${currentUser.firstName} ${currentUser.lastName}`)}
                                />
                            </Stack>
                        </ButtonBase>

                        <Menu open={userMenuOpen} anchorEl={anchorEl} onClose={handleUserMenuClose}>
                            <MenuItem onClick={() => {navigate("/user/trainings"); handleUserMenuClose();}}>
                                <Stack direction="row" spacing={2} alignItems="center" width="100%">
                                <SchoolIcon sx={{color: "gray"}}/>
                                <Typography variant="body1">User Trainings</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem onClick={() => {navigate("/user/settings"); handleUserMenuClose();}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                                <SettingsIcon sx={{color: "gray"}}/>
                                <Typography variant="body1">User Settings</Typography>
                                </Stack>
                            </MenuItem>
                        </Menu>
                    </Stack>
                </AppBar>
            </Box>
            <Outlet />
        </Stack>
    );
}
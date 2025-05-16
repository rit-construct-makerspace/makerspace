import { Alert, AppBar, Avatar, Box, ButtonBase, Container, Drawer, IconButton, List, Menu, MenuItem, Stack, Typography, useScrollTrigger } from "@mui/material";
import styled from "styled-components";
import LogoSvg from "../assets/acronym_logo.svg";
import LogoSvgW from "../assets/acronym_logo_w.svg";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PrinterOsIcon from "../common/PrinterOSIcon";
import SlackIcon from "../common/SlackIcon";
import EventIcon from "@mui/icons-material/Event";
import SharepointIcon from "../common/SharepointIcon";
import NavLink from "./NavLink";
import { useCurrentUser } from "../common/CurrentUserProvider";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from '@mui/icons-material/Settings';
import { stringAvatar } from "../common/avatarGenerator";
import MenuIcon from '@mui/icons-material/Menu';

const StyledLogo = styled.img`
  margin: 12px;
  &:hover {
    cursor: pointer;
  }
`;

export default function TopNav() {

    const [width, setWidth] = useState<number>(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
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

    const [labTraining, setLabTraining] = useState(true);

    const [mobileDrawer, setMobileDrawer] = useState(false);

    function makeAlerts() {

        return(
            <Stack>
                { // Hold alert
                currentUser.hasHolds
                ? <Alert variant="filled" severity="error" sx={{borderRadius: 0}}>
                    A hold has been placed on your account. You won't be able to create reservations, use machines, or purchase materials. Please speak to a member of staff in the makerspace to rectify this.
                </Alert>
                : null
                }
                { // No ID alert
                    currentUser.cardTagID == null || currentUser.cardTagID == ""
                    ? <Alert variant="filled" severity="warning" sx={{borderRadius: 0}}>
                        Your RIT ID has not been associated with your Makerspace account yet. Please speak to a member of staff in the makerspace to rectify this before using any makerspace equipment. Trainings and 3DPrinterOS will remain available.
                    </Alert>
                    : null
                }
                { // Lab training Alert
                    labTraining
                    ? <Alert variant="standard" severity="info" onClose={() => setLabTraining(false)} sx={{borderRadius: 0}}>
                        All Makerspace users must complete the <a href="https://rit.sabacloud.com/Saba/Web_spf/NA3P1PRD0049/common/leclassview/dowbt-0000146117">Shop Safety training course</a> before using any equipment.
                    </Alert>
                    : null
                }
            </Stack>
        );
    }

    return (
        <Stack>
            {isMobile
            ?<Box width="100%">
                <Stack direction="row" justifyContent="space-between">
                    <StyledLogo width="75%" src={localStorage.getItem("themeMode") == "dark" ? LogoSvgW : LogoSvg} alt="SHED logo" onClick={() => {navigate(`/`);}}/>
                    <IconButton onClick={() => setMobileDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                </Stack>
                <Drawer anchor="top" open={mobileDrawer} onClose={() => setMobileDrawer(false)}>
                    <Stack alignItems="center" spacing={2} paddingTop="10px">
                        <NavLink
                            to="/maker/training/13"
                            primary="3D Printing Training"
                            icon={<SchoolIcon />}
                        />
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
                                <Avatar
                                    alt="Profile picture"
                                    {...stringAvatar(`${currentUser.firstName} ${currentUser.lastName}`, {height: "30px", width: "30px", fontSize: 16})}
                                />
                                <Typography variant="body1" color="grey">
                                    {`${currentUser.firstName} ${currentUser.lastName}`}
                                </Typography>     
                            </Stack>
                        </ButtonBase>

                        <Menu open={userMenuOpen} anchorEl={anchorEl} onClose={handleUserMenuClose}>
                            <MenuItem onClick={() => {navigate("/user/trainings"); handleUserMenuClose(); setMobileDrawer(false);}}>
                                <Stack direction="row" spacing={2} alignItems="center" width="100%">
                                <SchoolIcon sx={{color: "gray"}}/>
                                <Typography variant="body1">User Trainings</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem onClick={() => {navigate("/user/settings"); handleUserMenuClose(); setMobileDrawer(false);}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                                <SettingsIcon sx={{color: "gray"}}/>
                                <Typography variant="body1">User Settings</Typography>
                                </Stack>
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Drawer>
            </Box>
            :<Box width="100%" height="5%" sx={{flexGrow: 1}}>
                <AppBar sx={{backgroundColor: "white"}} position="static">
                    <Stack component="nav" direction="row" justifyContent="space-between">
                        <StyledLogo width="15%" src={localStorage.getItem("themeMode") == "dark" ? LogoSvgW : LogoSvg} alt="SHED logo" onClick={() => {navigate(`/`);}}/>
                        <NavLink
                            to="/maker/training/13"
                            primary="3D Printing Training"
                            icon={<SchoolIcon />}
                        />
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
            }
            {makeAlerts()}
            <Outlet />
        </Stack>
    );
}
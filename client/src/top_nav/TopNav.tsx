import { AppBar, Avatar, Box, Container, List, Stack, Typography, useScrollTrigger } from "@mui/material";
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

const StyledLogo = styled.img`
  margin: 12px;
  &:hover {
    cursor: pointer;
  }
`;

function ElevationScroll() {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    })
}

export default function TopNav() {

    const [width, setWidth] = useState<number>(window.innerWidth);
    const isMobile = width <= 1100;

    const navigate = useNavigate();

    const currentUser = useCurrentUser();

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
                        <Stack direction="row" alignItems="center" spacing={2} padding={2}>
                            <Typography variant="body1" color="grey" sx={{ fontWeight: "bold" }}>
                                {`${currentUser.firstName} ${currentUser.lastName}`}
                            </Typography>
                            <Avatar
                                alt="Profile picture"
                                src="https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
                            />
                        </Stack>
                    </Stack>
                </AppBar>
            </Box>
            <Outlet />
        </Stack>
    );
}
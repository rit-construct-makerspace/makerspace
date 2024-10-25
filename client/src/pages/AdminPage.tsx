import React, { ReactNode, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper from "../common/RequestWrapper";

interface PageProps {
  title: string;
  topRightAddons?: ReactNode;
  maxWidth?: string;
  children?: ReactNode;
  noPadding?: boolean;
}

const IS_MENTOR_OR_HIGHER = gql`
  query IsMentorOrHigher {
    isMentorOrHigher
  }
`;

export default function AdminPage({
  title,
  topRightAddons,
  maxWidth = "100%",
  children,
  noPadding = false
}: PageProps) {

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

  const isMentorOrHigherResult = useQuery(IS_MENTOR_OR_HIGHER);

  return (
    <RequestWrapper loading={isMentorOrHigherResult.loading} error={isMentorOrHigherResult.error}>
      <Stack
        alignItems="center"
        sx={{ width: "100%", height: "100vh", overflowY: "auto" }}
      >
        <Stack
          sx={{
            px: noPadding ? 0 : 4,
            py: 4,
            width: "100%",
            maxWidth: `${noPadding ? 'max' : 'min'}(calc(100% - 64px), ${maxWidth})`,
          }}
        >
          <Stack direction="row" alignItems="center" mb={4} ml={noPadding ? 4 : ""}>
            {title != "" &&
            <Typography variant={isMobile ? "h5" : "h3"} sx={{pl: isMobile ? 4 : ""}} flexGrow={1}>
            {title}
            </Typography>}
            {topRightAddons}
          </Stack>

          {children}
        </Stack>
      </Stack>
    </RequestWrapper>
  );
}

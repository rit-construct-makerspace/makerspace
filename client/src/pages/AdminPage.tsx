import React, { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper from "../common/RequestWrapper";

interface PageProps {
  title: string;
  topRightAddons?: ReactNode;
  maxWidth?: string;
  children?: ReactNode;
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
}: PageProps) {
  const isMentorOrHigherResult = useQuery(IS_MENTOR_OR_HIGHER);

  return (
    <RequestWrapper loading={isMentorOrHigherResult.loading} error={isMentorOrHigherResult.error}>
      <Stack
        alignItems="center"
        sx={{ width: "100%", height: "100vh", overflowY: "auto" }}
      >
        <Stack
          sx={{
            p: 4,
            width: "100%",
            maxWidth: `min(calc(100% - 64px), ${maxWidth})`,
          }}
        >
          <Stack direction="row" alignItems="center" mb={4}>
            {title != "" &&
            <Typography variant="h3" flexGrow={1}>
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

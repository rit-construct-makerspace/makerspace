import React, { ReactElement } from "react";
import { ApolloError } from "@apollo/client";
import { Alert, CircularProgress, Stack } from "@mui/material";

interface RequestWrapperProps {
  loading: boolean;
  error: ApolloError | undefined;
  children: ReactElement;
}

export default function RequestWrapper({
  loading,
  error,
  children,
}: RequestWrapperProps) {
  if (loading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        minHeight="400px"
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        minHeight="400px"
      >
        <Alert severity="error" title={error.name}>
          {error.message}
        </Alert>
      </Stack>
    );
  }

  return children;
}

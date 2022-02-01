import React, { ReactNode } from "react";
import { Avatar, Card, CardActionArea, Stack, Typography } from "@mui/material";

interface ModuleThumbnailProps {
  title: string;
  image: string;
  children: ReactNode;
}

export default function ModuleThumbnail({
  title,
  image,
  children,
}: ModuleThumbnailProps) {
  return (
    <Card sx={{ mr: 2, mb: 2 }} elevation={2}>
      <CardActionArea sx={{ padding: 2, height: "100%" }}>
        <Stack alignItems="center" spacing={2} sx={{ height: "100%" }}>
          <Avatar alt="" src={image} sx={{ width: 80, height: 80 }} />
          <Typography
            variant="body1"
            fontWeight={500}
            maxWidth={150}
            textAlign="center"
            lineHeight={1.25}
            flex={1}
          >
            {title}
          </Typography>
          {children}
        </Stack>
      </CardActionArea>
    </Card>
  );
}

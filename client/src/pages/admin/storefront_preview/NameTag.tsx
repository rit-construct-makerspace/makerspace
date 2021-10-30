import React, { useState } from "react";
import Person from "../../../types/Person";
import { Avatar, Paper, Stack, Typography } from "@mui/material";

interface NameTagProps {
  person: Person;
}

export default function NameTag({ person }: NameTagProps) {
  const [angle] = useState(Math.random() * 10 - 5);

  return (
    <Paper
      elevation={4}
      sx={{
        bgcolor: "error.dark",
        pt: 1,
        pb: 2,
        borderRadius: 4,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <Stack alignItems="center">
        <Typography variant="h4" component="div" fontWeight="700" color="white">
          HELLO
        </Typography>

        <Typography variant="h5" component="div" fontWeight="700" color="white">
          my name is
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            bgcolor: "grey.100",
            mt: 1,
            mx: "2px",
            p: 2,
            borderRadius: 2,
            minWidth: 300,
          }}
        >
          <Avatar
            src={person.avatarHref}
            alt=""
            sx={{ width: 64, height: 64 }}
          />
          <Typography
            variant="h4"
            component="div"
            fontFamily="Architects Daughter"
          >
            {person.name.split(" ")[0]}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

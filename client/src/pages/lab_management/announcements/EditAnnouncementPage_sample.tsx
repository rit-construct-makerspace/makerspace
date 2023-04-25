import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Updater } from "use-immer";
import Page from "../../Page";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, Fab, FormControlLabel, FormGroup, Grid, Switch, TextField, Typography } from "@mui/material";

export default function EditAnnouncementSample() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

  return (
    <Page title={"Edit Announcement"}>
        <Grid container
            rowSpacing={5}
            columnSpacing={2}
            sx={{ mb: 4 }}
            alignItems="center"
            justifyContent="flex-start"
            display="flex"
            px={5}
          >
            <Grid item
              xs={12}
              sm={5}>
              <TextField
                label="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={50} >
                <Grid item
                xs={12}
                md={50}>
                <TextField
                    label="Announcement description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    minRows={10}
                />
                </Grid>
            </Grid>

            <Grid item
            md={10}
            xs={4}>
            </Grid>
            <Grid item
              xs={8}
              md={1}
              justifySelf="center">
              <Button
                startIcon={<SaveIcon />}
                color="info"
                sx={{ marginLeft: "auto" }}
              >
                Save
              </Button>
            </Grid>
            <Grid item
              xs={8}
              md={1}
              justifySelf="center">
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                sx={{ marginLeft: "auto" }}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
    </Page>
  );
}

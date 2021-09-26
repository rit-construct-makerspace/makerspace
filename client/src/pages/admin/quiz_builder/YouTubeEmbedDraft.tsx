import React from "react";
import styled from "styled-components";
import { Stack, TextField } from "@mui/material";
import QuizItemDraft from "./QuizItemDraft";
import { YoutubeEmbed } from "../../../types/Quiz";

const StyledIFrame = styled.iframe`
  border-radius: 4px;
  border: none;

  height: 300px;
`;

interface YouTubeEmbedProps {
  youtubeEmbed: YoutubeEmbed;
  updateYoutubeEmbed: (updatedYoutubeEmbed: YoutubeEmbed) => void;
  onRemove: () => void;
}

export default function YouTubeEmbedDraft({
  youtubeEmbed,
  updateYoutubeEmbed,
  onRemove,
}: YouTubeEmbedProps) {
  return (
    <QuizItemDraft onRemove={onRemove}>
      <Stack padding={2} spacing={2}>
        <TextField
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          onChange={(e) => {
            const embedId = new URL(e.target.value).searchParams.get("v") ?? "";
            updateYoutubeEmbed({ ...youtubeEmbed, embedId });
          }}
        />
        {youtubeEmbed.embedId && (
          <StyledIFrame
            src={`https://www.youtube.com/embed/${youtubeEmbed.embedId}`}
          />
        )}
      </Stack>
    </QuizItemDraft>
  );
}

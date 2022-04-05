import React from "react";
import styled from "styled-components";
import { Stack, TextField } from "@mui/material";
import QuizItemDraft from "./QuizItemDraft";
import { QuizItem } from "../../../../types/Quiz";

const StyledIFrame = styled.iframe`
  border-radius: 4px;
  border: none;
  height: 300px;
`;

interface YouTubeEmbedProps {
  index: number;
  youtubeEmbed: QuizItem;
  updateYoutubeEmbed: (updatedYoutubeEmbed: QuizItem) => void;
  onRemove: () => void;
}

export default function YouTubeEmbedDraft({
  index,
  youtubeEmbed,
  updateYoutubeEmbed,
  onRemove,
}: YouTubeEmbedProps) {
  return (
    <QuizItemDraft onRemove={onRemove} index={index} itemId={youtubeEmbed.id}>
      <Stack padding={2} spacing={2}>
        <TextField
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          value={youtubeEmbed.text}
          onChange={(e) => {
            const embedId = new URL(e.target.value).searchParams.get("v") ?? "";
            updateYoutubeEmbed({ ...youtubeEmbed, text: embedId });
          }}
        />
        {youtubeEmbed.text && (
          <StyledIFrame
            src={`https://www.youtube.com/embed/${youtubeEmbed.text}`}
          />
        )}
      </Stack>
    </QuizItemDraft>
  );
}

import React from "react";
import styled from "styled-components";
import { Stack, TextField } from "@mui/material";
import QuizItemDraft from "../QuizItemDraft";
import { QuizItem } from "../../../../../types/Quiz";

const StyledIFrame = styled.iframe`
  border-radius: 4px;
  border: none;
  height: 300px;
`;

interface YouTubeEmbedProps {
  index: number;
  item: QuizItem;
  updateYoutubeEmbed: (updatedYoutubeEmbed: QuizItem) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export default function YouTubeEmbedDraft({
  index,
  item,
  updateYoutubeEmbed,
  onRemove,
  onDuplicate,
}: YouTubeEmbedProps) {
  return (
    <QuizItemDraft onRemove={onRemove} onDuplicate={onDuplicate} index={index} itemId={item.id}>
      <Stack padding={2} spacing={2}>
        <TextField
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          value={item.text}
          onChange={(e) => {
            const embedId = new URL(e.target.value).searchParams.get("v") ?? "";
            updateYoutubeEmbed({ ...item, text: embedId });
          }}
          autoFocus={item.newDraft === true}
        />
        {item.text && (
          <StyledIFrame
            src={`https://www.youtube.com/embed/${item.text}`}
          />
        )}
      </Stack>
    </QuizItemDraft>
  );
}

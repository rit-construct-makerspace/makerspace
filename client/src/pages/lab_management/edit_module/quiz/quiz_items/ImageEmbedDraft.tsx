import React from "react";
import styled from "styled-components";
import QuizItemDraft from "../QuizItemDraft";
import { Stack, TextField } from "@mui/material";
import { QuizItem } from "../../../../../types/Quiz";

const StyledImage = styled.img`
  border-radius: 4px;
`;

interface ImageEmbedDraftProps {
  index: number;
  item: QuizItem;
  updateImageEmbed: (updatedImageEmbed: QuizItem) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export default function ImageEmbedDraft({
  index,
  item,
  updateImageEmbed,
  onRemove,
  onDuplicate,
}: ImageEmbedDraftProps) {
  return (
    <QuizItemDraft onRemove={onRemove} onDuplicate={onDuplicate} index={index} itemId={item.id}>
      <Stack padding={2} spacing={2}>
        <TextField
          label="Image URL"
          value={item.text}
          onChange={(e) => {
            updateImageEmbed({ ...item, text: e.target.value });
          }}
          autoFocus={item.newDraft === true}
        />
        {item.text && <StyledImage src={item.text} alt="" />}
      </Stack>
    </QuizItemDraft>
  );
}

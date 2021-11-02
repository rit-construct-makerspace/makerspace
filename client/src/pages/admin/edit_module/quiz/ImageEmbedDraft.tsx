import React from "react";
import styled from "styled-components";
import { ImageEmbed } from "../../../../types/Quiz";
import QuizItemDraft from "./QuizItemDraft";
import { Stack, TextField } from "@mui/material";

const StyledImage = styled.img`
  border-radius: 4px;
`;

interface ImageEmbedDraftProps {
  index: number;
  imageEmbed: ImageEmbed;
  updateImageEmbed: (updatedImageEmbed: ImageEmbed) => void;
  onRemove: () => void;
}

export default function ImageEmbedDraft({
  index,
  imageEmbed,
  updateImageEmbed,
  onRemove,
}: ImageEmbedDraftProps) {
  return (
    <QuizItemDraft onRemove={onRemove} index={index} itemId={imageEmbed.id}>
      <Stack padding={2} spacing={2}>
        <TextField
          label="Image URL"
          onChange={(e) => {
            updateImageEmbed({ ...imageEmbed, href: e.target.value });
          }}
        />
        {imageEmbed.href && <StyledImage src={imageEmbed.href} alt="" />}
      </Stack>
    </QuizItemDraft>
  );
}

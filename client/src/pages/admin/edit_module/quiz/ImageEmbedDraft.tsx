import React from "react";
import styled from "styled-components";
import ModuleItemDraft from "./ModuleItemDraft";
import { Stack, TextField } from "@mui/material";
import { ModuleItem } from "../../../../types/Module";
import useTimedState from "../../../../hooks/useTimedState";

const StyledImage = styled.img`
  border-radius: 4px;
`;

interface ImageEmbedDraftProps {
  index: number;
  moduleItem: ModuleItem;
  onChange: (updatedText: string) => void;
  onRemove: () => void;
}

export default function ImageEmbedDraft({
  index,
  moduleItem,
  onChange,
  onRemove,
}: ImageEmbedDraftProps) {
  const [text, setText] = useTimedState<string>(moduleItem.text, (latestText) =>
    onChange(latestText)
  );

  return (
    <ModuleItemDraft onRemove={onRemove} index={index} itemId={moduleItem.id}>
      <Stack padding={2} spacing={2}>
        <TextField
          value={text}
          label="Image URL"
          onChange={(e) => setText(e.target.value)}
        />
        {moduleItem.text && <StyledImage src={moduleItem.text} alt="" />}
      </Stack>
    </ModuleItemDraft>
  );
}

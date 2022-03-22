import React from "react";
import styled from "styled-components";
import { Stack, TextField } from "@mui/material";
import ModuleItemDraft from "./ModuleItemDraft";
import { ModuleItem } from "../../../../types/Module";
import useTimedState from "../../../../hooks/useTimedState";

const StyledIFrame = styled.iframe`
  border-radius: 4px;
  border: none;

  height: 300px;
`;

function getEmbedId(youtubeUrl: string) {
  try {
    return new URL(youtubeUrl).searchParams.get("v") ?? "";
  } catch (e) {
    // For some reason the URL object throws an error for invalid URLs
    return "";
  }
}

interface YouTubeEmbedProps {
  index: number;
  moduleItem: ModuleItem;
  onChange: (updatedText: string) => void;
  onRemove: () => void;
}

export default function YouTubeEmbedDraft({
  index,
  moduleItem,
  onChange,
  onRemove,
}: YouTubeEmbedProps) {
  const [text, setText] = useTimedState<string>(moduleItem.text, (latestText) =>
    onChange(latestText)
  );

  const embedId = getEmbedId(text);

  return (
    <ModuleItemDraft onRemove={onRemove} index={index} itemId={moduleItem.id}>
      <Stack padding={2} spacing={2}>
        <TextField
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          onChange={(e) => setText(e.target.value)}
        />
        {embedId && (
          <StyledIFrame src={`https://www.youtube.com/embed/${embedId}`} />
        )}
      </Stack>
    </ModuleItemDraft>
  );
}

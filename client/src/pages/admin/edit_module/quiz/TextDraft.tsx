import React from "react";
import ModuleItemDraft from "./ModuleItemDraft";
import { TextField } from "@mui/material";
import { ModuleItem } from "../../../../types/Module";
import useTimedState from "../../../../hooks/useTimedState";

interface TextDraftProps {
  index: number;
  moduleItem: ModuleItem;
  onChange: (updatedText: string) => void;
  onRemove: () => void;
}

export default function TextDraft({
  index,
  moduleItem,
  onChange,
  onRemove,
}: TextDraftProps) {
  const [text, setText] = useTimedState<string>(moduleItem.text, (latestText) =>
    onChange(latestText)
  );

  return (
    <ModuleItemDraft onRemove={onRemove} index={index} itemId={moduleItem.id}>
      <TextField
        multiline
        sx={{ m: 2 }}
        label="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </ModuleItemDraft>
  );
}

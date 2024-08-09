import React from "react";
import styled from "styled-components";
import { Stack, TextField } from "@mui/material";
import QuizItemDraft from "./QuizItemDraft";
import { QuizItem } from "../../../../types/Quiz";
import { Document, pdfjs } from 'react-pdf'

const StyledIFrame = styled.iframe`
  border-radius: 4px;
  border: none;
  height: 300px;
`;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

interface PdfEmbedProps {
  index: number;
  pdfEmbed: QuizItem;
  updatepdfEmbed: (updatepdfEmbed: QuizItem) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export default function PdfEmbedDraft({
  index,
  pdfEmbed,
  updatepdfEmbed,
  onRemove,
  onDuplicate,
}: PdfEmbedProps) {
  return (
    <QuizItemDraft onRemove={onRemove} onDuplicate={onDuplicate} index={index} itemId={pdfEmbed.id}>
      <Stack padding={2} spacing={2}>
        <TextField
          label="PDF URL"
          placeholder="https://isotropic.org/papers/chicken.pdf"
          value={pdfEmbed.text}
          onChange={(e) => {
            //const embedId = new URL(e.target.value).searchParams.get("v") ?? "";
            updatepdfEmbed({ ...pdfEmbed, text: e.target.value });
          }}
        />
        {pdfEmbed.text && (
          <Document file={pdfEmbed.text} />
        )}
      </Stack>
    </QuizItemDraft>
  );
}

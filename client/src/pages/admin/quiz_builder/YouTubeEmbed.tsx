import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div``;

interface YouTubeEmbedProps {
  embedId: string;
}

export default function YouTubeEmbed({ embedId }: YouTubeEmbedProps) {
  return (
    <StyledDiv>
      <iframe src={`https://www.youtube,com/embed/${embedId}`} />
    </StyledDiv>
  );
}

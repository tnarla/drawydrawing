import styled from "styled-components";

export const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;

  background-color: white;
`;

export const PencilContainer = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;

  pointer-events: none;

  position: absolute;

  & svg {
    width: 30px;
    fill: ${(p) => p.color};
  }
`;

import styled from "styled-components";

export const SidebarModalContainer = styled.div<{ show: boolean; top: number }>`
  /* ${(p) => !p.show && "display:none;"} */

  position:absolute;
  top: 50px;
  /* top: ${(p) => p.top}px; */
  left: 74px;

  width: fit-content;
  height: fit-content;

  background-color: #ebebeb;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

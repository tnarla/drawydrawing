import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 50px;
  height: 100%;

  margin-right: 24px;
`;

export const SidebarContent = styled.div`
  /* set a height */
  height: fit-content;

  background-color: #ebebeb;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  display: grid;
  grid-template-columns: 1fr;
`;

export const SidebarAction = styled.div<{ selected: boolean }>`
  width: 38px;
  height: 38px;

  margin: 6px;

  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #dddcdc;
  }

  ${(p) => (p.selected ? "background-color: #C0C0C0;" : "")}
`;

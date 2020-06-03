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
    ${(p) => !p.selected && "background-color: #dddcdc;"}
  }

  ${(p) => (p.selected ? "background-color: #C0C0C0;" : "")}
`;

export const ModalContainer = styled.div`
  display: flex;
  align-items: center;

  height: 100%;
`;

export const ColorPicker = styled.div<{ color: string }>`
  border-radius: 400px;
  background-color: ${(p) => p.color};
  width: 24px;
  height: 24px;

  margin: 8px 4px;
`;

export const SizePicker = styled.div<{ size: number; color: string }>`
  border-radius: 400px;
  background-color: ${(p) => p.color};

  width: ${(p) => 8 + p.size * 0.8}px;
  height: ${(p) => 8 + p.size * 0.8}px;

  margin: 8px 4px;
`;

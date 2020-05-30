import React, { useState, useCallback } from "react";
import {
  SidebarContainer,
  SidebarContent,
  SidebarAction as SidebarActionContainer,
  ColorContainer,
  ColorPicker,
} from "./sidebar-view-style";
import SidebarModal from "./sidebar-modal";

interface Props {
  readonly setColor: (color: string) => void;
}

export type SidebarAction = "color" | "draw" | "erase" | undefined;

export default function Sidebar(props: Props) {
  const [selectedAction, setSelectedAction] = useState<SidebarAction>(
    undefined
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hoveredAction, setHoveredAction] = useState<SidebarAction>(undefined);
  const [top, setTop] = useState<number>(-50);

  function getTopBound(event: React.MouseEvent) {
    var rect = event.currentTarget.getBoundingClientRect();
    setTop(rect.top);
  }

  return (
    <>
      <SidebarModal show={showModal} top={top}>
        <Colors setColor={props.setColor} />
      </SidebarModal>
      <SidebarContainer>
        <SidebarContent>
          <SidebarActionContainer
            selected={selectedAction === "color"}
            onClick={useCallback(() => {
              setSelectedAction("color");
            }, [selectedAction])}
            onMouseOver={useCallback(
              (event) => {
                setShowModal(true);
                setHoveredAction("color");
                getTopBound(event);
              },
              [showModal, hoveredAction, top]
            )}
            onMouseOut={useCallback(() => {
              setShowModal(false);
              setHoveredAction(undefined);
              setTop(-50);
            }, [showModal, hoveredAction, top])}
          >
            🎨
          </SidebarActionContainer>
          <SidebarActionContainer
            selected={selectedAction === "draw"}
            onClick={useCallback(() => {
              setSelectedAction("draw");
            }, [selectedAction])}
            onMouseOver={useCallback(
              (event) => {
                setShowModal(true);
                setHoveredAction("draw");
                getTopBound(event);
              },
              [showModal, hoveredAction, top]
            )}
            onMouseOut={useCallback(() => {
              setShowModal(false);
              setHoveredAction(undefined);
              setTop(-50);
            }, [showModal, hoveredAction, top])}
          >
            ✨
          </SidebarActionContainer>
          <SidebarActionContainer
            selected={selectedAction === "erase"}
            onClick={useCallback(() => {
              setSelectedAction("erase");
            }, [selectedAction])}
            onMouseOver={useCallback(
              (event) => {
                setShowModal(true);
                setHoveredAction("erase");
                getTopBound(event);
              },
              [showModal, hoveredAction, top]
            )}
            onMouseOut={useCallback(() => {
              setShowModal(false);
              setHoveredAction(undefined);
              setTop(-50);
            }, [showModal, hoveredAction, top])}
          >
            👌
          </SidebarActionContainer>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
}

function Colors(props: Props) {
  const colors = [
    "#f94144",
    "#f3722c",
    "#f8961e",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#577590",
    "#774936",
    "#011627",
    "#fdfffc",
  ];
  return (
    <ColorContainer>
      {colors.map((color) => (
        <ColorPicker color={color} onClick={() => props.setColor(color)} />
      ))}
    </ColorContainer>
  );
}

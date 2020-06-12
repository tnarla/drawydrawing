import React, { useState, useCallback, useRef } from "react";
import {
  SidebarContainer,
  SidebarContent,
  SidebarAction as SidebarActionContainer,
  ModalContainer,
  ColorPicker,
  SizePicker,
} from "./sidebar-view-style";
import Slider from "@material-ui/core/Slider";
import ReactModal from "react-modal";

interface Props {
  readonly setColor?: (color: string) => void;
  readonly setSize?: (size: number) => void;
  readonly penColor?: string;
}

export type SidebarAction = "color" | "draw" | "erase" | "save" | undefined;

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

  function closeModal() {
    setShowModal(false);
    setHoveredAction(undefined);
    setTop(-50);
  }

  function downloadCanvasAsImage() {
    let downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "CanvasAsImage.png");
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    let dataURL = canvas.toDataURL("image/png");
    let url = dataURL.replace(
      /^data:image\/png/,
      "data:application/octet-stream"
    );
    downloadLink.setAttribute("href", url);
    downloadLink.click();
  }

  return (
    <>
      <Colors
        setColor={props.setColor}
        isOpen={selectedAction === "color" && showModal}
        closeModal={closeModal}
        top={top}
      />
      <Size
        setSize={props.setSize}
        isOpen={selectedAction === "draw" && showModal}
        closeModal={closeModal}
        top={top}
        penColor={props.penColor}
      />
      <SidebarContainer>
        <SidebarContent>
          <SidebarActionContainer
            selected={selectedAction === "color" && showModal}
            onClick={useCallback(
              (event) => {
                setSelectedAction("color");
                setShowModal(!showModal);
                setHoveredAction("color");
                getTopBound(event);
              },
              [selectedAction, showModal, hoveredAction, top]
            )}
          >
            🎨
          </SidebarActionContainer>
          <SidebarActionContainer
            selected={selectedAction === "draw" && showModal}
            onClick={useCallback(
              (event) => {
                setSelectedAction("draw");
                setShowModal(!showModal);
                setHoveredAction("draw");
                getTopBound(event);
              },
              [selectedAction, showModal, hoveredAction, top]
            )}
          >
            🖌
          </SidebarActionContainer>
          <SidebarActionContainer
            selected={selectedAction === "save" && showModal}
            onClick={() => downloadCanvasAsImage()}
          >
            💾
          </SidebarActionContainer>
          <SidebarActionContainer
            selected={selectedAction === "save" && showModal}
            onClick={() => downloadCanvasAsImage()}
          >
            ⬅
          </SidebarActionContainer>
          <SidebarActionContainer
            selected={selectedAction === "save" && showModal}
            onClick={() => downloadCanvasAsImage()}
          >
            ➡
          </SidebarActionContainer>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
}

interface ModalProps extends Props {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
  readonly top: number;
}

function Colors(props: ModalProps) {
  const colors = [
    "#f94144",
    "#f3722c",
    "#f8961e",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#577590",
    "#A163F5",
    "#774936",
    "#011627",
    "#fdfffc",
  ];

  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      style={{
        overlay: { backgroundColor: "none", zIndex: 10 },
        content: {
          position: "absolute",
          top: props.top,
          left: 111,
          width: "fit-content",
          height: "fit-content",
          backgroundColor: "#ebebeb",
          boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: 4,
          padding: 0,
        },
      }}
    >
      <ModalContainer>
        {colors.map((color) => (
          <ColorPicker
            color={color}
            onClick={() => {
              props.setColor && props.setColor(color);
              props.closeModal();
            }}
          />
        ))}
      </ModalContainer>
    </ReactModal>
  );
}

function Size(props: ModalProps) {
  const sizes = [1, 3, 5, 10, 25, 50];

  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      style={{
        overlay: { backgroundColor: "none", zIndex: 10 },
        content: {
          position: "absolute",
          top: props.top,
          left: 111,
          width: "fit-content",
          height: "fit-content",
          backgroundColor: "#ebebeb",
          boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: 4,
          padding: 0,
        },
      }}
    >
      <ModalContainer>
        {sizes.map((size) => (
          <SizePicker
            color={props.penColor ?? "black"}
            size={size}
            onClick={() => {
              props.setSize && props.setSize(size);
              props.closeModal();
            }}
          />
        ))}
      </ModalContainer>
    </ReactModal>
  );
}

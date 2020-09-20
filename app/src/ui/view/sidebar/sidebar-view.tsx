import React, { useState, useCallback, useRef } from "react";
import { ChromePicker } from "react-color";
import {
  SidebarContainer,
  SidebarContent,
  SidebarAction as SidebarActionContainer,
  ModalContainer,
  ColorPicker,
  SizePicker,
  GridContainer,
} from "./sidebar-view-style";
import ReactModal from "react-modal";

interface Props {
  readonly setColor?: (color: string) => void;
  readonly setSize?: (size: number) => void;
  readonly penColor?: string;
}

export type SidebarAction =
  | "color"
  | "draw"
  | "erase"
  | "save"
  | "fill"
  | undefined;

type State = {
  selectedAction: SidebarAction | null;
  hoveredAction: SidebarAction | null;
  showModal: boolean;
  top: number;
};

export default class Sidebar extends React.Component<Props, State> {
  state: State = {
    selectedAction: null,
    hoveredAction: null,
    showModal: false,
    top: -50,
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      hoveredAction: null,
      top: -50,
    });
  };

  downloadCanvasAsImage = () => {
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
  };

  setTopBound(target: HTMLElement) {
    var rect = target.getBoundingClientRect();
    this.setState({ top: rect.top });
  }

  render() {
    const { props } = this;
    const { selectedAction, showModal, top } = this.state;

    return (
      <>
        <Colors
          penColor={props.penColor}
          setColor={props.setColor}
          isOpen={selectedAction === "color" && showModal}
          closeModal={this.closeModal}
          top={top}
        />
        <Size
          setSize={props.setSize}
          isOpen={selectedAction === "draw" && showModal}
          closeModal={this.closeModal}
          top={top}
          penColor={props.penColor}
        />
        <SidebarContainer>
          <SidebarContent>
            <SidebarActionContainer
              selected={selectedAction === "color" && showModal}
              onClick={(event) => {
                this.setState({
                  selectedAction: "color",
                  hoveredAction: "color",
                  showModal: !showModal,
                });
                this.setTopBound(event.currentTarget);
              }}
            >
              🎨
            </SidebarActionContainer>
            <SidebarActionContainer
              selected={selectedAction === "draw" && showModal}
              onClick={(event) => {
                this.setState({
                  selectedAction: "draw",
                  hoveredAction: "draw",
                  showModal: !showModal,
                });
                this.setTopBound(event.currentTarget);
              }}
            >
              🖌
            </SidebarActionContainer>
            <SidebarActionContainer
              selected={selectedAction === "save" && showModal}
              onClick={this.downloadCanvasAsImage}
            >
              💾
            </SidebarActionContainer>
            <SidebarActionContainer
              selected={selectedAction === "fill" && showModal}
              onClick={() => console.log("fill")}
            >
              <span style={{ filter: "hue-rotate(90deg)" }}>🍁</span>
            </SidebarActionContainer>
          </SidebarContent>
        </SidebarContainer>
      </>
    );
  }
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
        <GridContainer>
          {colors.map((color) => (
            <ColorPicker
              color={color}
              onClick={() => {
                props.setColor && props.setColor(color);
                props.closeModal();
              }}
            />
          ))}
        </GridContainer>
        <ChromePicker
          color={props.penColor}
          onChange={(color) => {
            props.setColor && props.setColor(color.hex);
          }}
        />
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

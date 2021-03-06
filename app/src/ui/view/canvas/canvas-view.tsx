import React from "react";
import { CanvasContainer, PencilContainer } from "./canvas-view-style";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { store } from "../../../models/store";
import { observer } from "mobx-react";
import socket from "../../../socket";

interface CanvasData {
  toX: number;
  toY: number;
  fromX: number;
  fromY: number;
  penColor: string;
  penSize: number;
}

type Position = {
  mouseX: number;
  mouseY: number;
};

type Props = RouteComponentProps<{ shortId?: string }>;

type State = {
  isMouseDown: boolean;
  drawObject: Position | null;
  undoImage: ImageData[];
  redoImage: ImageData[];
  windowSize: {
    height: number;
    width: number;
  };
};

class Canvas extends React.Component<Props, State> {
  state: State = {
    isMouseDown: false,
    drawObject: null,
    undoImage: [],
    redoImage: [],
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  ctx?: CanvasRenderingContext2D | null;
  canvasRef = React.createRef<HTMLCanvasElement>();
  previewCtx?: CanvasRenderingContext2D | null;
  previewCanvasRef = React.createRef<HTMLCanvasElement>();
  pencilRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (!this.canvasRef.current || !this.previewCanvasRef.current) {
      throw new Error("Could not find canvas ref");
    }

    this.ctx = this.canvasRef.current.getContext("2d");
    this.previewCtx = this.previewCanvasRef.current.getContext("2d");

    // Set the initial size of the canvas:
    this.canvasRef.current.width = this.state.windowSize.width;
    this.canvasRef.current.height = this.state.windowSize.height;
    this.previewCanvasRef.current.width = 180;
    this.previewCanvasRef.current.height = 100;

    // Set up key handlers for redo and undo:
    document.addEventListener("keypress", (e) => {
      if (e.key === "z" && e.ctrlKey) {
        this.undo();
      }

      if (e.key === "y" && e.ctrlKey) {
        this.redo();
      }
    });

    // Listen for window resizing:
    window.addEventListener("resize", (e) => {
      const windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      this.setState({ windowSize });

      const imageData = this.ctx!.getImageData(
        0,
        0,
        windowSize.width,
        windowSize.height
      );
      this.canvasRef.current!.width = windowSize.width;
      this.canvasRef.current!.height = windowSize.height;
      this.ctx!.putImageData(imageData, 0, 0);
    });

    // Whenever we get a draw event from the server, draw into the canvas:
    socket.on("update", (data: CanvasData) => {
      this.draw(
        data.toX,
        data.toY,
        data.fromX,
        data.fromY,
        data.penColor,
        data.penSize
      );
    });
  }

  componentDidUpdate(prevProps: Props) {
    // If the URL params change, then we need to re-join the socket room:
    if (this.props.match.params.shortId !== prevProps.match.params.shortId) {
      this.joinRoom();
    }

    // Sync canvas:
    this.previewCtx?.drawImage(this.canvasRef.current!, 0, 0, 180, 100);
  }

  joinRoom() {
    if (this.props.match.params.shortId) {
      socket.emit("join", this.props.match.params.shortId);
    }
  }

  draw(
    mouseX: number,
    mouseY: number,
    fromX: number,
    fromY: number,
    penColor: string,
    penSize: number
  ) {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.lineWidth = penSize;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = penColor;
    this.ctx.moveTo(fromX, fromY + 0.5);
    this.ctx.lineTo(mouseX, mouseY + 0.5);
    this.ctx.stroke();
  }

  redo() {
    if (!this.ctx) return;
    const { redoImage } = this.state;

    if (redoImage.length) {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.state.windowSize.width,
        this.state.windowSize.height
      );

      this.setState({ undoImage: [...this.state.undoImage, imageData] });

      const redoState = redoImage.pop();
      if (!redoState) return;

      this.ctx.putImageData(redoState, 0, 0);
    } else {
      this.ctx.clearRect(
        0,
        0,
        this.state.windowSize.width,
        this.state.windowSize.height
      );
    }
  }

  undo() {
    if (!this.ctx) return;
    const { undoImage } = this.state;

    if (undoImage.length) {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.state.windowSize.width,
        this.state.windowSize.height
      );

      this.setState({ redoImage: [...this.state.redoImage, imageData] });

      const undoState = undoImage.pop();
      if (!undoState) return;
      this.ctx.putImageData(undoState, 0, 0);
    } else {
      this.ctx.clearRect(
        0,
        0,
        this.state.windowSize.width,
        this.state.windowSize.height
      );
    }
  }

  onDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const mouseX = event.nativeEvent.offsetX;
    const mouseY = event.nativeEvent.offsetY;

    let imageData = this.ctx!.getImageData(
      0,
      0,
      this.state.windowSize.width,
      this.state.windowSize.height
    );

    this.setState({
      isMouseDown: true,
      drawObject: {
        mouseX,
        mouseY,
      },
      undoImage: [...this.state.undoImage, imageData],
    });
  };

  onMove = (event: React.MouseEvent) => {
    const mouseX = event.nativeEvent.offsetX;
    const mouseY = event.nativeEvent.offsetY;

    // TODO: Move this into state:
    if (this.pencilRef.current) {
      this.pencilRef.current.style.transform = `translate3d(${mouseX}px, ${
        mouseY - 30
      }px, 0)`;
    }

    if (this.state.isMouseDown) {
      const prevPosition = this.state.drawObject!;

      this.setState({
        drawObject: { mouseX, mouseY },
      });

      if (this.props.match.params.shortId) {
        socket.emit("sendImageData", {
          toX: mouseX,
          toY: mouseY,
          fromX: prevPosition.mouseX,
          fromY: prevPosition.mouseY,
          penColor: store.pen.color,
          penSize: store.pen.size,
        });
      }

      this.draw(
        mouseX,
        mouseY,
        prevPosition.mouseX,
        prevPosition.mouseY,
        store.pen.color,
        store.pen.size
      );
    }
  };

  onUp = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    this.setState({
      isMouseDown: false,
      drawObject: null,
    });
  };

  onDownload = () => {
    if (!this.canvasRef.current) return;
    let downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "drawydrawing.png");
    let dataURL = this.canvasRef.current.toDataURL("image/png");
    let url = dataURL.replace(
      /^data:image\/png/,
      "data:application/octet-stream"
    );
    downloadLink.setAttribute("href", url);
    downloadLink.click();
  };

  render() {
    return (
      <CanvasContainer>
        <PencilContainer ref={this.pencilRef} color={"black"}>
          <PencilIcon />
        </PencilContainer>

        <div
          className={`rotate-small-boi border-4 border-indigo-600 rounded absolute top-4 m-6 bg-white cursor-pointer transition duration-100 ${
            this.state.isMouseDown ? "pointer-events-none opacity-25" : ""
          }`}
          onClick={this.onDownload}
        >
          <canvas
            className=""
            style={{ height: 100, width: 180 }}
            ref={this.previewCanvasRef}
          />
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white absolute bottom-0 right-0 z-10 shadow-lg -mr-4 -mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 block"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
        </div>

        <canvas
          style={{ display: "block", touchAction: "none" }}
          ref={this.canvasRef}
          onPointerDown={this.onDown}
          onPointerMove={this.onMove}
          onPointerUp={this.onUp}
        />
      </CanvasContainer>
    );
  }
}

const PencilIcon = () => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 469.336 469.336">
      <g>
        <g>
          <path
            d="M456.836,76.168l-64-64.054c-16.125-16.139-44.177-16.17-60.365,0.031L45.763,301.682
   c-1.271,1.282-2.188,2.857-2.688,4.587L0.409,455.73c-1.063,3.722-0.021,7.736,2.719,10.478c2.031,2.033,4.75,3.128,7.542,3.128
   c0.979,0,1.969-0.136,2.927-0.407l149.333-42.703c1.729-0.5,3.302-1.418,4.583-2.69l289.323-286.983
   c8.063-8.069,12.5-18.787,12.5-30.192S464.899,84.237,456.836,76.168z M285.989,89.737l39.264,39.264L120.257,333.998
   l-14.712-29.434c-1.813-3.615-5.5-5.896-9.542-5.896H78.921L285.989,89.737z M26.201,443.137L40.095,394.5l34.742,34.742
   L26.201,443.137z M149.336,407.96l-51.035,14.579l-51.503-51.503l14.579-51.035h28.031l18.385,36.771
   c1.031,2.063,2.708,3.74,4.771,4.771l36.771,18.385V407.96z M170.67,390.417v-17.082c0-4.042-2.281-7.729-5.896-9.542
   l-29.434-14.712l204.996-204.996l39.264,39.264L170.67,390.417z M441.784,121.72l-47.033,46.613l-93.747-93.747l46.582-47.001
   c8.063-8.063,22.104-8.063,30.167,0l64,64c4.031,4.031,6.25,9.385,6.25,15.083S445.784,117.72,441.784,121.72z"
          />
        </g>
      </g>
    </svg>
  );
};

export default withRouter(observer(Canvas));

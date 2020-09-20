import React from "react";
import { CanvasContainer, PencilContainer } from "./canvas-view-style";
import socketIOClient from "socket.io-client";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as shortid from "shortid";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://cryptic-savannah-67902.herokuapp.com/"
    : "http://localhost:5000/";

const socket = socketIOClient(ENDPOINT);

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

type Props = RouteComponentProps<{ shortId?: string }> & {
  penColor: string;
  penSize: number;
};

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
  pencilRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (!this.canvasRef.current) {
      throw new Error("Could not find canvas ref");
    }

    this.ctx = this.canvasRef.current.getContext("2d");

    // Set the initial size of the canvas:
    this.canvasRef.current.width = this.state.windowSize.width;
    this.canvasRef.current.height = this.state.windowSize.height;

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

    // Join the room based on the URL
    const { shortId } = this.props.match.params;

    if (!shortId) {
      const sid = shortid.generate();
      this.props.history.push(`/${sid}`);
    } else {
      this.joinRoom();
    }
  }

  componentDidUpdate(prevProps: Props) {
    // If the URL params change, then we need to re-join the socket room:
    if (this.props.match.params.shortId !== prevProps.match.params.shortId) {
      this.joinRoom();
    }
  }

  joinRoom() {
    socket.emit("room", this.props.match.params.shortId);
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

      socket.emit("sendImageData", {
        toX: mouseX,
        toY: mouseY,
        fromX: prevPosition.mouseX,
        fromY: prevPosition.mouseY,
        penColor: this.props.penColor,
        penSize: this.props.penSize,
      });

      this.draw(
        mouseX,
        mouseY,
        prevPosition.mouseX,
        prevPosition.mouseY,
        this.props.penColor,
        this.props.penSize
      );
    }
  };

  onUp = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    this.setState({
      isMouseDown: false,
      drawObject: null,
    });
  };

  render() {
    return (
      <CanvasContainer>
        <PencilContainer ref={this.pencilRef} color={"black"}>
          <PencilIcon />
        </PencilContainer>

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
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 469.336 469.336"
      preserveAspectRatio="true"
    >
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

export default withRouter(Canvas);

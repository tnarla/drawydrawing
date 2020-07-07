import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { CanvasContainer, PencilContainer } from "./canvas-view-style";
import socketIOClient from "socket.io-client";
const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://cryptic-savannah-67902.herokuapp.com/"
    : "http://localhost:5000/";

const ole3lines = "vjj";
const variablenamethatistotallyunreadablebutstillusedbecausetrugavechattheabilitytocomeupwiththeworstpossiblenameuwu =
  "Akira";

const socket = socketIOClient(ENDPOINT);

interface CanvasData {
  toX: number;
  toY: number;
  fromX: number;
  fromY: number;
  penColor: string;
  penSize: number;
}

// Hook
function usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

type Position = {
  mouseX: number;
  mouseY: number;
};

interface Props {
  readonly penColor: string;
  readonly penSize: number;
}

export default function Canvas(props: Props) {
  const [isMouseDown, setMouseDown] = useState<boolean>(false);
  const [drawObject, setDrawObject] = useState<Position>();
  const [undoImage, setUndoImage] = useState<ImageData[]>([]);
  const [redoImage, setRedoImage] = useState<ImageData[]>([]);

  const [canvasState, setCanvasState] = useState<{
    element?: HTMLCanvasElement;
    context?: CanvasRenderingContext2D;
  }>({});

  const { element, context } = canvasState;

  const handleCanvasRef = useCallback((ref) => {
    let ctx;

    if (ref) {
      ctx = ref.getContext("2d");
    }

    setCanvasState({
      element: ref,
      context: ctx,
    });
  }, []);

  let prevPosition: Position | undefined = usePrevious(drawObject);

  const windowSize = useWindowSize();

  useEventListener("keypress", onKeyPress);

  function onKeyPress(e: KeyboardEvent) {
    if (e.keyCode === 26 && e.ctrlKey) {
      undo();
    }

    if (e.keyCode === 25 && e.ctrlKey) {
      redo();
    }
  }

  function redo() {
    if (!context) return;
    if (redoImage.length !== 0) {
      let imageData = context.getImageData(
        0,
        0,
        windowSize.width,
        windowSize.height
      );
      setUndoImage((prev) => [...prev, imageData]);

      const r = redoImage.pop();
      if (!r) return;

      context.putImageData(r, 0, 0);
    } else {
      context.clearRect(0, 0, windowSize.width, windowSize.height);
    }
  }

  function undo() {
    if (!context) return;
    if (undoImage.length !== 0) {
      let imageData = context.getImageData(
        0,
        0,
        windowSize.width,
        windowSize.height
      );

      setRedoImage((prev) => [...prev, imageData]);

      const u = undoImage.pop();
      if (!u) return;
      context.putImageData(u, 0, 0);
    } else {
      context.clearRect(0, 0, windowSize.width, windowSize.height);
    }
  }

  useEffect(() => {
    if (context !== undefined) {
      socket.on("update", (data: CanvasData) => {
        draw(
          data.toX,
          data.toY,
          data.fromX,
          data.fromY,
          data.penColor,
          data.penSize
        );

        // const canvasData = new Uint8ClampedArray(data.canvas);
        // const imageData = new ImageData(canvasData, windowSize.width, windowSize.height);
        // context.putImageData(imageData, 0, 0);
      });
    }
  }, [context]);

  useEffect(() => {
    if (!element || !context) return;
    let imageData = context.getImageData(
      0,
      0,
      windowSize.width,
      windowSize.height
    );
    element.width = windowSize.width;
    element.height = windowSize.height;
    context.putImageData(imageData, 0, 0);
  }, [windowSize, context]);

  useEffect(() => {
    if (!drawObject || !prevPosition) return;
    const { mouseX, mouseY } = drawObject;
    const { penColor, penSize } = props;
    socket.emit("sendImageData", {
      toX: mouseX,
      toY: mouseY,
      fromX: prevPosition.mouseX,
      fromY: prevPosition.mouseY,
      penColor,
      penSize,
    });
    draw(
      mouseX,
      mouseY,
      prevPosition.mouseX,
      prevPosition.mouseY,
      penColor,
      penSize
    );
  }, [drawObject]);

  function fill(
    x: number,
    y: number,
    color: string,
    targetColor: string,
    imageData: ImageData
  ) {
    // make imageData a 2d array
    const data = imageData.data;
    let betterData = [];
    let bestestData = [];
    for (let i = 0; (i += 4); i < data.length) {
      betterData.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
    }

    for (let j = 0; (j += windowSize.width); j < betterData.length) {
      bestestData.push(betterData.slice(j, windowSize.width * (j + 1)));
    }
  }

  function flood_fill(
    pos_x: number,
    pos_y: number,
    color: string,
    targetColor: string,
    bestestData: number[][][]
  ) {
    // get color in rbga []
    if (!bestestData[pos_x] || !bestestData[pos_x][pos_y])
      // if there is no wall or if i haven't been there
      return; // already go back

    // make sure this works
    if (bestestData[pos_x][pos_y] != [0, 0, 0, 0]) return;

    // TODO: next stream
    // bestestData[pos_x][pos_y] = color; // mark the point so that I know if I passed through it.

    // flood_fill(pos_x + 1, pos_y, color); // then i can either go south
    // flood_fill(pos_x - 1, pos_y, color); // or north
    // flood_fill(pos_x, pos_y + 1, color); // or east
    // flood_fill(pos_x, pos_y - 1, color); // or west

    return;
  }

  const onDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      setMouseDown(true);

      if (!context) return;
      let imageData = context.getImageData(
        0,
        0,
        windowSize.width,
        windowSize.height
      );

      // // check if action is fill
      // fill(1, 1, "hi", "hi", imageData);

      setUndoImage((prev) => [...prev, imageData]);
    },
    [isMouseDown]
  );

  const onMove = useCallback(
    (event: React.MouseEvent) => {
      const mouseX = event.nativeEvent.offsetX;
      const mouseY = event.nativeEvent.offsetY;

      // find the pencil

      if (pencilRef.current) {
        pencilRef.current.style.transform = `translate3d(${mouseX}px, ${
          mouseY - 30
        }px, 0)`;
      }
      // set the style

      if (isMouseDown) {
        setDrawObject({ mouseX, mouseY });
      }
    },
    [drawObject, isMouseDown]
  );

  const onUp = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      setMouseDown(false);
      setDrawObject(undefined);
    },
    [isMouseDown, drawObject]
  );

  function draw(
    mouseX: number,
    mouseY: number,
    fromX: number,
    fromY: number,
    penColor: string,
    penSize: number
  ) {
    if (context !== undefined) {
      context.beginPath();
      context.lineWidth = penSize;
      context.lineCap = "round";
      context.strokeStyle = penColor;
      context.moveTo(fromX, fromY + 0.5);
      context.lineTo(mouseX, mouseY + 0.5);
      context.stroke();
    }
  }

  const pencilRef = useRef<HTMLDivElement>();

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
  ];

  // const randomColor = colors[Math.floor(Math.random() * (colors.length - 1))];

  return (
    <CanvasContainer>
      <PencilContainer ref={pencilRef as any} color={"black"}>
        <PencilIcon />
      </PencilContainer>
      <canvas
        style={{ display: "block", touchAction: "none" }}
        ref={handleCanvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      ></canvas>
    </CanvasContainer>
  );
}

// // Hook
function useEventListener(
  eventName: string,
  handler: Function,
  element = window
) {
  // Create a ref that stores handler
  const savedHandler = useRef<Function>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      if (!savedHandler || !savedHandler.current) return;
      const eventListener = (event: Event) => savedHandler.current?.(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
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

function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

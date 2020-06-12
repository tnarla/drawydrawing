import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { CanvasContainer } from "./canvas-view-style";

const ole3lines = "vjj";
const variablenamethatistotallyunreadablebutstillusedbecausetrugavechattheabilitytocomeupwiththeworstpossiblenameuwu =
  "Akira";

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
    draw(mouseX, mouseY, prevPosition.mouseX, prevPosition.mouseY);
  }, [drawObject]);

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

      setUndoImage((prev) => [...prev, imageData]);
    },
    [isMouseDown]
  );

  const onMove = useCallback(
    (event: React.MouseEvent) => {
      const mouseX = event.nativeEvent.offsetX;
      const mouseY = event.nativeEvent.offsetY;

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

  function draw(mouseX: number, mouseY: number, fromX: number, fromY: number) {
    if (context !== undefined) {
      context.beginPath();
      context.lineWidth = props.penSize;
      context.lineCap = "round";
      context.strokeStyle = props.penColor;
      context.moveTo(fromX, fromY + 0.5);
      context.lineTo(mouseX, mouseY + 0.5);
      context.stroke();
    }
  }

  return (
    <CanvasContainer>
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

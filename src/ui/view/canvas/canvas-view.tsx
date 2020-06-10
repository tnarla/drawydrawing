import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { CanvasContainer } from "./canvas-view-style";

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

  useEffect(() => {
    console.log("should set height and width", element, context);
    if (!element || !context) return;
    // Grab image data here...
    let imageData = context.getImageData(
      0,
      0,
      windowSize.width,
      windowSize.height
    );
    element.width = windowSize.width;
    element.height = windowSize.height;
    // Restore image data here...
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

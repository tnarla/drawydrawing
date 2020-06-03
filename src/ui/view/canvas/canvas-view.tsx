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
  let c = useRef<HTMLCanvasElement>(null);

  const context = useMemo(() => {
    if (!c || !c.current) return;
    var ctx = c.current.getContext("2d");

    if (ctx === null) return;
    ctx.canvas.width = 800;
    ctx.canvas.height = 600;

    return ctx;
  }, [c.current]);

  let prevPosition: Position | undefined = usePrevious(drawObject);

  useEffect(() => {
    if (drawObject === undefined || prevPosition === undefined) return;
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
        style={{ display: "block" }}
        ref={c}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
      ></canvas>
    </CanvasContainer>
  );
}

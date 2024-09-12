import { FC, useRef } from "react";
import { Color } from "./color";
import Handler from "./Handler";
import Transform from "./Transform";
import useColorDrag from "./useColorDrag";

const Palettle: FC<{
  color: Color;
}> = ({ color }) => {
  const transformRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [offset, dragStartHandle] = useColorDrag({
    containerRef,
    targetRef: transformRef,
    onDragChange: (offsetValue) => {
      console.log(offsetValue);
    },
  });
  return (
    <div
      ref={containerRef}
      className="color-picker-panel-palette"
      onMouseDown={dragStartHandle}
    >
      <Transform ref={transformRef} offset={{ x: offset.x, y: offset.y }}>
        <Handler color={color.toRgbString()}></Handler>
      </Transform>
      {/* <Handler color={color.toRgbString()}></Handler> */}
      <div
        className="color-picker-panel-palette-main"
        style={{
          backgroundColor: `hsl(${color.toHsl().h}, 100%, 50%)`,
          backgroundImage:
            "linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0, 0%,100%, 0))",
        }}
      ></div>
    </div>
  );
};

export default Palettle;

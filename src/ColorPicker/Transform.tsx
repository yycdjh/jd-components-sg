import React, { forwardRef } from "react";

export interface TransformOffect {
  x: number;
  y: number;
}

interface TransFormProps {
  offset?: TransformOffect;
  children?: React.ReactNode;
}

const Transform = forwardRef<HTMLDivElement, TransFormProps>((props, ref) => {
  const { children, offset } = props;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: offset?.x ?? 0,
        top: offset?.y ?? 0,
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
});

export default Transform;

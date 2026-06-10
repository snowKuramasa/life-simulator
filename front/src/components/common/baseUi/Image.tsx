import * as React from "react";

import styles from "@/styles/common/baseUi/image.module.css";

type ResponsiveSize = number | string | { base: number | string; md?: number | string };

type ImageProps = Omit<React.ComponentProps<"img">, "width" | "height"> & {
  width?: ResponsiveSize;
  height?: ResponsiveSize;
};

function toCssSize(size: number | string) {
  return typeof size === "number" ? `${size}px` : size;
}

function getSizeStyle(size: ResponsiveSize | undefined, variableName: string) {
  if (size === undefined) {
    return {};
  }

  if (typeof size === "object") {
    return {
      [variableName]: toCssSize(size.base),
      [`${variableName}-md`]: size.md ? toCssSize(size.md) : toCssSize(size.base),
    };
  }

  return {
    [variableName]: toCssSize(size),
    [`${variableName}-md`]: toCssSize(size),
  };
}

export function Image({ className, style, width, height, ...props }: ImageProps) {
  const sizeStyle = {
    ...getSizeStyle(width, "--image-width"),
    ...getSizeStyle(height, "--image-height"),
  } as React.CSSProperties;
  const imageClassName = `${styles.image} ${className ?? ""}`.trim();

  return <img className={imageClassName} style={{ ...sizeStyle, ...style }} {...props} />;
}

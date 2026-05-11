import * as React from "react";

import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import styles from "@/styles/common/atom/button.module.css";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonProps = Omit<React.ComponentProps<typeof ShadcnButton>, "variant" | "size"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary: styles.primary,
  outline: styles.outline,
  ghost: styles.ghost,
};

const sizeClassNames: Record<ButtonSize, string> = {
  default: styles.defaultSize,
  sm: styles.sm,
  lg: styles.lg,
  icon: styles.icon,
};

export function Button({ className, variant = "primary", size = "default", ...props }: ButtonProps) {
  return (
    <ShadcnButton
      variant="ghost"
      size="default"
      className={cn(styles.button, variantClassNames[variant], sizeClassNames[size], className)}
      {...props}
    />
  );
}

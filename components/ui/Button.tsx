import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "accent" | "blush" | "sage" | "paper" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  accent: "btn-accent",
  blush: "btn-blush",
  sage: "btn-sage",
  paper: "btn-paper",
  ghost: "btn-ghost",
};

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
  prefetch?: boolean;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const classes = ["btn", variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, target, rel, onClick, prefetch, "aria-label": ariaLabel } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        prefetch={prefetch}
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    href: _href,
    ...rest
  } = props as ButtonAsButton & { href?: undefined };
  void _variant;
  void _size;
  void _className;
  void _children;
  void _href;

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

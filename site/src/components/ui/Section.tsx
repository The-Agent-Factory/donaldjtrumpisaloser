import { ReactNode } from "react";

export function Section({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "header";
}) {
  return <Tag className={`py-12 md:py-16 ${className}`}>{children}</Tag>;
}

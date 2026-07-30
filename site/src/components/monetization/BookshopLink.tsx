import { ReactNode } from "react";

export function BookshopLink({
  isbn,
  children,
}: {
  isbn: string;
  children: ReactNode;
}) {
  const id = process.env.NEXT_PUBLIC_BOOKSHOP_ID;
  const href = id
    ? `https://bookshop.org/a/${id}/${isbn}`
    : `https://bookshop.org/books?keywords=${isbn}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow sponsored"
      className="underline decoration-1 underline-offset-2 hover:text-[var(--accent)]"
    >
      {children}
    </a>
  );
}

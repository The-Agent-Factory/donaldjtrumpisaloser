import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "sm"
      ? "text-base"
      : size === "lg"
      ? "text-3xl"
      : "text-xl";
  return (
    <Link
      href="/"
      aria-label="donaldjtrumpisaloser.com — home"
      className={`font-serif ${cls} tracking-tight inline-flex items-baseline gap-0 hover:!text-[var(--primary)]`}
      style={{ fontVariantCaps: "small-caps", color: "var(--primary)" }}
    >
      <span>donaldjtrump</span>
      <span className="relative">
        <span>i</span>
        <span
          aria-hidden
          className="absolute"
          style={{
            top: "0.05em",
            left: "0.32em",
            width: "0.18em",
            height: "0.18em",
            background: "var(--accent)",
          }}
        />
      </span>
      <span>sa</span>
      <span style={{ color: "var(--accent)" }}>l</span>
      <span>oser</span>
    </Link>
  );
}

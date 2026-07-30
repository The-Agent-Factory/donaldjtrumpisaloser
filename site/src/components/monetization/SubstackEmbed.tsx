export function SubstackEmbed({
  variant = "wide",
}: {
  variant?: "wide" | "compact";
}) {
  const url = process.env.NEXT_PUBLIC_SUBSTACK_URL;
  if (!url) {
    return (
      <div
        className="border rule p-6 text-center font-ui text-sm"
        style={{ background: "var(--surface)", color: "var(--text-muted)" }}
      >
        <div className="font-serif text-lg mb-1" style={{ color: "var(--primary)" }}>
          Newsletter
        </div>
        <div>
          Weekly digest. What changed in the archive, with citations. Coming
          soon.
        </div>
      </div>
    );
  }
  const embedUrl = url.replace(/\/$/, "") + "/embed";
  return (
    <div className="border rule" style={{ background: "var(--surface)" }}>
      <iframe
        src={embedUrl}
        title="Newsletter signup"
        width="100%"
        height={variant === "compact" ? 220 : 320}
        style={{ border: 0, background: "transparent" }}
        loading="lazy"
      />
    </div>
  );
}

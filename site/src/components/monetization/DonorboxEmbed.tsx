export function DonorboxEmbed() {
  const id = process.env.NEXT_PUBLIC_DONORBOX_ID;
  if (!id) return null;
  return (
    <iframe
      src={`https://donorbox.org/embed/${id}?language=en`}
      name="donorbox"
      allow="payment"
      seamless
      title="Support this archive"
      width="100%"
      height="900"
      style={{ maxWidth: 500, minWidth: 250, maxHeight: "none", border: 0 }}
      loading="lazy"
    />
  );
}

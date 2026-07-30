"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

export function AdSlot({
  slotId,
  format = "auto",
  className = "",
}: {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // no-op: ad load failed silently
    }
  }, [client]);

  if (!client) return null;

  return (
    <div className={`my-8 ${className}`} aria-label="Advertisement">
      <div className="font-ui text-[10px] uppercase tracking-widest text-center mb-2" style={{ color: "var(--text-muted)" }}>
        Advertisement
      </div>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

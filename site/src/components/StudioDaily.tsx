"use client";

import { useEffect, useState } from "react";

interface Posts {
  date: string;
  thread: string[];
  tiktok_script: string;
  substack_md: string;
  has_video: boolean;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      className="px-3 py-1 border rule font-ui text-xs uppercase tracking-wider"
      style={{
        background: done ? "var(--accent)" : "var(--surface)",
        color: done ? "var(--bg)" : "var(--text)",
      }}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}

export function StudioDaily() {
  const [posts, setPosts] = useState<Posts | null>(null);
  useEffect(() => {
    fetch("/data/posts-latest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setPosts)
      .catch(() => setPosts(null));
  }, []);

  if (!posts) {
    return (
      <p className="font-ui" style={{ color: "var(--text-muted)" }}>
        No content package published yet. The studio fills itself daily after the
        11:00 UTC panel run.
      </p>
    );
  }

  return (
    <div className="grid gap-12">
      {posts.has_video && (
        <div>
          <h2 className="font-serif mb-4">Today&apos;s Short — {posts.date}</h2>
          <video
            controls
            playsInline
            preload="metadata"
            className="border rule w-full max-w-sm"
            style={{ background: "#000", aspectRatio: "9 / 16" }}
            src="/shorts/latest.mp4"
          />
          <p className="font-ui text-sm mt-3" style={{ color: "var(--text-muted)" }}>
            Auto-rendered from today&apos;s panel.{" "}
            <a href="/shorts/latest.mp4" download className="underline">
              Download the MP4
            </a>{" "}
            and upload to YouTube Shorts / TikTok / Reels.
          </p>
        </div>
      )}

      {posts.thread?.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-serif">X thread ({posts.thread.length} posts)</h2>
            <CopyButton text={posts.thread.join("\n\n---\n\n")} label="Copy full thread" />
          </div>
          <div className="grid gap-3">
            {posts.thread.map((t, i) => (
              <div
                key={i}
                className="border rule p-4 flex justify-between items-start gap-4"
                style={{ background: "var(--surface)" }}
              >
                <p className="font-ui text-sm whitespace-pre-wrap" style={{ color: "var(--text)" }}>
                  {t}
                </p>
                <CopyButton text={t} />
              </div>
            ))}
          </div>
        </div>
      )}

      {posts.tiktok_script && (
        <div>
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-serif">TikTok / Reels script</h2>
            <CopyButton text={posts.tiktok_script} />
          </div>
          <pre
            className="border rule p-4 font-ui text-sm whitespace-pre-wrap overflow-x-auto"
            style={{ background: "var(--surface)", color: "var(--text)" }}
          >
            {posts.tiktok_script}
          </pre>
        </div>
      )}

      {posts.substack_md && (
        <div>
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-serif">Substack — LLM News edition</h2>
            <CopyButton text={posts.substack_md} label="Copy full edition" />
          </div>
          <pre
            className="border rule p-4 font-ui text-sm whitespace-pre-wrap overflow-x-auto"
            style={{ background: "var(--surface)", color: "var(--text)" }}
          >
            {posts.substack_md}
          </pre>
        </div>
      )}
    </div>
  );
}

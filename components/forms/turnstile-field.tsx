"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

type TurnstileApi = {
  remove: (widgetId: string) => void;
  render: (
    container: HTMLElement,
    options: {
      action: string;
      appearance: "interaction-only";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      sitekey: string;
      size: "flexible";
      theme: "dark";
    },
  ) => string;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileLoader: Promise<void> | undefined;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (turnstileLoader) return turnstileLoader;

  turnstileLoader = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById("cloudflare-turnstile");
    const handleReady = () => resolve();
    const handleError = () => reject(new Error("Turnstile failed to load"));

    if (existingScript) {
      existingScript.addEventListener("load", handleReady, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "cloudflare-turnstile";
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleReady, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.append(script);
  });

  return turnstileLoader;
}

export function TurnstileField({
  action,
  className,
  onTokenChange,
  resetKey,
  siteKey,
}: {
  action: "client-inquiry" | "newsletter" | "partner-inquiry";
  className?: string;
  onTokenChange: (token: string) => void;
  resetKey: number;
  siteKey?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    onTokenChange("");
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;
    let widgetId: string | undefined;

    void loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        widgetId = window.turnstile.render(containerRef.current, {
          action,
          appearance: "interaction-only",
          callback: onTokenChange,
          "error-callback": () => onTokenChange(""),
          "expired-callback": () => onTokenChange(""),
          sitekey: siteKey,
          size: "flexible",
          theme: "dark",
        });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [action, onTokenChange, resetKey, siteKey]);

  if (!siteKey) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div ref={containerRef} />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {loadFailed
          ? "Spam verification could not load. Refresh before submitting."
          : "Protected by Cloudflare Turnstile."}
      </p>
    </div>
  );
}

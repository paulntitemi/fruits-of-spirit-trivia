"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  /** Bitmap resolution to render at; display size is controlled by the parent. */
  resolution?: number;
  className?: string;
}

export function QrCode({ value, resolution = 720, className = "" }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, {
      width: resolution,
      margin: 1,
      color: { dark: "#1c1917", light: "#ffffff" },
    })
      .then((url) => alive && setSrc(url))
      .catch(() => alive && setSrc(""));
    return () => {
      alive = false;
    };
  }, [value, resolution]);

  if (!src) {
    return (
      <div
        className={`aspect-square w-full animate-pulse rounded-lg bg-card ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt="QR code — scan to join the game"
      className={`ink block h-auto w-full rounded-lg bg-white ${className}`}
    />
  );
}

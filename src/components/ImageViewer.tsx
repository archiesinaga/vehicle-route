"use client";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageViewer({ src, alt, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in max-w-full h-auto border rounded ${className}`}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setOpen(false)}
        >
          <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] rounded shadow-lg" />
        </div>
      )}
    </>
  );
}

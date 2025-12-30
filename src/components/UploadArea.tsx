"use client";
import { useRef } from "react";
import { CloudUpload } from "lucide-react";

export function UploadArea({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section aria-label="Upload Section" onClick={() => fileInputRef.current?.click()}>
      {/* TOKEN: bg-surface-base (contraste leve com o card branco) */}
      <div className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border-subtle bg-surface-base px-6 py-8 transition-all hover:border-brand/50 hover:bg-brand/5 cursor-pointer active:scale-[0.98]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:scale-110 transition-transform">
          <CloudUpload className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-txt-primary text-base font-semibold">Toque para selecionar áudio</p>
          <p className="text-txt-secondary text-xs">Suporta MP3, WAV, OGG, M4A</p>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} accept="audio/*" />
      </div>
    </section>
  );
}
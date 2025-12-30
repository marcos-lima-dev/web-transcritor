"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Download, Share2, Check } from "lucide-react";

interface TranscriptionViewerProps {
  text: string;
  aiText: string | null;
  onImprove: () => void;
  isImproving: boolean;
}

export function TranscriptionViewer({ text, aiText, onImprove, isImproving }: TranscriptionViewerProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const contentToShow = aiText || text;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contentToShow);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transcrição - Audio Scribe',
          text: contentToShow,
        });
      } catch (err) {
        console.log("Usuário fechou o menu");
      }
    } else {
      handleCopy(); 
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([contentToShow], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    const now = new Date();
    const filename = `transcricao_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.txt`;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-txt-primary tracking-tight">Transcrição</h3>
        <div className="flex gap-2">
          {aiText && (
            // AQUI MUDOU: De Amarelo para Roxo (Violet) com alto contraste
            <span className="text-xs bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 border border-violet-100 dark:border-violet-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> IA Revisada
            </span>
          )}
        </div>
      </div>

      <div className="relative flex flex-col rounded-xl bg-surface-card shadow-sm border border-border-subtle min-h-[320px]">
        
        {/* Barra Superior */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-surface-card/95 backdrop-blur px-4 py-3 rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-txt-secondary uppercase tracking-wider">Português (BR)</span>
          </div>
          
          {!aiText && (
            <button 
              onClick={onImprove}
              disabled={isImproving}
              className="flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand hover:bg-brand/20 transition-colors disabled:opacity-50"
            >
              {isImproving ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Sparkles className="w-3.5 h-3.5" />}
              {isImproving ? "Revisando..." : "✨ Corrigir & Formatar"}
            </button>
          )}
        </div>

        {/* Texto */}
        <div className="p-5 text-base leading-relaxed text-txt-primary font-normal">
          {aiText ? (
            <div className="whitespace-pre-wrap animate-in fade-in">{aiText}</div>
          ) : (
            <p className="whitespace-pre-wrap">{text}</p>
          )}
        </div>

        {/* Rodapé com Botões */}
        <div className="mt-auto border-t border-border-subtle p-2 flex justify-around bg-surface-base/50 rounded-b-xl">
          
          <button onClick={handleCopy} className="flex flex-1 flex-col items-center gap-1 rounded-lg p-2 text-txt-secondary hover:bg-surface-highlight hover:text-brand transition-colors group active:scale-95">
            {copied ? <Check className="w-5 h-5 text-green-500"/> : <Copy className="w-5 h-5 group-hover:text-brand" />}
            <span className={`text-[10px] font-medium ${copied ? "text-green-600" : ""}`}>
              {copied ? "Copiado!" : "Copiar"}
            </span>
          </button>

          <button onClick={handleDownload} className="flex flex-1 flex-col items-center gap-1 rounded-lg p-2 text-txt-secondary hover:bg-surface-highlight hover:text-brand transition-colors group active:scale-95">
            <Download className="w-5 h-5 group-hover:text-brand" />
            <span className="text-[10px] font-medium">Baixar</span>
          </button>

          <button onClick={handleShare} className="flex flex-1 flex-col items-center gap-1 rounded-lg p-2 text-txt-secondary hover:bg-surface-highlight hover:text-brand transition-colors group active:scale-95">
            {shared ? <Check className="w-5 h-5 text-green-500"/> : <Share2 className="w-5 h-5 group-hover:text-brand" />}
            <span className={`text-[10px] font-medium ${shared ? "text-green-600" : ""}`}>
              {shared ? "Link Copiado!" : "Enviar"}
            </span>
          </button>

        </div>
      </div>
    </section>
  );
}
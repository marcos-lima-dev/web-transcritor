"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Header } from "@/components/Header";
import { UploadArea } from "@/components/UploadArea";
import { StatusCard } from "@/components/StatusCard";
import { TranscriptionViewer } from "@/components/TranscriptionViewer";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [result, setResult] = useState<any>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // ... (Lógica de upload e API mantém igual) ...
  const handleUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus('processing');
    setResult(null);
    setAiResult(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("http://127.0.0.1:8000/transcrever", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Erro na API");
      const data = await response.json();
      setResult(data);
      setStatus('completed');
    } catch (error) {
      alert("Erro na conexão");
      setStatus('idle');
      setFile(null);
    }
  };

  const handleImprove = async () => {
    if (!result?.texto_completo) return;
    setLoadingAI(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/melhorar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: result.texto_completo }),
      });
      const data = await response.json();
      setAiResult(data.texto_melhorado);
    } catch (error) { alert("Erro na IA"); } 
    finally { setLoadingAI(false); }
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setAiResult(null);
  };

  return (
    // USA O TOKEN: bg-surface-base (Fundo da página definido no globals.css)
    <main className="bg-surface-base text-txt-primary antialiased min-h-screen flex justify-center p-4 sm:p-0 transition-colors duration-300">
      
      {/* USA OS TOKENS: bg-surface-card (Fundo branco/escuro) e border-border-subtle */}
      <div className="relative flex min-h-screen sm:min-h-0 sm:h-[90vh] sm:my-auto w-full flex-col max-w-md bg-surface-card shadow-sm sm:shadow-xl sm:rounded-2xl overflow-hidden border border-border-subtle transition-colors duration-300">
        
        <Header />

        <div className="flex-1 overflow-y-auto flex flex-col px-5 pt-6 pb-24 gap-6 scrollbar-hide">
          {status === 'idle' && <UploadArea onFileSelect={handleUpload} />}
          {file && <StatusCard file={file} status={status} time={result?.tempo_processamento} />}
          {result && (
            <TranscriptionViewer 
              text={result.texto_completo}
              aiText={aiResult}
              onImprove={handleImprove}
              isImproving={loadingAI}
            />
          )}
        </div>

        {status === 'completed' && (
          // USA O TOKEN: bg-surface-card/90 (Transparência automática)
          <div className="fixed sm:absolute bottom-0 z-20 mx-auto w-full max-w-md bg-surface-card/90 backdrop-blur-lg px-5 py-4 border-t border-border-subtle left-0 right-0">
            {/* USA O TOKEN: bg-brand e bg-brand-dark */}
            <button 
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold h-12 shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Nova Transcrição
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
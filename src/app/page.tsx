"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

// Removemos o Header daqui (já está no layout.tsx)
import { UploadArea } from "@/components/UploadArea";
import { StatusCard } from "@/components/StatusCard";
import { TranscriptionViewer } from "@/components/TranscriptionViewer";

// Define a URL da API (Pega do Netlify em produção OU usa localhost no seu PC)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [result, setResult] = useState<any>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus('processing');
    setResult(null);
    setAiResult(null);
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      // CORREÇÃO: Usando a variável API_URL em vez do link fixo
      const response = await fetch(`${API_URL}/transcrever`, { 
        method: "POST", 
        body: formData 
      });
      
      if (!response.ok) throw new Error("Erro na API");
      
      const data = await response.json();
      setResult(data);
      setStatus('completed');
    } catch (error) {
      console.error(error);
      alert("Erro na conexão com o servidor.");
      setStatus('idle');
      setFile(null);
    }
  };

  const handleImprove = async () => {
    if (!result?.texto_completo) return;
    setLoadingAI(true);
    try {
      // CORREÇÃO: Usando a variável API_URL
      const response = await fetch(`${API_URL}/melhorar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: result.texto_completo }),
      });
      const data = await response.json();
      setAiResult(data.texto_melhorado);
    } catch (error) { 
      alert("Erro ao conectar com a IA"); 
    } 
    finally { 
      setLoadingAI(false); 
    }
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setAiResult(null);
  };

  return (
    // Removemos <main>, backgrounds e bordas extras. 
    // O layout.tsx já cuida de centralizar tudo.
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Área de Upload (Só aparece se não tiver arquivo) */}
      {status === 'idle' && (
        <UploadArea onFileSelect={handleUpload} />
      )}

      {/* Card de Status (Processando ou Concluído) */}
      {file && (
        <StatusCard file={file} status={status} time={result?.tempo_processamento} />
      )}

      {/* Visualizador do Texto (Só aparece quando termina) */}
      {result && (
        <TranscriptionViewer 
          text={result.texto_completo}
          aiText={aiResult}
          onImprove={handleImprove}
          isImproving={loadingAI}
        />
      )}

      {/* Botão Flutuante "Nova Transcrição" */}
      {status === 'completed' && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <button 
            onClick={reset}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 shadow-xl shadow-brand/25 transition-all transform hover:scale-105 active:scale-95 ring-2 ring-white dark:ring-surface-card"
          >
            <Plus className="w-5 h-5" />
            Nova Transcrição
          </button>
        </div>
      )}
    </div>
  );
}
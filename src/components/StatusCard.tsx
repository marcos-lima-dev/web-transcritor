import { Check, Loader2 } from "lucide-react";

export function StatusCard({ file, status, time }: { file: File, status: string, time?: string }) {
  if (status === 'idle') return null;
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3 rounded-xl bg-surface-card p-4 shadow-sm border border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} dark:bg-opacity-20`}>
               {status === 'completed' ? <Check className="w-5 h-5"/> : <Loader2 className="w-5 h-5 animate-spin"/>}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="truncate text-sm font-semibold text-txt-primary max-w-[150px]">{file.name}</p>
              <p className="text-xs text-txt-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} dark:bg-opacity-20`}>
            {status === 'completed' ? 'Concluído' : 'Processando'}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between text-xs font-medium text-txt-secondary">
            <span>{status === 'completed' ? 'Pronto' : 'Enviando...'}</span>
            <span>{status === 'completed' ? '100%' : '...'}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-highlight overflow-hidden">
            <div className={`h-full rounded-full ${status === 'completed' ? 'bg-green-500 w-full' : 'bg-brand w-2/3 animate-pulse'}`}></div>
          </div>
        </div>
        {time && <p className="text-xs text-right text-txt-secondary mt-1">Tempo: {time}</p>}
      </div>
    </section>
  );
}
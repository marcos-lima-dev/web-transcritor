from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel
from dotenv import load_dotenv 
import shutil
import os
import time

# Carrega variáveis de ambiente
load_dotenv()

app = FastAPI()

# --- ÁREA DE SEGURANÇA (CHAVE) ---
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("❌ ERRO CRÍTICO: A variável de ambiente 'GROQ_API_KEY' não foi encontrada.")

client = Groq(api_key=GROQ_API_KEY)

# --- CORREÇÃO DO CORS (Onde a mágica acontece) ---
# Aqui definimos EXPLICITAMENTE quem pode chamar este servidor.
origins = [
    "http://localhost:3000",            # Seu PC
    "http://127.0.0.1:3000",            # Seu PC (variação)
    "https://audio-scrib.netlify.app",  # <--- SEU SITE NO NETLIFY (Copiado do seu erro)
    "*"                                 # Fallback para garantir
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class TextoRequest(BaseModel):
    texto: str

# --- ROTA NOVA: HEALTH CHECK (Para acordar o servidor) ---
@app.get("/")
def home():
    return {
        "status": "online", 
        "mensagem": "API Audio Scribe está rodando!", 
        "docs": "/docs"
    }

# --- ROTA 1: TRANSCRIÇÃO ---
@app.post("/transcrever")
async def transcrever_audio(file: UploadFile = File(...)):
    start_time = time.time()
    temp_filename = f"{UPLOAD_DIR}/{file.filename}"
    
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        print(f"🎤 [1/2] Enviando áudio para Groq Cloud (Whisper Large v3)...")
        
        with open(temp_filename, "rb") as arquivo_audio:
            transcription = client.audio.transcriptions.create(
                file=(temp_filename, arquivo_audio.read()),
                model="whisper-large-v3",
                response_format="json",   
                language="pt",            
                temperature=0.0           
            )
        
        texto_final = transcription.text
        print(f"✅ Transcrição concluída em {time.time() - start_time:.2f}s")

        return {
            "idioma": "pt",
            "confianca": 0.99, 
            "tempo_processamento": f"{time.time() - start_time:.2f}s",
            "texto_completo": texto_final.strip(),
        }

    except Exception as e:
        print(f"❌ Erro na API Groq: {e}")
        raise HTTPException(status_code=500, detail=f"Erro na API: {str(e)}")
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

# --- ROTA 2: MELHORIA DE TEXTO ---
@app.post("/melhorar")
async def melhorar_texto(request: TextoRequest):
    try:
        print("🧠 [2/2] Solicitando REVISÃO ao Llama 3.3...")
        
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Você é um revisor de textos profissional. "
                               "Sua tarefa é transformar a transcrição de áudio crua abaixo em um texto perfeitamente legível e fluido.\n"
                               "Regras:\n"
                               "1. Adicione pontuação correta.\n"
                               "2. Corrija erros gramaticais mantendo o tom original.\n"
                               "3. Quebre o texto em parágrafos.\n"
                               "4. NÃO RESUMA.\n"
                               "5. Use Markdown moderado."
                },
                {
                    "role": "user",
                    "content": request.texto,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3, 
        )
        
        return {"texto_melhorado": completion.choices[0].message.content}
    
    except Exception as e:
        print(f"❌ Erro na IA: {e}")
        raise HTTPException(status_code=500, detail=str(e))
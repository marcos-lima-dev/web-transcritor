from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel
from dotenv import load_dotenv 
import shutil
import os
import time

load_dotenv()

app = FastAPI()

# Segurança: Pega a chave do ambiente (Render) ou do .env (Local)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("❌ AVISO: A variável GROQ_API_KEY não foi detectada.")

client = Groq(api_key=GROQ_API_KEY)

# Permite conexões de qualquer lugar (necessário para o Netlify acessar)
origins = ["*"]

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

@app.post("/transcrever")
async def transcrever_audio(file: UploadFile = File(...)):
    start_time = time.time()
    temp_filename = f"{UPLOAD_DIR}/{file.filename}"
    
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        print(f"🎤 Processando áudio...")
        with open(temp_filename, "rb") as arquivo_audio:
            transcription = client.audio.transcriptions.create(
                file=(temp_filename, arquivo_audio.read()),
                model="whisper-large-v3",
                response_format="json",   
                language="pt",            
                temperature=0.0           
            )
        
        texto_final = transcription.text
        return {
            "idioma": "pt",
            "tempo_processamento": f"{time.time() - start_time:.2f}s",
            "texto_completo": texto_final.strip(),
        }

    except Exception as e:
        print(f"❌ Erro: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.post("/melhorar")
async def melhorar_texto(request: TextoRequest):
    try:
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Você é um revisor profissional. Corrija pontuação e parágrafos, mantendo o texto completo. Use Markdown."
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
        raise HTTPException(status_code=500, detail=str(e))
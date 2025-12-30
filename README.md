# 🎙️ Audio Scribe

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

> **Transcrição de áudio ultrarrápida e inteligente.**
> Transforme áudio em texto estruturado em segundos usando o poder das LPUs da Groq (Whisper v3) e refinamento via Llama 3.

![Screenshot do Projeto](./public/screenshot.png)
*(Dica: Salve um print da tela como `screenshot.png` na pasta `public`)*

## ✨ Funcionalidades

- 🚀 **Transcrição Instantânea:** Processamento via Groq Cloud (Whisper Large v3) muito mais rápido que execução local.
- 🧠 **Refinamento com IA:** Transforma o texto bruto em parágrafos legíveis com pontuação correta (Llama 3.3).
- 🎨 **Design System Moderno:** Interface "Clean" inspirada na Apple, construída com Tailwind CSS v4.
- 🌗 **Dark/Light Mode:** Detecção automática de tema do sistema e alternância manual suave.
- 📱 **Totalmente Responsivo:** Layout Mobile-First que funciona perfeitamente em celulares e desktops.
- 📤 **Compartilhamento Nativo:** Integração com Web Share API para enviar direto para WhatsApp/Email no mobile.

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS Variables & Tokens)
- [Lucide React](https://lucide.dev/) (Ícones)

**Backend:**
- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Groq SDK](https://groq.com/) (AI Inference)

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura limpa e modular:

```bash
.
├── src/
│   ├── app/
│   │   ├── globals.css      # Design System (Tokens de Cores)
│   │   └── page.tsx         # Página Principal (Lógica)
│   └── components/          # Componentes Reutilizáveis
│       ├── Header.tsx
│       ├── UploadArea.tsx
│       ├── StatusCard.tsx
│       └── TranscriptionViewer.tsx
├── api.py                   # Servidor Backend (FastAPI)
└── ...
🚀 Como Rodar Localmente
Pré-requisitos
Node.js 18+

Python 3.8+

Uma API Key da Groq Cloud (Gratuita)

1. Configurar o Backend (Python)
Bash

# Instale as dependências
pip install fastapi uvicorn groq python-multipart

# Configure sua chave API
# Abra o arquivo api.py e insira sua chave na variável GROQ_API_KEY
# (Ou configure via variável de ambiente para mais segurança)

# Inicie o servidor
uvicorn api:app --reload
O backend rodará em http://127.0.0.1:8000

2. Configurar o Frontend (Next.js)
Em um novo terminal, na pasta do projeto:

Bash

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
Acesse a aplicação em http://localhost:3000

🎨 Design System & Customização
Este projeto utiliza o Tailwind CSS v4 com variáveis CSS nativas para definição de temas.

Para alterar as cores do projeto (ex: mudar o azul da marca), edite apenas o arquivo src/app/globals.css:

CSS

@theme {
  --color-brand: #seu-novo-hex; 
}
O modo escuro e claro é gerenciado automaticamente via classes semânticas (bg-surface-base, text-txt-primary), facilitando a manutenção e escalabilidade.

🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

Fork o projeto

Crie sua Feature Branch (git checkout -b feature/MinhaFeature)

Commit suas mudanças (git commit -m 'Adiciona MinhaFeature')

Push para a Branch (git push origin feature/MinhaFeature)

Abra um Pull Request

📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Feito com 💙 e muita IA.
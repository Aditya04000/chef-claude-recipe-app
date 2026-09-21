# 🍳 Chef Claude

AI-powered recipe generator — add the ingredients you have on hand and get a full recipe back.

## Stack
- React 19 + Vite 7
- Hugging Face Inference API (Llama 3.1 8B)
- react-markdown

## Local setup

```bash
npm install
echo "VITE_HF_API_KEY=your_token_here" > .env
npm run dev
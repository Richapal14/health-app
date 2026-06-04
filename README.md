# Health Predictor

Patient blood test management with local AI-generated health remarks via Ollama.

## Setup

### 1. Install Ollama + pull the model

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Pull the model (one-time, ~4GB)
ollama pull mistral

# Start the inference server
ollama serve
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at http://localhost:8000
Docs at http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173

## Swapping the model

Edit `backend/ai.py`:

```python
MODEL = "llama3"   # or "phi3", "gemma2", "qwen2.5" — whatever you've pulled
```

Any model you have locally in Ollama works. Mistral gives the best clinical text.

## Project structure

```
backend/
  main.py      # FastAPI app entry + lifespan
  database.py  # SQLAlchemy 2.0 engine + session
  models.py    # Patient ORM model
  schemas.py   # Pydantic validation
  crud.py      # DB operations
  ai.py        # Ollama integration
  routes.py    # REST endpoints

frontend/src/
  api.js                        # axios client
  App.jsx                       # root component
  hooks/use-patients.js         # data + state management
  components/patient-form.jsx   # add/edit form
  components/patient-table.jsx  # records table
  styles/tokens.css             # design tokens
```

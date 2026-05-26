from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import sys
import os
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from memory.memory_system import memory
from agents.omega_agents import agents
from agents.computer_control import computer_agent

# Use Fast Model
try:
    from langchain_community.llms import Ollama
    ollama_available = True
    print("🚀 Using FAST AI Model (llama3.2:1b)")
except:
    ollama_available = False

app = FastAPI(title="JARVIS OMEGA - GOD MODE", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Command(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"status": "🟢 ONLINE", "speed_mode": "ENABLED"}

@app.post("/command")
async def handle_command(command: Command):
    user_input = command.text.strip()
    
    # Safety Check
    dangerous = ["delete", "format", "shutdown", "rm -rf"]
    if any(word in user_input.lower() for word in dangerous):
        return {"response": "⚠️ Command blocked for safety.", "success": False}

    # Computer Control
    if any(word in user_input.lower() for word in ["open", "close", "explorer", "say hello"]):
        response = computer_agent.execute(user_input)
    else:
        if ollama_available:
            # FAST SETTINGS
            llm = Ollama(
                model="llama3.2:1b",   # Fast model
                temperature=0.7,
                num_ctx=2048,
                num_thread=4           # Use more CPU threads
            )
            prompt = f"""You are JARVIS OMEGA. Respond in short, clear, and cinematic style.
User: {user_input}
Omega:"""
            response = llm.invoke(prompt)
        else:
            response = agents.get_response(user_input)

    memory.remember(user_input, response)
    
    return {
        "response": response,
        "success": True
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
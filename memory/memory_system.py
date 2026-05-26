import chromadb
from datetime import datetime

class OmegaMemory:
    def __init__(self):
        # Short-term memory (remembers last 20 messages)
        self.short_term = []
        
        # Long-term memory using ChromaDB (free vector database)
        self.client = chromadb.PersistentClient(path="./memory_db")
        self.collection = self.client.get_or_create_collection(name="omega_memory")
        
        # User Profile
        self.user_profile = {
            "name": "User",
            "preferences": {},
            "learned_facts": []
        }
        
        print("🧠 JARVIS OMEGA Memory System Initialized")

    def remember(self, user_message: str, ai_response: str):
        """Save conversation"""
        entry = {
            "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "user": user_message,
            "ai": ai_response
        }
        
        # Short-term memory
        self.short_term.append(entry)
        if len(self.short_term) > 20:
            self.short_term.pop(0)
        
        # Long-term memory
        self.collection.add(
            documents=[f"User: {user_message}\nOmega: {ai_response}"],
            metadatas=[{"timestamp": entry["time"]}],
            ids=[f"mem_{datetime.now().timestamp()}"]
        )
        
        print(f"💾 Saved to memory: {user_message[:50]}...")

    def recall(self, query: str = None):
        """Get relevant memories"""
        if not query:
            return self.short_term[-5:]  # last 5 messages
        
        # Search long-term memory
        results = self.collection.query(
            query_texts=[query],
            n_results=3
        )
        return results

    def update_profile(self, key: str, value):
        """Remember user info"""
        self.user_profile["preferences"][key] = value
        print(f"👤 Updated profile: {key} = {value}")

    def get_profile(self):
        return self.user_profile


# Create one memory instance
memory = OmegaMemory()
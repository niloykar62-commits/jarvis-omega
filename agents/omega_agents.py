class OmegaAgents:
    def __init__(self):
        print("🤖 JARVIS OMEGA Multi-Agent System Loaded (Fast Mode)")

    def get_response(self, user_input: str):
        if not user_input:
            return "Please say something..."

        user_input_lower = user_input.lower()

        if any(word in user_input_lower for word in ["hello", "hi", "hey"]):
            return "Hello Sir! JARVIS OMEGA at your service. How can I help you today?"

        elif any(word in user_input_lower for word in ["research", "search", "what is", "tell me"]):
            return f"🔍 Researching: {user_input}. I'll prepare a detailed summary for you."

        elif any(word in user_input_lower for word in ["plan", "schedule", "todo", "today"]):
            return f"📅 Planning: I've analyzed your request for '{user_input}'. Ready to create schedule."

        elif any(word in user_input_lower for word in ["code", "write", "program"]):
            return f"💻 Coding Agent: Tell me what you want to build. Example: 'write hello world code'"

        else:
            return f"Omega: Understood '{user_input}'. What would you like me to do with this?"


agents = OmegaAgents()
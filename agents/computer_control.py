import pyautogui
import time
import os

class ComputerControlAgent:
    def __init__(self):
        pyautogui.FAILSAFE = True  # Safety: Move mouse to top-left corner to stop
        print("🖥️ Computer Control Agent Activated (Safe Mode)")

    def execute(self, command: str):
        cmd = command.lower().strip()
        
        try:
            if "open notepad" in cmd:
                pyautogui.press('win')
                time.sleep(0.5)
                pyautogui.write('notepad')
                pyautogui.press('enter')
                return "✅ Opened Notepad"

            elif "open chrome" in cmd or "open browser" in cmd:
                pyautogui.press('win')
                time.sleep(0.5)
                pyautogui.write('chrome')
                pyautogui.press('enter')
                return "✅ Opened Google Chrome"

            elif "open explorer" in cmd or "open files" in cmd:
                os.startfile('C:\\')
                return "✅ Opened File Explorer"

            elif "say hello" in cmd or "greet me" in cmd:
                pyautogui.alert("Hello from JARVIS OMEGA!\nI am now controlling the computer.", "Omega")
                return "✅ Greeted you on screen"

            elif "close" in cmd:
                pyautogui.hotkey('alt', 'f4')
                return "✅ Closed current window"

            else:
                return "⚠️ Command not recognized. Try: 'open notepad', 'open chrome', 'say hello'"

        except Exception as e:
            return f"❌ Error executing command: {str(e)}"


# Create instance
computer_agent = ComputerControlAgent()
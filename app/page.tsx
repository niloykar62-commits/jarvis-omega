'use client';
import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// Global Type Declaration for Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function OmegaCore({ isThinking }: { isThinking: boolean }) {
  return (
    <mesh>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#67e8f9"
        emissiveIntensity={isThinking ? 1.2 : 0.6}
        wireframe={true}
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
}

export default function JarvisOmega() {
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const [voiceSpeed, setVoiceSpeed] = useState(1.05);
  const [voicePitch, setVoicePitch] = useState(1.0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto Save History
  useEffect(() => {
    const saved = localStorage.getItem('omegaHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('omegaHistory', JSON.stringify(history));
  }, [history]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      utterance.volume = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendCommand = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage = { type: 'user', text };
    setHistory(prev => [...prev, userMessage]);
    
    setIsThinking(true);
    setMessage("🧠 NEURAL CORE PROCESSING...");

    try {
      const res = await fetch("http://localhost:8000/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      const omegaResponse = data.response;
      
      const omegaMessage = { type: 'omega', text: omegaResponse };
      setHistory(prev => [...prev, omegaMessage]);
      setMessage(omegaResponse);
      speak(omegaResponse);
    } catch (err) {
      setMessage("❌ Cannot connect to backend. Is it running?");
    }
    
    setIsThinking(false);
    setInput("");
  };

  const startListening = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      alert("Please use Google Chrome for voice recognition");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (transcript.includes("hey omega") || transcript.includes("hello omega")) {
        setMessage("🎤 Wake word detected! Listening...");
        setTimeout(() => {
          const cmdRec = new SpeechRecognitionAPI();
          cmdRec.lang = 'en-US';
          cmdRec.onresult = (e: any) => sendCommand(e.results[0][0].transcript);
          cmdRec.start();
        }, 600);
      }
    };

    recognition.start();
    setIsListening(true);
  };

  const toggleCamera = async () => {
    if (cameraOn) setCameraOn(false);
    else {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('omegaHistory');
    setMessage("✅ History cleared.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-cyan-400 font-mono overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_0.6px,transparent_1px)] [background-size:60px_60px] opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black"></div>

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 h-16 border-b border-cyan-500/40 flex items-center px-8 justify-between bg-black/80 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-4">
          <div className="text-3xl animate-pulse">⚡</div>
          <div>
            <div className="text-2xl tracking-[6px] font-bold text-white">JARVIS OMEGA</div>
            <div className="text-xs text-cyan-400 -mt-1">GOD MODE • NEON v1.0</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-cyan-500">Created by</div>
            <div className="text-cyan-300 font-semibold">NILOY KAR</div>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="px-6 py-2 border border-cyan-400/50 hover:bg-cyan-500/10 rounded-xl text-sm">
            ⚙️ SETTINGS
          </button>
        </div>
      </div>

      {/* 3D Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] z-30">
        <Canvas camera={{ position: [0, 0, 9] }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} color="#67e8f9" intensity={2} />
          <OmegaCore isThinking={isThinking} />
          <Stars radius={500} depth={60} count={1200} factor={6} saturation={0} fade />
          <OrbitControls enablePan={false} enableZoom={true} autoRotate={true} autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* Quick Commands & Settings */}
      {showSettings && (
        <div className="absolute top-24 right-10 w-96 glass-panel border border-cyan-400/40 rounded-3xl p-8 z-50">
          <h2 className="text-2xl mb-8 text-white">SYSTEM SETTINGS</h2>
          <div className="space-y-8">
            <div>
              <label className="block text-sm mb-3">Voice Speed — {voiceSpeed.toFixed(1)}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={voiceSpeed} onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))} className="w-full accent-cyan-400" />
            </div>
            <div>
              <label className="block text-sm mb-3">Voice Pitch — {voicePitch.toFixed(1)}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={voicePitch} onChange={(e) => setVoicePitch(parseFloat(e.target.value))} className="w-full accent-cyan-400" />
            </div>
            <button onClick={clearHistory} className="w-full py-4 border border-red-500/50 text-red-400 rounded-2xl hover:bg-red-500/10">Clear History</button>
            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-cyan-500 text-black rounded-2xl font-bold">Close</button>
          </div>
        </div>
      )}

      {/* Conversation Log */}
      <div className="absolute top-28 left-10 w-96 h-[440px] glass-panel border border-cyan-400/30 rounded-3xl p-6 overflow-y-auto z-40">
        <div className="text-xs text-cyan-400 mb-4">CONVERSATION LOG</div>
        {history.length === 0 ? (
          <p className="text-cyan-500/70 text-center mt-12">Say "Hey Omega" to begin...</p>
        ) : (
          history.map((msg, i) => (
            <div key={i} className={`mb-5 ${msg.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-[85%] px-5 py-3.5 rounded-2xl ${msg.type === 'user' ? 'bg-cyan-600 text-white' : 'glass-message'}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
        <div className="flex gap-4">
          <button onClick={startListening} className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl transition-all ${isListening ? 'bg-red-500 scale-110' : 'glass-button hover:scale-105'}`}>
            🎤
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendCommand(input)}
            placeholder='Type or say "Hey Omega"...'
            className="flex-1 glass-input border border-cyan-400/40 rounded-3xl px-8 py-6 text-lg focus:outline-none focus:border-cyan-400"
          />

          <button onClick={() => sendCommand(input)} disabled={isThinking} className="px-14 glass-button bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-3xl disabled:opacity-50">
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
}
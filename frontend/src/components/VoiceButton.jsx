import { useState, useEffect, useRef } from "react";

export default function VoiceButton({ onResult }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [onResult]);

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      title={listening ? "Stop listening" : "Speak your task"}
      style={{
        width: "38px", height: "38px", borderRadius: "6px", flexShrink: 0,
        border: listening ? "0.5px solid #1D9E75" : "0.5px solid #2a2a2a",
        background: listening ? "#0a2e22" : "transparent",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", transition: "all 0.15s", position: "relative"
      }}
    >
      {/* Mic icon SVG */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={listening ? "#1D9E75" : "#555"} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <rect x="9" y="2" width="6" height="11" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="9" y1="22" x2="15" y2="22" />
      </svg>

      {/* Pulse ring when listening */}
      {listening && (
        <span style={{
          position: "absolute", inset: "-4px", borderRadius: "8px",
          border: "1.5px solid #1D9E75", opacity: 0.4,
          animation: "voicePulse 1.2s ease-in-out infinite"
        }} />
      )}
    </button>
  );
}
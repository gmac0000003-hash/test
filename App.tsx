
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const App: React.FC = () => {
  const [text, setText] = useState<string>("Breathe.");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewThought = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Give me a single, short, inspiring or grounding word or phrase (max 4 words). Do not use quotes or punctuation.",
        config: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
        }
      });

      const generatedText = response.text || "Peace.";
      setText(generatedText.trim());
    } catch (err) {
      console.error("Failed to fetch thought:", err);
      setError("An echo in the void.");
      // Fallback
      setText("Stillness.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Initial load
  useEffect(() => {
    // Optionally fetch on mount, or just use default
    // fetchNewThought();
  }, []);

  return (
    <main 
      className="flex h-screen w-screen items-center justify-center cursor-pointer select-none transition-colors duration-700 bg-white"
      onClick={fetchNewThought}
    >
      <div className="text-center px-8">
        <h1 
          className={`
            text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-stone-800
            transition-all duration-1000 ease-in-out
            ${isLoading ? 'opacity-20 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}
          `}
        >
          {error ? error : text}
        </h1>
        <p className={`mt-8 text-stone-300 text-xs font-medium uppercase tracking-[0.2em] transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          Click to reflect
        </p>
      </div>
    </main>
  );
};

export default App;

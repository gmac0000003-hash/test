
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [text, setText] = useState<string>("Breathe.");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Safely initialize GenAI within the component scope
  const ai = useMemo(() => {
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    return new GoogleGenAI({ apiKey: apiKey || '' });
  }, []);

  const fetchNewThought = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Give me a single, short, inspiring or grounding word or phrase (max 3 words). No punctuation.",
        config: {
          temperature: 1.0,
          topP: 0.95,
          topK: 64,
        }
      });

      const generatedText = response.text || "Peace.";
      setText(generatedText.trim());
    } catch (err) {
      console.error("Gemini Error:", err);
      // Fail gracefully with a calming fallback
      setText("Stillness.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, ai]);

  return (
    <main 
      className="flex h-screen w-screen items-center justify-center cursor-pointer select-none transition-colors duration-1000 bg-white"
      onClick={fetchNewThought}
    >
      <div className="text-center px-6">
        <h1 
          className={`
            text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-stone-800
            transition-all duration-1000 ease-in-out
            ${isLoading ? 'opacity-20 blur-md scale-90' : 'opacity-100 blur-0 scale-100'}
          `}
        >
          {text}
        </h1>
        <p 
          className={`
            mt-12 text-stone-300 text-[10px] font-medium uppercase tracking-[0.3em] 
            transition-opacity duration-1000 
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
        >
          Tap to reflect
        </p>
      </div>
    </main>
  );
};

export default App;

import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [text, setText] = useState<string>("Breathe.");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Safely initialize GenAI - using memo to prevent re-initialization
  const ai = useMemo(() => {
    // process.env.API_KEY is automatically injected by the environment
    const key = typeof process !== 'undefined' ? process.env.API_KEY : '';
    return new GoogleGenAI({ apiKey: key || '' });
  }, []);

  const fetchNewThought = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Give me a single, short, inspiring or grounding word or phrase (max 3 words). Do not use punctuation or quotes.",
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
      // Fallback to a list of grounding words if API fails
      const fallbacks = ["Stillness.", "Present.", "Aware.", "Calm.", "Flow."];
      setText(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, ai]);

  return (
    <main 
      className="flex h-screen w-screen items-center justify-center cursor-pointer select-none transition-colors duration-1000 bg-white"
      onClick={fetchNewThought}
      aria-label="Click to generate a new grounding word"
    >
      <div className="text-center px-6">
        <h1 
          className={`
            text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-stone-800
            transition-all duration-1000 ease-in-out
            ${isLoading ? 'opacity-20 blur-xl scale-95' : 'opacity-100 blur-0 scale-100'}
          `}
        >
          {text}
        </h1>
        <p 
          className={`
            mt-12 text-stone-300 text-[10px] font-medium uppercase tracking-[0.4em] 
            transition-all duration-700 
            ${isLoading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
          `}
        >
          Tap to reflect
        </p>
      </div>
    </main>
  );
};

export default App;
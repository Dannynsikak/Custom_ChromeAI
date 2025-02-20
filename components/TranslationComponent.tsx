"use client";
import React, { useState } from "react";

declare global {
  interface Window {
    translation: {
      canTranslate: (options: {
        sourceLanguage: string;
        targetLanguage: string;
      }) => Promise<string>;
      createTranslator: (options: {
        sourceLanguage: string;
        targetLanguage: string;
      }) => Promise<{ translate: (text: string) => Promise<string> }>;
    };
  }
}

function TranslationComponent() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");

  const handleTranslate = async () => {
    setLoading(true);
    setError("");
    setTranslatedText("");

    const translationOptions = {
      sourceLanguage: "en",
      targetLanguage: targetLanguage,
    };

    try {
      const availability =
        await window.translation.canTranslate(translationOptions);

      if (availability === "no") {
        setError("Translation not available for these languages.");
        setLoading(false);
        return;
      }

      const translator =
        await window.translation.createTranslator(translationOptions);
      const result = await translator.translate(inputText);
      setTranslatedText(result);
    } catch (err) {
      console.error("Translation Error:", err);
      setError("An error occurred during translation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Text Translator</h2>
      <div className="m-3">
        {translatedText && (
          <div className="mt-5 p-3 border border-gray-300 rounded">
            <h3 className="text-xl font-semibold">Translated Text:</h3>
            <p>{translatedText}</p>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
        rows={4}
        cols={50}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <br />
      <label htmlFor="language-select" className="block mb-2">
        Select Target Language:
      </label>
      <select
        id="language-select"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      >
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="tr">Turkish</option>
        {/* Add more languages as needed */}
      </select>
      <br />
      <button
        type="button"
        onClick={handleTranslate}
        disabled={loading}
        className={`p-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"} text-white`}
      >
        {loading ? "Translating..." : "Translate"}
      </button>
    </div>
  );
}

export default TranslationComponent;

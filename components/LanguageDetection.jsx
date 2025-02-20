"use client";
import React, { useEffect, useState } from "react";

const LanguageDetection = () => {
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [outputText, setOutputText] = useState("");
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");

  useEffect(() => {
    const initialize = async () => {
      if (
        !("translation" in window) ||
        !("createDetector" in window.translation)
      ) {
        document.querySelector(".not-supported-message").hidden = false;
        return;
      }

      const detector = await window.translation.createDetector();

      const handleInput = async () => {
        if (!inputText.trim()) {
          setDetectedLanguage("not sure what language this is");
          return;
        }
        const { detectedLanguage, confidence } = (
          await detector.detect(inputText.trim())
        )[0];
        setDetectedLanguage(
          `${(confidence * 100).toFixed(1)}% sure that this is ${languageTagToHumanReadable(detectedLanguage, "en")}`
        );
        setConfidence(confidence);
      };

      handleInput();

      if ("createTranslator" in window.translation) {
        for (const el of document.querySelectorAll(
          "[hidden]:not(.not-supported-message)"
        )) {
          el.removeAttribute("hidden");
        }
      }
    };

    initialize();
  }, [inputText]);

  const languageTagToHumanReadable = (languageTag, targetLanguage) => {
    const displayNames = new Intl.DisplayNames([targetLanguage], {
      type: "language",
    });
    return displayNames.of(languageTag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const detector = await window.translation.createDetector();
      const sourceLanguage = (await detector.detect(inputText.trim()))[0]
        .detectedLanguage;
      if (!["en", "ja", "es"].includes(sourceLanguage)) {
        setOutputText(
          "Currently, only English ↔ Spanish and English ↔ Japanese are supported."
        );
        return;
      }
      const translator = await window.translation.createTranslator({
        sourceLanguage,
        targetLanguage,
      });
      setOutputText(await translator.translate(inputText.trim()));
    } catch (err) {
      setOutputText("An error occurred. Please try again.");
      console.error(err.name, err.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div
        className="not-supported-message text-center text-red-500 font-semibold"
        hidden
      >
        Your browser doesn't support the Language Detector APIs. If you're in
        Chrome, join the &nbsp;
        <span className="underline">
          <a
            target="_blank"
            href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview"
            className="text-blue-500 hover:text-blue-700"
          >
            Early Preview Program
          </a>
        </span>{" "}
        to enable it.
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 mt-4"
        style={{ visibility: "hidden" }}
      >
        <output className="text-gray-700 font-medium bg-white p-2 rounded shadow">
          {outputText}
        </output>
        <span className="text-gray-600 italic">{detectedLanguage}</span>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text to translate..."
        />

        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="ja">Japanese</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Translate
        </button>
      </form>
    </div>
  );
};

export default LanguageDetection;

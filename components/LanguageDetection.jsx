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
    <div>
      <div className="not-supported-message text-center" hidden>
        Your browser doesn't support the Language Detector APIs. If you're in
        Chrome, join the
        <span className="underline">
          <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">
            Early Preview Program
          </a>
        </span>{" "}
        to enable it.
      </div>
      <form onSubmit={handleSubmit} style={{ visibility: "hidden" }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <output>{outputText}</output>
        <span>{detectedLanguage}</span>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="ja">Japanese</option>
        </select>
        <button type="submit">Translate</button>
      </form>
    </div>
  );
};

export default LanguageDetection;

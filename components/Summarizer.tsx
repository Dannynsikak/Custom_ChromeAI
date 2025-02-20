"use client";
import React, { useState, useEffect } from "react";

function SummarizerComponent() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [summarizer, setSummarizer] = useState<Summarizer | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    loaded: 0,
    total: 0,
  });

  // Initialize the summarizer if available
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const initializeSummarizer = async () => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      if (typeof window !== "undefined" && (window as any).ai) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const ai = (window as any).ai; // Safely access the global object
        if (ai.summarizer) {
          const canSummarize = await ai.summarizer.capabilities();
          if (canSummarize && canSummarize.available !== "no") {
            // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
            let newSummarizer;
            if (canSummarize.available === "readily") {
              newSummarizer = await ai.summarizer.create();
            } else {
              newSummarizer = await ai.summarizer.create();
              newSummarizer.addEventListener("downloadprogress", (e: any) => {
                setDownloadProgress({ loaded: e.loaded, total: e.total });
                setIsDownloading(true);
              });
              await newSummarizer.ready;
              setIsDownloading(false);
            }
            setSummarizer(newSummarizer);
            setIsAvailable(true);
          } else {
            console.warn(
              "Summarizer is not available on this device or browser If you are in Chrome, join the Early Preview Program: https://developer.chrome.com/docs/ai/built-in#get_an_early_preview"
            );
          }
        }
      }
    };

    initializeSummarizer();

    return () => {
      if (summarizer) summarizer.destroy();
    };
  }, []);

  interface DownloadProgress {
    loaded: number;
    total: number;
  }

  interface Summarizer {
    destroy: () => void;
    summarize: (text: string) => Promise<string>;
    addEventListener: (
      event: string,
      callback: (e: ProgressEvent) => void
    ) => void;
    ready: Promise<void>;
  }

  interface Ai {
    summarizer: {
      capabilities: () => Promise<{ available: string }>;
      create: () => Promise<Summarizer>;
    };
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSummarize = async () => {
    if (summarizer && inputText.trim()) {
      setLoading(true);
      const result = await summarizer.summarize(inputText);
      setSummary(result);
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">AI Summarizer Component</h2>
      {isAvailable ? (
        <>
          {isDownloading ? (
            <p>
              Downloading model... {downloadProgress.loaded} /{" "}
              {downloadProgress.total} bytes
            </p>
          ) : (
            <>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text to summarize..."
                rows={6}
                cols={50}
                className="mb-2 p-2 border border-gray-300 rounded w-full"
              />
              <br />
              <button
                type="button"
                onClick={handleSummarize}
                disabled={loading || isDownloading}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  loading || isDownloading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? "Summarizing..." : "Summarize Text"}
              </button>
              {summary && (
                <div className="mt-5 p-2 border border-gray-300 rounded">
                  <h3 className="text-xl font-semibold">Summary:</h3>
                  <p>{summary}</p>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>Summarizer is not available on this device or browser.</p>
      )}
    </div>
  );
}

export default SummarizerComponent;

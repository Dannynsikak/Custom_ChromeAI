"use client";
import type React from "react";
import { useState } from "react";

// type definitions for writer and rewriter APIs
type WriterTone = "formal" | "neutral" | "casual";
type WriterFormat = "plain_text" | "markdown";
type WriterLength = "short" | "medium" | "long";

type RewriterTone = "as-is" | "more-formal" | "more-casual";
type RewriterFormat = "as-is" | "plain-text" | "markdown";
type RewriterLength = "as-is" | "shorter" | "longer";

interface AIWriterOptions {
  tone: WriterTone;
  format: WriterFormat;
  length: WriterLength;
  sharedContext?: string;
}

interface AIRewriterOptions {
  tone: RewriterTone;
  format: RewriterFormat;
  length: RewriterLength;
  context?: string;
}

const AIComponent: React.FC = () => {
  const [writingTask, setWritingTask] = useState("");
  const [rewritingTask, setRewritingTask] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // writer options state
  const [writerOptions, setWriterOptions] = useState<AIWriterOptions>({
    tone: "neutral",
    format: "markdown",
    length: "short",
  });
  // Rewriter options state
  const [rewriterOptions, setRewriterOptions] = useState<AIRewriterOptions>({
    tone: "as-is",
    format: "as-is",
    length: "as-is",
  });
  //function to handle writing
  const handleWrite = async () => {
    if (!window.ai?.writer) return;
    setIsProcessing(true);
    const writer = await window.ai.writer.create({
      tone: writerOptions.tone,
      format: writerOptions.format,
      length: writerOptions.length,
      sharedContext: writerOptions.sharedContext,
    });

    const result = await writer.write(writingTask, {
      context: "Generated via AI.",
    });
    setOutput(result);
    setIsProcessing(false);
  };
  // function to handle rewriting
  const handleRewrite = async () => {
    if (!window.ai?.rewriter) return;

    setIsProcessing(true);
    const rewriter = await window.Int8Array.rewriter.create({
      tone: rewriterOptions.tone,
      format: rewriterOptions.format,
      length: rewriterOptions.length,
    });
    const result = await rewriter.rewrite(rewritingTask, {
      context: "Rewrite for clarity and tone.",
    });
    setOutput(result);
    setIsProcessing(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        AI Writer and Rewriter
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Writer</h2>
        <textarea
          className="w-full p-2 mb-4 border rounded text-black"
          value={writingTask}
          onChange={(e) => setWritingTask(e.target.value)}
          placeholder="Enter your writing task"
        />
        <div className="mb-4">
          <label className="block mb-2">
            Tone:
            <select
              value={writerOptions.tone}
              onChange={(e) =>
                setWriterOptions({
                  ...writerOptions,
                  tone: e.target.value as WriterTone,
                })
              }
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="formal">Formal</option>
              <option value="neutral">Neutral</option>
              <option value="casual">Casual</option>
            </select>
          </label>
          <label className="block mb-2">
            Format:
            <select
              value={writerOptions.format}
              onChange={(e) =>
                setWriterOptions({
                  ...writerOptions,
                  format: e.target.value as WriterFormat,
                })
              }
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </label>
          <label className="block mb-2">
            Length:
            <select
              value={writerOptions.length}
              onChange={(e) =>
                setWriterOptions({
                  ...writerOptions,
                  length: e.target.value as WriterLength,
                })
              }
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={handleWrite}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isProcessing ? "Writing..." : "Write"}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Rewriter</h2>
        <textarea
          className="w-full p-2 mb-4 border rounded"
          value={rewritingTask}
          onChange={(e) => setRewritingTask(e.target.value)}
          placeholder="Enter text to rewrite"
        />
        <div className="mb-4">
          <label className="block mb-2">
            Tone:
            <select
              value={rewriterOptions.tone}
              onChange={(e) =>
                setRewriterOptions({
                  ...rewriterOptions,
                  tone: e.target.value as RewriterTone,
                })
              }
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="as-is">As-Is</option>
              <option value="more-formal">More Formal</option>
              <option value="more-casual">More Casual</option>
            </select>
          </label>
          <label className="block mb-2">
            Format:
            <select
              value={rewriterOptions.format}
              onChange={(e) =>
                setRewriterOptions({
                  ...rewriterOptions,
                  format: e.target.value as RewriterFormat,
                })
              }
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="as-is">As-Is</option>
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </label>
          <label className="block mb-2">
            Length:
            <select
              value={rewriterOptions.length}
              onChange={(e) =>
                setRewriterOptions({
                  ...rewriterOptions,
                  length: e.target.value as RewriterLength,
                })
              }
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="as-is">As-Is</option>
              <option value="shorter">Shorter</option>
              <option value="longer">Longer</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={handleRewrite}
          disabled={isProcessing}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isProcessing ? "Rewriting..." : "Rewrite"}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <div className="p-4 border rounded bg-gray-100">{output}</div>
      </div>
    </div>
  );
};

export default AIComponent;

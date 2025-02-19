import AIComponent from "@/components/AiComponents";
import TranslationComponent from "@/components/TranslationComponent";
import SummarizerComponent from "@/components/Summarizer";
import LanguageDetector from "@/components/LanguageDetection";
export default function Home() {
  return (
    <div className="w-[60%] m-auto">
      <AIComponent />
      <TranslationComponent />
      <SummarizerComponent />
      <LanguageDetector />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Slides from "../components/Slides";
import Avatar from "../components/Avatar";

interface Slide {
  id: number;
  commands: string[];
  content: string;
}

// Minimal SpeechRecognition type (enough for our usage)
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
  }
}

// Pick whichever is available
const SpeechRecognitionClass =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined;

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [avatarMessage, setAvatarMessage] = useState("");

  useEffect(() => {
    fetch("/commands.json")
      .then((res) => res.json())
      .then((data) => setSlides(data.slides as Slide[]));
  }, []);

  useEffect(() => {
    if (!SpeechRecognitionClass) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("You said:", transcript);

      slides.forEach((slide) => {
        if (slide.commands.some((cmd) => transcript.includes(cmd))) {
          setCurrentSlide(slide.id);
          setAvatarMessage(slide.content);
        }
      });
    };

    recognition.start();

    return () => recognition.stop();
  }, [slides]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">AI Avatar Slide Controller</h1>
      <Slides slides={slides} currentSlide={currentSlide} />
      <Avatar message={avatarMessage} />
    </main>
  );
}

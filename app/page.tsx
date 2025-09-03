"use client";

import { useEffect, useState } from "react";
import Slides from "../components/Slides";
import Avatar from "../components/Avatar";

interface Slide {
  id: number;
  commands: string[];
  content: string;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Some browsers only expose webkitSpeechRecognition
const SpeechRecognitionClass: typeof SpeechRecognition | undefined =
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
      .then((data) => setSlides(data.slides));
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

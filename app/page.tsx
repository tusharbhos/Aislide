"use client";

import { useEffect, useState } from "react";
import Slides from "../components/Slides";
import Avatar from "../components/Avatar";

interface Slide {
  id: number;
  commands: string[];
  content: string;
}

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
    if (typeof window === "undefined" || !(window as any).webkitSpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
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

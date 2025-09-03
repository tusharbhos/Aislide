"use client";

interface Slide {
  id: number;
  commands: string[];
  content: string;
}

export default function Slides({ slides, currentSlide }: { slides: Slide[]; currentSlide: number }) {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {slides[currentSlide - 1]?.content}
      </h2>
    </div>
  );
}

"use client";
import { useEffect } from "react";

export default function Avatar({ message }: { message: string }) {
  useEffect(() => {
    if (!message) return;

    const speak = async () => {
      try {
        const resp = await fetch("/api/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });
        const data = await resp.json();
        console.log("Avatar response:", data);
      } catch (e) {
        console.error("Avatar speak error:", e);
      }
    };

    speak();
  }, [message]);

  return (
    <div className="mt-4 text-center">
      <p className="text-gray-500">🎤 Avatar Speaking...</p>
    </div>
  );
}

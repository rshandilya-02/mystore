"use client"

import { useEffect, useState } from "react";

const commands = [
  "$ npm install -g mydrive-cli",
  "Installing...",
  "✔ CLI installed",
  "",
  "$ mydrive login",
  "Opening browser...",
  "✔ Logged in",
  "",
  "$ mydrive upload ./photos",
  "Uploading files...",
  "████████████████ 100%",
  "✔ Upload complete"
];

export default function DemoTerminal() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setVisibleLines(prev => [...prev, commands[i]]);
      i++;

      if (i >= commands.length) clearInterval(interval);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-400 p-6 rounded-lg font-mono flex flex-col justify-center items-center">
      {visibleLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
"use client";

import { useState } from "react";
import Script from "next/script";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setReply(data.reply);
  }

  return (
    <main style={{ padding: 20 }}>
      {/* Load chatbot widget */}
      <Script src="/widget.js" strategy="afterInteractive" />

      <h1>My AI Chatbot</h1>

      <input
        style={{ padding: 10, width: "100%" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={sendMessage} style={{ marginTop: 10 }}>
        Send
      </button>

      <div style={{ marginTop: 20 }}>
        <strong>Reply:</strong>
        <p>{reply}</p>
      </div>
    </main>
  );
}
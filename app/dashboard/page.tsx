"use client";

import { useEffect, useState } from "react";

type Site = {
  id: string;
  name: string;
  messages_used: number;
};

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);

  async function loadSites() {
    const res = await fetch("/api/sites");
    const data = await res.json();

    setSites(data);
  }

  async function createSite() {
    const name = prompt("Chatbot name");

    if (!name) return;

    await fetch("/api/sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    loadSites();
  }

  useEffect(() => {
    loadSites();
  }, []);

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Dashboard 🚀</h1>

      <button
        onClick={createSite}
        style={{
          padding: "10px 16px",
          marginBottom: 20,
          cursor: "pointer",
          borderRadius: 8,
          border: "none",
          background: "#111",
          color: "#fff",
        }}
      >
        Create Chatbot
      </button>

      <div>
        {sites.map((site) => (
          <div
            key={site.id}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              marginBottom: 12,
              borderRadius: 10,
            }}
          >
            <h3>{site.name}</h3>

            <p>
              Messages Used: {site.messages_used}
            </p>

            <code
              style={{
                display: "block",
                marginTop: 10,
                whiteSpace: "pre-wrap",
              }}
            >
              {`<script src="https://my-chat-widget-xi.vercel.app/widget.js" data-site-id="${site.id}"></script>`}
            </code>
          </div>
        ))}
      </div>
    </main>
  );
}
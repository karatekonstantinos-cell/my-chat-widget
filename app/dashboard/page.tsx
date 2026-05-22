"use client";

import { useEffect, useState } from "react";

type Site = {
  id: string;
  name: string;
  messages_used: number;
};

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSites() {
    try {
      const res = await fetch("/api/sites");
      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (!Array.isArray(data)) {
        setSites([]);
        return;
      }

      setSites(data);
    } catch (err) {
      console.error("Failed to load sites:", err);
      setSites([]);
    } finally {
      setLoading(false);
    }
  }

  async function createSite() {
    const name = prompt("Chatbot name");
    if (!name) return;

    try {
      await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      loadSites();
    } catch (err) {
      console.error("Failed to create site:", err);
    }
  }

  useEffect(() => {
    loadSites();
  }, []);

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Dashboard 🚀</h1>

      <button
        onClick={createSite}
        style={{
          marginBottom: 20,
          padding: "10px 14px",
          cursor: "pointer",
        }}
      >
        Create Chatbot
      </button>

      {loading && <p>Loading...</p>}

      {!loading && sites.length === 0 && (
        <p>No chatbots yet</p>
      )}

      {sites.map((site) => (
        <div
          key={site.id}
          style={{
            padding: 16,
            border: "1px solid #ddd",
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3>{site.name}</h3>
          <p>Messages: {site.messages_used}</p>

          <code>
            {`<script src="https://my-chat-widget-xi.vercel.app/widget.js" data-site-id="${site.id}"></script>`}
          </code>
        </div>
      ))}
    </main>
  );
}
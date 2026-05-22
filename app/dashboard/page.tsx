"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSites() {
    try {
      const res = await fetch("/api/sites");
      const data = await res.json();

      setSites(Array.isArray(data) ? data : []);
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

    await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    loadSites();
  }

  useEffect(() => {
    loadSites();
  }, []);

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Dashboard 🚀</h1>

      <button onClick={createSite} style={{ marginBottom: 20 }}>
        Create Chatbot
      </button>

      {loading && <p>Loading...</p>}

      {!loading && sites.length === 0 && (
        <p>No chatbots yet</p>
      )}

      {sites.map((site) => (
        <div key={site.id || Math.random()} style={{ padding: 16 }}>
          <h3>{site.name || "Unnamed bot"}</h3>
          <p>Messages: {site.messages_used || 0}</p>
        </div>
      ))}
    </main>
  );
}
(function () {
  // =========================
  // SAAS CONFIG
  // =========================

  const script = document.currentScript;

  const SITE_ID =
    script?.getAttribute("data-site-id") || "demo";

  // ✅ FIXED: use same-origin API (IMPORTANT)
  const API_URL = "/api/chat";

  // =========================
  // UI ELEMENTS
  // =========================

  const button = document.createElement("button");
  button.innerText = "💬";

  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: "24px",
    zIndex: 999999,
    cursor: "pointer",
  });

  const box = document.createElement("div");

  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "350px",
    height: "500px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 999999,
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  });

  const messages = document.createElement("div");

  Object.assign(messages.style, {
    flex: "1",
    padding: "12px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    background: "#fafafa",
  });

  const input = document.createElement("input");

  Object.assign(input.style, {
    padding: "12px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    color: "#000",
    background: "#fff",
    fontSize: "14px",
  });

  box.appendChild(messages);
  box.appendChild(input);

  document.body.appendChild(button);
  document.body.appendChild(box);

  // =========================
  // CHAT BUBBLES
  // =========================

  function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.innerText = text;

    Object.assign(msg.style, {
      maxWidth: "80%",
      padding: "10px 12px",
      marginBottom: "10px",
      borderRadius: "14px",
      fontSize: "14px",
      lineHeight: "1.4",
      wordWrap: "break-word",
    });

    if (type === "user") {
      msg.style.background = "#000";
      msg.style.color = "#fff";
      msg.style.marginLeft = "auto";
    } else {
      msg.style.background = "#e5e5e5";
      msg.style.color = "#000";
      msg.style.marginRight = "auto";
    }

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // =========================
  // TYPING INDICATOR
  // =========================

  function showTyping() {
    if (document.getElementById("typing")) return;

    const typing = document.createElement("div");
    typing.id = "typing";
    typing.innerText = "Our assistant is typing...";

    Object.assign(typing.style, {
      fontSize: "13px",
      color: "#666",
      fontStyle: "italic",
      marginBottom: "10px",
    });

    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById("typing")?.remove();
  }

  // =========================
  // SEND MESSAGE (FIXED)
  // =========================

  async function sendMessage(text) {
    addMessage(text, "user");
    showTyping();

    try {
      const res = await fetch(`${API_URL}?siteId=${SITE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      removeTyping();
      addMessage(data?.reply ?? "No response from server", "bot");

    } catch (err) {
      removeTyping();
      addMessage("Error connecting to server", "bot");
      console.error(err);
    }
  }

  // =========================
  // OPEN / CLOSE + GREETING
  // =========================

  button.onclick = () => {
    const open = box.style.display === "flex";
    box.style.display = open ? "none" : "flex";

    if (!open && messages.childElementCount === 0) {
      addMessage("Hello, how may I help you?", "bot");
    }
  };

  // =========================
  // INPUT HANDLING
  // =========================

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      const text = input.value.trim();
      input.value = "";
      sendMessage(text);
    }
  });
})();
(function () {
  // =========================
  // SAAS CONFIG
  // =========================
  const script = document.currentScript;

  const SITE_ID =
    script?.getAttribute("data-site-id") || "demo";

  const API_URL = "/api/chat";

  // =========================
  // FLOAT BUTTON
  // =========================
  const button = document.createElement("button");
  button.innerText = "💬";

  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: "22px",
    zIndex: 999999,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  });

  // =========================
  // CHAT WINDOW
  // =========================
  const box = document.createElement("div");

  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "380px",
    height: "520px",
    background: "#ffffff",
    borderRadius: "18px",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 999999,
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  });

  // =========================
  // HEADER
  // =========================
  const header = document.createElement("div");
  header.innerText = "AI Assistant";

  Object.assign(header.style, {
    padding: "14px",
    background: "#111",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
  });

  // =========================
  // MESSAGES
  // =========================
  const messages = document.createElement("div");

  Object.assign(messages.style, {
    flex: "1",
    padding: "14px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#f7f7f8",
  });

  // =========================
  // INPUT AREA
  // =========================
  const inputWrap = document.createElement("div");

  Object.assign(inputWrap.style, {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #eee",
    background: "#fff",
  });

  const input = document.createElement("input");

 Object.assign(input.style, {
  flex: "1",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  outline: "none",
  fontSize: "14px",

  color: "#111",        // ✅ FIX: text color visible
  background: "#fff",   // ensure white background
});

  const sendBtn = document.createElement("button");
  sendBtn.innerText = "➤";

  Object.assign(sendBtn.style, {
    marginLeft: "8px",
    padding: "12px 14px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  });

  inputWrap.appendChild(input);
  inputWrap.appendChild(sendBtn);

  box.appendChild(header);
  box.appendChild(messages);
  box.appendChild(inputWrap);

  document.body.appendChild(button);
  document.body.appendChild(box);

  // =========================
  // MESSAGE BUBBLES
  // =========================
  function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.innerText = text;

    Object.assign(msg.style, {
      maxWidth: "75%",
      padding: "10px 12px",
      borderRadius: "14px",
      fontSize: "14px",
      lineHeight: "1.4",
      wordBreak: "break-word",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    });

    if (type === "user") {
      msg.style.background = "#111";
      msg.style.color = "#fff";
      msg.style.marginLeft = "auto";
    } else {
      msg.style.background = "#fff";
      msg.style.color = "#111";
      msg.style.marginRight = "auto";
      msg.style.border = "1px solid #eee";
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
    typing.innerText = "Assistant is typing...";

    Object.assign(typing.style, {
      fontSize: "12px",
      color: "#777",
      fontStyle: "italic",
    });

    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById("typing")?.remove();
  }

  // =========================
  // SEND MESSAGE
  // =========================
  async function sendMessage(text) {
    addMessage(text, "user");
    showTyping();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const raw = await res.text();
      const data = JSON.parse(raw);

      removeTyping();
      addMessage(data.reply || "No response", "bot");
    } catch (err) {
      removeTyping();
      addMessage("Error connecting to server", "bot");
      console.error(err);
    }
  }

  // =========================
  // EVENTS
  // =========================
  button.onclick = () => {
    const open = box.style.display === "flex";
    box.style.display = open ? "none" : "flex";

    if (!open && messages.childElementCount === 0) {
      addMessage("Hello 👋 How can I help you?", "bot");
    }
  };

  sendBtn.onclick = () => {
    if (input.value.trim()) {
      sendMessage(input.value.trim());
      input.value = "";
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      sendMessage(input.value.trim());
      input.value = "";
    }
  });
})();
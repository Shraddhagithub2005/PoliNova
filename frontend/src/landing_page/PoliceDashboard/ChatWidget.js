import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api";
import "./chat.css";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [size, setSize] = useState({ width: 320, height: 420 });
  const [expanded, setExpanded] = useState(false);
  const { t, i18n } = useTranslation();

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage === "") return;

    setMessages((prev) => [...prev, { text: trimmedMessage, sender: "user" }]);
    setMessage("");

    try {
      const response = await api.post("legal-chatbot/", {
        message: trimmedMessage,
        user_type: "police",
        language: i18n.language,
      });

      const reply = response.data?.reply || {};
      const replyText = [
        `${t("crimeType")}: ${reply["Crime Type"] || ""}`,
        `${t("ipcSections")}: ${reply["IPC Sections"] || ""}`,
        `${t("explanation")}: ${reply["Explanation"] || ""}`,
        `${t("actionSteps")}: ${reply["Action Steps"] || ""}`,
      ].join("\n");

      setMessages((prev) => [...prev, { text: replyText, sender: "bot" }]);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || t("unableLegalGuidance");
      setMessages((prev) => [...prev, { text: errorMessage, sender: "bot" }]);
    }
  };

  const startResize = (e, direction) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (event) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === "right") newWidth = startWidth + (event.clientX - startX);
      if (direction === "bottom") newHeight = startHeight + (event.clientY - startY);
      if (direction === "left") newWidth = startWidth - (event.clientX - startX);
      if (direction === "top") newHeight = startHeight - (event.clientY - startY);

      setSize({
        width: Math.max(250, newWidth),
        height: Math.max(300, newHeight),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      <div
        className="chat-button"
        onClick={() => {
          if (!open) {
            setMessages([]);
            setMessage("");
          }
          setOpen(!open);
        }}
      >
        🤖
      </div>

      {!open && <div className="chat-popup-msg">👋 {t("chatHelpPrompt")}</div>}

      {open && (
        <div
          className="chat-window"
          style={{
            width: expanded ? "700px" : size.width,
            height: expanded ? "500px" : size.height,
          }}
        >
          <div className="resize-handle top" onMouseDown={(e) => startResize(e, "top")} />
          <div className="resize-handle right" onMouseDown={(e) => startResize(e, "right")} />
          <div className="resize-handle bottom" onMouseDown={(e) => startResize(e, "bottom")} />
          <div className="resize-handle left" onMouseDown={(e) => startResize(e, "left")} />

          <div className="chat-header">
            {t("legalAssistant")}
            <div style={{ display: "flex", gap: "10px" }}>
              <span onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer", color: "rgb(0, 0, 0)" }} title="Resize">
                {expanded ? "🗗" : "🗖"}
              </span>

              <span
                onClick={() => setOpen(false)}
                style={{
                  cursor: "pointer",
                  color: "black",
                  fontSize: "24px",
                  marginTop: "-4px",
                }}
              >
                ×
              </span>
            </div>
          </div>

          <div className="chat-body">
            {messages.length === 0 && <p>👋 {t("chatGreeting")}</p>}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    background: msg.sender === "user" ? "rgb(254, 92, 92)" : "rgb(245, 245, 245)",
                    color: msg.sender === "user" ? "white" : "black",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    display: "inline-block",
                    whiteSpace: "pre-line",
                    maxWidth: "90%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ position: "relative", padding: "10px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder={t("askSomething")}
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                outline: "none",
              }}
            />

            <button
              onClick={handleSend}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgb(254, 92, 92)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;

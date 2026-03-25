import React, { useState } from "react";
import "./chat.css";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [size, setSize] = useState({ width: 320, height: 420 });
  const [expanded, setExpanded] = useState(false);

  const handleSend = () => {
    if (message.trim() === "") return;

    setMessages([...messages, { text: message, sender: "user" }]);
    setMessage("");
  };

  // ✅ Resize Logic
  const startResize = (e, direction) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (e) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === "right") {
        newWidth = startWidth + (e.clientX - startX);
      }
      if (direction === "bottom") {
        newHeight = startHeight + (e.clientY - startY);
      }
      if (direction === "left") {
        newWidth = startWidth - (e.clientX - startX);
      }
      if (direction === "top") {
        newHeight = startHeight - (e.clientY - startY);
      }

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
      {/* Floating Button */}
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

      {/* Popup */}
      {!open && (
        <div className="chat-popup-msg">
          👋 Hi, Need legal help?
        </div>
      )}

      {/* Chat Window */}
      {open && (
                    <div
            className="chat-window"
            style={{
                width: expanded ? "700px" : size.width,
                height: expanded ? "500px" : size.height,
            }}
            >
          {/* 🔥 Resize Handles */}
          <div className="resize-handle top" onMouseDown={(e) => startResize(e, "top")} />
          <div className="resize-handle right" onMouseDown={(e) => startResize(e, "right")} />
          <div className="resize-handle bottom" onMouseDown={(e) => startResize(e, "bottom")} />
          <div className="resize-handle left" onMouseDown={(e) => startResize(e, "left")} />

          {/* Header */}
          <div className="chat-header">
            Legal Assistant
            <div style={{ display: "flex", gap: "10px" }}>
    
                {/* 🔥 Expand / Collapse Button */}
                <span
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: "pointer",color:"rgb(0, 0, 0)" }}
                title="Resize"
                >
                {expanded ? "🗗" : "🗖"}
                </span>

                {/* Close Button */}
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

          {/* Messages */}
          <div className="chat-body">
            {messages.length === 0 && (
              <p>👋 Hello! I can help with FIR, legal queries.</p>
            )}

            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: "right", marginTop: "8px" }}>
                <span
                  style={{
                    background: "rgb(254, 92, 92)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    display: "inline-block",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ position: "relative", padding: "10px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask something..."
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
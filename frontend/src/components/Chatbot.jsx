import React, { useState } from "react";
import SummaryApi from "../common";

const Chatbot = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const botMsg = { role: "bot", content: "" };
    setMessages((prev) => [...prev, botMsg]);

    try {
      const apiUrl = SummaryApi.chat.url.trim().replace(/\u200B/g, "");
      const res = await fetch(apiUrl, {
        method: SummaryApi.chat.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: input }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let botResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        try {
          const lines = chunk.split("\n").filter(Boolean);
          for (const line of lines) {
            if (line.trim().startsWith("{")) {
              const json = JSON.parse(line.trim());
              if (json?.message) {
                botResponse += json.message;
              } else if (json?.response) {
                botResponse += json.response;
              }
            } else {
              botResponse += line;
            }
          }
        } catch {
          botResponse += chunk;
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = botResponse;
          return updated;
        });
      }

      setIsStreaming(false);
    } catch (err) {
      console.error("Chatbot error:", err);
      setIsStreaming(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShow(!show)}
          className="bg-red-600 hover:bg-red-700 text-white w-12 h-12 text-xl rounded-full shadow flex items-center justify-center"
        >
          {show ? "×" : "🗨️"}
        </button>
      </div>

      {show && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border border-red-600 rounded-xl shadow-lg z-50 flex flex-col">
          <div className="p-2 border-b border-red-600 font-semibold bg-red-100 text-red-800 rounded-t-xl">
            🛍️ Electronify Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-2 max-h-80 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  msg.role === "user" ? "text-right" : "text-left text-red-800"
                }`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-xl ${
                    msg.role === "user"
                      ? "bg-gray-200"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {isStreaming && (
              <div className="text-left text-red-600 text-xs mt-2">Typing...</div>
            )}
          </div>

          <div className="flex border-t border-red-600 p-2">
            <input
              className="flex-1 border border-red-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-red-200"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              disabled={isStreaming}
            />
            <button
              className="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              onClick={sendMessage}
              disabled={isStreaming}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

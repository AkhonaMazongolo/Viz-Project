import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

import { sendMessage } from "../services/chatService";

export default function Chat() {
  const location = useLocation();
  const user = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const firstMessage = location.state?.initialMessage;

    if (firstMessage) {
      handleConversation(firstMessage);
    }
  }, []);

  const handleConversation = async (message) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setLoading(true);

    try {
      const reply = await sendMessage(message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentMessage = input;

    setInput("");

    await handleConversation(currentMessage);
  };

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="h-16 border-b border-slate-200 px-8 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Visualizer AI</h2>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              {user?.name || user?.email || "Guest"}
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}

            {/* Loading Message */}
            {loading && <ChatMessage role="assistant" content="Thinking..." />}
          </div>
        </div>

        {/* Input */}
        <ChatInput value={input} onChange={setInput} onSend={handleSend} />
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import HeroSection from "../components/HeroSection";
import ChatInput from "../components/ChatInput";

export default function Home() {
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSend = () => {
    if (!message.trim()) return;

    navigate("/chat", {
      state: {
        initialMessage: message,
      },
    });
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-6">
          <Link
            to="/login"
            className="
              bg-blue-600
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              hover:bg-blue-700
              transition
            "
          >
            Login
          </Link>
        </div>
        <HeroSection />

        <ChatInput value={message} onChange={setMessage} onSend={handleSend} />
      </div>
    </div>
  );
}

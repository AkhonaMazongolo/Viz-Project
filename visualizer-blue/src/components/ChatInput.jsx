import { useRef, useState } from "react";
import { FiArrowUp, FiPlus } from "react-icons/fi";

export default function ChatInput({ value, onChange, onSend }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      console.log(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full mb-10 px-4">
      <div className="bg-white shadow-xl border border-slate-200 rounded-3xl px-4 md:px-6 py-4 md:py-5 flex items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={handleFileSelect}
          className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"
        >
          <FiPlus size={22} />
        </button>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask Visualizer..."
          className="flex-1 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
        />

        <button
          onClick={onSend}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center"
        >
          <FiArrowUp />
        </button>
      </div>
    </div>
  );
}

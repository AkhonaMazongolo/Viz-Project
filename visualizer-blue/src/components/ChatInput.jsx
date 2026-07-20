import { useRef, useState } from "react";
import axios from "axios";
import { FiArrowUp, FiPlus } from "react-icons/fi";

export default function ChatInput({
  value,
  onChange,
  onSend,
  onDocumentReady,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("userId", String(user?.id || ""));

    setUploading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (onDocumentReady) {
        onDocumentReady(response.data.document.extractedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      e.target.value = "";
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
          disabled={uploading}
        >
          {uploading ? "..." : <FiPlus size={22} />}
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

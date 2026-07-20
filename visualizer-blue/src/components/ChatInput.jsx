import { useRef, useState } from "react";
import axios from "axios";
import { FiArrowUp, FiPlus, FiX, FiFile } from "react-icons/fi";

export default function ChatInput({
  value,
  onChange,
  onSend,
  onDocumentReady,
}) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Upload successful:", response.data);

      if (onDocumentReady) {
        onDocumentReady(response.data.document?.extractedData || "");
      }
    } catch (error) {
      console.error("Upload failed:", error);

      alert(error?.response?.data?.error || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full mb-10 px-4">
      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-3 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 w-fit">
          <FiFile className="text-blue-600" />

          <span className="text-sm text-slate-700">{selectedFile.name}</span>

          <button
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700"
          >
            <FiX />
          </button>
        </div>
      )}

      <div className="bg-white shadow-xl border border-slate-200 rounded-3xl px-4 md:px-6 py-4 md:py-5 flex items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          onClick={handleFileSelect}
          disabled={uploading}
          className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
        >
          {uploading ? "..." : <FiPlus size={22} />}
        </button>

        {/* Message Input */}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            uploading ? "Uploading document..." : "Ask Visualizer..."
          }
          className="flex-1 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
        />

        {/* Send Button */}
        <button
          onClick={onSend}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
        >
          <FiArrowUp />
        </button>
      </div>
    </div>
  );
}

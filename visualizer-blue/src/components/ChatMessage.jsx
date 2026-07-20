export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-2xl
          px-5
          py-4
          rounded-2xl
          shadow-md
          ${isUser ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"}
        `}
      >
        {content}
      </div>
    </div>
  );
}

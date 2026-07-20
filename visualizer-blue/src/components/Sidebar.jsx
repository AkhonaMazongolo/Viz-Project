import { useState } from "react";
import { FiMenu, FiSearch, FiSquare, FiPlus } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const chats = [
    "Revenue Analysis",
    "Financial Report",
    "Project Timeline",
    "Sales Dashboard",
  ];

  return (
    <div
      className={`
        bg-slate-50
        border-r
        border-slate-200
        h-screen
        flex
        flex-col
        transition-all
        duration-300
        ${collapsed ? "w-20" : "w-80"}
      `}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:text-blue-600"
          >
            <FiMenu size={24} />
          </button>

          {!collapsed && (
            <h1 className="font-bold text-3xl tracking-wider text-blue-600">
              VISUALIZER
            </h1>
          )}
        </div>

        <button
          className="
            w-full
            bg-blue-600
            text-white
            py-4
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            hover:bg-blue-700
            transition
          "
        >
          <FiPlus />

          {!collapsed && <span>New Chat</span>}
        </button>

        {!collapsed && (
          <div className="mt-5 relative">
            <FiSearch className="absolute left-4 top-4" size={18} />

            <input
              placeholder="Search chats..."
              className="w-full py-3 pl-12 rounded-xl border border-slate-300"
            />
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="px-4 flex-1 overflow-y-auto">
        {!collapsed && <p className="text-slate-500 text-sm mb-6">RECENT</p>}

        {chats.map((chat) => (
          <div
            key={chat}
            className="
              flex
              items-center
              gap-3
              py-4
              px-2
              rounded-lg
              cursor-pointer
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <FiSquare />

            {!collapsed && <span>{chat}</span>}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-slate-200">
        {collapsed ? (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            A
          </div>
        ) : (
          <>
            <h3 className="font-bold">Akhona</h3>
            <p className="text-slate-500">AI Learner</p>
          </>
        )}
      </div>
    </div>
  );
}

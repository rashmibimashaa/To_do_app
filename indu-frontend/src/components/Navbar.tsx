"use client";

import { LogOut, ListTodo } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Add your logout logic here
    router.push("/login");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        backdropFilter: "blur(15px)",
        background: "rgba(255,255,255,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.25)",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
        onClick={() => router.push("/dashboard")}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <ListTodo color="white" size={22} />
        </div>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.3px",
          }}
        >
          Todo App
        </h1>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          borderRadius: "12px",
          border: "none",
          background: "rgba(255,255,255,0.2)",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.2)";
        }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </nav>
  );
}

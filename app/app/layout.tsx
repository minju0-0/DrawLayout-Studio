import React from "react";
import "../globals.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full"> 
      {children}
    </div>
  );
}

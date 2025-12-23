"use client";

import React from "react";
import { BookOpen, Briefcase, Coffee } from "lucide-react";
import "./CommandSidebar.css";

export default function CommandSidebar() {
  return (
    <aside className="command-bar">
      <div className="command-bar__top">
        <nav className="command-bar__nav">
          <button
            className="command-bar__link command-bar__link--active"
            aria-label="Study"
          >
            <BookOpen size={22} />
          </button>

          <button
            className="command-bar__link"
            aria-label="Services"
          >
            <Briefcase size={22} />
          </button>

          <button
            className="command-bar__link"
            aria-label="Food"
          >
            <Coffee size={22} />
          </button>
        </nav>
      </div>

      <div className="command-bar__bottom">
        <div className="command-bar__profile">
          <img
            src="/api/placeholder/40/40"
            alt="Profile"
            className="command-bar__avatar"
          />
        </div>
      </div>
    </aside>
  );
}

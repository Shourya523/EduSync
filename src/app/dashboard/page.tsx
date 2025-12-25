"use client"

import { useEffect, useState } from "react"
import { auth } from "@/src/lib/firebase"
import AuthGuard from "@/src/components/AuthGuard"
import {
  BookOpen,
  Coffee,
  Calendar,
  Library,
  Bell,
  Search,
  UserCircle,
  ArrowUpRight,
} from "lucide-react"
import "./Dashboard.css"

export default function DashboardPage() {
  const [username, setUsername] = useState("")
  const [photoURL, setPhotoURL] = useState<string | null>(null)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(
          user.displayName ||
            user.email?.split("@")[0] ||
            "Student"
        )
        setPhotoURL(user.photoURL)
      }
    })
    return () => unsub()
  }, [])

  return (
    <AuthGuard>
      <section className="edusync-dashboard-root">
        <header className="edusync-main-header">
          <div className="edusync-welcome-container">
            <h1>
              Welcome back, <span>{username}</span>
            </h1>
            <p>Built by students, for the students who actually show up.</p>
          </div>

          <div className="edusync-avatar-wrapper">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="edusync-avatar-img"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserCircle size={32} strokeWidth={1.5} />
            )}
          </div>
        </header>

        <div className="edusync-bento-layout">
          <div className="edusync-tile edusync-copilot-tile">
            <div className="edusync-search-input-box">
              <Search className="edusync-icon-dim" size={20} />
              <input
                type="text"
                placeholder="What's on your mind today?"
              />
            </div>
            <div className="edusync-hint-box">
              <span className="edusync-tag-label">Pro-Tip</span>
              <p>The 3rd-floor wing has the fastest Wi-Fi and quietest desks.</p>
            </div>
          </div>

          <a
            href="/notes"
            className="edusync-tile edusync-tile-tall edusync-notes-tile"
          >
            <div className="edusync-tile-top">
              <BookOpen size={24} />
              <ArrowUpRight size={18} className="edusync-link-arrow" />
            </div>
            <h3>Notes.Co</h3>
            <p>Access, upload, and organize notes with AI help.</p>
          </a>

          <a
            href="/jcafe"
            className="edusync-tile edusync-tile-wide edusync-cafe-tile"
          >
            <div className="edusync-flex-container">
              <div className="edusync-content-group">
                <Coffee size={24} />
                <h3>J-Cafe</h3>
                <p>Order food and skip the queues.</p>
              </div>
              <div className="edusync-indicator-pill">Active</div>
            </div>
          </a>

          <a
            href="/timetable"
            className="edusync-tile edusync-schedule-tile"
          >
            <Calendar size={24} />
            <h3>Timetable</h3>
            <p>View your daily sync.</p>
          </a>

          <a
            href="/essentialServices"
            className="edusync-tile edusync-tile-wide edusync-services-tile"
          >
            <div className="edusync-flex-container">
              <Library size={24} />
              <div>
                <h3>Campus Essentials</h3>
                <p>Books, prints, and car buddy.</p>
              </div>
            </div>
          </a>

          <div className="edusync-tile edusync-alerts-tile">
            <div className="edusync-tile-top">
              <Bell size={20} />
              <span>Live Portal</span>
            </div>
            <p className="edusync-text-preview">
              "Found a lost ID card in Library Wing A" — Rahul
            </p>
          </div>
        </div>
      </section>
    </AuthGuard>
  )
}

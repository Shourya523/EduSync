'use client'

import { useState } from "react"
import { auth } from "@/src/lib/firebase"
import { Plus, Youtube } from "lucide-react"

export default function AddVideoUrl({ onAdded }: { onAdded?: () => void }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!url.trim()) return
    const user = auth.currentUser
    if (!user) return

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      })
      if (res.ok) {
        setUrl("")
        onAdded?.()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="video-input-wrapper">
      <div className="input-group">
        <Youtube size={18} className="input-icon" />
        <input
          type="text"
          placeholder="Paste YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button className="add-btn" onClick={submit} disabled={loading || !url}>
        {loading ? <span className="loader"></span> : <><Plus size={18} /> Add Video</>}
      </button>
    </div>
  )
}
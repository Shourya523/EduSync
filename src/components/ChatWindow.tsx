"use client"
import { X, Send, UserCircle } from "lucide-react"
import "../app/car-buddy/car-buddy.css"

interface ChatWindowProps {
  recipientName: string
  destination: string
  onClose: () => void
}

export default function ChatWindow({ recipientName, destination, onClose }: ChatWindowProps) {
  return (
    <div className="edusync-modal-overlay" onClick={onClose}>
      <div className="edusync-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="edusync-modal-header">
          <div className="edusync-chat-user-info">
            <div className="edusync-avatar-small">
              <UserCircle size={24} color="#555" />
            </div>
            <div>
              <h3>{recipientName}</h3>
              <span className="edusync-chat-status">Heading to {destination}</span>
            </div>
          </div>
          <button className="edusync-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="edusync-chat-body">
          <div className="edusync-msg-bubble received">
            I saw you are going to Noida Sector 62
          </div>
          <div className="edusync-msg-bubble received">
            I'm going to {destination} as well — can I hop in?
          </div>
          <div className="edusync-date-divider">Today 4:20 PM</div>
        </div>

        <div className="edusync-chat-input-area">
          <input 
            type="text" 
            placeholder="Type a message..."
            autoFocus
          />
          <button className="edusync-send-btn">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
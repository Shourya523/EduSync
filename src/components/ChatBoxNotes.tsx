"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import "./ChatBox.css";

type ChatMessage = {
    role: "user" | "ai";
    content: string;
};

type UploadFileProps = {
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
};

export default function ChatBot({
    selectedFile,
}: UploadFileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "ai", content: "Upload notes to start asking questions." }
    ]);
    const [loading, setLoading] = useState(false);

    const canChat = isOpen && selectedFile;

    async function sendMessage() {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setInputValue("");

        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
            { role: "ai", content: "Thinking…" }
        ]);

        setLoading(true);

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_QUERY_URL!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: userMessage,
                    source_type: "pdf",
                }),
            });

            const { answer } = await res.json();

            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "ai", content: answer }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "ai", content: "Something went wrong. Please try again." }
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                className={`edubot-trigger ${isOpen ? "edubot-trigger--active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle EduBot"
            >
                <MessageCircle size={22} />
            </button>

            <div className={`edubot-panel ${isOpen ? "edubot-panel--visible" : ""}`}>
                <div className="edubot-panel__header">
                    <span className="edubot-panel__title">EduSync AI</span>
                </div>

                <div className="edubot-panel__body">
                    {messages.map((msg, idx) => {
                        // Check if this is the "Thinking..." state
                        const isThinking = msg.role === "ai" && msg.content === "Thinking…";

                        return (
                            <div
                                key={idx}
                                className={`edubot-msg edubot-msg--${msg.role} ${isThinking ? "edubot-msg--thinking" : ""}`}
                            >
                                {msg.content}
                            </div>
                        );
                    })}
                </div>

                <div className="edubot-footer">
                    <div className="edubot-footer__input-group">
                        <input
                            type="text"
                            className="edubot-footer__input"
                            placeholder={
                                !selectedFile
                                    ? "Upload a file to enable chat"
                                    : !isOpen
                                        ? "Open chat to ask questions"
                                        : "Ask about your notes…"
                            }
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            disabled={!canChat || loading}
                        />

                        <button
                            className="edubot-footer__send-btn"
                            onClick={sendMessage}
                            disabled={!canChat || loading || !inputValue.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

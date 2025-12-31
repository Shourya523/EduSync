"use client";
import { useEffect, useState } from "react";
import "./page.css";
import UploadFileButton from "@/src/components/UploadFile";
import ChatBox from "@/src/components/ChatBoxNotes";
import AuthGuard from "@/src/components/AuthGuard";

export default function NotesPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploaded, setUploaded] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    async function deletePdf() {
        await fetch(process.env.NEXT_PUBLIC_NOTES_DELETE_URL!, {
            method: "DELETE",
        });
    }

    useEffect(() => {
        if (!selectedFile) {
            setPdfUrl(null);
            return;
        }

        const url = URL.createObjectURL(selectedFile);
        setPdfUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    return (
        <AuthGuard>
        <section className="notes-page">
            <div className="notes-header">
                <h1>
                    Notes<span>.Co</span>
                </h1>
                <p>Upload PDFs and let EduSync index them intelligently.</p>
            </div>

            {!uploaded ? (
                <div className="notes-bento">
                    <div className="notes-bento-left">
                        <div className="notes-card">
                            <h3>Upload Notes</h3>
                            <p>Add PDFs to your knowledge base with AI-powered indexing.</p>
                            <UploadFileButton
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                onUploaded={() => setUploaded(true)}
                            />
                        </div>

                        <a href="/dashboard" className="notes-card secondary">
                            <h3>Go to Dashboard</h3>
                            <p>View announcements, services, and campus tools.</p>
                        </a>
                    </div>

                    <div className="notes-bento-right">
                        <h4>Previously Uploaded</h4>
                        <p className="notes-bento-hint">Example documents</p>

                        <ul className="notes-demo-list">
                            <li>Momentum_Topic_Guide.pdf</li>
                            <li>DSA_Revision_Notes.pdf</li>
                            <li>Physics_Midsem_Syllabus.pdf</li>
                            <li>Operating_Systems_CheatSheet.pdf</li>
                        </ul>
                    </div>
                </div>
            ) : (

                <div className="notes-workspace">
                    <div className="notes-toolbar">
                        <span className="notes-filename">{selectedFile?.name}</span>

                        <div className="notes-toolbar-actions">
                            <button
                                className="notes-reupload"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setUploaded(false);
                                }}
                            >
                                Upload another PDF
                            </button>

                            <button
                                className="notes-delete"
                                onClick={async () => {
                                    await deletePdf();
                                    setSelectedFile(null);
                                    setUploaded(false);
                                }}
                            >
                                Delete all PDFs
                            </button>
                        </div>
                    </div>

                    <div className="notes-pdf-viewer">
                        {pdfUrl && <iframe src={pdfUrl} title="PDF Viewer" />}
                    </div>
                </div>
            )}
            <div className="notes-powered">
                <span>Powered by</span>
                <span className="gemini-brand">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="gemini-icon"
                    >
                        <path
                            d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"
                            fill="currentColor"
                        />
                    </svg>
                    Gemini
                </span>
            </div>


            <ChatBox selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
        </section>
        </AuthGuard>
    );
}

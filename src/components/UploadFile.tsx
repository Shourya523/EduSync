"use client";

import "./UploadFile.css";
import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";

type UploadFileProps = {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onUploaded?: () => void;
};

export default function UploadFileButton({
  selectedFile,
  setSelectedFile,
  onUploaded,
}: UploadFileProps) {
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  async function uploadFile() {
    if (!selectedFile) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_NOTES_QUERY_URL!, {
        method: "POST",
        body: formData,
      });

      await res.json();
      setUploaded(true);
      onUploaded?.();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  if (uploaded && selectedFile) {
    return (
      <div className="upload-collapsed">
        <CheckCircle size={16} />
        <span className="upload-collapsed__name">{selectedFile.name}</span>
        <button
          className="upload-collapsed__change"
          onClick={() => {
            setUploaded(false);
            setSelectedFile(null);
          }}
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="upload-wrapper">
      <div className="upload-input">
        <label className="upload-label">
          <Upload size={18} className="upload-icon" />
          <span className="upload-text">
            {selectedFile ? selectedFile.name : "Choose PDF"}
          </span>
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) =>
              setSelectedFile(e.target.files?.[0] || null)
            }
          />
        </label>
      </div>

      <button
        className="upload-btn"
        onClick={uploadFile}
        disabled={loading}
      >
        {loading ? "Uploading…" : "Upload PDF"}
      </button>
    </div>
  );
}

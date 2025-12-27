"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/src/components/AuthGuard";
import "./timetable.css";

interface Subject {
  id: string;
  name: string;
  preference: string;
  importance: string;
  minHours: number;
}

export default function TimetablePage() {
  const [totalHours, setTotalHours] = useState<number>(0);
  const [subjectCount, setSubjectCount] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const count = Math.max(0, subjectCount);
    if (count !== subjects.length) {
      if (count > subjects.length) {
        const newSubjects = [...subjects];
        for (let i = subjects.length; i < count; i++) {
          newSubjects.push({
            id: crypto.randomUUID(),
            name: "",
            preference: "neutral",
            importance: "medium",
            minHours: 1,
          });
        }
        setSubjects(newSubjects);
      } else {
        setSubjects(subjects.slice(0, count));
      }
    }
  }, [subjectCount]);

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  const handleGenerate = () => {
    console.log({ totalHours, subjects });
  };

  return (
    <AuthGuard>
      <div className="timetable-container">
        <header className="timetable-header">
          <h1>
            Study<span>Plan</span>
          </h1>
          <p>Configure your weekly learning schedule.</p>
        </header>

        <div className="config-section">
          <div className="input-group">
            <label>Weekly Available Hours</label>
            <input
              type="number"
              className="main-input"
              placeholder="e.g. 40"
              value={totalHours || ""}
              onChange={(e) => setTotalHours(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="input-group">
            <label>Number of Subjects</label>
            <input
              type="number"
              className="main-input"
              placeholder="e.g. 6"
              value={subjectCount || ""}
              onChange={(e) => setSubjectCount(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="subjects-section">
          <div className="section-title">
            <span>Subject Details</span>
            {subjects.length > 0 && (
              <span className="subject-count-badge">
                {subjects.length} Subjects
              </span>
            )}
          </div>

          {subjects.length === 0 ? (
            <div className="empty-state">
              <p>Enter the number of subjects above to begin.</p>
            </div>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="subject-card">
                  <div className="field-wrapper">
                    <label>Subject Name</label>
                    <input
                      type="text"
                      className="sub-input"
                      placeholder={`Subject ${index + 1}`}
                      value={subject.name}
                      onChange={(e) =>
                        updateSubject(subject.id, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="field-wrapper">
                    <label>Preference</label>
                    <select
                      className="sub-select"
                      value={subject.preference}
                      onChange={(e) =>
                        updateSubject(subject.id, "preference", e.target.value)
                      }
                    >
                      <option value="love">❤️ Love it</option>
                      <option value="like">👍 Like it</option>
                      <option value="neutral">😐 Neutral</option>
                      <option value="dislike">👎 Dislike it</option>
                      <option value="hate">😡 Hate it</option>
                    </select>
                  </div>

                  <div className="field-wrapper">
                    <label>Importance</label>
                    <select
                      className="sub-select"
                      value={subject.importance}
                      onChange={(e) =>
                        updateSubject(subject.id, "importance", e.target.value)
                      }
                    >
                      <option value="critical">🔥 Critical</option>
                      <option value="high">⚡ High</option>
                      <option value="medium">🔹 Medium</option>
                      <option value="low">💤 Low</option>
                    </select>
                  </div>

                  <div className="field-wrapper">
                    <label>Min Hours</label>
                    <input
                      type="number"
                      className="sub-input"
                      min={1}
                      value={subject.minHours}
                      onChange={(e) =>
                        updateSubject(
                          subject.id,
                          "minHours",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Timetable
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
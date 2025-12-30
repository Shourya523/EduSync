"use client"
import "./HomePage.css";
import { useEffect, useState } from "react";
import {
    CheckCircle,
    LayoutDashboard,
    CalendarRange,
    Coffee,
    ShoppingBag,
    BellRing,
    XCircle,
    BookOpenText,
    FolderHeart
} from "lucide-react";

export default function HomePage() {
    const [fade, setFade] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => setFade(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <section className="hero">
                <div className={`hero-badge fade-up${fade ? ' visible' : ''}`}>Your All-in-One Campus Ecosystem</div>
                <div className={`hero-title fade-up${fade ? ' visible' : ''}`}>
                    Elevate Your University <br /> Experience with EduSync
                </div>
                <p className={`hero-subtext fade-up${fade ? ' visible' : ''}`}>
                    A unified platform for modern students. Manage your academic life with AI-generated timetables, 
                    personalized digital shelves, lecture notes, and seamless campus services from J-Cafe to Essentials.
                </p>
                <div className={`hero-actions fade-up${fade ? ' visible' : ''}`}>
                </div>
            </section>
            
            <section className="features-section">
                <div className="features-container">
                    <div className={`features-content fade-up${fade ? ' visible' : ''}`}>
                        <h2>Intelligent Campus Management</h2>
                        <p>
                            EduSync simplifies the complexities of university life. By integrating 
                            essential tools into one dashboard, we ensure you spend less time 
                            organizing and more time learning.
                        </p>
                        <ul className="features-list">
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                Dynamic Timetable Generation & Updates
                            </li>
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                Centralized Resource Shelf for Notes & Videos
                            </li>
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                Instant Access to J-Cafe & Campus Essentials
                            </li>
                        </ul>
                    </div>
                    <div className={`features-dashboard-home fade-up${fade ? ' visible' : ''}`}>
                        <div className="dashboard-header">
                            <LayoutDashboard size={18} />
                            <span>Student Dashboard Overview</span>
                        </div>
                        <div className="dashboard-metric">
                            <div className="metric-info">
                                <span>Timetable Accuracy</span>
                                <span>100%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: "100%" }}
                                ></div>
                            </div>
                        </div>
                        <div className="dashboard-metric">
                            <div className="metric-info">
                                <span>Shelf Utilization</span>
                                <span>92%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: "92%" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid-features-section">
                <div className="grid-features-header fade-up visible">
                    <h2>Features Built for Your Success</h2>
                    <p>
                        Every tool you need to navigate your degree, from the first lecture 
                        to the final exam.
                    </p>
                </div>
                <div className="features-grid">
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <CalendarRange size={28} className="card-icon" />
                        <h3>Generate Timetable</h3>
                        <p>
                            Instantly create and view conflict-free academic schedules tailored to your course enrollments.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <FolderHeart size={28} className="card-icon" />
                        <h3>My Shelf</h3>
                        <p>
                            A personal digital library to organize your PDF notes, YouTube resources, and study materials.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <BookOpenText size={28} className="card-icon" />
                        <h3>Notes.Co</h3>
                        <p>
                            Access professional lecture summaries and collaborative note-sharing features across all subjects.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Coffee size={28} className="card-icon" />
                        <h3>J-Cafe</h3>
                        <p>
                            Skip the queue. Browse menus and order your campus meals directly through the app.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <ShoppingBag size={28} className="card-icon" />
                        <h3>Campus Essentials</h3>
                        <p>
                            Your go-to marketplace for stationeries, lab gear, and daily university requirements.
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <BellRing size={28} className="card-icon" />
                        <h3>Announcements</h3>
                        <p>
                            Stay informed with real-time updates on class changes, events, and campus news.
                        </p>
                    </div>
                </div>

                <section className="comparison-section">
                    <h2 className="fade-up visible">From Chaos to Clarity</h2>
                    <div className="comparison-container">
                        <div className={`comparison-card problems-card fade-up${fade ? ' visible' : ''}`}>
                            <h3>Disconnected Campus Life</h3>
                            <ul>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Scattered PDFs and YouTube links
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Missing important faculty announcements
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Manual scheduling with paper timetables
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Long wait times at J-Cafe and stores
                                </li>
                            </ul>
                        </div>
                        <div className={`comparison-card solutions-card fade-up${fade ? ' visible' : ''}`}>
                            <h3>The EduSync Advantage</h3>
                            <ul>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Unified "My Shelf" for all study resources
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Centralized real-time announcement feed
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    One-click automated timetable generation
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Integrated digital ordering and shopping
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </section>

            <section className="cta-section">
                <h2 className="fade-up visible">Ready to Simplify Your Campus Life?</h2>
                <p className="fade-up visible">
                    Join thousands of students who have upgraded their academic workflow with EduSync.
                </p>
            </section>
        </>
    );
}
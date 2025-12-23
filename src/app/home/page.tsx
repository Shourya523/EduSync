"use client"
import "./HomePage.css";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    CheckCircle,
    BarChart,
    BrainCircuit,
    CalendarDays,
    Users,
    Clock,
    Shield,
    Zap,
    XCircle
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
                <div className={`hero-badge fade-up${fade ? ' visible' : ''}`}>AI-Powered Academic Scheduling</div>
                <div className={`hero-title fade-up${fade ? ' visible' : ''}`}>
                    Smart Timetables <br /> for Modern Universities
                </div>
                <p className={`hero-subtext fade-up${fade ? ' visible' : ''}`}>
                    Transform campus life with EduSync’s AI-powered ecosystem.
                    Timetables, AI lecture summaries, notes, services, marketplace, and J-Cafe—unified in one platform.
                </p>
                <div className={`hero-actions fade-up${fade ? ' visible' : ''}`}>
                    <button className="btn btn-primary-home" onClick={() => setShowDisclaimer(true)}>
                        Start Free Trial <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-secondary-demo-dashboard" >View Demo Dashboard</button>
                </div>
            </section>
            <section className="features-section">
                <div className="features-container">
                    <div className={`features-content fade-up${fade ? ' visible' : ''}`}>
                        <h2>Intelligent Academic Management</h2>
                        <p>
                            EduSync revolutionizes university scheduling with advanced AI
                            algorithms that understand the complexities of academic
                            environments. Our platform seamlessly integrates with your existing
                            systems to provide real-time optimization and conflict resolution.
                        </p>
                        <ul className="features-list">
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                Automated conflict detection and resolution
                            </li>
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                Real-time faculty workload balancing
                            </li>
                            <li>
                                <CheckCircle size={20} className="feature-icon" />
                                Optimal classroom and resource allocation
                            </li>
                        </ul>
                    </div>
                    <div className={`features-dashboard-home fade-up${fade ? ' visible' : ''}`}>
                        <div className="dashboard-header">
                            <BarChart size={18} />
                            <span>Live Analytics Dashboard</span>
                        </div>
                        <div className="dashboard-metric">
                            <div className="metric-info">
                                <span>Classroom Utilization</span>
                                <span>87%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: "87%" }}
                                ></div>
                            </div>
                        </div>
                        <div className="dashboard-metric">
                            <div className="metric-info">
                                <span>Faculty Satisfaction</span>
                                <span>94%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: "94%" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="grid-features-section">
                <div className="grid-features-header fade-up visible">
                    <h2>Powerful Features for Academic Excellence</h2>
                    <p>
                        Comprehensive tools designed specifically for the unique challenges
                        of university scheduling
                    </p>
                </div>
                <div className="features-grid">
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <BrainCircuit size={28} className="card-icon" />
                        <h3>AI-Powered Optimization</h3>
                        <p>
                            Advanced machine learning algorithms automatically optimize
                            schedules for maximum efficiency
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <CalendarDays size={28} className="card-icon" />
                        <h3>Smart Timetable Generation</h3>
                        <p>
                            Generate conflict-free timetables in minutes, not hours, with
                            intelligent constraint handling
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Users size={28} className="card-icon" />
                        <h3>Faculty Management</h3>
                        <p>
                            Balance workloads, track preferences, and ensure fair distribution
                            of teaching responsibilities
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Clock size={28} className="card-icon" />
                        <h3>Real-Time Updates</h3>
                        <p>
                            Instant notifications and automatic adjustments when changes occur
                            in your schedule
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Shield size={28} className="card-icon" />
                        <h3>Secure & Compliant</h3>
                        <p>
                            Enterprise-grade security with full compliance to educational
                            data protection standards
                        </p>
                    </div>
                    <div className={`feature-card fade-up${fade ? ' visible' : ''}`}>
                        <Zap size={28} className="card-icon" />
                        <h3>Lightning Fast</h3>
                        <p>
                            Process complex scheduling requirements in seconds with our
                            optimized algorithms
                        </p>
                    </div>
                </div>
                <section className="comparison-section">
                    <h2 className="fade-up visible">From Chaos to Clarity</h2>
                    <div className="comparison-container">
                        <div className={`comparison-card problems-card fade-up${fade ? ' visible' : ''}`}>
                            <h3>Traditional Scheduling Problems</h3>
                            <ul>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Manual conflict resolution takes weeks
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Unbalanced faculty workloads
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Poor classroom utilization
                                </li>
                                <li>
                                    <XCircle size={20} className="icon-problem" />
                                    Last-minute schedule changes cause chaos
                                </li>
                            </ul>
                        </div>
                        <div className={`comparison-card solutions-card fade-up${fade ? ' visible' : ''}`}>
                            <h3>EduSync Solutions</h3>
                            <ul>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Automated conflict resolution in minutes
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    AI-balanced faculty workload distribution
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Optimized classroom and resource usage
                                </li>
                                <li>
                                    <CheckCircle size={20} className="icon-solution" />
                                    Real-time adaptation to changes
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </section>
            <section className="cta-section">
                <h2 className="fade-up visible">Ready to Transform Your Scheduling?</h2>
                <p className="fade-up visible">
                    Join hundreds of universities already using EduSync to streamline
                    their academic operations
                </p>
                <div className={`cta-actions fade-up${fade ? ' visible' : ''}`}>
                    <button className="btn btn-cta-primary">
                        Start Your Free Trial <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-cta-secondary">
                        Sign In to Dashboard
                    </button>
                </div>
            </section>
        </>
    );
}
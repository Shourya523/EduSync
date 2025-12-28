"use client";

import { useState, useRef, useEffect } from "react";
import "./essential.css";
import AuthGuard from "@/src/components/AuthGuard";
import { Search, MapPin, BookOpen, Printer, Clock, AlertCircle, FileText, X, CheckCircle, UploadCloud, IndianRupee, QrCode, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

// --- Types ---
type TabType = "Library" | "Print Out";

interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    status: "Available" | "Issued";
    location: string;
}

interface PrintJob {
    id: string;
    name: string;
    size: string;
    pages: number; 
    type: "bw" | "color";
    cost: number;
    status: "queued" | "processing" | "completed";
}

// --- Constants ---
const COST_BW = 5;
const COST_COLOR = 10;

const MOCK_BOOKS: Book[] = [
    { id: "1", title: "Introduction to Algorithms", author: "Cormen", category: "CSE", status: "Available", location: "Row 4, Shelf B" },
    { id: "2", title: "Digital Design", author: "Morris Mano", category: "ECE", status: "Issued", location: "Row 2, Shelf A" },
    { id: "3", title: "Engineering Physics", author: "H.K. Dass", category: "Physics", status: "Available", location: "Row 1, Shelf D" },
    { id: "4", title: "Clean Code", author: "Robert Martin", category: "CSE", status: "Available", location: "Row 4, Shelf C" },
    { id: "5", title: "Microprocessors & Interfacing", author: "Douglas Hall", category: "ECE", status: "Available", location: "Row 2, Shelf B" },
    { id: "6", title: "Organic Chemistry", author: "Morrison & Boyd", category: "Biotech", status: "Issued", location: "Row 6, Shelf A" },
];

export default function CampusEssentials() {
    const [activeTab, setActiveTab] = useState<TabType>("Library");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");

    // Print State
    const [printQueue, setPrintQueue] = useState<PrintJob[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredBooks = MOCK_BOOKS.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === "All" || book.category === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const totalCost = printQueue.reduce((sum, job) => sum + job.cost, 0);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles: PrintJob[] = Array.from(e.target.files).map(file => {
                const mockPages = Math.floor(Math.random() * 15) + 1;
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                    pages: mockPages,
                    type: "bw", 
                    cost: mockPages * COST_BW,
                    status: "queued"
                };
            });
            setPrintQueue(prev => [...prev, ...newFiles]);
            toast.success(`${newFiles.length} file(s) added to queue`);
        }
    };

    const updatePrintType = (id: string, newType: "bw" | "color") => {
        setPrintQueue(prev => prev.map(job => {
            if (job.id === id) {
                if (job.type === newType) return job;
                const newCost = job.pages * (newType === "bw" ? COST_BW : COST_COLOR);
                return { ...job, type: newType, cost: newCost };
            }
            return job;
        }));
    };

    const removeFile = (id: string) => {
        setPrintQueue(printQueue.filter(job => job.id !== id));
        toast.info("File removed");
    };

    const handlePaymentSuccess = () => {
        setIsPrinting(true);
        setShowPaymentModal(false);
        setTimeout(() => {
            setPrintQueue(prev => prev.map(job => ({ ...job, status: "completed" })));
            setIsPrinting(false);
            toast.success("Payment Received! Printing started.");
        }, 2000);
    };

    return (
        <AuthGuard>
            <section className="ce-page-container">
                <header className="ce-header">
                    <h1>Campus<span>Essentials</span></h1>
                    <p>Library resources and printing services at your fingertips.</p>
                </header>

                <nav className="ce-tab-bar">
                    <button 
                        className={`ce-tab-btn ${activeTab === "Library" ? "is-active" : ""}`}
                        onClick={() => setActiveTab("Library")}
                    >
                        <BookOpen size={18} /> Library Search
                    </button>
                    <button 
                        className={`ce-tab-btn ${activeTab === "Print Out" ? "is-active" : ""}`}
                        onClick={() => setActiveTab("Print Out")}
                    >
                        <Printer size={18} /> PrintOut
                    </button>
                </nav>

                <div className="ce-bento-layout">
                    <div className="ce-card ce-main-portal">
                        {activeTab === "Library" ? (
                            <>
                                <span className="ce-badge">Live Catalog</span>
                                <h3>Book Finder</h3>
                                <p>Locate books instantly. Check availability before you walk to the LRC.</p>
                                
                                <div className="ce-input-group">
                                    <input 
                                        type="text" 
                                        className="ce-search-bar" 
                                        placeholder="Search by title, author..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="ce-submit-btn"><Search size={20} /></button>
                                </div>

                                <div className="lib-filters">
                                    {["All", "CSE", "ECE", "Physics", "Biotech"].map(cat => (
                                        <button 
                                            key={cat}
                                            className={`lib-chip ${selectedFilter === cat ? "active" : ""}`}
                                            onClick={() => setSelectedFilter(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="lib-book-list">
                                    {filteredBooks.length > 0 ? (
                                        filteredBooks.map(book => (
                                            <div key={book.id} className="lib-book-item">
                                                <div className="lib-book-info">
                                                    <h4>{book.title}</h4>
                                                    <span>by {book.author}</span>
                                                </div>
                                                <div className="lib-book-meta">
                                                    <span className={`lib-status ${book.status.toLowerCase()}`}>
                                                        {book.status}
                                                    </span>
                                                    <span className="lib-location">
                                                        <MapPin size={12} style={{marginRight:4}} />
                                                        {book.location}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{textAlign:'center', marginTop:'3rem', color: '#999'}}>
                                            <AlertCircle size={40} style={{marginBottom: '10px', opacity: 0.5}} />
                                            <p>No books found matching "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="ce-badge">Smart Printing</span>
                                <h3>Upload & Print</h3>
                                <p>Queue your documents here. <strong>₹5/page (B&W)</strong> • <strong>₹10/page (Color)</strong></p>
                                
                                <div className="print-workspace">
                                    <div 
                                        className="print-upload-zone"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UploadCloud size={48} className="print-icon" />
                                        <span className="print-cta">Click to upload documents</span>
                                        <span className="print-sub">Supports PDF, DOCX (Max 10MB)</span>
                                        <input 
                                            type="file" 
                                            hidden 
                                            ref={fileInputRef} 
                                            multiple 
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileSelect}
                                        />
                                    </div>

                                    {printQueue.length > 0 && (
                                        <div className="print-queue">
                                            <h4>Print Queue ({printQueue.length})</h4>
                                            <div className="queue-list">
                                                {printQueue.map(job => (
                                                    <div 
                                                        key={job.id} 
                                                        className={`queue-item ${job.status} ${job.type}`}
                                                    >
                                                        <div className="queue-info">
                                                            <div className="file-icon-box">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <span className="file-name">{job.name}</span>
                                                                <span className="file-meta">
                                                                    {job.pages} Pages • {job.size}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        {job.status === "completed" ? (
                                                            <span className="status-success"><CheckCircle size={18} /> Printed</span>
                                                        ) : (
                                                            <div className="queue-actions">
                                                                
                                                                {/* --- NEW SLIDER TOGGLE --- */}
                                                                <div 
                                                                    className={`print-toggle-slider ${job.type}`}
                                                                    onClick={() => updatePrintType(job.id, job.type === 'bw' ? 'color' : 'bw')}
                                                                    title="Click to toggle B&W / Color"
                                                                >
                                                                    <div className="toggle-knob">
                                                                        {job.type === 'color' && <Sparkles size={14} strokeWidth={2.5} />}
                                                                    </div>
                                                                    {/* Text changes based on state */}
                                                                    <span className="toggle-text right">Color</span>
                                                                    <span className="toggle-text left">B&W</span>
                                                                </div>
                                                                
                                                                <span className="job-cost">₹{job.cost}</span>
                                                                
                                                                <button 
                                                                    className="remove-queue-btn" 
                                                                    onClick={() => removeFile(job.id)}
                                                                    disabled={isPrinting}
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="print-footer">
                                                <div className="total-cost-display">
                                                    <span>Total to Pay:</span>
                                                    <strong>₹{totalCost}</strong>
                                                </div>
                                                <button 
                                                    className="print-action-btn"
                                                    onClick={() => setShowPaymentModal(true)}
                                                    disabled={isPrinting || printQueue.every(j => j.status === 'completed')}
                                                >
                                                    {isPrinting ? "Processing..." : `Pay ₹${totalCost} & Print`}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="ce-sidebar-col">
                        <div className="ce-card ce-stat-card">
                            <h4>My Account</h4>
                            <div className="stat-row">
                                <span className="stat-label">Library Books</span>
                                <span className="stat-val">2 / 4</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Wallet</span>
                                <span className="stat-val" style={{color: '#15803d'}}>₹120.00</span>
                            </div>
                        </div>

                        <div className="ce-card ce-tip-card">
                            <h4 className="ce-gold-text">Pro-Tip</h4>
                            <p style={{fontSize: '0.9rem', color: '#555', marginTop: '0.5rem'}}>
                                {activeTab === "Library" 
                                    ? "The 3rd-floor quiet zone has the strongest Wi-Fi signal."
                                    : "Color prints are cheaper on Tuesdays! (Not really, just checking if you read this)."}
                            </p>
                        </div>
                    </div>
                </div>

                {showPaymentModal && (
                    <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                        <div className="payment-modal" onClick={e => e.stopPropagation()}>
                            <div className="payment-header">
                                <h3>Secure Payment</h3>
                                <button className="close-modal-btn" onClick={() => setShowPaymentModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="payment-body">
                                <p>Scan to pay for {printQueue.length} document(s)</p>
                                <div className="qr-box">
                                    <QrCode size={180} style={{opacity: 0.1}} /> 
                                    <span className="qr-placeholder-text">Valid for 5:00 min</span>
                                </div>
                                <div className="payment-total">
                                    Total: <span>₹{totalCost}</span>
                                </div>
                            </div>

                            <button className="confirm-pay-btn" onClick={handlePaymentSuccess}>
                                <CheckCircle size={20} />
                                I have Paid
                            </button>
                        </div>
                    </div>
                )}

                <footer className="ce-footer">
                    <p>EduSync Essentials // Making campus life slightly less chaotic.</p>
                </footer>
            </section>
        </AuthGuard>
    );
}
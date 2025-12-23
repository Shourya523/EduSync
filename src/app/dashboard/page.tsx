import './page.css';
export default function DashboardPage() {
  const username = "Shourya"; 

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h1>
          Welcome back, <span>{username}</span>
        </h1>
        <p>Your campus, simplified and synced.</p>
      </div>

      <div className="dashboard-actions">
        <a href="/notes" className="dashboard-card">
          <h3>Notes.Co</h3>
          <p>Access, upload, and organize notes with AI help</p>
        </a>

        <a href="/jcafe" className="dashboard-card">
          <h3>J-Cafe</h3>
          <p>Order food, book slots, and skip queues</p>
        </a>
      </div>
      <div className="copilot-wrapper">
        <div className="copilot-bar">
        <input type="text" placeholder="What's on your mind today?" />
      </div>
      </div>
    </section>
  );
}

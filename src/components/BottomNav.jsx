
export default function BottomNav({ activePage, setActivePage }) {
  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "message", label: "Message", icon: "💌" },
    { id: "counter", label: "Days", icon: "⏳" },
    { id: "notes", label: "Snippets", icon: "❤️" },
    { id: "photos", label: "Photos", icon: "🖼️" },
    { id: "timeline", label: "Yapping", icon: "📜" },
    { id: "extra", label: "Extra", icon: "⭐" },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActivePage(tab.id)}
          className={`bn-item ${activePage === tab.id ? "active" : ""}`}
        >
          <span className="bn-icon">{tab.icon}</span>
          <span className="bn-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

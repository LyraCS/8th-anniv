// src/components/Message.jsx
export default function Message({ text }) {
  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>Message</h2>
      <p style={{ fontSize: 18, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

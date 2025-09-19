import { useState, useEffect } from "react";

export default function Counter({ startDate }) {
  const start = new Date(startDate);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Years together
  let years = now.getFullYear() - start.getFullYear();
  let yearAnniversary = new Date(start);
  yearAnniversary.setFullYear(start.getFullYear() + years);

  if (now < yearAnniversary) {
    years -= 1;
    yearAnniversary.setFullYear(start.getFullYear() + years);
  }

  // Days since last anniversary
  let daysSinceAnniv = Math.floor(
    (now - yearAnniversary) / (1000 * 60 * 60 * 24)
  );

  // Weeks + days
  const weeks = Math.floor(daysSinceAnniv / 7);
  const days = daysSinceAnniv % 7;

  // Time of day diff
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    if (days > 0) {
      daysSinceAnniv -= 1;
    }
  }

  // --- Next Anniversary Countdown ---
  const nextAnniv = new Date(start);
  nextAnniv.setFullYear(yearAnniversary.getFullYear() + 1);

  const diff = nextAnniv - now;
  const cdDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const cdHours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const cdMinutes = Math.floor((diff / (1000 * 60)) % 60);
  const cdSeconds = Math.floor((diff / 1000) % 60);

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Time Spent Together</h2>
      <p style={{ fontSize: 22, fontWeight: "600" }}>
        {years} years, {weeks} weeks, {days} days
      </p>
      <p style={{ fontSize: 22 }}>
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </p>

      <h3 style={{ marginTop: 24 }}>Next Anniversary Countdown</h3>
      <p style={{ fontSize: 20, fontWeight: "500" }}>
        {cdDays} days, {cdHours} hours, {cdMinutes} minutes, {cdSeconds} seconds
      </p>
    </div>
  );
}

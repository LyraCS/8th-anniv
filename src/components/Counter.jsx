import { useState, useEffect } from "react";

export default function Counter({ startDate }) {
  const start = new Date(startDate);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate difference
  let years = now.getFullYear() - start.getFullYear();
  let yearAnniversary = new Date(start);
  yearAnniversary.setFullYear(start.getFullYear() + years);

  // If we haven’t reached the anniversary yet this year, subtract 1 year
  if (now < yearAnniversary) {
    years -= 1;
    yearAnniversary.setFullYear(start.getFullYear() + years);
  }

  // Days since last full anniversary
  let daysSinceAnniv = Math.floor((now - yearAnniversary) / (1000 * 60 * 60 * 24));

  // Break days into weeks + leftover days
  const weeks = Math.floor(daysSinceAnniv / 7);
  const days = daysSinceAnniv % 7;

  // Time of day difference
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  // Borrow if negative
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
    </div>
  );
}

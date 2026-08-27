import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/events";
import "../styles/Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();

        const publishedEvents = Array.isArray(data)
          ? data.filter((event) => event.status !== "DRAFT")
          : [];

        setEvents(publishedEvents);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Unable to load events right now.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date TBA";

    return new Date(date).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    const value = Number(price);

    if (Number.isNaN(value)) {
      return "Price TBA";
    }

    return `KSh ${value.toLocaleString("en-KE")}`;
  };

  return (
    <div className="events-page">
      <section className="events-hero">
        <div>
          <span className="section-label">DISCOVER</span>

          <h1>Find Your Next Experience.</h1>

          <p>
            From live music and sports to festivals, culture and
            business events — find something worth showing up for.
          </p>
        </div>
      </section>

      <section className="events-container">
        <div className="events-header">
          <div>
            <span className="section-label">TIKITIHUB EVENTS</span>
            <h2>All Events</h2>
          </div>

          <span className="event-count">
            {events.length} events
          </span>
        </div>

        {loading && (
          <div className="events-state">
            <div className="loader"></div>
            <p>Finding events for you...</p>
          </div>
        )}

        {error && !loading && (
          <div className="events-state error-state">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="events-state">
            <h3>No events available</h3>
            <p>
              There are currently no published events.
              Check back soon.
            </p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="events-grid">
            {events.map((event, index) => (
              <article className="event-card-page" key={event.id}>
                <div className={`event-cover event-cover-${(index % 4) + 1}`}>
                  <span className="event-type">EVENT</span>

                  <div className="event-cover-icon">
                    🎟
                  </div>
                </div>

                <div className="event-card-content">
                  <span className="event-date">
                    {formatDate(event.start_datetime)}
                  </span>

                  <h3>{event.title}</h3>

                  <p>
                    {event.description ||
                      "Experience an unforgettable event with TikitiHub."}
                  </p>

                  <div className="event-meta">
                    <span>📍 Kenya</span>
                    <span>👥 {event.capacity} capacity</span>
                  </div>

                  <div className="event-card-footer">
                    <div>
                      <small>FROM</small>
                      <strong>
                        {formatPrice(event.ticket_price)}
                      </strong>
                    </div>

                    <Link
                      to={`/events/${event.id}`}
                      className="event-view-btn"
                    >
                      View Event →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Events;
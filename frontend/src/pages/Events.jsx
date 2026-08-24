import { useEffect, useState } from "react";
import { getEvents } from "../services/events";
import "./Events.css";
import { Link } from "react-router-dom";

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
        setError("Unable to load events. Please try again.");
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
          <span className="section-label">
            DISCOVER
          </span>

          <h1>
            Find Your Next
            <br />
            <span>Experience.</span>
          </h1>

          <p>
            Discover concerts, sports, festivals,
            culture and unforgettable experiences
            happening across Kenya.
          </p>
        </div>
      </section>

      <section className="all-events-section">
        <div className="events-page-heading">
          <div>
            <span className="section-label">
              TIKITIHUB EVENTS
            </span>

            <h2>
              Upcoming Events
            </h2>
          </div>

          <span className="event-count">
            {events.length} Events
          </span>
        </div>

        {loading && (
          <div className="events-state">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        )}

        {error && !loading && (
          <div className="events-state error">
            <p>{error}</p>

            <button
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="events-state">
              <div className="empty-icon">
                🎟
              </div>

              <h3>
                No upcoming events
              </h3>

              <p>
                There are no published events available
                right now. Check back soon.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          events.length > 0 && (
            <div className="events-page-grid">
              {events.map((event) => (
                <article
                  className="large-event-card"
                  key={event.id}
                >
                  <div className="large-event-image">
                    {event.banner_image ? (
                      <img
                        src={event.banner_image}
                        alt={event.title}
                      />
                    ) : (
                      <div className="event-image-placeholder">
                        <span>🎟</span>
                        <small>
                          TIKITIHUB EVENT
                        </small>
                      </div>
                    )}

                    <span className="event-type">
                      EVENT
                    </span>
                  </div>

                  <div className="large-event-body">
                    <p className="event-date">
                      {formatDate(
                        event.start_datetime
                      )}
                    </p>

                    <h3>
                      {event.title}
                    </h3>

                    <p className="event-description">
                      {event.description ||
                        "Experience an unforgettable event."}
                    </p>

                    <div className="large-event-meta">
                      <span>
                        📍 Kenya
                      </span>

                      <span>
                        👥 {event.capacity} capacity
                      </span>
                    </div>

                    <div className="large-event-footer">
                      <div>
                        <small>
                          FROM
                        </small>

                        <strong>
                          {formatPrice(
                            event.ticket_price
                          )}
                        </strong>
                      </div>

                      <Link
                      to={`/events/${event.id}`}
                      className="view-event-button"
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
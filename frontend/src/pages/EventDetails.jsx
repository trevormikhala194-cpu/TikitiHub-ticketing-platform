import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./EventDetails.css";

import { getEvent } from "../services/events";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEvent(id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event:", err);
        setError("Unable to load this event right now.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Date TBA";

    return new Date(date).toLocaleDateString("en-KE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "Time TBA";

    return new Date(date).toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return "Price TBA";
    }

    return `KSh ${numericPrice.toLocaleString("en-KE")}`;
  };

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="event-details-message">
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-page">
        <div className="event-details-message error">
          <h2>Event not found</h2>
          <p>{error || "This event could not be found."}</p>

          <Link to="/events" className="back-button">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-page">

      {/* Back navigation */}
      <div className="event-details-container">
        <Link to="/events" className="back-link">
          ← Back to Events
        </Link>
      </div>

      {/* Event Hero */}
      <section className="event-details-hero">
        <div className="event-details-container">

          <div className="event-banner">
            {event.banner_image ? (
              <img
                src={event.banner_image}
                alt={event.title}
              />
            ) : (
              <div className="event-banner-placeholder">
                <span>🎟</span>
                <p>TIKITIHUB EVENT</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Event Information */}
      <main className="event-details-container">
        <section className="event-information">

          <div className="event-main-content">

            <span className="event-details-label">
              TIKITIHUB EVENT
            </span>

            <h1>{event.title}</h1>

            <p className="event-description">
              {event.description ||
                "Experience an unforgettable event with TikitiHub."}
            </p>

            <div className="event-meta-grid">

              <div className="event-meta-card">
                <span className="meta-icon">📅</span>

                <div>
                  <small>DATE</small>
                  <strong>
                    {formatDate(event.start_datetime)}
                  </strong>
                </div>
              </div>

              <div className="event-meta-card">
                <span className="meta-icon">⏰</span>

                <div>
                  <small>TIME</small>
                  <strong>
                    {formatTime(event.start_datetime)}
                  </strong>
                </div>
              </div>

              <div className="event-meta-card">
                <span className="meta-icon">📍</span>

                <div>
                  <small>LOCATION</small>
                  <strong>
                    Kenya
                  </strong>
                </div>
              </div>

              <div className="event-meta-card">
                <span className="meta-icon">🎟</span>

                <div>
                  <small>CAPACITY</small>
                  <strong>
                    {event.capacity?.toLocaleString("en-KE") ||
                      "TBA"}
                  </strong>
                </div>
              </div>

            </div>

          </div>

          {/* Ticket Card */}
          <aside className="ticket-purchase-card">

            <span className="ticket-card-label">
              TICKET
            </span>

            <h2>
              {formatPrice(event.ticket_price)}
            </h2>

            <p>
              per ticket
            </p>

            <div className="ticket-card-divider" />

            <div className="ticket-status">
              <span
                className={`status-dot ${
                  event.status === "PUBLISHED"
                    ? "active"
                    : ""
                }`}
              />

              <span>
                {event.status === "PUBLISHED"
                  ? "Tickets available"
                  : "Tickets unavailable"}
              </span>
            </div>

            {event.status === "PUBLISHED" ? (
            <Link
             to={`/events/${event.id}/book`}
             className="book-ticket-button"
              >
              Get Your Ticket →
             </Link>
             ) : (
             <button
              className="book-ticket-button"
              disabled
              >
              Not Available
             </button>
              )}

            <small className="secure-note">
              🔒 Secure booking with TikitiHub
            </small>

          </aside>

        </section>

        {/* Organizer */}
        <section className="organizer-section">

          <span className="event-details-label">
            ORGANIZED BY
          </span>

          <h2>
            {event.organizer || "TikitiHub Organizer"}
          </h2>

          <p>
            This event is proudly listed on TikitiHub.
          </p>

        </section>

      </main>

    </div>
  );
}

export default EventDetails;
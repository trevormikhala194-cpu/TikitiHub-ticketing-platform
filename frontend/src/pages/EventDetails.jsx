import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";

const API_URL = "http://127.0.0.1:8000/api";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/events/${id}/`
        );

        setEvent(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this event.");
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
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "Time TBA";

    return new Date(date).toLocaleTimeString("en-KE", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    const value = Number(price);

    if (Number.isNaN(value)) {
      return "Price TBA";
    }

    return `KSh ${value.toLocaleString("en-KE")}`;
  };

  if (loading) {
    return (
      <div className="event-details-state">
        <div className="loading-spinner"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-state">
        <div className="empty-icon">🎟</div>

        <h2>Event not found</h2>

        <p>
          {error ||
            "The event you are looking for does not exist."}
        </p>

        <Link to="/events" className="back-button">
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="event-details-page">

      {/* Hero Image */}
      <section className="event-details-hero">
        {event.banner_image ? (
          <img
            src={event.banner_image}
            alt={event.title}
          />
        ) : (
          <div className="event-details-placeholder">
            <span>🎟</span>
            <p>TIKITIHUB</p>
          </div>
        )}

        <div className="hero-overlay"></div>

        <Link
          to="/events"
          className="back-link"
        >
          ← All Events
        </Link>
      </section>

      {/* Main Content */}
      <main className="event-details-content">

        <div className="event-details-main">

          <span className="event-details-label">
            TIKITIHUB EVENT
          </span>

          <h1>{event.title}</h1>

          <p className="event-description-large">
            {event.description ||
              "Get ready for an unforgettable experience."}
          </p>

          <div className="event-information">

            <div className="information-item">
              <span className="information-icon">
                📅
              </span>

              <div>
                <small>DATE</small>
                <strong>
                  {formatDate(event.start_datetime)}
                </strong>
              </div>
            </div>

            <div className="information-item">
              <span className="information-icon">
                🕐
              </span>

              <div>
                <small>TIME</small>
                <strong>
                  {formatTime(event.start_datetime)}
                </strong>
              </div>
            </div>

            <div className="information-item">
              <span className="information-icon">
                📍
              </span>

              <div>
                <small>VENUE</small>
                <strong>
                  Venue #{event.venue}
                </strong>
              </div>
            </div>

          </div>

          <div className="event-about">
            <h2>About this event</h2>

            <p>
              {event.description ||
                "More information about this event will be available soon."}
            </p>
          </div>

        </div>

        {/* Ticket Card */}
        <aside className="ticket-purchase-card">

          <span className="ticket-card-label">
            YOUR TICKET
          </span>

          <h2>
            Ready to experience
            <br />
            <span>{event.title}?</span>
          </h2>

          <div className="ticket-price">
            <small>FROM</small>

            <strong>
              {formatPrice(event.ticket_price)}
            </strong>
          </div>

          <div className="ticket-capacity">
            <span>🎟 Available tickets</span>
            <strong>
              {event.capacity?.toLocaleString() || "N/A"}
            </strong>
          </div>

          <button className="get-ticket-button">
            Get Your Ticket →
          </button>

          <p className="secure-note">
            🔒 Secure booking through TikitiHub
          </p>

        </aside>

      </main>
    </div>
  );
}

export default EventDetails;
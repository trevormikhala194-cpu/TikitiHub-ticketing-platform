import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getEvent } from "../services/events";
import { createBooking } from "../services/bookings";
import { isAuthenticated } from "../utils/auth";

import "./Booking.css";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const formatPrice = (price) => {
    const value = Number(price);

    if (Number.isNaN(value)) {
      return "KSh 0";
    }

    return `KSh ${value.toLocaleString("en-KE")}`;
  };

  const ticketPrice = Number(event?.ticket_price || 0);

  const totalAmount = ticketPrice * quantity;

  const increaseQuantity = () => {
    if (quantity < 20) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    if (!isAuthenticated()) {
      navigate("/login", {
        state: {
          from: `/events/${id}/book`,
        },
      });

      return;
    }

    if (!event || event.status !== "PUBLISHED") {
      setError(
        "Tickets are currently unavailable for this event."
      );

      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
        event: event.id,
        quantity,
      });

      setSuccess(
        "Booking created successfully."
      );

      setTimeout(() => {
        navigate("/events");
      }, 1500);
    } catch (err) {
      console.error("Booking failed:", err);

      const responseError =
        err?.response?.data?.quantity ||
        err?.response?.data?.event ||
        err?.response?.data?.detail;

      setError(
        responseError ||
          "Unable to complete your booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="booking-message">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="booking-page">
        <div className="booking-message error">
          <h2>Unable to load event</h2>

          <p>{error}</p>

          <Link
            to="/events"
            className="booking-back-button"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">

      <div className="booking-container">

        <Link
          to={`/events/${id}`}
          className="booking-back-link"
        >
          ← Back to Event
        </Link>

        <div className="booking-layout">

          {/* EVENT INFORMATION */}

          <section className="booking-event-card">

            <div className="booking-event-image">
              {event.banner_image ? (
                <img
                  src={event.banner_image}
                  alt={event.title}
                />
              ) : (
                <span>🎟</span>
              )}
            </div>

            <div className="booking-event-content">

              <span className="section-label">
                TIKITIHUB EVENT
              </span>

              <h1>{event.title}</h1>

              <p>
                {event.description ||
                  "Experience an unforgettable event."}
              </p>

              <div className="booking-event-details">

                <div>
                  <span>📅</span>
                  <div>
                    <small>DATE</small>
                    <strong>
                      {new Date(
                        event.start_datetime
                      ).toLocaleDateString(
                        "en-KE",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>📍</span>
                  <div>
                    <small>LOCATION</small>
                    <strong>Kenya</strong>
                  </div>
                </div>

              </div>

            </div>

          </section>

          {/* BOOKING CARD */}

          <aside className="booking-card">

            <span className="section-label">
              RESERVE YOUR TICKET
            </span>

            <h2>
              {formatPrice(ticketPrice)}
            </h2>

            <p className="booking-price-label">
              per ticket
            </p>

            <div className="booking-divider" />

            <div className="quantity-section">

              <label>
                Number of tickets
              </label>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= 20}
                >
                  +
                </button>

              </div>

            </div>

            <div className="booking-summary">

              <div>
                <span>Ticket price</span>

                <strong>
                  {formatPrice(ticketPrice)}
                </strong>
              </div>

              <div>
                <span>Quantity</span>

                <strong>
                  {quantity}
                </strong>
              </div>

              <div className="booking-total">

                <span>Total</span>

                <strong>
                  {formatPrice(totalAmount)}
                </strong>

              </div>

            </div>

            {error && (
              <div className="booking-alert error">
                {error}
              </div>
            )}

            {success && (
              <div className="booking-alert success">
                {success}
              </div>
            )}

            <button
              className="confirm-booking-button"
              onClick={handleBooking}
              disabled={
                submitting ||
                event.status !== "PUBLISHED"
              }
            >
              {submitting
                ? "Processing..."
                : "Confirm Booking →"}
            </button>

            <small className="secure-note">
              🔒 Secure booking with TikitiHub
            </small>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Booking;
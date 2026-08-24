import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

import { getEvents } from "./services/events";
import EventDetails from "./pages/EventDetails";

function Home() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();

        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load events:", error);
        setEventsError("Unable to load events right now.");
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  const categories = [
    {
      icon: "🎵",
      title: "Music",
      description: "Concerts, festivals & live performances",
    },
    {
      icon: "⚽",
      title: "Sports",
      description: "Football, athletics & sporting events",
    },
    {
      icon: "🎭",
      title: "Arts & Culture",
      description: "Theatre, comedy & cultural experiences",
    },
    {
      icon: "💼",
      title: "Business",
      description: "Conferences, expos & networking",
    },
  ];

  const publishedEvents = events.filter(
    (event) => event.status !== "DRAFT"
  );

  const formatEventDate = (date) => {
    if (!date) {
      return "DATE TBA";
    }

    return new Date(date).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return "Price TBA";
    }

    return `KSh ${numericPrice.toLocaleString("en-KE")}`;
  };

  return (
    <div className="app">

      {/* =========================
          NAVIGATION
      ========================== */}

      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">🎟</span>

          <span>
            Tikiti<span>Hub</span>
          </span>
        </Link>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <button className="login-btn">
            Login
          </button>

          <button className="signup-btn">
            Get Started
          </button>
        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main>

        {/* =========================
            HERO SECTION
        ========================== */}

        <section
          className="hero-section"
          id="home"
        >
          <div className="hero-content">

            <div className="hero-badge">
              ✦ Kenya&apos;s Event Ticketing Platform
            </div>

            <h1>
              Experience More.
              <br />
              <span>Book Your Moment.</span>
            </h1>

            <p>
              Discover the hottest events happening across Kenya.
              Find your event, secure your ticket and make memories
              that last.
            </p>

            <div className="hero-actions">
              <a
                href="#events"
                className="primary-btn"
              >
                Explore Events →
              </a>

              <a
                href="#about"
                className="secondary-btn"
              >
                How it works
              </a>
            </div>

            <div className="hero-stats">

              <div>
                <strong>
                  {events.length > 0
                    ? `${events.length}+`
                    : "500+"}
                </strong>

                <span>
                  Events
                </span>
              </div>

              <div>
                <strong>
                  50K+
                </strong>

                <span>
                  Tickets Sold
                </span>
              </div>

              <div>
                <strong>
                  20K+
                </strong>

                <span>
                  Happy Users
                </span>
              </div>

            </div>
          </div>

          {/* HERO TICKET */}

          <div className="hero-visual">
            <div className="ticket-card">

              <div className="ticket-top">
                <span>
                  LIVE EVENT
                </span>

                <span>
                  🎟
                </span>
              </div>

              <div className="ticket-image">
                <div className="music-icon">
                  ♪
                </div>
              </div>

              <div className="ticket-info">

                <p className="ticket-label">
                  UPCOMING EVENT
                </p>

                <h3>
                  {publishedEvents[0]?.title ||
                    "Discover Amazing Events"}
                </h3>

                <div className="ticket-details">

                  <span>
                    📅{" "}
                    {publishedEvents[0]
                      ? formatEventDate(
                          publishedEvents[0].start_datetime
                        )
                      : "COMING SOON"}
                  </span>

                  <span>
                    📍 Kenya
                  </span>

                </div>
              </div>

              <div className="ticket-footer">

                <div>
                  <small>
                    FROM
                  </small>

                  <strong>
                    {publishedEvents[0]
                      ? formatPrice(
                          publishedEvents[0].ticket_price
                        )
                      : "KSh 0"}
                  </strong>
                </div>

                {publishedEvents[0] ? (
                  <Link
                    to={`/events/${publishedEvents[0].id}`}
                    className="ticket-button"
                  >
                    Get Ticket
                  </Link>
                ) : (
                  <a
                    href="#events"
                    className="ticket-button"
                  >
                    Explore
                  </a>
                )}

              </div>

            </div>
          </div>
        </section>

        {/* =========================
            EVENTS SECTION
        ========================== */}

        <section
          className="events-section"
          id="events"
        >
          <div className="section-heading">

            <div>
              <span className="section-label">
                DISCOVER
              </span>

              <h2>
                Popular Events
              </h2>
            </div>

            <button className="view-all">
              View all →
            </button>

          </div>

          <div className="event-grid">

            {/* LOADING */}

            {loadingEvents && (
              <p className="events-message">
                Loading events...
              </p>
            )}

            {/* ERROR */}

            {eventsError && (
              <p className="events-message error">
                {eventsError}
              </p>
            )}

            {/* EMPTY */}

            {!loadingEvents &&
              !eventsError &&
              publishedEvents.length === 0 && (
                <p className="events-message">
                  No events available at the moment.
                </p>
              )}

            {/* EVENTS */}

            {!loadingEvents &&
              !eventsError &&
              publishedEvents
                .slice(0, 3)
                .map((event, index) => (

                  <article
                    className="event-card"
                    key={event.id}
                  >

                    <div
                      className={`event-image event-${
                        (index % 3) + 1
                      }`}
                    >
                      <span>
                        EVENT
                      </span>
                    </div>

                    <div className="event-body">

                      <p className="event-date">
                        {formatEventDate(
                          event.start_datetime
                        )}{" "}
                        • KENYA
                      </p>

                      <h3>
                        {event.title}
                      </h3>

                      <p>
                        {event.description ||
                          "Experience an unforgettable event."}
                      </p>

                      <div className="event-bottom">

                        <strong>
                          From{" "}
                          {formatPrice(
                            event.ticket_price
                          )}
                        </strong>

                        <Link
                          to={`/events/${event.id}`}
                          className="view-event-button"
                        >
                          View →
                        </Link>

                      </div>

                    </div>
                  </article>

                ))}

          </div>
        </section>

        {/* =========================
            CATEGORIES
        ========================== */}

        <section
          className="categories-section"
          id="categories"
        >
          <div className="section-heading">

            <div>
              <span className="section-label">
                EXPLORE
              </span>

              <h2>
                Find Your Vibe
              </h2>
            </div>

          </div>

          <div className="category-grid">

            {categories.map((category) => (

              <article
                className="category-card"
                key={category.title}
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <h3>
                  {category.title}
                </h3>

                <p>
                  {category.description}
                </p>

                <button>
                  Explore →
                </button>

              </article>

            ))}

          </div>
        </section>

        {/* =========================
            ABOUT
        ========================== */}

        <section
          className="about-section"
          id="about"
        >
          <div className="about-content">

            <span className="section-label">
              ABOUT TIKITIHUB
            </span>

            <h2>
              Your gateway to
              <br />
              unforgettable experiences.
            </h2>

            <p>
              TikitiHub makes discovering and booking
              events across Kenya simple, secure and
              convenient. Whether you&apos;re looking for
              music, sports, culture or business events,
              we help you get there.
            </p>

            <a
              href="#events"
              className="primary-btn"
            >
              Explore Events →
            </a>

          </div>

          <div className="about-stats">

            <div>
              <strong>
                {events.length > 0
                  ? `${events.length}+`
                  : "500+"}
              </strong>

              <span>
                Events
              </span>
            </div>

            <div>
              <strong>
                50K+
              </strong>

              <span>
                Tickets
              </span>
            </div>

            <div>
              <strong>
                20K+
              </strong>

              <span>
                Users
              </span>
            </div>

            <div>
              <strong>
                47
              </strong>

              <span>
                Counties
              </span>
            </div>

          </div>
        </section>

        {/* =========================
            CTA
        ========================== */}

        <section className="cta-section">

          <div>

            <span>
              READY FOR YOUR NEXT EXPERIENCE?
            </span>

            <h2>
              Don&apos;t miss the vibe.
              Pull up.
              <br />
              Make plans. Grab tickets
              and make memories.
            </h2>

          </div>

          <a
            href="#events"
            className="primary-btn"
          >
            Find an Event →
          </a>

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================== */}

      <footer>

        <Link
          to="/"
          className="footer-logo"
        >
          🎟 Tikiti<span>Hub</span>
        </Link>

        <p>
          Your gateway to unforgettable experiences
          across Kenya. Discover Kenya&apos;s hottest
          events, grab your ticket, and show up for
          the moments that matter.
        </p>

        <div className="footer-links">

          <a href="#events">
            Events
          </a>

          <a href="#about">
            About
          </a>

          <a href="#contact">
            Contact
          </a>

          <a href="#privacy">
            Privacy
          </a>

        </div>

        <p className="copyright">
          © 2026 TikitiHub. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;
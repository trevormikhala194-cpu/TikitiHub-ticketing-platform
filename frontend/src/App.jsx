import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { getEvents } from "./services/events";
import { useAuth } from "./context/AuthContext";

import "./App.css";

function Home() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        setEventsError("");

        const data = await getEvents();

        setEvents(
          Array.isArray(data)
            ? data
            : data?.results || []
        );
      } catch (error) {
        console.error(
          "Failed to load events:",
          error
        );

        setEventsError(
          "We couldn't load events right now. Please try again."
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    {
      icon: "🎵",
      title: "Music",
      description:
        "Concerts, festivals & live performances",
    },
    {
      icon: "⚽",
      title: "Sports",
      description:
        "Football, athletics & sporting events",
    },
    {
      icon: "🎭",
      title: "Arts & Culture",
      description:
        "Theatre, comedy & cultural experiences",
    },
    {
      icon: "💼",
      title: "Business",
      description:
        "Conferences, expos & networking",
    },
  ];

  // =====================================================
  // PUBLIC EVENTS
  // =====================================================

  const publishedEvents = events.filter(
    (event) => event.status !== "DRAFT"
  );

  const featuredEvent = publishedEvents[0];

  // =====================================================
  // FORMATTERS
  // =====================================================

  const formatEventDate = (date) => {
    if (!date) {
      return "DATE TBA";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "DATE TBA";
    }

    return parsedDate.toLocaleDateString(
      "en-KE",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatEventTime = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      "en-KE",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return "Price TBA";
    }

    return `KSh ${numericPrice.toLocaleString(
      "en-KE"
    )}`;
  };

  const getEventLocation = (event) => {
    if (event?.venue_name) {
      return event.venue_name;
    }

    if (event?.venue?.name) {
      return event.venue.name;
    }

    return "Kenya";
  };

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (!user) {
      return "";
    }

    if (user.first_name) {
      return user.first_name;
    }

    if (user.username) {
      return user.username;
    }

    if (user.email) {
      return user.email.split("@")[0];
    }

    return "Account";
  };

  // =====================================================
  // MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="app">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <header className="navbar">
        <div className="navbar-inner">

          {/* LOGO */}

          <Link
            to="/"
            className="logo"
            onClick={closeMobileMenu}
          >
            <span className="logo-icon">
              🎟
            </span>

            <span className="logo-text">
              Tikiti<span>Hub</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="nav-links">
            <a href="#home">
              Home
            </a>

            <Link to="/events">
              Events
            </Link>

            <a href="#categories">
              Categories
            </a>

            <a href="#about">
              About
            </a>
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="nav-actions">

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="login-btn"
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  {getUserDisplayName()}
                </button>

                <button
                  type="button"
                  className="signup-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="login-btn"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login
                </button>

                <button
                  type="button"
                  className="signup-btn"
                  onClick={() =>
                    navigate("/register")
                  }
                >
                  Get Started
                </button>
              </>
            )}

          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        {mobileMenuOpen && (
          <div className="mobile-menu">

            <a
              href="#home"
              onClick={closeMobileMenu}
            >
              Home
            </a>

            <Link
              to="/events"
              onClick={closeMobileMenu}
            >
              Events
            </Link>

            <a
              href="#categories"
              onClick={closeMobileMenu}
            >
              Categories
            </a>

            <a
              href="#about"
              onClick={closeMobileMenu}
            >
              About
            </a>

            <div className="mobile-menu-actions">

              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    className="login-btn"
                    onClick={() => {
                      closeMobileMenu();
                      navigate("/profile");
                    }}
                  >
                    {getUserDisplayName()}
                  </button>

                  <button
                    type="button"
                    className="signup-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="login-btn"
                    onClick={() => {
                      closeMobileMenu();
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="signup-btn"
                    onClick={() => {
                      closeMobileMenu();
                      navigate("/register");
                    }}
                  >
                    Get Started
                  </button>
                </>
              )}

            </div>

          </div>
        )}

      </header>

      <main>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="hero-section"
          id="home"
        >

          <div className="hero-content">

            <div className="hero-badge">
              <span>✦</span>
              Kenya&apos;s Event Ticketing Platform
            </div>

            <h1>
              Experience More.
              <br />
              <span>
                Book Your Moment.
              </span>
            </h1>

            <p>
              Discover the hottest events
              happening across Kenya. Find your
              event, secure your ticket and make
              memories that last.
            </p>

            <div className="hero-actions">

              <Link
                to="/events"
                className="primary-btn"
              >
                Explore Events →
              </Link>

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

          {/* =====================================================
              FEATURED TICKET
          ====================================================== */}

          <div className="hero-visual">

            <div className="ticket-card">

              <div className="ticket-top">

                <span>
                  FEATURED EVENT
                </span>

                <span>
                  🎟
                </span>

              </div>

              <div className="ticket-image">

                {featuredEvent?.banner_image ? (
                  <img
                    src={
                      featuredEvent.banner_image
                    }
                    alt={
                      featuredEvent.title
                    }
                  />
                ) : (
                  <div className="music-icon">
                    ♪
                  </div>
                )}

              </div>

              <div className="ticket-info">

                <p className="ticket-label">
                  UPCOMING EVENT
                </p>

                <h3>
                  {featuredEvent?.title ||
                    "Discover Amazing Events"}
                </h3>

                <div className="ticket-details">

                  <span>
                    📅{" "}
                    {featuredEvent
                      ? formatEventDate(
                          featuredEvent.start_datetime
                        )
                      : "COMING SOON"}
                  </span>

                  <span>
                    📍{" "}
                    {featuredEvent
                      ? getEventLocation(
                          featuredEvent
                        )
                      : "Kenya"}
                  </span>

                </div>

              </div>

              <div className="ticket-footer">

                <div>

                  <small>
                    FROM
                  </small>

                  <strong>
                    {featuredEvent
                      ? formatPrice(
                          featuredEvent.ticket_price
                        )
                      : "KSh 0"}
                  </strong>

                </div>

                {featuredEvent ? (
                  <Link
                    to={`/events/${featuredEvent.id}`}
                    className="ticket-button"
                  >
                    Get Ticket
                  </Link>
                ) : (
                  <Link
                    to="/events"
                    className="ticket-button"
                  >
                    Explore
                  </Link>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            EVENTS
        ====================================================== */}

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

            <Link
              to="/events"
              className="view-all"
            >
              View all →
            </Link>

          </div>

          <div className="event-grid">

            {/* LOADING */}

            {loadingEvents && (
              <>
                {[1, 2, 3].map(
                  (item) => (
                    <article
                      className="event-card event-card-skeleton"
                      key={item}
                    >
                      <div className="event-image skeleton"></div>

                      <div className="event-body">

                        <div className="skeleton-line small"></div>

                        <div className="skeleton-line"></div>

                        <div className="skeleton-line medium"></div>

                      </div>

                    </article>
                  )
                )}
              </>
            )}

            {/* ERROR */}

            {!loadingEvents &&
              eventsError && (
                <div className="events-message error">

                  <strong>
                    Something went wrong.
                  </strong>

                  <p>
                    {eventsError}
                  </p>

                </div>
              )}

            {/* EMPTY */}

            {!loadingEvents &&
              !eventsError &&
              publishedEvents.length ===
                0 && (
                <div className="events-message">

                  <strong>
                    No events available yet.
                  </strong>

                  <p>
                    Check back soon for exciting
                    events across Kenya.
                  </p>

                </div>
              )}

            {/* EVENTS */}

            {!loadingEvents &&
              !eventsError &&
              publishedEvents
                .slice(0, 3)
                .map(
                  (event, index) => (
                    <article
                      className="event-card"
                      key={event.id}
                    >

                      <div
                        className={`event-image event-${
                          (index % 3) + 1
                        }`}
                      >

                        {event.banner_image ? (
                          <img
                            src={
                              event.banner_image
                            }
                            alt={
                              event.title
                            }
                          />
                        ) : (
                          <span>
                            EVENT
                          </span>
                        )}

                      </div>

                      <div className="event-body">

                        <p className="event-date">

                          {formatEventDate(
                            event.start_datetime
                          )}

                          {" • "}

                          {formatEventTime(
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
                  )
                )}

          </div>

        </section>

        {/* =====================================================
            CATEGORIES
        ====================================================== */}

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

            {categories.map(
              (category) => (
                <button
                  type="button"
                  className="category-card"
                  key={category.title}
                  onClick={() =>
                    navigate(
                      `/events?category=${encodeURIComponent(
                        category.title
                      )}`
                    )
                  }
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

                  <span>
                    Explore →
                  </span>

                </button>
              )
            )}

          </div>

        </section>

        {/* =====================================================
            ABOUT
        ====================================================== */}

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
              TikitiHub makes discovering and
              booking events across Kenya simple,
              secure and convenient. Whether
              you&apos;re looking for music, sports,
              culture or business events, we help
              you get there.
            </p>

            <Link
              to="/events"
              className="primary-btn"
            >
              Explore Events →
            </Link>

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

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="cta-section">

          <div>

            <span>
              READY FOR YOUR NEXT EXPERIENCE?
            </span>

            <h2>
              Don&apos;t miss the vibe.
              <br />
              Pull up. Make plans.
              <br />
              Grab your tickets.
            </h2>

          </div>

          <Link
            to="/events"
            className="primary-btn"
          >
            Find an Event →
          </Link>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer>

        <div className="footer-main">

          <Link
            to="/"
            className="footer-logo"
          >
            🎟 Tikiti<span>Hub</span>
          </Link>

          <p>
            Your gateway to unforgettable
            experiences across Kenya. Discover
            Kenya&apos;s hottest events, grab your
            ticket, and show up for the moments
            that matter.
          </p>

        </div>

        <div className="footer-links">

          <Link to="/events">
            Events
          </Link>

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
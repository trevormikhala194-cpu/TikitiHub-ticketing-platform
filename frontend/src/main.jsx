import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./App";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider } from "./context/AuthContext";

import "./index.css";


createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* =========================
              PUBLIC PAGES
          ========================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />


          {/* =========================
              BOOKING
          ========================== */}

          <Route
            path="/events/:id/book"
            element={<Booking />}
          />


          {/* =========================
              AUTHENTICATION
          ========================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =========================
              FALLBACK
          ========================== */}

          <Route
            path="*"
            element={<Home />}
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>

  </StrictMode>
);
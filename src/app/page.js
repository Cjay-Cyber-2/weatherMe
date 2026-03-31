"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import CloudIcon from "@/components/CloudIcon";
import { LOCATION_OPTIONS } from "@/lib/locationOptions";
import { WEATHER_STORAGE_KEY } from "@/store";
import {
  fetchWeather,
  clearError,
  resetWeatherState,
} from "@/store/weatherSlice";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState(LOCATION_OPTIONS[0].query);
  const { currentWeather, loading, error } = useSelector((state) => state.weather);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="container text-center mt-2">Loading session...</div>;
  }

  if (!session) {
    return null;
  }

  const handleSearch = () => {
    dispatch(fetchWeather(selectedCity));
  };

  const handleLogout = () => {
    dispatch(resetWeatherState());
    window.localStorage.removeItem(WEATHER_STORAGE_KEY);
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div>
      <nav className="navbar">
        <h1 className="brand logo-font" style={{ display: "flex", alignItems: "center" }}>
          <CloudIcon size={54} alt="WeatherMEE animated cloud" className="brand-icon" priority />
          WeatherMEE
        </h1>
        <div className="nav-links">
          <span>
            Welcome, <b>{session.user?.name || "User"}</b>
          </span>
          <Link href="/history" className="btn btn-secondary">
            Weather History
          </Link>
          <button onClick={handleLogout} className="btn danger-btn">
            Log Out
          </button>
        </div>
      </nav>

      <div className="container mt-2">
        <div className="card">
          <h2
            style={{
              color: "var(--primary-color)",
              display: "flex",
              alignItems: "center",
            }}
          >
            Check The Weather
          </h2>
          <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
            Select a location below to receive the latest weather information.
          </p>

          {error && (
            <div
              style={{
                backgroundColor: "#fff2f0",
                color: "#ff4d4f",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "1rem",
                border: "1px solid #ffccc7",
              }}
            >
              <strong>Error fetching weather: </strong>
              {error}
              <button
                onClick={() => dispatch(clearError())}
                style={{
                  float: "right",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ff4d4f",
                }}
              >
                Close
              </button>
            </div>
          )}

          <div
            className="d-flex"
            style={{ gap: "1rem", alignItems: "flex-end", marginBottom: "2rem" }}
          >
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Select Location</label>
              <select
                className="form-control"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {LOCATION_OPTIONS.map((location) => (
                  <option key={location.query} value={location.query}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn"
              onClick={handleSearch}
              disabled={loading}
              style={{ minWidth: "120px" }}
            >
              {loading ? "Loading..." : "Check Weather"}
            </button>
          </div>

          {currentWeather && (
            <div
              style={{
                textAlign: "center",
                backgroundColor: "#f9fdfc",
                padding: "2rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
              }}
            >
              <h3 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {currentWeather.name}
              </h3>
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: 0,
                }}
              >
                <span style={{ fontSize: "3rem", fontWeight: "bold" }}>
                  {Math.round(currentWeather.temp)} C
                </span>
              </p>
              <p
                style={{
                  textTransform: "capitalize",
                  color: "var(--text-secondary)",
                  fontSize: "1.2rem",
                  marginTop: "0.5rem",
                }}
              >
                {currentWeather.condition}
              </p>
            </div>
          )}

          <div className="text-center" style={{ marginTop: "2rem" }}>
            <Link
              href="/history"
              style={{
                color: "var(--primary-color)",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              View recently searched locations &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

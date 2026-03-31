"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import CloudIcon from "@/components/CloudIcon";
import TrashIcon from "@/components/TrashIcon";
import {
  clearHistory,
  removeHistoryItem,
} from "@/store/weatherSlice";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.weather);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return <div className="container text-center mt-2">Loading session...</div>;
  }

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeHistoryItem(itemId));
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div>
      <nav className="navbar">
        <Link
          href="/"
          className="brand logo-font"
          style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
        >
          <CloudIcon size={54} alt="WeatherMEE animated cloud" className="brand-icon" priority />
          WeatherMEE
        </Link>
        <div className="nav-links">
          <span>
            Welcome, <b>{session.user?.name || "User"}</b>
          </span>
          <Link href="/" className="btn btn-secondary">
            Current Weather
          </Link>
          <button onClick={handleLogout} className="btn danger-btn">
            Log Out
          </button>
        </div>
      </nav>

      <div className="container mt-2">
        <div className="card">
          <div className="d-flex justify-between align-center mb-2">
            <h2
              style={{
                color: "var(--primary-color)",
                margin: 0,
              }}
            >
              Search History
            </h2>
            <button
              className="btn danger-btn"
              onClick={handleClearHistory}
              disabled={history.length === 0}
            >
              Clear History
            </button>
          </div>

          <p style={{ color: "var(--text-secondary)" }}>
            This table shows your saved weather searches on this device while
            your session stays active.
          </p>

          {history.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="weather-table mt-1">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Temperature (C)</th>
                    <th>Condition</th>
                    <th>Time Searched</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id || `${item.name}-${item.timestamp}-${index}`}>
                      <td style={{ fontWeight: "500" }}>
                        <div className="history-location">
                          <span>{item.name}</span>
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Delete ${item.name} from weather history`}
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <TrashIcon className="trash-icon" />
                          </button>
                        </div>
                      </td>
                      <td>{Math.round(item.temp)} C</td>
                      <td style={{ textTransform: "capitalize" }}>{item.condition}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.9em" }}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="text-center"
              style={{
                padding: "3rem 0",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                marginTop: "1rem",
              }}
            >
              <p style={{ color: "var(--text-secondary)" }}>
                You have not searched for any weather yet.
              </p>
              <Link href="/" className="btn mt-1">
                Go Back to Search
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

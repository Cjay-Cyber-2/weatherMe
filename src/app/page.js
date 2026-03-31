"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, clearError } from "@/store/weatherSlice";

const CITIES = [
  "London", "New York", "Tokyo", "Paris", "Berlin", "Sydney", 
  "Mumbai", "Lagos", "Los Angeles", "Toronto", "Dubai", 
  "Singapore", "Rome", "Cape Town", "Buenos Aires", "Seoul", 
  "Mexico City", "Istanbul", "Rio de Janeiro"
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  const { currentWeather, loading, error } = useSelector((state) => state.weather);

  useEffect(() => {
    // Basic protection: if unauthenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Loading state placeholder while checking session
  if (status === "loading") {
    return <div className="container text-center mt-2">Loading session...</div>;
  }
  
  if (!session) return null; // Avoid flicker

  const handleSearch = () => {
    dispatch(fetchWeather(selectedCity));
  };

  return (
    <div>
      <nav className="navbar">
        <h1 className="brand logo-font" style={{ display: 'flex', alignItems: 'center' }}>
          <lord-icon 
            src="https://cdn.lordicon.com/qzhneolq.json" 
            trigger="loop" 
            colors="primary:#18f2b2,secondary:#1e293b" 
            style={{ width: '45px', height: '45px', marginRight: '8px' }}>
          </lord-icon>
          WeatherMEE
        </h1>
        <div className="nav-links">
          <span>Welcome, <b>{session.user?.name || "User"}</b></span>
          <Link href="/history" className="btn btn-secondary">Weather History</Link>
          <button onClick={() => signOut()} className="btn danger-btn">Log Out</button>
        </div>
      </nav>

      <div className="container mt-2">
        <div className="card">
          <h2 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <lord-icon 
              src="https://cdn.lordicon.com/nocovwne.json" 
              trigger="hover" 
              colors="primary:#18f2b2,secondary:#1e293b" 
              style={{ width: '50px', height: '50px' }}>
            </lord-icon>
            Check The Weather
          </h2>
          <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
            Select a location below to receive the latest weather information.
          </p>

          {error && (
            <div style={{ backgroundColor: '#fff2f0', color: '#ff4d4f', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #ffccc7' }}>
              <strong>Error fetching weather: </strong>{error}
              <button 
                onClick={() => dispatch(clearError())} 
                style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f' }}
              >
                ✕
              </button>
            </div>
          )}

          <div className="d-flex" style={{ gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Select Location</label>
              <select 
                className="form-control" 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <button className="btn" onClick={handleSearch} disabled={loading} style={{ minWidth: '120px' }}>
              {loading ? "Loading..." : "Check Weather"}
            </button>
          </div>

          {/* Displaying Results */}
          {currentWeather && (
            <div style={{ textAlign: 'center', backgroundColor: '#f9fdfc', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{currentWeather.name}</h3>
              <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                {currentWeather.icon && (
                  <img 
                    src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`} 
                    alt={currentWeather.condition} 
                    style={{ background: 'var(--primary-color)', borderRadius: '50%', width: '50px', height: '50px' }}
                  />
                )}
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                  {Math.round(currentWeather.temp)}°C
                </span>
              </p>
              <p style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
                {currentWeather.condition}
              </p>
            </div>
          )}

          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link href="/history" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
              View recently searched locations &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

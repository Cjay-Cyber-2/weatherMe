"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  if (status === "loading") {
    return <div className="container text-center mt-2">Loading session...</div>;
  }

  if (status === "authenticated") {
    return null;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const trimmedUsername = username.trim();
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: trimmedUsername, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(true);

      const signInRes = await signIn("credentials", {
        username: trimmedUsername,
        password,
        redirect: false,
      });

      setTimeout(() => {
        if (!signInRes?.error) {
          router.replace("/");
          router.refresh();
        } else {
          router.replace("/login");
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div
        className="card"
        style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}
      >
        <h1
          className="logo-font"
          style={{
            color: "var(--primary-color)",
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          WeatherMEE
        </h1>
        <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
          Create your free account
        </p>

        {error && (
          <div
            style={{
              color: "#7f1d1d",
              backgroundColor: "#fca5a5",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              color: "#14532d",
              backgroundColor: "#bbf7d0",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            Registration successful! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleRegister} style={{ textAlign: "left" }}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Verify password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          {"Already have an account? "}
          <Link
            href="/login"
            style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}
          >
            Log in here.
          </Link>
        </p>
      </div>
    </div>
  );
}

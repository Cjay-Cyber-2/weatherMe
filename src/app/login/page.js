"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CloudIcon from "@/components/CloudIcon";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      username: username.trim(),
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Try again.");
    } else {
      router.replace("/");
      router.refresh();
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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <CloudIcon size={88} alt="WeatherMEE animated cloud" priority />
        </div>
        <h1
          className="logo-font"
          style={{
            color: "var(--primary-color)",
            fontSize: "2.5rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          WeatherMEE
        </h1>
        <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
          Sign in to check the weather and keep your session active on this
          device.
        </p>

        {error && (
          <div style={{ color: "#ff4d4f", marginBottom: "1rem", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem" }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          {"Don't have an account yet? "}
          <Link
            href="/register"
            style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}
          >
            Create one.
          </Link>
        </p>
      </div>
    </div>
  );
}

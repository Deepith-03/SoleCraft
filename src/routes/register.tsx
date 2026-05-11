import { FormEvent, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.register({ username, email, password });
      login(response);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="container-page section">
        <div className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit} className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field">
              <label>Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </div>
            {error ? <p style={{ color: "var(--accent)" }}>{error}</p> : null}
            <button className="btn btn-primary" type="submit">Register</button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

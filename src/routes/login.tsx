import { FormEvent, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { login } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.login({ email, password });
      login(response);
      if (response.role !== "ADMIN" && search.redirect?.startsWith("/")) {
        window.location.href = search.redirect;
      } else {
        navigate({ to: response.role === "ADMIN" ? "/admin" : "/" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="container-page section">
        <div className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2>Customer Login</h2>
          <form onSubmit={handleSubmit} className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </div>
            {error ? <p style={{ color: "var(--accent)" }}>{error}</p> : null}
            <button className="btn btn-primary" type="submit">Login</button>
            <p style={{ color: "var(--muted-foreground)", fontSize: ".9rem" }}>Admin default: admin@sneakerhead.com / admin123</p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

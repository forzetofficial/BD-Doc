import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import TextField from "../components/TextField";
import styles from "./AuthForm.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <AuthLayout title="BD Doc">
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <TextField
          label="Пароль"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          minLength={6}
        />

        <button className={styles.submit} type="submit">
          Войти
        </button>
        <div className={styles.hint}>
          Нет аккаунта?{" "}
          <Link className={styles.link} to="/registration">
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import TextField from "../components/TextField";
import styles from "./AuthForm.module.css";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = Cookies.get("email");
    const savedPassword = Cookies.get("password");

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    Cookies.set("email", value, { expires: 7 });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    Cookies.set("password", value, { expires: 7 });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://77.51.223.54:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          Cookies.set("access_token", data.access_token, { expires: 7 });
        }
        if (data.refresh_token) {
          Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
        }
        sessionStorage.setItem('justLoggedIn', 'true');
        navigate("/home");
      } else {
        const errorData = await response.json();
        alert(`Ошибка входа: ${errorData.message || "Неверный email или пароль"}`);
      }
    } catch (error) {
      alert(`Ошибка входа: ${ error || "Неверный email или пароль"}`);
    } finally {
      setIsLoading(false);
    }
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
          onChange={handleEmailChange}
          required
          autoComplete="email"
        />

        <TextField
          label="Пароль"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={handlePasswordChange}
          required
          autoComplete="current-password"
          minLength={6}
        />

        <button className={styles.submit} type="submit" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </button>
        <div className={styles.hint}>
          Нет аккаунта?{" "}
          <Link className={styles.link} to="/auth/register">
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

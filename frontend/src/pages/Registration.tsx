import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import TextField from "../components/TextField";
import styles from "./AuthForm.module.css";
import Cookies from "js-cookie";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = Cookies.get("username");
    const savedEmail = Cookies.get("email");
    const savedPassword = Cookies.get("password");

    if (savedUsername) setName(savedUsername);
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    Cookies.set("username", value, { expires: 7 });
  };

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
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        navigate("/auth/login");
      } else {
        const errorData = await response.json();
        alert(`Ошибка регистрации: ${errorData.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      alert("Произошла ошибка при регистрации. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout title="BD Doc">
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="Имя"
          type="text"
          placeholder="Иван Иванов"
          value={name}
          onChange={handleNameChange}
          required
          autoComplete="name"
        />

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
          autoComplete="new-password"
          minLength={6}
        />

        <button className={styles.submit} type="submit" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
        <div className={styles.hint}>
          Уже есть аккаунт?{" "}
          <Link className={styles.link} to="/auth/login">
            Войти
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

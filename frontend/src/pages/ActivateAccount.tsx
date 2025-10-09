import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";
import AuthLayout from "../components/AuthLayout";

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const link = searchParams.get("link");
    if (!link) {
      setStatus("error");
      setMessage("Некорректная ссылка активации.");
      return;
    }
    fetch("/auth/activate_account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setMessage("Аккаунт успешно активирован! Теперь вы можете войти.");
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus("error");
          setMessage(data.message || "Ошибка активации аккаунта.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Ошибка сети. Попробуйте позже.");
      });
  }, [searchParams]);

  return (
    <AuthLayout title="Активация аккаунта">
      <div className={styles.form} style={{ minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {status === "loading" && <div className={styles.submit} style={{ width: 120, textAlign: "center" }}>Загрузка...</div>}
        {status !== "loading" && (
          <>
            <div style={{ marginBottom: 24, color: status === "success" ? "#2ecc40" : "#ff4444", fontWeight: 600, fontSize: 18 }}>{message}</div>
            <button
              className={styles.submit}
              style={{ width: 180 }}
              onClick={() => navigate("/auth/login")}
            >
              Войти
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

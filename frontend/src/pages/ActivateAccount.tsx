import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ActivateAccount() {
  const navigate = useNavigate();
  const params = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activate = async () => {
      const link = params.url;
      if (!link) {
        setStatus("error");
        setMessage("Некорректная ссылка активации.");
        return;
      }
      setStatus("loading");
      try {
        const response = await axios.post(
          "http://77.51.223.54:8080/api/v1/auth/activate_account",
          { link },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          setStatus("success");
          setMessage("Аккаунт успешно активирован! Теперь вы можете войти.");
        } else {
          setStatus("error");
          setMessage(response.data?.message || "Ошибка активации аккаунта.");
        }
      } catch (error: any) {
        setStatus("error");
        if (error.response) {
          setMessage(error.response.data?.message || "Ошибка активации аккаунта.");
        } else {
          setMessage(error.message || "Ошибка сети. Попробуйте позже.");
        }
      }
    };
    activate();
  }, [params]);

  return (
    <div style={{ minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      {status === "loading" && <div style={{ width: 120, textAlign: "center" }}>Загрузка...</div>}
      {status !== "loading" && (
        <>
          <div style={{ marginBottom: 24, color: status === "success" ? "#2ecc40" : "#ff4444", fontWeight: 600, fontSize: 18 }}>{message}</div>
          <button
            style={{ width: 180 }}
            onClick={() => navigate("/auth/login")}
          >
            Войти
          </button>
        </>
      )}
    </div>
  );
}

export default ActivateAccount;

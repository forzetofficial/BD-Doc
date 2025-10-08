import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import AppBackground from "../components/AppBackground";
import Cookies from "js-cookie";

export default function Home() {
  const navigate = useNavigate();
  const [globalQuery, setGlobalQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState<"diploma" | "coursework">("diploma");
  const [criteria, setCriteria] = useState({
    group: "",
    fio: "",
    title: "",
    supervisor: "",
    year: "",
    order: "",
    reviewer: "",
    discipline: "",
  });

  useEffect(() => {
    const hasJustLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
    
    if (hasJustLoggedIn) {
      sessionStorage.removeItem('justLoggedIn');
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  function handleLogout() {
    navigate("/login", { replace: true });
  }

  function handleCriteriaChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  }

  function submitGlobalSearch(event: React.FormEvent) {
    event.preventDefault();
    // TODO: wire to backend search
    // For now, no-op
  }

  function submitCriteriaSearch(event: React.FormEvent) {
    event.preventDefault();
    // TODO: wire to backend criteria search
  }

  function clearCriteria() {
    setCriteria({
      group: "",
      fio: "",
      title: "",
      supervisor: "",
      year: "",
      order: "",
      reviewer: "",
      discipline: "",
    });
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  const username = Cookies.get("username") || "Ваше имя";

  return (
    <div className={`${styles["home-page"]} ${!isSidebarOpen ? styles.collapsed : ""} ${styles.fadeInHome}`}>
      <AppBackground />

      <button
        className={styles["home-toggle"]}
        type="button"
        aria-label={isSidebarOpen ? "Скрыть панель" : "Показать панель"}
        onClick={() => setIsSidebarOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <aside className={styles["home-sidebar"]}>
        <div className={styles["home-sidebar__header"]}>
          <div className={styles["home-avatar"]} aria-hidden>
            BD
          </div>
          <div className={styles["home-username"]}>{username}</div>
        </div>

        <button className={styles["home-settings-btn"]} type="button">⚙ Настройки</button>

        <div className={styles["home-section"]}>
          <div className={styles["home-section__title"]}>Тип поиска</div>
          <div className={styles["type-toggle"]}>
            <label className={styles.radio}>
              <input
                type="radio"
                name="searchType"
                value="diploma"
                checked={searchType === "diploma"}
                onChange={() => { setSearchType("diploma"); clearCriteria(); }}
              />
              <span>По дипломам</span>
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="searchType"
                value="coursework"
                checked={searchType === "coursework"}
                onChange={() => { setSearchType("coursework"); clearCriteria(); }}
              />
              <span>По курсовым</span>
            </label>
          </div>

          <div className={styles["home-section__title"]}>Поиск по критериям</div>
          <form className={styles["criteria-form"]} onSubmit={submitCriteriaSearch}>
            <input
              className={styles.input}
              name="group"
              placeholder="Группа"
              value={criteria.group}
              onChange={handleCriteriaChange}
            />
            <input
              className={styles.input}
              name="fio"
              placeholder="ФИО"
              value={criteria.fio}
              onChange={handleCriteriaChange}
            />
            <input
              className={styles.input}
              name="title"
              placeholder="Тема"
              value={criteria.title}
              onChange={handleCriteriaChange}
            />
            {searchType === "diploma" ? (
              <>
                <input
                  className={styles.input}
                  name="supervisor"
                  placeholder="Руководитель"
                  value={criteria.supervisor}
                  onChange={handleCriteriaChange}
                />
                <input
                  className={styles.input}
                  name="year"
                  type="number"
                  placeholder="Год"
                  value={criteria.year}
                  onChange={handleCriteriaChange}
                />
                <input
                  className={styles.input}
                  name="order"
                  placeholder="Приказ"
                  value={criteria.order}
                  onChange={handleCriteriaChange}
                />
                <input
                  className={styles.input}
                  name="reviewer"
                  placeholder="Рецензент"
                  value={criteria.reviewer}
                  onChange={handleCriteriaChange}
                />
              </>
            ) : (
              <>
                <input
                  className={styles.input}
                  name="year"
                  type="number"
                  placeholder="Год"
                  value={criteria.year}
                  onChange={handleCriteriaChange}
                />
                <input
                  className={styles.input}
                  name="order"
                  placeholder="Приказ"
                  value={criteria.order}
                  onChange={handleCriteriaChange}
                />
                <input
                  className={styles.input}
                  name="supervisor"
                  placeholder="Руководитель"
                  value={criteria.supervisor}
                  onChange={handleCriteriaChange}
                />
                <input
                  className={styles.input}
                  name="discipline"
                  placeholder="Дисциплина"
                  value={criteria.discipline}
                  onChange={handleCriteriaChange}
                />
              </>
            )}
            <div className={styles["criteria-actions"]}>
              <button className={styles.submit} type="submit">Искать</button>
              <button className={styles.clear} type="button" onClick={clearCriteria}>Очистить</button>
            </div>
          </form>
        </div>

        <button className={styles["home-logout"]} onClick={handleLogout}>Выйти</button>
      </aside>

      <main className={styles["home-content"]}>
        <div className={`${styles["home-brand"]} ${styles.title}`}>BD Doc</div>
        <form className={styles["home-search"]} onSubmit={submitGlobalSearch}>
          <input
            className={`${styles.input} ${styles["home-search__input"]}`}
            placeholder="Найти документ..."
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
          />
          <button className={`${styles.submit} ${styles["home-search__button"]}`} type="submit">Поиск</button>
        </form>
      </main>
    </div>
  );
}

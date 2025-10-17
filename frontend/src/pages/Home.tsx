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
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    director: "",
    discipline: "",
    fio: "",
    group: "",
    order: "",
    reviewer: "",
    theme: "",
    type: "diploma",
    year: 0,
  });
  const [docs, setDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

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
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
      navigate("/login", { replace: true });
      return;
    }
    fetch("http://158.160.159.90:8080/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then((resp) => {
        if (resp.ok) {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          navigate("/login", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }

  function handleCriteriaChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  }

  async function submitGlobalSearch(event: React.FormEvent) {
    event.preventDefault();
    setDocsLoading(true);
    setDocsError(null);
    const refreshToken = Cookies.get("refresh_token");
    try {
      const resp = await fetch("http://158.160.159.90:8080/api/v1/docs/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ search_line: globalQuery }),
      });
      if (resp.ok) {
        const res = await resp.json();
        setDocs(Array.isArray(res.docs) ? res.docs : []);
      } else {
        setDocsError("Ошибка поиска");
        setDocs([]);
      }
    } catch (e) {
      setDocsError("Ошибка соединения");
      setDocs([]);
    } finally {
      setDocsLoading(false);
    }
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

  function openAddModal() {
    setAddModalOpen(true);
  }
  function closeAddModal() {
    setAddModalOpen(false);
  }
  function handleAddFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setAddForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }
  function handleAddTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAddForm(prev => ({ ...prev, type: e.target.value }));
  }
  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const refreshToken = Cookies.get("refresh_token");
    try {
      const resp = await fetch("http://158.160.159.90:8080/api/v1/docs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
        body: JSON.stringify(addForm),
      });
      if (resp.ok) {
        closeAddModal();
        setAddForm({
          director: "",
          discipline: "",
          fio: "",
          group: "",
          order: "",
          reviewer: "",
          theme: "",
          type: "diploma",
          year: 0,
        });
      } else {
        const err = await resp.json().catch(() => ({message:"Ошибка"}));
        alert(`Ошибка: ${err.message || "Ошибка сохранения"}`);
      }
    } catch (error) {
      alert("Ошибка соединения или сервера");
    }
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

        {/* Кнопка настроек УДАЛЕНА */}

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
              <button className={styles["home-add"]} type="button" onClick={openAddModal}>Добавить</button>
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
        {docsLoading && <div style={{marginTop:20, color:'#aaa'}}>Загрузка...</div>}
        {docsError && <div style={{marginTop:20, color:'#e55'}}>{docsError}</div>}
        {docs.length > 0 && (
          <div style={{width:'100%', display:'grid', gap:18, marginTop:30, gridTemplateColumns:'repeat(auto-fit, minmax(340px,1fr))'}}>
            {docs.map((doc:any) => (
              <div key={doc.id || Math.random()} style={{padding:22, borderRadius:18, background:'rgba(255,255,255,0.04)',boxShadow:'0 2px 10px #0003', border:'1px solid var(--border, #333)', minWidth:300}}>
                <div style={{fontWeight:'600', fontSize:18, marginBottom:9, color:'var(--violet,#869FF8)'}}>{doc.theme || '-'}</div>
                <div style={{marginBottom:7, fontSize:15}}><b>ФИО:</b> {doc.fio || '-'}</div>
                <div style={{marginBottom:7, fontSize:15}}><b>Руководитель:</b> {doc.director || '-'}</div>
                <div style={{marginBottom:7, fontSize:15}}><b>Год:</b> {doc.year || '-'}</div>
                <div style={{marginBottom:7, fontSize:15}}><b>Тип:</b> {doc.type === 'diploma' ? 'Диплом' : doc.type === 'coursework' ? 'Курсовая' : doc.type || '-'}</div>
                <div style={{marginBottom:4, fontSize:13}}><b>Группа:</b> {doc.group || '-'}</div>
                <div style={{marginBottom:4, fontSize:13}}><b>Рецензент:</b> {doc.reviewer || '-'}</div>
                <div style={{marginBottom:4, fontSize:13}}><b>Приказ:</b> {doc.order || '-'}</div>
                <div style={{marginBottom:4, fontSize:13}}><b>Дисциплина:</b> {doc.discipline || '-'}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Модальное окно добавления */}
      {isAddModalOpen && (
        <div style={{ position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 1000, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form style={{ background: "#18151e", padding: 28, borderRadius: 18, boxShadow: "0 2px 32px #0007", minWidth: 320, maxWidth: 400, width: "95vw", display: "grid", gap: 14 }} onSubmit={handleAddSubmit}>
            <label style={{ marginBottom: 2, fontWeight: 600 }}>Тип *</label>
            <select name="type" value={addForm.type} onChange={handleAddTypeChange} style={{ padding: 10, borderRadius: 8, marginBottom: 6 }} required>
              <option value="diploma">Диплом</option>
              <option value="coursework">Курсовая</option>
            </select>
            <input className={styles.input} name="group" placeholder="Группа" value={addForm.group} onChange={handleAddFormChange} />
            <input className={styles.input} name="fio" placeholder="ФИО" value={addForm.fio} onChange={handleAddFormChange} />
            <input className={styles.input} name="theme" placeholder="Тема" value={addForm.theme} onChange={handleAddFormChange} />
            <input className={styles.input} name="director" placeholder="Руководитель" value={addForm.director} onChange={handleAddFormChange} />
            <input className={styles.input} name="year" placeholder="Год" type="number" value={addForm.year || ''} onChange={handleAddFormChange} />
            <input className={styles.input} name="order" placeholder="Приказ" value={addForm.order} onChange={handleAddFormChange} />
            <input className={styles.input} name="reviewer" placeholder="Рецензент" value={addForm.reviewer} onChange={handleAddFormChange} />
            <input className={styles.input} name="discipline" placeholder="Дисциплина" value={addForm.discipline} onChange={handleAddFormChange} />
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button type="submit" className={styles.submit} style={{ flex: 1 }}>Отправить</button>
              <button type="button" className={styles.clear} style={{ flex: 1 }} onClick={closeAddModal}>Закрыть</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

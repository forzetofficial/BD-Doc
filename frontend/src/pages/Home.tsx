import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
    type: "diploma", // добавлено поле type
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
  const docsEndRef = useRef<HTMLDivElement>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [editForm, setEditForm] = useState({
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

  useEffect(() => {
    if (docsEndRef.current && docs.length > 0) {
      docsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [docs]);

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

  function handleCriteriaChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  }

  async function submitGlobalSearch(event: React.FormEvent) {
    event.preventDefault();
    setDocsLoading(true);
    setDocsError(null);
    const accessToken = Cookies.get("access_token");
    try {
      const resp = await fetch("http://158.160.159.90:8080/api/v1/docs/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
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

  async function submitCriteriaSearch(event: React.FormEvent) {
    event.preventDefault();
    setDocsLoading(true);
    setDocsError(null);
    const accessToken = Cookies.get("access_token");
    try {
      const resp = await fetch("http://158.160.159.90:8080/api/v1/docs/filtered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          director: criteria.supervisor,
          discipline: criteria.discipline,
          fio: criteria.fio,
          group: criteria.group,
          order: criteria.order,
          reviewer: criteria.reviewer,
          theme: criteria.title,
          type: (criteria.type || '').toLowerCase(),
          year: Number(criteria.year) || 0
        }),
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
      type: "diploma",
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

  async function handleDeleteDoc(docId: number) {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      alert("Ошибка авторизации");
      return;
    }

    if (!confirm("Вы уверены, что хотите удалить этот документ?")) {
      return;
    }

    try {
      const resp = await fetch("http://158.160.159.90:8080/api/v1/docs/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: docId }),
      });

      if (resp.ok) {
        setDocs(prev => prev.filter((doc: any) => doc.id !== docId));
        alert("Документ успешно удален");
      } else {
        const err = await resp.json().catch(() => ({message:"Ошибка"}));
        alert(`Ошибка удаления: ${err.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      alert("Ошибка соединения при удалении");
    }
  }

  function openEditModal(doc: any) {
    setEditingDoc(doc);
    setEditForm({
      director: doc.director || "",
      discipline: doc.discipline || "",
      fio: doc.fio || "",
      group: doc.group || "",
      order: doc.order || "",
      reviewer: doc.reviewer || "",
      theme: doc.theme || "",
      type: doc.type || "diploma",
      year: doc.year || 0,
    });
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditingDoc(null);
    setEditForm({
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
  }

  function handleEditFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  function handleEditTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEditForm(prev => ({ ...prev, type: e.target.value }));
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDoc) return;
    
    const accessToken = Cookies.get("access_token");
    try {
      const resp = await fetch("http://158.160.159.90:8080/api/v1/docs/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...editForm,
          id: editingDoc.id,
          type: editForm.type.toLowerCase()
        }),
      });
      if (resp.ok) {
        // Обновляем документ в списке
        setDocs(prev => prev.map((doc: any) => 
          doc.id === editingDoc.id 
            ? { ...doc, ...editForm, type: editForm.type.toLowerCase() }
            : doc
        ));
        closeEditModal();
        alert("Документ успешно обновлен");
      } else {
        const err = await resp.json().catch(() => ({message:"Ошибка"}));
        alert(`Ошибка обновления: ${err.message || "Ошибка сохранения"}`);
      }
    } catch (error) {
      alert("Ошибка соединения при обновлении");
    }
  }
  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const accessToken = Cookies.get("access_token");
    try {
      const resp = await fetch("http://158.160.159.90:8080/api/v1/docs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...addForm, type: addForm.type.toLowerCase() }),
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
            <select className={styles.input} name="type" value={criteria.type} onChange={handleCriteriaChange} style={{ marginBottom: 8 }}>
              <option value="diploma">Диплом</option>
              <option value="coursework">Курсовая</option>
            </select>
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
          <div style={{width:'100%', display:'grid', gap:18, marginTop:30, gridTemplateColumns:'repeat(auto-fit, minmax(340px,1fr))', maxHeight:'70vh', overflowY:'auto', paddingRight:'8px', alignItems:'start'}}>
            {docs.map((doc:any) => (
              <div key={doc.id || Math.random()} style={{padding:22, borderRadius:18, background:'rgba(255,255,255,0.04)',boxShadow:'0 2px 10px #0003', border:'1px solid var(--border, #333)', minWidth:300, maxWidth:'100%', wordWrap:'break-word', display:'flex', flexDirection:'column', height:'fit-content', minHeight:'280px'}}>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                  <div style={{fontWeight:'600', fontSize:18, marginBottom:9, color:'var(--violet,#869FF8)', wordBreak:'break-word', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}} title={doc.theme || '-'}>{doc.theme || '-'}</div>
                  <div style={{marginBottom:7, fontSize:15, wordBreak:'break-word'}}><b>ФИО:</b> {doc.fio || '-'}</div>
                  <div style={{marginBottom:7, fontSize:15, wordBreak:'break-word'}}><b>Руководитель:</b> {doc.director || '-'}</div>
                  <div style={{marginBottom:7, fontSize:15, wordBreak:'break-word'}}><b>Год:</b> {doc.year || '-'}</div>
                  <div style={{marginBottom:7, fontSize:15, wordBreak:'break-word'}}><b>Тип:</b> {doc.type === 'diploma' ? 'Диплом' : doc.type === 'coursework' ? 'Курсовая' : doc.type || '-'}</div>
                  <div style={{marginBottom:4, fontSize:13, wordBreak:'break-word'}}><b>Группа:</b> {doc.group || '-'}</div>
                  <div style={{marginBottom:4, fontSize:13, wordBreak:'break-word'}}><b>Рецензент:</b> {doc.reviewer || '-'}</div>
                  <div style={{marginBottom:4, fontSize:13, wordBreak:'break-word'}}><b>Приказ:</b> {doc.order || '-'}</div>
                  <div style={{marginBottom:4, fontSize:13, wordBreak:'break-word'}}><b>Дисциплина:</b> {doc.discipline || '-'}</div>
                </div>
                <div style={{display: 'flex', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)'}}>
                  <button 
                    type="button" 
                    onClick={() => openEditModal(doc)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #333)',
                      background: 'linear-gradient(135deg, var(--blue), var(--green))',
                      color: '#0b1220',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Обновить
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteDoc(doc.id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #333)',
                      background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                      color: '#0b1220',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            <div ref={docsEndRef} />
          </div>
        )}
      </main>

      {/* Модальное окно редактирования */}
      {isEditModalOpen && (
        <div style={{ position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 1000, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form style={{ background: "#18151e", padding: 28, borderRadius: 18, boxShadow: "0 2px 32px #0007", minWidth: 320, maxWidth: 400, width: "95vw", display: "grid", gap: 14 }} onSubmit={handleEditSubmit}>
            <label style={{ marginBottom: 2, fontWeight: 600 }}>Тип *</label>
            <select name="type" value={editForm.type} onChange={handleEditTypeChange} style={{ padding: 10, borderRadius: 8, marginBottom: 6 }} required>
              <option value="diploma">Диплом</option>
              <option value="coursework">Курсовая</option>
            </select>

            <input className={styles.input} name="theme" placeholder="Тема" value={editForm.theme} onChange={handleEditFormChange} />
            <input className={styles.input} name="fio" placeholder="ФИО" value={editForm.fio} onChange={handleEditFormChange} />
            <input className={styles.input} name="director" placeholder="Руководитель" value={editForm.director} onChange={handleEditFormChange} />
            <input className={styles.input} name="year" placeholder="Год" type="number" value={editForm.year || ''} onChange={handleEditFormChange} />
            <input className={styles.input} name="group" placeholder="Группа" value={editForm.group} onChange={handleEditFormChange} />
            <input className={styles.input} name="order" placeholder="Приказ" value={editForm.order} onChange={handleEditFormChange} />
            <input className={styles.input} name="reviewer" placeholder="Рецензент" value={editForm.reviewer} onChange={handleEditFormChange} />
            <input className={styles.input} name="discipline" placeholder="Дисциплина" value={editForm.discipline} onChange={handleEditFormChange} />
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button type="submit" className={styles.submit} style={{ flex: 1 }}>Обновить</button>
              <button type="button" className={styles.clear} style={{ flex: 1 }} onClick={closeEditModal}>Закрыть</button>
            </div>
          </form>
        </div>
      )}

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

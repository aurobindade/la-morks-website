import { useState, useEffect, useRef } from "react";
import { subscribePortfolio, addPortfolioItem, deletePortfolioItem, seedPortfolio, uploadPortfolioImage, updatePortfolioItem } from "./firebase.js";

const DEFAULT_PORTFOLIO = [
  { id: 1, init: "IC", name: "IsaacCare", desc: "Cognitive health monitoring and support platform", category: "Technology" },
  { id: 2, init: "RM", name: "Raidmed", desc: "Diabetic foot monitoring with AI thermal analysis", category: "Technology" },
  { id: 3, init: "SC", name: "Screen Clinical", desc: "AI-enabled medication review platform", category: "Technology" },
  { id: 4, init: "PX", name: "Pillaxia", desc: "AI tools for medication management workflows", category: "Technology" },
  { id: 5, init: "SI", name: "Sports Impact Tech", desc: "Concussion & impact monitoring wearable", category: "Technology" },
  { id: 6, init: "MP", name: "MediPacks", desc: '"Heart Attack Hero" emergency guidance system', category: "Technology" },
  { id: 7, init: "CS", name: "Carryduff Surgery", desc: "Agentic primary care disease management", category: "Technology" },
  { id: 8, init: "AF", name: "Angurbala Films", desc: "Animation production & motion design", category: "Animation" },
];

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "lamorks2024";

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", desc: "", category: "Technology", imageFile: null });
  const fileInputRef = useRef(null);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const unsub = subscribePortfolio((data) => {
      setItems(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Please try again.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError("Project name is required.");
    if (!form.desc.trim()) return setFormError("Description is required.");
    setFormError("");
    const newItem = {
      init: getInitials(form.name),
      name: form.name.trim(),
      desc: form.desc.trim(),
      category: form.category,
    };
    try {
      // upload image if provided
      if (form.imageFile) {
        try {
          const url = await uploadPortfolioImage(form.imageFile, `portfolio/${Date.now()}-${form.imageFile.name}`);
          newItem.imageUrl = url;
        } catch (err) {
          console.error('upload error', err);
          setFormError('Image upload failed.');
          return;
        }
      }
      await addPortfolioItem(newItem);
      setForm({ name: "", desc: "", category: "Technology" });
      if (fileInputRef.current) fileInputRef.current.value = null;
      showToast("Portfolio item added successfully.");
    } catch (err) {
      setFormError("Failed to save. Check your connection.");
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setForm((s) => ({ ...s, imageFile: f || null }));
  };

  const handleUploadForItem = async (id, file) => {
    if (!file) return showToast('No file selected.');
    try {
      const url = await uploadPortfolioImage(file, `portfolio/${Date.now()}-${file.name}`);
      await updatePortfolioItem(id, { imageUrl: url });
      showToast('Image updated.');
    } catch (err) {
      console.error(err);
      showToast('Image upload failed.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePortfolioItem(id);
      showToast("Item removed.");
    } catch (err) {
      showToast("Failed to remove item.");
    }
    setDeleteId(null);
  };

  const handleSeed = async () => {
    try {
      const { id: _id, ...rest } = DEFAULT_PORTFOLIO[0];
      await seedPortfolio(DEFAULT_PORTFOLIO.map(({ id: _id, ...item }) => item));
      showToast("Default items seeded successfully.");
    } catch (err) {
      showToast("Failed to seed data. Check your connection.");
    }
  };

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  if (!authed) {
    return (
      <div style={s.loginWrap}>
        <div style={s.loginCard}>
          <div style={s.loginLogo}>La-MORKS</div>
          <div style={s.loginSub}>Admin Panel</div>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Enter admin password"
              style={s.input}
              autoFocus
            />
            {pwError && <div style={s.errorMsg}>{pwError}</div>}
            <button type="submit" style={s.btnPrimary}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>La-MORKS</div>
        <div style={s.sidebarRole}>Admin</div>
        <nav style={s.sidebarNav}>
          <div style={s.sidebarItem}>
            <span style={s.sidebarIcon}>🗂️</span> Portfolio
          </div>
        </nav>
        <div style={{ marginTop: "auto" }}>
          <button
            style={s.sidebarLogout}
            onClick={() => { setAuthed(false); setPwInput(""); }}
          >
            Sign Out
          </button>
          <a href="/" style={s.sidebarViewSite}>← View Site</a>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Toast */}
        {toast && <div style={s.toast}>{toast}</div>}

        {/* Delete confirm modal */}
        {deleteId !== null && (
          <div style={s.modalOverlay}>
            <div style={s.modal}>
              <div style={s.modalTitle}>Remove Portfolio Item?</div>
              <div style={s.modalSub}>This action cannot be undone.</div>
              <div style={s.modalActions}>
                <button style={s.btnGhost} onClick={() => setDeleteId(null)}>Cancel</button>
                <button style={s.btnDanger} onClick={() => handleDelete(deleteId)}>Remove</button>
              </div>
            </div>
          </div>
        )}

        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Portfolio</h1>
            <p style={s.pageSub}>Manage projects shown on the public website.</p>
          </div>
          <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
            {!loading && items.length === 0 && (
              <button style={s.btnSeed} onClick={handleSeed}>Seed Default Data</button>
            )}
            <div style={s.badge}>{loading ? "..." : `${items.length} items`}</div>
          </div>
        </div>

        <div style={s.grid}>
          {/* Add Form */}
          <div style={s.card}>
            <div style={s.cardTitle}>Add New Project</div>
            <form onSubmit={handleAdd} style={s.form}>
              <div style={s.formGroup}>
                <label style={s.label}>Project Name *</label>
                <input
                  style={s.input}
                  placeholder="e.g. IsaacCare"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Description *</label>
                <textarea
                  style={s.textarea}
                  placeholder="Short description of the project"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={3}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Category</label>
                <select
                  style={s.select}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="Technology">Technology</option>
                  <option value="Animation">Animation</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Project Image</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ padding: 6 }} />
              </div>
              {form.imageFile && (
                <div style={{ marginBottom: ".75rem" }}>
                  <img src={URL.createObjectURL(form.imageFile)} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(26,58,107,.12)' }} />
                </div>
              )}
              {form.name && (
                <div style={s.preview}>
                  <span style={s.previewDot}>{getInitials(form.name)}</span>
                  <span style={s.previewText}>Preview initials</span>
                </div>
              )}
              {formError && <div style={s.errorMsg}>{formError}</div>}
              <button type="submit" style={s.btnPrimary}>Add to Portfolio</button>
            </form>
          </div>

          {/* List */}
          <div style={s.card}>
            <div style={s.cardTitleRow}>
              <div style={s.cardTitle}>All Projects</div>
              <div style={s.filterRow}>
                {["All", "Technology", "Animation"].map((f) => (
                  <button
                    key={f}
                    style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div style={s.itemList}>
              {loading && (
                <div style={s.empty}>Loading from database...</div>
              )}
              {!loading && filtered.length === 0 && (
                <div style={s.empty}>No projects found.</div>
              )}
              {filtered.map((item) => (
                <div key={item.id} style={s.item}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  ) : (
                    <div style={s.itemDot}>{item.init}</div>
                  )}
                  <div style={s.itemBody}>
                    <div style={s.itemName}>{item.name}</div>
                    <div style={s.itemDesc}>{item.desc}</div>
                    <span style={s.itemBadge}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', alignItems: 'flex-end' }}>
                    <input
                      id={`file-${item.id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) handleUploadForItem(item.id, f); }}
                    />
                    <button style={{ ...s.btnGhost, padding: '.4rem .6rem', fontSize: '.72rem' }} onClick={() => document.getElementById(`file-${item.id}`).click()}>Change Image</button>
                    <button
                      style={s.itemDelete}
                      title="Remove"
                      onClick={() => setDeleteId(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const s = {
  loginWrap: { minHeight: "100vh", background: "#F5F7FF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat', sans-serif" },
  loginCard: { background: "#fff", border: "1px solid rgba(26,58,107,.15)", borderRadius: "20px", padding: "2.5rem", width: "100%", maxWidth: "380px", boxShadow: "0 8px 40px rgba(26,58,107,.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" },
  loginLogo: { fontSize: "1.4rem", fontWeight: 800, color: "#1A3A6B", letterSpacing: "-1px" },
  loginSub: { fontSize: ".82rem", color: "#5B6380", marginBottom: "1.5rem" },
  wrap: { display: "flex", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif", background: "#F5F7FF" },
  sidebar: { width: "220px", background: "#1A3A6B", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem", flexShrink: 0 },
  sidebarLogo: { fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-1px" },
  sidebarRole: { fontSize: ".72rem", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: ".5rem" },
  sidebarNav: { display: "flex", flexDirection: "column", gap: ".25rem" },
  sidebarItem: { display: "flex", alignItems: "center", gap: ".6rem", padding: ".7rem 1rem", borderRadius: "10px", background: "rgba(255,255,255,.12)", color: "#fff", fontSize: ".88rem", fontWeight: 600, cursor: "default" },
  sidebarIcon: { fontSize: "1rem" },
  sidebarLogout: { width: "100%", background: "rgba(255,255,255,.1)", border: "none", color: "rgba(255,255,255,.7)", padding: ".65rem", borderRadius: "10px", cursor: "pointer", fontSize: ".82rem", fontFamily: "'Montserrat', sans-serif", marginBottom: ".5rem" },
  sidebarViewSite: { display: "block", textAlign: "center", color: "rgba(255,255,255,.5)", fontSize: ".78rem", textDecoration: "none" },
  main: { flex: 1, padding: "2.5rem", overflowY: "auto", position: "relative" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" },
  pageTitle: { fontSize: "1.6rem", fontWeight: 800, color: "#1A1F3C", margin: 0, letterSpacing: "-1px" },
  pageSub: { color: "#5B6380", fontSize: ".88rem", marginTop: ".25rem" },
  badge: { background: "rgba(26,58,107,.08)", color: "#1A3A6B", fontSize: ".78rem", fontWeight: 700, padding: ".4rem .9rem", borderRadius: "50px", border: "1px solid rgba(26,58,107,.2)" },
  btnSeed: { background: "rgba(26,58,107,.08)", color: "#1A3A6B", border: "1px solid rgba(26,58,107,.25)", borderRadius: "50px", padding: ".4rem 1rem", fontSize: ".78rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Montserrat', sans-serif" },
  grid: { display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.5rem", alignItems: "start" },
  card: { background: "#fff", border: "1px solid rgba(26,58,107,.13)", borderRadius: "16px", padding: "1.8rem" },
  cardTitle: { fontSize: "1rem", fontWeight: 700, color: "#1A1F3C", marginBottom: "1.5rem" },
  cardTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: ".5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  formGroup: { display: "flex", flexDirection: "column", gap: ".4rem" },
  label: { fontSize: ".78rem", fontWeight: 600, color: "#1A1F3C", letterSpacing: ".02em" },
  input: { padding: ".7rem .9rem", border: "1px solid rgba(26,58,107,.2)", borderRadius: "10px", fontSize: ".88rem", fontFamily: "'Montserrat', sans-serif", outline: "none", color: "#1A1F3C", width: "100%", boxSizing: "border-box" },
  textarea: { padding: ".7rem .9rem", border: "1px solid rgba(26,58,107,.2)", borderRadius: "10px", fontSize: ".88rem", fontFamily: "'Montserrat', sans-serif", outline: "none", color: "#1A1F3C", resize: "vertical", width: "100%", boxSizing: "border-box" },
  select: { padding: ".7rem .9rem", border: "1px solid rgba(26,58,107,.2)", borderRadius: "10px", fontSize: ".88rem", fontFamily: "'Montserrat', sans-serif", outline: "none", color: "#1A1F3C", background: "#fff", width: "100%", boxSizing: "border-box" },
  preview: { display: "flex", alignItems: "center", gap: ".75rem", padding: ".75rem 1rem", background: "rgba(26,58,107,.04)", borderRadius: "10px", border: "1px dashed rgba(26,58,107,.2)" },
  previewDot: { width: "36px", height: "36px", background: "linear-gradient(135deg,#1A3A6B,#31456D)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 800, color: "#fff", flexShrink: 0 },
  previewText: { fontSize: ".78rem", color: "#5B6380" },
  btnPrimary: { background: "linear-gradient(135deg,#1A3A6B,#0F2A55)", color: "#fff", border: "none", borderRadius: "10px", padding: ".8rem 1.4rem", fontSize: ".88rem", fontWeight: 700, fontFamily: "'Montserrat', sans-serif", cursor: "pointer", width: "100%" },
  btnGhost: { background: "none", border: "1px solid rgba(26,58,107,.2)", borderRadius: "10px", padding: ".65rem 1.4rem", fontSize: ".88rem", fontWeight: 600, fontFamily: "'Montserrat', sans-serif", cursor: "pointer", color: "#5B6380" },
  btnDanger: { background: "#dc2626", color: "#fff", border: "none", borderRadius: "10px", padding: ".65rem 1.4rem", fontSize: ".88rem", fontWeight: 700, fontFamily: "'Montserrat', sans-serif", cursor: "pointer" },
  errorMsg: { color: "#dc2626", fontSize: ".8rem", fontWeight: 600 },
  filterRow: { display: "flex", gap: ".4rem" },
  filterBtn: { background: "none", border: "1px solid rgba(26,58,107,.15)", borderRadius: "50px", padding: ".3rem .85rem", fontSize: ".75rem", fontWeight: 600, cursor: "pointer", color: "#5B6380", fontFamily: "'Montserrat', sans-serif" },
  filterBtnActive: { background: "#1A3A6B", color: "#fff", borderColor: "#1A3A6B" },
  itemList: { display: "flex", flexDirection: "column", gap: ".75rem", maxHeight: "560px", overflowY: "auto" },
  item: { display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem 1.2rem", border: "1px solid rgba(26,58,107,.1)", borderRadius: "12px", background: "rgba(26,58,107,.02)", transition: "border-color .2s" },
  itemDot: { width: "38px", height: "38px", background: "linear-gradient(135deg,#1A3A6B,#31456D)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 800, color: "#fff", flexShrink: 0 },
  itemBody: { flex: 1, minWidth: 0 },
  itemName: { fontSize: ".9rem", fontWeight: 700, color: "#1A1F3C" },
  itemDesc: { fontSize: ".8rem", color: "#5B6380", marginTop: ".2rem", lineHeight: 1.5 },
  itemBadge: { display: "inline-block", marginTop: ".4rem", fontSize: ".68rem", fontWeight: 700, padding: ".2rem .6rem", borderRadius: "50px", background: "rgba(26,58,107,.08)", color: "#1A3A6B", border: "1px solid rgba(26,58,107,.15)" },
  itemDelete: { background: "none", border: "none", color: "#ccc", fontSize: ".85rem", cursor: "pointer", padding: ".25rem", borderRadius: "6px", flexShrink: 0, transition: "color .2s" },
  empty: { color: "#5B6380", fontSize: ".88rem", textAlign: "center", padding: "2rem" },
  toast: { position: "fixed", bottom: "2rem", right: "2rem", background: "#1A3A6B", color: "#fff", padding: ".85rem 1.5rem", borderRadius: "12px", fontSize: ".88rem", fontWeight: 600, boxShadow: "0 8px 24px rgba(26,58,107,.3)", zIndex: 9999 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 },
  modal: { background: "#fff", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "360px", boxShadow: "0 16px 48px rgba(0,0,0,.2)" },
  modalTitle: { fontSize: "1.05rem", fontWeight: 700, color: "#1A1F3C", marginBottom: ".5rem" },
  modalSub: { color: "#5B6380", fontSize: ".88rem", marginBottom: "1.5rem" },
  modalActions: { display: "flex", gap: ".75rem", justifyContent: "flex-end" },
};

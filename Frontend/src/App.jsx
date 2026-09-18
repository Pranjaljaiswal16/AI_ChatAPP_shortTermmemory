import { useState } from "react";
import {
  ArrowUpRight,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from "lucide-react";

const apiRequest = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [notice, setNotice] = useState("");

  const handleAuth = async (credentials) => {
    setNotice("Connecting...");
    try {
      const data = await apiRequest(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      setUser(data.user);
      setNotice("");
    } catch (error) {
      setNotice(error.message);
    }
  };

  if (!user) {
    return (
      <AuthPage mode={mode} setMode={setMode} onSubmit={handleAuth} notice={notice} setNotice={setNotice} />
    );
  }

  return <Studio user={user} onLogout={() => setUser(null)} />;
}

function AuthPage({ mode, setMode, onSubmit, notice, setNotice }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <div className="brand"><span className="brand-mark">f</span> framewise</div>
        <div className="intro-copy">
          <p className="eyebrow"><Sparkles size={15} /> AI-powered visual notes</p>
          <h1>Give every<br /><em>frame</em> a voice.</h1>
          <p className="intro-text">Turn the images you capture into posts with a point of view. Framewise writes the first draft, so you can focus on the story.</p>
        </div>
        <div className="orbit-note"><WandSparkles size={17} /><span>Caption intelligence<br /><strong>Ready when you are</strong></span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <p className="panel-kicker">YOUR CREATIVE STUDIO</p>
          <h2>{mode === "login" ? "Welcome back." : "Start creating."}</h2>
          <p className="panel-subtitle">{mode === "login" ? "Pick up where your visual story left off." : "Create an account and find your visual voice."}</p>
          <form onSubmit={submit}>
            <label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="yourname" /></label>
            <label>Password<input required minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>
            <button className="primary-button" type="submit">{mode === "login" ? "Enter studio" : "Create account"}<ArrowUpRight size={18} /></button>
          </form>
          {notice && <p className="form-notice">{notice}</p>}
          <p className="switch-auth">{mode === "login" ? "New to Framewise?" : "Already have an account?"} <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setNotice(""); }}>{mode === "login" ? "Create account" : "Log in"}</button></p>
        </div>
        <div className="panel-footnote">Private by design <span>•</span> Built for the in-between moments</div>
      </section>
    </main>
  );
}

function Studio({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("");

  const chooseFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPost(null);
    setStatus("");
  };

  const createPost = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setStatus("Writing your caption...");
    try {
      const data = await apiRequest("/api/posts", { method: "POST", body: formData });
      setPost(data.post);
      setStatus("Your post is ready.");
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">f</span> framewise</div>
        <div className="topbar-right"><span className="user-chip">{user.username?.[0]?.toUpperCase()}</span><span>{user.username}</span><button className="logout-button" onClick={onLogout} title="Log out"><LogOut size={17} /></button></div>
      </header>
      <div className="studio-content">
        <div className="studio-heading"><div><p className="eyebrow"><Sparkles size={15} /> CREATIVE STUDIO</p><h1>Make something<br /><em>worth sharing.</em></h1></div><p className="date-note">A quiet place for<br />your loudest ideas.</p></div>
        <section className="workspace-grid">
          <div className="upload-column">
            <div className={`upload-zone ${preview ? "has-preview" : ""}`} onClick={() => document.getElementById("image-input").click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); chooseFile(e.dataTransfer.files[0]); }}>
              {preview ? <img src={preview} alt="Selected preview" /> : <><div className="upload-icon"><ImagePlus size={26} /></div><h3>Drop a frame here</h3><p>or click to browse your images</p><span className="file-rule">JPG, PNG or WEBP <b>•</b> up to 10MB</span></>}
              <input id="image-input" type="file" accept="image/*" hidden onChange={(e) => chooseFile(e.target.files[0])} />
            </div>
            <button className="primary-button create-button" disabled={!file || status === "Writing your caption..."} onClick={createPost}>{status === "Writing your caption..." ? <LoaderCircle className="spin" size={18} /> : <UploadCloud size={18} />}{status === "Writing your caption..." ? "Creating post" : "Generate my post"}</button>
            {status && status !== "Writing your caption..." && !post && <p className="form-notice">{status}</p>}
          </div>
          <aside className="result-column">
            <div className="result-head"><span>01</span><h2>AI caption</h2><WandSparkles size={18} /></div>
            {post ? <div className="post-result"><img src={post.image} alt="Generated post" /><p>{post.caption}</p><span className="ready-label">{status}</span></div> : <div className="empty-result"><WandSparkles size={22} /><p>Your generated caption<br />will appear here.</p><small>Upload an image to begin</small></div>}
          </aside>
        </section>
      </div>
    </main>
  );
}

export default App;
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { listTracks, recommendTracks } from "@/lib/studio.functions";
import type { PublicTrack } from "@/lib/studio.server";
import {
  AudioLines,
  Search,
  Sun,
  Moon,
  Heart,
  Play,
  Pause,
  Sparkles,
  Menu,
  X,
  ArrowUpLeft,
  Plus,
  Trash2,
  Music2,
  MessageCircle,
  Clock3,
  CheckCircle2,
  Upload,
  Wand2,
  LogOut,
} from "lucide-react";
type Track = PublicTrack;
const WHATSAPP_NUMBER = "967700000000"; // استبدله برقم الاستوديو بصيغة دولية دون +
const greeting = () => {
  const h = new Date().getHours();
  return h < 12
    ? "صباح يحمل لكم بداية جميلة"
    : h < 17
      ? "مساء يليق بتفاصيلكم"
      : "ليلتكم أجمل مع استوديو ليل";
};
export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("layl-theme") as "dark" | "light") || "dark",
  );
  const fetchTracks = useServerFn(listTracks);
  const { data: tracks = [], isLoading: loadingTracks } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => fetchTracks(),
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("layl-favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [category, setCategory] = useState("الكل"),
    [search, setSearch] = useState(""),
    [playing, setPlaying] = useState<string | null>(null),
    [onlyFav, setOnlyFav] = useState(false),
    [request, setRequest] = useState(false),
    [admin, setAdmin] = useState(false),
    [menu, setMenu] = useState(false),
    [toast, setToast] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    document.documentElement.dataset["theme"] = theme;
    localStorage.setItem("layl-theme", theme);
  }, [theme]);
  useEffect(() => localStorage.setItem("layl-favorites", JSON.stringify(favorites)), [favorites]);
  const visible = useMemo(
    () =>
      tracks.filter(
        (t) =>
          (category === "الكل" || t.category === category) &&
          (!onlyFav || favorites.includes(t.id)) &&
          `${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [tracks, category, onlyFav, favorites, search],
  );
  const notify = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(""), 2800);
  };
  const play = (t: Track) => {
    if (!t.audioUrl) {
      notify("لم يُرفع ملف صوتي لهذا العمل بعد.");
      return;
    }
    if (playing === t.id) {
      audio.current?.pause();
      setPlaying(null);
      return;
    }
    if (audio.current) {
      audio.current.src = t.audioUrl;
      void audio.current
        .play()
        .then(() => setPlaying(t.id))
        .catch(() => notify("تعذر تشغيل الملف؛ تحقق من المسار."));
    }
  };
  return (
    <div className="shell">
      <audio ref={audio} onEnded={() => setPlaying(null)} />
      <header className="top">
        <a className="brand" href="#home">
          <span className="brand-icon">
            <AudioLines />
          </span>
          <span>
            <b>لَيل</b>
            <small>STUDIO</small>
          </span>
        </a>
        <nav className={menu ? "nav open" : "nav"}>
          <a href="#home" onClick={() => setMenu(false)}>
            الرئيسية
          </a>
          <a href="#library" onClick={() => setMenu(false)}>
            الأعمال
          </a>
          <a href="#about" onClick={() => setMenu(false)}>
            عن الاستوديو
          </a>
          <button
            className="nav-cta"
            onClick={() => {
              setRequest(true);
              setMenu(false);
            }}
          >
            اطلب زفتك <ArrowUpLeft size={15} />
          </button>
        </nav>
        <div className="top-actions">
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="تبديل المظهر"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button className="icon-btn mobile" onClick={() => setMenu(!menu)} aria-label="القائمة">
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <i /> فنّ يصنع للّحظة ذاكرة
            </div>
            <p className="greeting">{greeting()}</p>
            <h1>
              بعض اللحظات
              <br />
              تستحق <em>صوتاً</em> لا يُنسى.
            </h1>
            <p className="lead">
              نصنع زفاتكم وشيلاتكم بعناية، لتكون الموسيقى جزءاً من الحكاية التي تروونها دائماً.
            </p>
            <div className="hero-actions">
              <button className="gold-btn" onClick={() => setRequest(true)}>
                صمّم زفتك الخاصة <ArrowUpLeft size={17} />
              </button>
              <a href="#library" className="listen">
                <span>
                  <Play size={12} fill="currentColor" />
                </span>{" "}
                استمع إلى أعمالنا
              </a>
            </div>
            <div className="hero-meta">
              <span>
                <Sparkles /> تفاصيل تُصنع لكم
              </span>
              <i />
              <span>
                <AudioLines /> هوية صوتية خاصة
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="ring r1" />
            <div className="ring r2" />
            <div className="orb" />
            <div className="art-logo">
              <AudioLines size={50} />
              <small>LAYL</small>
            </div>
            <div className="art-caption">
              YOUR MOMENT
              <br />
              <b>OUR SOUND</b>
            </div>
            <span className="star s1">✦</span>
            <span className="star s2">✧</span>
          </div>
          <div className="hero-index">
            01 <i /> 03
          </div>
        </section>
        <Recommender tracks={tracks} play={play} playing={playing} />
        <section className="section" id="library">
          <div className="section-head">
            <div>
              <div className="eyebrow">
                <i /> مكتبة الاستوديو
              </div>
              <h2>
                أعمال تلامس <em>الإحساس</em>
              </h2>
            </div>
            <p>استكشف نماذج من أعمالنا، واختر الإحساس الأقرب إلى لحظتك.</p>
          </div>
          <div className="tools">
            <div className="tabs">
              {["الكل", "زفات", "شيلات", "مخصص"].map((c) => (
                <button
                  key={c}
                  className={category === c ? "tab active" : "tab"}
                  onClick={() => {
                    setCategory(c);
                    setOnlyFav(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="tool-right">
              <button
                className={onlyFav ? "fav selected" : "fav"}
                onClick={() => setOnlyFav(!onlyFav)}
              >
                <Heart size={15} /> المفضلة
              </button>
              <label className="search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن عمل..."
                />
              </label>
            </div>
          </div>
          <div className="cards">
            {visible.map((t, i) => (
              <article className="track" key={t.id}>
                <div className="cover">
                  <div className="wave">
                    {Array.from({ length: 19 }, (_, n) => (
                      <i key={n} />
                    ))}
                  </div>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <button className="play" onClick={() => play(t)} aria-label="تشغيل">
                    {playing === t.id ? (
                      <Pause fill="currentColor" />
                    ) : (
                      <Play fill="currentColor" />
                    )}
                  </button>
                  <button
                    className={favorites.includes(t.id) ? "heart liked" : "heart"}
                    onClick={() =>
                      setFavorites((old) =>
                        old.includes(t.id) ? old.filter((x) => x !== t.id) : [...old, t.id],
                      )
                    }
                    aria-label="المفضلة"
                  >
                    <Heart size={16} fill={favorites.includes(t.id) ? "currentColor" : "none"} />
                  </button>
                  {t.featured && <span className="featured">اختيار الاستوديو</span>}
                </div>
                <div className="track-info">
                  <div className="track-meta">
                    <span>{t.category}</span>
                    <span>
                      <Clock3 size={12} /> {t.duration}
                    </span>
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                </div>
              </article>
            ))}
            {loadingTracks && (
              <div className="empty">
                <Music2 />
                <b>جارٍ تحميل الأعمال...</b>
              </div>
            )}
            {!loadingTracks && visible.length === 0 && (
              <div className="empty">
                <Music2 />
                <b>لا توجد أعمال مطابقة</b>
                <span>جرّب تغيير البحث أو التصنيف.</span>
              </div>
            )}
          </div>
          <div className="library-foot">
            <span>نعمل على إضافة المزيد من الحكايات الصوتية</span>
            <span>{visible.length} أعمال معروضة</span>
          </div>
        </section>
        <section className="quote" id="about">
          <div>“</div>
          <p>
            ليست مجرد زفة؛ إنها نغمة تبقى
            <br />
            كلما عادت الذاكرة إلى تلك الليلة.
          </p>
          <small>استوديو ليل — نصنع صوت لحظتكم</small>
        </section>
        <section className="custom">
          <div className="custom-icon">
            <AudioLines />
          </div>
          <div>
            <div className="eyebrow">
              <i /> عمل يحمل اسمكم
            </div>
            <h2>حكايتكم لا تشبه غيرها.</h2>
            <p>أخبرونا بالتفاصيل، ونبدأ معكم بصناعة عمل صوتي يليق بالمناسبة.</p>
          </div>
          <button className="gold-btn" onClick={() => setRequest(true)}>
            ابدأ طلبك الآن <ArrowUpLeft />
          </button>
        </section>
      </main>
      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">
            <AudioLines />
          </span>
          <span>
            <b>لَيل</b>
            <small>STUDIO</small>
          </span>
        </a>
        <span>© {new Date().getFullYear()} استوديو ليل. جميع الحقوق محفوظة.</span>
        <div>
          <a href="#library">الأعمال</a>
          <a href="#about">من نحن</a>
          <button onClick={() => setAdmin(true)}>الإدارة</button>
        </div>
      </footer>
      {request && <RequestModal close={() => setRequest(false)} />}
      {admin && <AdminModal tracks={tracks} close={() => setAdmin(false)} />}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}
function RequestModal({ close }: { close: () => void }) {
  const [name, setName] = useState(""),
    [type, setType] = useState("زفة"),
    [occasion, setOccasion] = useState(""),
    [date, setDate] = useState(""),
    [details, setDetails] = useState("");
  const send = () => {
    const msg = `طلب جديد من موقع استوديو ليل\nالاسم: ${name}\nنوع العمل: ${type}\nالمناسبة: ${occasion}\nالتاريخ: ${date || "غير محدد"}\nالتفاصيل: ${details}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal">
        <button className="close" onClick={close}>
          <X />
        </button>
        <div className="eyebrow">
          <i /> طلب مخصص
        </div>
        <h2>لنبدأ حكايتكم.</h2>
        <p className="intro">كلما كانت التفاصيل أوضح، اقتربنا أكثر من العمل الذي تتخيلونه.</p>
        <div className="form">
          <label>
            الاسم
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك الكريم"
            />
          </label>
          <label>
            نوع العمل
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>زفة</option>
              <option>شيلة</option>
              <option>إهداء صوتي</option>
              <option>موسيقى خاصة</option>
            </select>
          </label>
          <label>
            المناسبة
            <input
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="مثلاً: زفاف"
            />
          </label>
          <label>
            تاريخ المناسبة
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="wide">
            التفاصيل
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="الأسماء، الأسلوب، الإيقاع، وأي تفاصيل تحب إضافتها..."
            />
          </label>
        </div>
        <button className="gold-btn submit" disabled={!name.trim()} onClick={send}>
          إرسال الطلب عبر واتساب <MessageCircle />
        </button>
        <small className="note">سيتم فتح واتساب برسالة جاهزة لمراجعتها وإرسالها.</small>
      </div>
    </div>
  );
}
function Recommender({
  tracks,
  play,
  playing,
}: {
  tracks: Track[];
  play: (t: Track) => void;
  playing: string | null;
}) {
  const recommend = useServerFn(recommendTracks);
  const [mood, setMood] = useState(""),
    [busy, setBusy] = useState(false),
    [result, setResult] = useState<{
      message: string;
      picks: { id: string; reason: string }[];
    } | null>(null),
    [error, setError] = useState("");
  const ask = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await recommend({ data: { mood } });
      if (r.error) setError(r.error);
      else setResult({ message: r.message, picks: r.picks });
    } catch {
      setError("تعذر الحصول على اقتراحات الآن، حاول مرة أخرى بعد قليل.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="section ai-match" id="match">
      <div className="section-head">
        <div>
          <div className="eyebrow">
            <i /> مستشار ليل
          </div>
          <h2>
            صف لنا <em>لحظتك</em>
          </h2>
        </div>
        <p>اكتب المناسبة أو الإحساس الذي تتخيله، وسنقترح لك الأعمال الأقرب إليه.</p>
      </div>
      <div className="ai-box">
        <textarea
          value={mood}
          maxLength={500}
          onChange={(e) => setMood(e.target.value)}
          placeholder="مثلاً: دخول العروس بهدوء ورقي، أجواء عائلية دافئة..."
        />
        <button className="gold-btn" disabled={busy || mood.trim().length < 3} onClick={ask}>
          {busy ? "جارٍ الاختيار..." : "اقترح لي"} <Wand2 size={16} />
        </button>
      </div>
      {error && <p className="ai-error">{error}</p>}
      {result && (
        <div className="ai-results">
          {result.message && <p className="ai-message">{result.message}</p>}
          {result.picks.length === 0 && (
            <p className="ai-message">لم نجد عملاً مطابقاً، اطلب زفتك الخاصة.</p>
          )}
          {result.picks.map((p) => {
            const t = tracks.find((x) => x.id === p.id);
            if (!t) return null;
            return (
              <div className="ai-pick" key={p.id}>
                <button className="play" onClick={() => play(t)} aria-label="تشغيل">
                  {playing === t.id ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                </button>
                <div>
                  <b>{t.title}</b> <small>{t.category}</small>
                  <span>{p.reason}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

const fmtDuration = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
const readDuration = (file: File) =>
  new Promise<string>((resolve) => {
    const a = new Audio();
    const url = URL.createObjectURL(file);
    a.preload = "metadata";
    a.onloadedmetadata = () => {
      resolve(Number.isFinite(a.duration) ? fmtDuration(a.duration) : "—");
      URL.revokeObjectURL(url);
    };
    a.onerror = () => resolve("—");
    a.src = url;
  });

function AdminModal({ tracks, close }: { tracks: Track[]; close: () => void }) {
  const [session, setSession] = useState<Session | null>(null),
    [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase
      .rpc("has_role", { _user_id: session.user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);
  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal admin">
        <button className="close" onClick={close}>
          <X />
        </button>
        <div className="eyebrow">
          <i /> إدارة المكتبة
        </div>
        {!session ? (
          <AdminLogin />
        ) : isAdmin === null ? (
          <p className="intro">جارٍ التحقق...</p>
        ) : !isAdmin ? (
          <>
            <h2>لا تملك صلاحية الإدارة</h2>
            <p className="intro">هذا الحساب ليس حساب مالك الاستوديو.</p>
            <button className="gold-btn submit" onClick={() => supabase.auth.signOut()}>
              <LogOut /> تسجيل الخروج
            </button>
          </>
        ) : (
          <AdminPanel tracks={tracks} email={session.user.email ?? ""} />
        )}
      </div>
    </div>
  );
}

function AdminLogin() {
  const [mode, setMode] = useState<"in" | "up">("in"),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("البريد أو كلمة المرور غير صحيحة.");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setMsg(
        error ? error.message : "تم إنشاء الحساب. افتح رسالة التأكيد في بريدك ثم سجّل الدخول.",
      );
    }
    setBusy(false);
  };
  return (
    <>
      <h2>{mode === "in" ? "دخول المالك" : "إنشاء حساب المالك"}</h2>
      <p className="intro">
        {mode === "in"
          ? "سجّل الدخول لإدارة الأعمال ورفع الملفات الصوتية."
          : "أول حساب يُنشأ يصبح حساب مالك الاستوديو."}
      </p>
      <div className="form">
        <label className="wide">
          البريد الإلكتروني
          <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="wide">
          كلمة المرور
          <input
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button
        className="gold-btn submit"
        disabled={busy || !email || password.length < 6}
        onClick={submit}
      >
        {mode === "in" ? "دخول" : "إنشاء الحساب"}
      </button>
      {msg && <small className="note">{msg}</small>}
      <button className="link-btn" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "لا يوجد حساب بعد؟ أنشئ حساب المالك" : "لديك حساب؟ سجّل الدخول"}
      </button>
    </>
  );
}

async function uploadAudio(trackId: string, file: File) {
  const ext = (file.name.split(".").pop() || "mp3").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${trackId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("track-audio")
    .upload(path, file, { contentType: file.type || "audio/mpeg" });
  if (error) throw error;
  const duration = await readDuration(file);
  const { error: e2 } = await supabase
    .from("tracks")
    .update({ audio_path: path, duration })
    .eq("id", trackId);
  if (e2) throw e2;
}

function AdminPanel({ tracks, email }: { tracks: Track[]; email: string }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(""),
    [category, setCategory] = useState("زفات"),
    [description, setDescription] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [busy, setBusy] = useState<string | null>(null),
    [msg, setMsg] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["tracks"] });
  const run = async (key: string, fn: () => Promise<void>, ok: string) => {
    setBusy(key);
    setMsg("");
    try {
      await fn();
      await refresh();
      setMsg(ok);
    } catch {
      setMsg("حدث خطأ، حاول مرة أخرى.");
    } finally {
      setBusy(null);
    }
  };
  const add = () =>
    run(
      "add",
      async () => {
        const { data, error } = await supabase
          .from("tracks")
          .insert({ title: title.trim(), category, description: description.trim() })
          .select("id")
          .single();
        if (error) throw error;
        if (file) await uploadAudio(data.id, file);
        setTitle("");
        setDescription("");
        setFile(null);
      },
      "تمت إضافة العمل.",
    );
  return (
    <>
      <h2>إضافة عمل جديد</h2>
      <p className="intro">
        مسجّل باسم {email} ·{" "}
        <button className="link-btn inline" onClick={() => supabase.auth.signOut()}>
          تسجيل الخروج
        </button>
      </p>
      <div className="form">
        <label className="wide">
          عنوان العمل
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="اسم العمل" />
        </label>
        <label>
          التصنيف
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>زفات</option>
            <option>شيلات</option>
            <option>مخصص</option>
          </select>
        </label>
        <label>
          الملف الصوتي
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="wide">
          وصف العمل
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف قصير"
          />
        </label>
      </div>
      <button className="gold-btn submit" disabled={!title.trim() || !!busy} onClick={add}>
        <Plus /> {busy === "add" ? "جارٍ الحفظ..." : "إضافة العمل"}
      </button>
      {msg && <small className="note">{msg}</small>}
      <div className="admin-list">
        {tracks.map((t) => (
          <div key={t.id}>
            <span>
              {t.title}
              <small>
                {t.category} · {t.audioUrl ? "الصوت مرفوع" : "بلا صوت"}
              </small>
            </span>
            <span className="admin-actions">
              <label className="upload-btn" aria-label="رفع ملف صوتي">
                {busy === t.id ? "..." : <Upload />}
                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  disabled={!!busy}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void run(t.id, () => uploadAudio(t.id, f), `تم رفع صوت «${t.title}».`);
                  }}
                />
              </label>
              <button
                disabled={!!busy}
                onClick={() =>
                  run(
                    "del" + t.id,
                    async () => {
                      const { error } = await supabase.from("tracks").delete().eq("id", t.id);
                      if (error) throw error;
                    },
                    "تم حذف العمل.",
                  )
                }
                aria-label="حذف"
              >
                <Trash2 />
              </button>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

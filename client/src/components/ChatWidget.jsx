import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api";

const TOKEN_KEY = "pps_chat_token";
const NAME_KEY = "pps_chat_name";

const readStorage = (k) => {
  try { return localStorage.getItem(k) || ""; } catch { return ""; }
};
const writeStorage = (k, v) => {
  try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch { /* storage unavailable */ }
};

export default function ChatWidget() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "ht";

  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(() => readStorage(TOKEN_KEY));
  const [name, setName] = useState(() => readStorage(NAME_KEY));
  const [messages, setMessages] = useState([]);
  const [agentOnline, setAgentOnline] = useState(false);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");
  const lastId = useRef(0);
  const openRef = useRef(open);
  const scroller = useRef(null);
  openRef.current = open;

  const merge = useCallback((incoming) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !seen.has(m.id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });
    lastId.current = Math.max(lastId.current, ...incoming.map((m) => m.id));
    if (incoming.some((m) => m.sender !== "visitor")) {
      setWaiting(false);
      if (!openRef.current) setUnread((n) => n + incoming.filter((m) => m.sender !== "visitor").length);
    }
  }, []);

  // Let other pages open the chat (e.g. the "Chat with us" button on the tracking page)
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("pps:open-chat", openIt);
    return () => window.removeEventListener("pps:open-chat", openIt);
  }, []);

  // Resume an existing conversation
  useEffect(() => {
    if (!token) return;
    api("/api/chat/start", { method: "POST", body: { token, language: lang } })
      .then((d) => {
        if (d.token !== token) { setToken(d.token); writeStorage(TOKEN_KEY, d.token); }
        setMessages(d.messages);
        lastId.current = d.messages.reduce((m, x) => Math.max(m, x.id), 0);
        setAgentOnline(d.agentOnline);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll: fast when open, slow in the background (to show the unread dot)
  useEffect(() => {
    if (!token) return undefined;
    const tick = async () => {
      try {
        const d = await api(`/api/chat/${token}/messages?after=${lastId.current}`);
        setAgentOnline(d.agentOnline);
        merge(d.messages);
      } catch (err) {
        if (err.status === 404) { setToken(""); setMessages([]); writeStorage(TOKEN_KEY, ""); lastId.current = 0; }
      }
    };
    const id = setInterval(tick, open ? 3000 : 15000);
    return () => clearInterval(id);
  }, [token, open, merge]);

  useEffect(() => { if (open) setUnread(0); }, [open]);

  // Stop the "typing…" bubble if nothing arrives
  useEffect(() => {
    if (!waiting) return undefined;
    const id = setTimeout(() => setWaiting(false), 30000);
    return () => clearTimeout(id);
  }, [waiting]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, waiting, open]);

  // Status for the header/welcome when there is no conversation yet
  useEffect(() => {
    if (!open || token) return;
    api("/api/chat/status").then((d) => setAgentOnline(d.agentOnline)).catch(() => {});
  }, [open, token]);

  const start = async (e) => {
    e?.preventDefault();
    try {
      const d = await api("/api/chat/start", { method: "POST", body: { name: name.trim(), language: lang } });
      writeStorage(TOKEN_KEY, d.token);
      writeStorage(NAME_KEY, name.trim());
      setToken(d.token);
      setMessages(d.messages);
      lastId.current = 0;
      setAgentOnline(d.agentOnline);
    } catch {
      setError(t("chat.error"));
    }
  };

  const send = async (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !token) return;
    setDraft("");
    setError("");
    try {
      const d = await api(`/api/chat/${token}/messages`, {
        method: "POST",
        body: { body, language: lang, name },
      });
      merge([d.message]);
      setAgentOnline(d.agentOnline);
      setWaiting(!d.agentOnline);
    } catch {
      setDraft(body);
      setError(t("chat.error"));
    }
  };

  const label = (sender) => (sender === "admin" ? t("chat.team") : t("chat.ai"));

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t("chat.open")}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-pp-gold px-5 py-4 font-bold text-pp-navy shadow-2xl transition hover:scale-105"
        >
          <span className="text-xl">💬</span>
          <span className="hidden sm:inline">{t("chat.open")}</span>
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t("chat.title")}
          className="fixed inset-x-0 bottom-0 z-[60] flex h-[85vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-dark-card sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[560px] sm:w-[380px] sm:rounded-3xl"
        >
          <div className="flex items-center justify-between bg-pp-navy px-5 py-4 text-white dark:bg-dark-surface">
            <div>
              <p className="font-bold">{t("chat.title")}</p>
              <p className="flex items-center gap-2 text-xs text-white/80">
                <span className={`h-2 w-2 rounded-full ${agentOnline ? "bg-green-400" : "bg-pp-gold"}`} />
                {agentOnline ? t("chat.online") : t("chat.away")}
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t("chat.close")} className="rounded-full p-2 text-xl leading-none hover:bg-white/10">
              ✕
            </button>
          </div>

          {!token ? (
            <form onSubmit={start} className="flex flex-1 flex-col justify-center gap-4 p-6">
              <p className="text-center text-pp-deep dark:text-dark-text">
                {agentOnline ? t("chat.welcomeOnline") : t("chat.welcomeAway")}
              </p>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-pp-deep dark:text-dark-text">{t("chat.namePrompt")}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("chat.namePlaceholder")}
                  autoComplete="name"
                  className="w-full rounded-xl border border-pp-gray bg-white px-4 py-3 text-pp-deep outline-none focus:border-pp-blue dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                />
              </label>
              <button className="rounded-full bg-pp-gold px-6 py-3 font-bold text-pp-navy transition hover:brightness-110">
                {t("chat.start")}
              </button>
              {error && <p className="text-center text-sm font-semibold text-red-600">{error}</p>}
            </form>
          ) : (
            <>
              <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-pp-gray/60 p-4 dark:bg-dark-bg">
                <div className="rounded-2xl bg-white p-3 text-sm text-pp-deep shadow-sm dark:bg-dark-card dark:text-dark-text">
                  {agentOnline ? t("chat.welcomeOnline") : t("chat.welcomeAway")}
                </div>

                {messages.map((m) => {
                  const mine = m.sender === "visitor";
                  return (
                    <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      {!mine && <span className="mb-1 px-1 text-xs font-semibold text-pp-deep/60 dark:text-dark-text-secondary">{label(m.sender)}</span>}
                      <div
                        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm shadow-sm ${
                          mine
                            ? "rounded-br-md bg-pp-blue text-white"
                            : "rounded-bl-md bg-white text-pp-deep dark:bg-dark-card dark:text-dark-text"
                        }`}
                      >
                        {m.body}
                      </div>
                    </div>
                  );
                })}

                {waiting && (
                  <p className="px-1 text-xs italic text-pp-deep/60 dark:text-dark-text-secondary">
                    {t("chat.ai")} {t("chat.typing")}
                  </p>
                )}
              </div>

              {!agentOnline && (
                <p className="bg-pp-gold/15 px-4 py-1.5 text-center text-[11px] text-pp-deep dark:text-dark-text-secondary">
                  {t("chat.aiNotice")}
                </p>
              )}
              {error && <p className="px-4 py-1 text-center text-xs font-semibold text-red-600">{error}</p>}

              <form onSubmit={send} className="flex gap-2 border-t border-pp-gray bg-white p-3 dark:border-dark-border dark:bg-dark-card">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={1000}
                  placeholder={t("chat.placeholder")}
                  className="min-w-0 flex-1 rounded-full border border-pp-gray bg-white px-4 py-2 text-sm text-pp-deep outline-none focus:border-pp-blue dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                />
                <button disabled={!draft.trim()} className="rounded-full bg-pp-navy px-5 py-2 text-sm font-bold text-white transition hover:bg-pp-deep disabled:opacity-40 dark:bg-dark-accent-blue">
                  {t("chat.send")}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

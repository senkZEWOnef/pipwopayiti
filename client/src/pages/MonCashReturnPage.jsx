import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import { Card, PageHeader } from "../components/FormBits";

const PENDING_KEY = "pps_moncash_pending";

// MonCash sends the customer back here (set this URL in the MonCash business portal).
// We never trust the browser: the server re-checks the payment with MonCash.
export default function MonCashReturnPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [state, setState] = useState("checking"); // checking | ok | notCompleted | error | noRef
  const [tracking, setTracking] = useState(null);

  const confirm = useCallback(async () => {
    const transactionId = params.get("transactionId") || params.get("transaction_id") || "";
    let pending = null;
    try {
      pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
    } catch {
      /* ignore */
    }
    if (!transactionId && !pending?.orderId) return setState("noRef");

    setState("checking");
    try {
      const r = await api("/api/moncash/confirm", {
        method: "POST",
        body: { transactionId, orderId: pending?.orderId },
      });
      if (r.success) {
        try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
        setTracking(r.trackingNumber);
        setState("ok");
        setTimeout(() => navigate(`/shipping/track/${r.trackingNumber}?moncash=paid`, { replace: true }), 2500);
      } else {
        setTracking(pending?.trackingNumber || null);
        setState("notCompleted");
      }
    } catch {
      setTracking(pending?.trackingNumber || null);
      setState("error");
    }
  }, [params, navigate]);

  useEffect(() => { confirm(); }, [confirm]);

  const icon = { checking: "⏳", ok: "✅", notCompleted: "⚠️", error: "⚠️", noRef: "❓" }[state];

  return (
    <div className="bg-pp-gray pb-20 dark:bg-dark-bg">
      <PageHeader icon="📱" title={t("shipping.moncash.title")} />
      <div className="relative z-10 mx-auto -mt-8 max-w-xl px-6">
        <Card>
          <div className="text-center">
            <div className="mb-3 text-5xl">{icon}</div>
            <p className="mb-6 text-lg font-semibold text-pp-deep dark:text-dark-text">
              {state === "checking" && t("shipping.moncash.checking")}
              {state === "ok" && t("shipping.moncash.success")}
              {state === "notCompleted" && t("shipping.moncash.notCompleted")}
              {state === "error" && t("shipping.moncash.error")}
              {state === "noRef" && t("shipping.moncash.noRef")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {(state === "notCompleted" || state === "error") && (
                <button onClick={confirm} className="rounded-full bg-pp-navy px-6 py-3 font-bold text-white transition hover:bg-pp-deep dark:bg-dark-accent-blue">
                  {t("shipping.moncash.retry")}
                </button>
              )}
              <Link
                to={tracking ? `/shipping/track/${tracking}` : "/shipping/track"}
                className="rounded-full border-2 border-pp-navy px-6 py-3 font-semibold text-pp-navy transition hover:bg-pp-navy hover:text-white dark:border-dark-accent-blue dark:text-dark-accent-blue"
              >
                {t("shipping.moncash.backToTrack")}
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

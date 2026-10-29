import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import Spinner from "./Spinner";
import { getAviatorHistory } from "../repository/HistoryRepository";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "win", label: "Win" },
  { value: "lose", label: "Lose" },
  { value: "cancel", label: "Cancel" },
];

function groupIndianDigits(whole) {
  if (whole.length <= 3) {
    return whole;
  }
  const head = whole.slice(0, -3);
  const tail = whole.slice(-3);
  return `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${tail}`;
}

function formatInr(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const text = String(value).trim();
  if (!/^-?\d+(\.\d+)?$/.test(text)) {
    return text;
  }

  const negative = text.startsWith("-");
  const unsigned = negative ? text.slice(1) : text;
  const [whole, fraction] = unsigned.split(".");
  const grouped = groupIndianDigits(whole);
  const amount = fraction !== undefined ? `${grouped}.${fraction}` : grouped;
  return `${negative ? "-" : ""}₹${amount}`;
}

function formatNetResult(value) {
  if (value === null || value === undefined || value === "") {
    return { text: "—", className: "aviator-net-empty" };
  }

  const text = String(value).trim();
  const formatted = formatInr(value) || "—";
  if (text.startsWith("-")) {
    return { text: formatted, className: "aviator-net-negative" };
  }
  if (Number(text) > 0) {
    return { text: `+${formatted}`, className: "aviator-net-positive" };
  }
  return { text: formatted, className: "aviator-net-empty" };
}

function formatHistoryDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value || "";
  const hour = part("hour").padStart(2, "0");
  return `${part("day")} ${part("month")} ${part("year")}, ${hour}:${part("minute")} ${part("dayPeriod").toLowerCase()}`;
}

function statusLabel(status) {
  if (status === "win") return "Won";
  if (status === "lose") return "Lost";
  if (status === "pending") return "Pending";
  if (status === "cancel") return "Cancelled";
  return status || "—";
}

function statusClassName(status) {
  if (status === "win" || status === "lose" || status === "cancel" || status === "pending") {
    return `aviator-status-pill aviator-status-${status}`;
  }
  return "aviator-status-pill";
}

function readAviatorHistory(data) {
  if (data?.error) {
    throw new Error(data.message || "Could not load Aviator history.");
  }

  const history = data?.history || data?.response?.history;
  if (!history || !Array.isArray(history.data)) {
    throw new Error(data?.message || "Aviator history did not return a list.");
  }

  return history;
}

const AviatorHistory = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  const [openKey, setOpenKey] = useState("");

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setDataLoading(true);
      try {
        const { data } = await getAviatorHistory({ page, status, date });
        if (!active) {
          return;
        }

        const history = readAviatorHistory(data);
        const apiPage = Number(history.current_page) || 1;
        setRows(history.data);
        setOpenKey("");
        setCurrentPage(apiPage);
        setLastPage(Number(history.last_page) || 1);
        setPage((current) => (current === apiPage ? current : apiPage));
      } catch (err) {
        if (!active) {
          return;
        }

        const httpStatus = err?.response?.status;
        if (httpStatus === 401 || httpStatus === 419) {
          localStorage.removeItem("authToken");
          toast.error("Your session has expired. Please sign in again.");
          navigate("/auth/login", { replace: true });
          return;
        }

        toast.error(err?.response?.data?.message || err.message || "Could not load Aviator history.");
        setRows([]);
        setOpenKey("");
        setCurrentPage(1);
        setLastPage(1);
      } finally {
        if (active) {
          setDataLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, [page, status, date, navigate]);

  const changeStatus = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const changeDate = (nextDate) => {
    setDate(nextDate);
    setPage(1);
  };

  const toggleDetail = (key) => {
    setOpenKey((current) => (current === key ? "" : key));
  };

  return (
    <>
      <form className="history-filters" onSubmit={(event) => event.preventDefault()}>
        <div className="history-filter-grid">
          <label className="history-filter-field">
            Date
            <input
              className="history-filter-control"
              type="date"
              value={date}
              name="date"
              onChange={(event) => changeDate(event.target.value)}
            />
          </label>
          <label className="history-filter-field">
            Status
            <select
              className="history-filter-control"
              value={status}
              name="status"
              onChange={(event) => changeStatus(event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>

      {!dataLoading && rows.length > 0 ? (
        <div className="aviator-history-list">
          {rows.map((row, index) => {
            const cardKey = row.id || `${row.round_id || "round"}-${index}`;
            const isOpen = openKey === cardKey;
            const detailId = `aviator-bet-detail-${cardKey}`;
            const multiplier = row.cash_out_multiplier === null || row.cash_out_multiplier === undefined || row.cash_out_multiplier === ""
              ? "—"
              : `${row.cash_out_multiplier}×`;
            const netResult = formatNetResult(row.net_result);

            return (
              <article className="aviator-bet-card" key={cardKey}>
                <div className="aviator-bet-card-head">
                  <div>
                    <div className="aviator-bet-title">Aviator</div>
                    <div className="aviator-bet-date">{formatHistoryDate(row.placed_at)}</div>
                  </div>
                  <span className={statusClassName(row.status)}>{statusLabel(row.status)}</span>
                </div>
                <div className="aviator-bet-amounts">
                  <div>
                    <div className="aviator-bet-stat-label">Bet amount</div>
                    <div className="aviator-bet-stat-value">{formatInr(row.stake) || "—"}</div>
                  </div>
                  <div>
                    <div className="aviator-bet-stat-label">Payout</div>
                    <div className="aviator-bet-stat-value">{formatInr(row.payout) || "—"}</div>
                  </div>
                </div>
                <div className="aviator-bet-net">
                  <span>Net result</span>
                  <span className={netResult.className}>{netResult.text}</span>
                </div>
                <button
                  type="button"
                  className="aviator-bet-detail-button"
                  aria-expanded={isOpen}
                  aria-controls={detailId}
                  onClick={() => toggleDetail(cardKey)}
                >
                  <span className={`aviator-bet-chevron${isOpen ? " aviator-bet-chevron-open" : ""}`} />
                  Bet details
                </button>
                {isOpen ? (
                  <div className="aviator-bet-detail" id={detailId}>
                    <div className="aviator-bet-ids">
                      <div>
                        <div className="aviator-bet-detail-label">Bet ID</div>
                        <div className="aviator-bet-detail-value">{row.bet_id || "—"}</div>
                      </div>
                      <div>
                        <div className="aviator-bet-detail-label">Round ID</div>
                        <div className="aviator-bet-detail-value">{row.round_id || "—"}</div>
                      </div>
                    </div>
                    <div className="aviator-bet-detail-stats">
                      <div>
                        <div className="aviator-bet-detail-label">Refund</div>
                        <div className="aviator-bet-detail-value">{formatInr(row.refund) || "—"}</div>
                      </div>
                      <div>
                        <div className="aviator-bet-detail-label">Cash-out multiplier</div>
                        <div className="aviator-bet-detail-value">{multiplier}</div>
                      </div>
                      <div>
                        <div className="aviator-bet-detail-label">Settled</div>
                        <div className="aviator-bet-detail-value">{formatHistoryDate(row.settled_at)}</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}

      {dataLoading && (
        <div className="flex justify-center w-full p-4">
          <Spinner size={24} />
        </div>
      )}

      {!dataLoading && rows.length === 0 ? (
        <div className="w-full p-2 font-semibold text-center">
          No Data Found
        </div>
      ) : null}

      {!dataLoading && (rows.length > 0 || lastPage > 1) && (
        <div className="pb-4">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onChange={setPage}
          />
        </div>
      )}
    </>
  );
};

export default AviatorHistory;

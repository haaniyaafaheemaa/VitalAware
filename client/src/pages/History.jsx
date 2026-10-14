
import { useEffect, useMemo, useState } from "react";

import { getCurrentUserId } from "../services/auth";
import API from "../services/api";

import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Filter,
  HeartPulse,
  Search,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function History() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FORMAT DATE AND TIME
  // ============================================================

  const formatDate = (dateValue) => {
    const dateObject = new Date(dateValue);

    // Handle missing or invalid dates safely.
    if (Number.isNaN(dateObject.getTime())) {
      return {
        dateObject: new Date(0),
        date: "Unknown date",
        time: "--",
      };
    }

    return {
      dateObject,
      date: dateObject.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: dateObject.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // ============================================================
  // FETCH VERIFICATION SESSIONS AND SENSOR MEASUREMENTS
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const userId = getCurrentUserId();

        if (!userId) {
          if (isMounted) {
            setError("Please login before viewing your history.");
          }
          return;
        }

        // Fetch both data sources for the logged-in user.
        const [verificationResponse, measurementResponse] =
          await Promise.all([
            API.get(`/verifications/user/${userId}`),
            API.get(`/measurements/user/${userId}`),
          ]);

        const backendSessions =
          verificationResponse.data?.data || [];

        const backendMeasurements =
          measurementResponse.data?.data || [];

        console.log("Verification sessions:", backendSessions);
        console.log("Sensor measurements:", backendMeasurements);

        // Keep track of measurements already linked to sessions.
        // This prevents displaying the same measurement twice.
        const linkedMeasurementIds = new Set();

        // --------------------------------------------------------
        // 1. FORMAT VERIFICATION SESSIONS
        // --------------------------------------------------------

        const sessionItems = backendSessions.map((session) => {
          const measurement = session.measurementId;

          // measurementId may be a populated object or just an ID.
          if (
            measurement &&
            typeof measurement === "object" &&
            measurement._id
          ) {
            linkedMeasurementIds.add(String(measurement._id));
          }

          const formattedDate = formatDate(
            session.createdAt || session.updatedAt
          );

          const symptoms = Array.isArray(session.symptoms)
            ? session.symptoms
            : [];

          let status = "Started";

          if (session.status === "accepted") {
            status = "Accepted";
          } else if (session.status === "failed") {
            status = "Failed";
          } else if (session.status === "measuring") {
            status = "Measuring";
          }

          return {
            id: `session-${session._id}`,
            ...formattedDate,

            heartRate:
              measurement &&
              typeof measurement === "object"
                ? measurement.heartRate ?? "--"
                : "--",

            ppi:
              measurement &&
              typeof measurement === "object"
                ? measurement.ppi ?? "--"
                : "--",

            quality:
              measurement &&
              typeof measurement === "object"
                ? measurement.signalQuality ?? "--"
                : "--",

            context: session.context || "Not specified",

            symptoms:
              symptoms.length > 0
                ? symptoms.join(", ")
                : "No symptoms recorded",

            status,
            source: "verification",
          };
        });

        // --------------------------------------------------------
        // 2. FORMAT STANDALONE SENSOR MEASUREMENTS
        // --------------------------------------------------------

        const sensorItems = backendMeasurements
          .filter((measurement) => {
            // Do not duplicate a measurement already linked
            // to a verification session.
            return !linkedMeasurementIds.has(
              String(measurement._id)
            );
          })
          .map((measurement) => {
            const formattedDate = formatDate(
              measurement.measuredAt || measurement.createdAt
            );

            const isEsp32 = measurement.source === "esp32";

            return {
              id: `measurement-${measurement._id}`,
              ...formattedDate,

              heartRate: measurement.heartRate ?? "--",
              ppi: measurement.ppi ?? "--",
              quality: measurement.signalQuality ?? "--",

              context: isEsp32
                ? "Live ESP32 measurement"
                : "Recorded measurement",

              symptoms: "No symptoms linked to this measurement",

              status: "Recorded",
              source: measurement.source || "measurement",
            };
          });

        // --------------------------------------------------------
        // 3. COMBINE AND SORT NEWEST FIRST
        // --------------------------------------------------------

        const combinedHistory = [
          ...sessionItems,
          ...sensorItems,
        ].sort(
          (a, b) =>
            b.dateObject.getTime() - a.dateObject.getTime()
        );

        if (isMounted) {
          setSessions(combinedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch VitalAware history:", error);
        console.error("Backend response:", error.response?.data);

        if (isMounted) {
          if (error.response?.status === 401) {
            setError(
              "Your login session is invalid or expired. Please login again."
            );
          } else {
            setError(
              error.response?.data?.message ||
                "Failed to load history. Please check that the backend is running."
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================
  // FILTERS AND SEARCH
  // ============================================================

  const filters = ["All", "Today", "This Week"];

  const filteredSessions = useMemo(() => {
    const now = new Date();

    return sessions.filter((session) => {
      let matchesFilter = true;

      if (filter === "Today") {
        matchesFilter =
          session.dateObject.toDateString() === now.toDateString();
      }

      if (filter === "This Week") {
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const difference = day === 0 ? 6 : day - 1;

        startOfWeek.setDate(
          startOfWeek.getDate() - difference
        );
        startOfWeek.setHours(0, 0, 0, 0);

        matchesFilter =
          session.dateObject >= startOfWeek &&
          session.dateObject <= now;
      }

      const searchText = search.toLowerCase().trim();

      if (!searchText) {
        return matchesFilter;
      }

      const searchableText = [
        session.context,
        session.symptoms,
        session.heartRate,
        session.ppi,
        session.quality,
        session.status,
        session.source,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesFilter && searchableText.includes(searchText)
      );
    });
  }, [sessions, filter, search]);

  // ============================================================
  // SUMMARY DATA
  // ============================================================

  const latestSession = sessions[0];

  const latestHeartRate = latestSession?.heartRate ?? "--";
  const latestQuality = latestSession?.quality ?? "--";

  const latestTime = latestSession?.dateObject
    ? latestSession.dateObject.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  // ============================================================
  // PAGE UI
  // ============================================================

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
          <div>
            <p className="text-sm text-slate-500">
              Your health data
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              Verification History
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 sm:flex">
            <CalendarDays className="h-4 w-4" />
            {sessions.length} records
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          {/* Intro */}
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Longitudinal view
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Your verification history
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review previous measurement sessions, signal
              quality, and the context recorded during each
              verification. Standalone ESP32 readings are included
              when available.
            </p>
          </section>

          {/* Summary Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={<Activity className="h-5 w-5" />}
              label="Records"
              value={sessions.length}
              detail="Saved"
            />

            <SummaryCard
              icon={<HeartPulse className="h-5 w-5" />}
              label="Latest HR"
              value={latestHeartRate}
              detail="BPM"
            />

            <SummaryCard
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Latest Quality"
              value={latestQuality}
              detail={latestQuality === "--" ? "" : "%"}
            />

            <SummaryCard
              icon={<Clock3 className="h-5 w-5" />}
              label="Last Check"
              value={latestTime}
              detail=""
            />
          </section>

          {/* Search and Filters */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by context, symptom or heart rate..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter size={17} className="text-slate-400" />

                <div className="flex rounded-xl bg-slate-100 p-1">
                  {filters.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        filter === item
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* History List */}
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Measurement records
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredSessions.length} record
                  {filteredSessions.length !== 1 ? "s" : ""} shown
                </p>
              </div>

              <div className="hidden items-center gap-1 text-sm font-medium text-slate-500 sm:flex">
                Newest first
                <ChevronDown size={15} />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

                <p className="mt-4 text-sm font-medium text-slate-700">
                  Loading your history...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Fetching saved sessions and sensor readings.
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center">
                <CircleAlertIcon />

                <h3 className="mt-4 font-semibold text-red-900">
                  Unable to load history
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results */}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <HistoryCard
                      key={session.id}
                      session={session}
                    />
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <Search
                      className="mx-auto text-slate-300"
                      size={32}
                    />

                    <h3 className="mt-4 font-semibold text-slate-800">
                      No records found
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {sessions.length === 0
                        ? "Your saved measurements and verification sessions will appear here."
                        : "Try changing your search or filter."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Information */}
          <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <p className="text-sm font-semibold text-blue-900">
                  About your history
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Historical measurements can help establish an
                  individual's usual physiological pattern.
                  VitalAware stores these readings for review;
                  they are screening information, not a clinical
                  diagnosis.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({ icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-2">
        <p className="text-2xl font-bold text-slate-900">
          {value}
        </p>

        {detail && (
          <p className="mb-1 text-xs font-medium text-slate-400">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// HISTORY CARD
// ============================================================

function HistoryCard({ session }) {
  const qualityValue =
    typeof session.quality === "number"
      ? session.quality
      : null;

  const isEsp32 = session.source === "esp32";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Record details */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {session.status}
            </span>

            {isEsp32 && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                ESP32
              </span>
            )}

            <span className="text-xs text-slate-400">
              {session.date} · {session.time}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {session.context}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {session.symptoms}
          </p>
        </div>

        {/* Measurement metrics */}
        <div className="grid grid-cols-3 gap-3">
          <Metric
            label="Heart Rate"
            value={
              session.heartRate === "--"
                ? "--"
                : String(session.heartRate)
            }
            unit={session.heartRate === "--" ? "" : "BPM"}
          />

          <Metric
            label="PPI"
            value={
              session.ppi === "--"
                ? "--"
                : String(session.ppi)
            }
            unit={session.ppi === "--" ? "" : "ms"}
          />

          <Metric
            label="Quality"
            value={
              qualityValue !== null
                ? String(qualityValue)
                : "--"
            }
            unit={qualityValue !== null ? "%" : ""}
          />
        </div>

        <ArrowRight className="hidden h-5 w-5 text-slate-300 lg:block" />
      </div>
    </div>
  );
}

// ============================================================
// METRIC
// ============================================================

function Metric({ label, value, unit }) {
  return (
    <div className="min-w-[90px] rounded-2xl bg-slate-50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-lg font-bold text-slate-900">
          {value}
        </span>

        {unit && (
          <span className="text-[11px] font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ERROR ICON
// ============================================================

function CircleAlertIcon() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    </div>
  );
}

export default History;

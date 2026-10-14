
import { useEffect, useState } from "react";

import {
  Activity,
  Wifi,
  HeartPulse,
  Gauge,
  Clock3,
  ArrowRight,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { getCurrentUserId } from "../services/auth";

function Dashboard() {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch measurements belonging to the logged-in user.
 
useEffect(() => {
  let isMounted = true;

  const fetchMeasurements = async (showLoader = false) => {
    try {
      // Show the loading screen only during the initial fetch.
      if (showLoader && isMounted) {
        setLoading(true);
      }

      const userId = getCurrentUserId();

      if (!userId) {
        if (isMounted) {
          setError("Please login to view your dashboard.");
          setLoading(false);
        }
        return;
      }

      const response = await API.get(
        `/measurements/user/${userId}`
      );

      const records = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      records.sort((a, b) => {
        const dateA = new Date(
          a.measuredAt || a.createdAt
        ).getTime();

        const dateB = new Date(
          b.measuredAt || b.createdAt
        ).getTime();

        return dateB - dateA;
      });

      if (isMounted) {
        setMeasurements(records);
        setError("");
      }
    } catch (err) {
      console.error(
        "Failed to refresh Dashboard measurements:",
        err
      );

      if (isMounted) {
        setError(
          err.response?.data?.message ||
            (err.response?.status === 401
              ? "Your login session may have expired. Please login again."
              : "Unable to refresh measurements. Check your backend connection.")
        );
      }
    } finally {
      if (isMounted && showLoader) {
        setLoading(false);
      }
    }
  };

  // Load the first set of readings.
  fetchMeasurements(true);

  // Check for newly saved readings every 10 seconds.
  const refreshInterval = setInterval(() => {
    fetchMeasurements(false);
  }, 10000);

  // Stop polling when the Dashboard unmounts.
  return () => {
    isMounted = false;
    clearInterval(refreshInterval);
  };
}, []);


  // Latest measurement and chart data.
  const latestMeasurement = measurements[0] || null;

  const chartMeasurements = [...measurements]
    .filter(
      (item) =>
        item.heartRate !== null &&
        item.heartRate !== undefined &&
        Number.isFinite(Number(item.heartRate))
    )
    .slice(0, 12)
    .reverse();

  const heartRateData = chartMeasurements.map((item) => ({
    value: Number(item.heartRate),
    date: new Date(
      item.measuredAt || item.createdAt
    ),
  }));

  const heartRate = latestMeasurement?.heartRate ?? "--";
  const ppi = latestMeasurement?.ppi ?? "--";
  const quality = latestMeasurement?.signalQuality ?? "--";

  const latestDateValue = latestMeasurement
    ? latestMeasurement.measuredAt ||
      latestMeasurement.createdAt
    : null;

  const latestDate = latestDateValue
    ? new Date(latestDateValue)
    : null;

  const validLatestDate =
    latestDate && !Number.isNaN(latestDate.getTime())
      ? latestDate
      : null;

  const formattedLatestTime = validLatestDate
    ? validLatestDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No measurement yet";

  // This is a recent-data indicator, not a hardware heartbeat.
  const isRecentlyActive =
    latestMeasurement?.source === "esp32" &&
    validLatestDate &&
    Date.now() - validLatestDate.getTime() >= 0 &&
    Date.now() - validLatestDate.getTime() <= 2 * 60 * 1000;

  const deviceStatus = isRecentlyActive
    ? "Recently active"
    : "No recent data";

  const qualityDisplay =
    quality === "--"
      ? "--"
      : typeof quality === "number"
        ? `${quality}%`
        : String(quality);

  const qualityColor =
    quality === "--"
      ? "text-slate-500"
      : "text-emerald-600";

  // Dynamic chart scaling: no mock readings are inserted.
  const chartValues = heartRateData.map((item) => item.value);
  const chartMin =
    chartValues.length > 0
      ? Math.min(...chartValues)
      : 0;
  const chartMax =
    chartValues.length > 0
      ? Math.max(...chartValues)
      : 0;

  const getBarHeight = (value) => {
    if (chartValues.length === 0) return 0;

    if (chartMax === chartMin) return 60;

    return 15 + ((value - chartMin) / (chartMax - chartMin)) * 75;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden">
        {/* Top bar */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
          <div>
            <p className="text-sm text-slate-500">
              Health verification
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                My Account
              </p>

              <p className="text-xs text-slate-500">
                Personal dashboard
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
              V
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {/* Welcome */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Your VitalAware Dashboard 👋
              </h2>

              <p className="mt-2 text-slate-500">
                An overview of your latest saved sensor measurement.
              </p>
            </div>

            <a
              href="/verify"
              className="flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Start Verification
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<HeartPulse className="h-5 w-5" />}
              label="Heart Rate"
              value={loading ? "..." : heartRate}
              unit={heartRate === "--" ? "" : "BPM"}
              iconStyle="bg-rose-50 text-rose-500"
            />

            <StatCard
              icon={<Activity className="h-5 w-5" />}
              label="PPI"
              value={loading ? "..." : ppi}
              unit={ppi === "--" ? "" : "ms"}
              iconStyle="bg-blue-50 text-blue-500"
            />

            <StatCard
              icon={<Gauge className="h-5 w-5" />}
              label="Signal Quality"
              value={loading ? "..." : qualityDisplay}
              unit=""
              iconStyle="bg-emerald-50 text-emerald-500"
              valueStyle={qualityColor}
            />

            <StatCard
              icon={<Wifi className="h-5 w-5" />}
              label="Device Data"
              value={
                loading
                  ? "..."
                  : latestMeasurement
                    ? isRecentlyActive
                      ? "Recent"
                      : "Saved"
                    : "No data"
              }
              unit=""
              iconStyle="bg-violet-50 text-violet-500"
              valueStyle="text-violet-600"
            />
          </div>

          {/* Main grid */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Heart rate chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Heart Rate Trend
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Recent saved measurements
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  {chartValues.length} readings
                </span>
              </div>

              {loading ? (
                <div className="mt-8 flex h-64 items-center justify-center text-sm text-slate-500">
                  Loading measurements...
                </div>
              ) : chartValues.length > 0 ? (
                <>
                  <div className="mt-8 flex h-64 items-end gap-2 border-b border-l border-slate-200 px-4 pb-0">
                    {heartRateData.map((item, index) => {
                      const height = getBarHeight(item.value);

                      return (
                        <div
                          key={`${item.date.getTime()}-${index}`}
                          className="group relative flex h-full flex-1 items-end"
                        >
                          <div
                            className="w-full rounded-t-lg bg-emerald-400 transition hover:bg-emerald-500"
                            style={{
                              height: `${height}%`,
                              minHeight: "10%",
                            }}
                          />

                          <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
                            {item.value} BPM
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex justify-between px-4 text-xs text-slate-400">
                    <span>Earlier</span>
                    <span>Latest</span>
                  </div>
                </>
              ) : (
                <div className="mt-8 flex h-64 flex-col items-center justify-center rounded-xl bg-slate-50 px-5 text-center">
                  <Activity className="h-8 w-8 text-slate-300" />

                  <p className="mt-3 font-medium text-slate-700">
                    No heart rate readings yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Saved measurements containing a heart rate will
                    appear here. No sample readings are being shown.
                  </p>
                </div>
              )}
            </div>

            {/* Device status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Device Status
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Based on saved ESP32 readings
                  </p>
                </div>

                <span
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isRecentlyActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isRecentlyActive
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {loading ? "Checking" : deviceStatus}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <DeviceRow
                  label="ESP32 readings"
                  value={
                    loading
                      ? "Checking..."
                      : measurements.filter(
                          (item) => item.source === "esp32"
                        ).length > 0
                        ? "Found in database"
                        : "No ESP32 records"
                  }
                  active={measurements.some(
                    (item) => item.source === "esp32"
                  )}
                />

                <DeviceRow
                  label="Latest data"
                  value={
                    loading
                      ? "Loading..."
                      : validLatestDate
                        ? formattedLatestTime
                        : "Not available"
                  }
                  active={Boolean(latestMeasurement)}
                />

                <DeviceRow
                  label="MongoDB records"
                  value={loading ? "Loading..." : String(measurements.length)}
                  active={measurements.length > 0}
                />

                <DeviceRow
                  label="Data source"
                  value={latestMeasurement?.source || "No data"}
                  active={Boolean(latestMeasurement)}
                />
              </div>

              <a
                href="/device"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open Device Center
                <ArrowRight className="h-4 w-4" />
              </a>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Recent data indicates a recent upload, not a direct
                hardware connection check. Wi-Fi and sensor status
                require separate device telemetry.
              </p>
            </div>
          </div>

          {/* Latest measurement */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-900">
                  Latest Measurement
                </h3>

                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  {loading ? "Loading..." : formattedLatestTime}
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                {loading
                  ? "Loading"
                  : latestMeasurement
                    ? "Saved measurement"
                    : "No measurement"}
              </span>
            </div>

            {latestMeasurement ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <InfoBox
                  label="Heart Rate"
                  value={
                    heartRate === "--"
                      ? "--"
                      : `${heartRate} BPM`
                  }
                />

                <InfoBox
                  label="PPI"
                  value={ppi === "--" ? "--" : `${ppi} ms`}
                />

                <InfoBox
                  label="Signal Quality"
                  value={qualityDisplay}
                />
              </div>
            ) : (
              !loading && (
                <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  No saved measurements were returned for your
                  account. Once a reading is saved, its values will
                  appear here.
                </p>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon,
  label,
  value,
  unit,
  iconStyle,
  valueStyle = "text-slate-900",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-500">{label}</p>

      <div className="mt-1 flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${valueStyle}`}>
          {value}
        </span>

        {unit && (
          <span className="text-xs text-slate-400">{unit}</span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DEVICE ROW
// ============================================================

function DeviceRow({ label, value, active }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <span className="flex items-center gap-2 text-right text-xs font-medium text-slate-500">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            active ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
        {value}
      </span>
    </div>
  );
}

// ============================================================
// INFO BOX
// ============================================================

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default Dashboard;

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Info,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const measurement = location.state || {
    heartRate: 76,
    ppi: 789,
    signalQuality: 94,
    attempt: 2,
    measurementStatus: "accepted",
  };

  const {
    heartRate,
    ppi,
    signalQuality,
    attempt,
    measurementStatus,
  } = measurement;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      <main className="flex-1">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">

          <div>
            <p className="text-sm text-slate-500">
              Health verification
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              Verification Result
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 sm:flex">
            <CheckCircle2 className="h-4 w-4" />
            Measurement accepted
          </div>

        </header>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-8 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          {/* Result Hero */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                    <CheckCircle2
                      className="h-7 w-7 text-emerald-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      Measurement accepted
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                      Verification session completed
                    </h2>
                  </div>

                </div>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500">
                  The measured signal passed the current prototype
                  signal-quality check and can be reviewed alongside the
                  information provided during the session.
                </p>
              </div>

              {/* Session info */}
              <div className="rounded-2xl bg-slate-50 p-5 lg:min-w-64">

                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-400">
                      Measurement attempt
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      Attempt {attempt || 1}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Activity className="h-5 w-5 text-emerald-500" />

                  <div>
                    <p className="text-xs text-slate-400">
                      Session status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-700">
                      {measurementStatus === "accepted"
                        ? "Accepted"
                        : "Review"}
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </section>

          {/* Main Metrics */}
          <section className="mt-6 grid gap-5 md:grid-cols-3">

            <MetricCard
              icon={<HeartPulse className="h-6 w-6" />}
              label="Heart Rate"
              value={heartRate}
              unit="BPM"
              description="Pulse rate from the accepted PPG measurement."
            />

            <MetricCard
              icon={<Activity className="h-6 w-6" />}
              label="Pulse-to-Pulse Interval"
              value={ppi}
              unit="ms"
              description="Representative interval between detected pulses."
            />

            <MetricCard
              icon={<ShieldCheck className="h-6 w-6" />}
              label="Signal Quality"
              value={signalQuality}
              unit="%"
              description="Prototype quality score for this measurement."
            />

          </section>

          {/* Signal Summary */}
          <section className="mt-6 grid gap-6 lg:grid-cols-3">

            {/* Signal Quality */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Signal assessment
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Measurement quality
                  </h3>
                </div>

                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  Good
                </div>

              </div>

              {/* Quality bar */}
              <div className="mt-7">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Signal quality
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {signalQuality}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${signalQuality}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <QualityItem
                  title="Signal accepted"
                  description="The measurement met the current prototype quality threshold."
                />

                <QualityItem
                  title="Re-measurement available"
                  description="A new measurement can be performed if the reading needs verification."
                />

              </div>

            </div>

            {/* Device */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Connected device
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                MAX30102
              </h3>

              <div className="mt-6 space-y-4">

                <DeviceRow
                  label="Sensor"
                  value="Online"
                />

                <DeviceRow
                  label="PPG"
                  value="Detected"
                />

                <DeviceRow
                  label="Signal"
                  value="Accepted"
                />

                <DeviceRow
                  label="Cloud"
                  value="Prototype"
                />

              </div>

            </div>

          </section>

          {/* Context Section */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Info className="h-5 w-5 text-blue-600" />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Context-aware session
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Measurement interpretation context
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  The measurement should be interpreted together with the
                  symptoms, activity, sleep, stress, and measurement context
                  provided during the verification session.
                </p>

              </div>

            </div>

            {/* Context placeholders */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <ContextCard
                label="Primary context"
                value="Session context"
              />

              <ContextCard
                label="Symptoms"
                value="Recorded"
              />

              <ContextCard
                label="Activity"
                value="Recorded"
              />

              <ContextCard
                label="Additional details"
                value="Available"
              />

            </div>

          </section>

          {/* Screening Observation */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <TrendingUp className="h-5 w-5 text-violet-600" />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Screening observation
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Personalized analysis will appear here
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  In the next stage, VitalAware will compare accepted
                  measurements with the user's historical baseline and
                  contextual information to identify meaningful physiological
                  deviations.
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">

              <p className="text-sm font-semibold text-slate-800">
                Current prototype status
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Personalized machine-learning analysis is not connected yet.
                This section is reserved for the future anomaly-analysis and
                explainability layer.
              </p>

            </div>

          </section>

          {/* Actions */}
          <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/measurement")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Re-measure
            </button>

            <button
              type="button"
              onClick={() => navigate("/history")}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View History
            </button>

          </section>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-xs leading-5 text-slate-400">
            VitalAware is a prototype physiological screening framework.
            Measurement results are not a medical diagnosis.
          </div>

        </div>

      </main>

    </div>
  );
}


/* ============================================================= */
/* COMPONENTS                                                     */
/* ============================================================= */

function MetricCard({
  icon,
  label,
  value,
  unit,
  description,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          Accepted
        </span>

      </div>

      <p className="mt-6 text-sm font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-1">

        <span className="text-4xl font-bold tracking-tight text-slate-950">
          {value}
        </span>

        <span className="text-sm font-semibold text-slate-400">
          {unit}
        </span>

      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}


function QualityItem({ title, description }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <div className="flex items-center gap-2">

        <CheckCircle2 className="h-4 w-4 text-emerald-500" />

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}


function DeviceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}


function ContextCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}


export default Result;
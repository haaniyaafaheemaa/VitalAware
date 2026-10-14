import API from "../services/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Fingerprint,
  RefreshCw,
  Wifi,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function Measurement() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data received from Verify page
  const verificationSessionId =
    location.state?.verificationSessionId;

  const userId = location.state?.userId;

  const [status, setStatus] = useState("preparing");
  const [progress, setProgress] = useState(0);
  const [measurementAttempt, setMeasurementAttempt] = useState(1);

  const [heartRate, setHeartRate] = useState(null);
  const [ppi, setPpi] = useState(null);
  const [signalQuality, setSignalQuality] = useState(null);

  // ---------------------------------------------------------
  // Measurement flow
  // ---------------------------------------------------------

  useEffect(() => {
    let timer;

    // PREPARING
    if (status === "preparing") {
      setProgress(0);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setStatus("placing");
            return 100;
          }

          return prev + 10;
        });
      }, 150);

      return () => clearInterval(timer);
    }

    // MEASURING
    if (status === "measuring") {
      setProgress(0);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);

            // First attempt deliberately produces poor signal
            if (measurementAttempt === 1) {
              setSignalQuality(42);
              setHeartRate(null);
              setPpi(null);
              setStatus("poor");
            } else {
              // Accepted prototype measurement
              setHeartRate(76);
              setPpi(789);
              setSignalQuality(94);
              setStatus("accepted");
            }

            return 100;
          }

          return prev + 5;
        });
      }, 100);

      return () => clearInterval(timer);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [status, measurementAttempt]);

  // ---------------------------------------------------------
  // Start measurement
  // ---------------------------------------------------------

  const startMeasurement = () => {
    setProgress(0);
    setStatus("measuring");
  };

  // ---------------------------------------------------------
  // Retry after poor signal
  // ---------------------------------------------------------

  const retryMeasurement = () => {
    setMeasurementAttempt((prev) => prev + 1);
    setProgress(0);
    setHeartRate(null);
    setPpi(null);
    setSignalQuality(null);
    setStatus("measuring");
  };

  // ---------------------------------------------------------
  // Save accepted measurement to MongoDB
  // ---------------------------------------------------------

  const saveMeasurement = async () => {
    try {
      // Check required router state
      if (!verificationSessionId || !userId) {
        throw new Error(
          "Verification session or user information is missing."
        );
      }

      // Check measurement values
      if (
        heartRate === null ||
        ppi === null ||
        signalQuality === null
      ) {
        throw new Error(
          "Measurement values are not available yet."
        );
      }

      // -----------------------------------------------------
      // 1. Prepare measurement data
      // -----------------------------------------------------

      const measurementData = {
        
        heartRate,
        ppi,
        signalQuality,
        measurementAttempt,
        source: "mock",
      };

      console.log(
        "Saving measurement:",
        measurementData
      );

      // -----------------------------------------------------
      // 2. Save measurement in MongoDB
      // -----------------------------------------------------

      const measurementResponse = await API.post(
        "/measurements",
        measurementData
      );

      const measurementId =
        measurementResponse.data.data._id;

      console.log(
        "Measurement saved successfully:",
        measurementResponse.data
      );

      // -----------------------------------------------------
      // 3. Link measurement to verification session
      // -----------------------------------------------------

      const verificationResponse = await API.patch(
        `/verifications/${verificationSessionId}`,
        {
          measurementId,
          status: "accepted",
          result: "Measurement accepted",
        }
      );

      console.log(
        "Verification session updated:",
        verificationResponse.data
      );

      // -----------------------------------------------------
      // 4. Navigate to Result page
      // -----------------------------------------------------

      navigate("/result", {
        state: {
          heartRate,
          ppi,
          signalQuality,
          attempt: measurementAttempt,
          measurementStatus: "accepted",
          verificationSessionId,
          measurementId,
        },
      });
    } catch (error) {
      console.error(
        "Failed to save measurement:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save measurement"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/verify")}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Wifi size={17} />
            Device connection ready
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <Activity
              className="text-emerald-600"
              size={28}
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Health Verification
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Follow the measurement guidance carefully. The
            system first checks signal quality before accepting
            the reading.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Status Header */}
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Measurement
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {status === "preparing" &&
                    "Preparing sensor"}

                  {status === "placing" &&
                    "Place your finger"}

                  {status === "measuring" &&
                    "Measuring signal"}

                  {status === "poor" &&
                    "Signal needs improvement"}

                  {status === "accepted" &&
                    "Measurement accepted"}
                </h2>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                Attempt {measurementAttempt}
              </div>
            </div>
          </div>

          {/* Measurement Area */}
          <div className="px-6 py-10 sm:px-10">

            {/* ================================================= */}
            {/* PREPARING */}
            {/* ================================================= */}

            {status === "preparing" && (
              <div className="text-center">
                <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-60" />

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50">
                    <RefreshCw
                      className="animate-spin text-emerald-600"
                      size={42}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  Preparing your measurement
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Establishing the measurement session and
                  preparing the connected sensor.
                </p>

                <ProgressBar progress={progress} />
              </div>
            )}

            {/* ================================================= */}
            {/* PLACING FINGER */}
            {/* ================================================= */}

            {status === "placing" && (
              <div className="text-center">
                <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-emerald-50">
                  <Fingerprint
                    className="text-emerald-600"
                    size={82}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  Place your finger on the sensor
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Keep your finger gently positioned on the
                  MAX30102 sensor and remain still during
                  measurement.
                </p>

                <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-slate-50 p-4 text-left">
                  <div className="flex gap-3">
                    <ShieldCheck
                      className="mt-0.5 shrink-0 text-emerald-600"
                      size={20}
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Measurement guidance
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Avoid excessive movement or pressing too
                        hard on the sensor.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startMeasurement}
                  className="mt-8 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Start Measurement
                </button>
              </div>
            )}

            {/* ================================================= */}
            {/* MEASURING */}
            {/* ================================================= */}

            {status === "measuring" && (
              <div className="text-center">
                <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-100" />

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50">
                    <Activity
                      className="animate-pulse text-emerald-600"
                      size={50}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  Reading your PPG signal
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Stay still while the system evaluates the
                  incoming signal.
                </p>

                <ProgressBar progress={progress} />

                <div className="mt-4 text-xs font-medium text-slate-400">
                  Analyzing signal quality...
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* POOR SIGNAL */}
            {/* ================================================= */}

            {status === "poor" && (
              <div className="text-center">
                <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-amber-50">
                  <CircleAlert
                    className="text-amber-500"
                    size={76}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  Signal quality is insufficient
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  The current signal is not reliable enough to
                  accept this measurement.
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-amber-100 bg-amber-50 p-5 text-left">
                  <p className="text-sm font-semibold text-amber-900">
                    Try the following
                  </p>

                  <ul className="mt-2 space-y-2 text-xs leading-5 text-amber-800">
                    <li>
                      • Reposition your finger gently.
                    </li>
                    <li>
                      • Keep your hand steady.
                    </li>
                    <li>
                      • Avoid pressing too hard on the sensor.
                    </li>
                  </ul>
                </div>

                <div className="mt-5 text-sm font-medium text-slate-500">
                  Signal quality:{" "}
                  <span className="font-bold text-amber-600">
                    {signalQuality}%
                  </span>
                </div>

                <button
                  onClick={retryMeasurement}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <RefreshCw size={17} />
                  Re-measure
                </button>
              </div>
            )}

            {/* ================================================= */}
            {/* ACCEPTED */}
            {/* ================================================= */}

            {status === "accepted" && (
              <div className="text-center">
                <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2
                    className="text-emerald-600"
                    size={82}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  Measurement accepted
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  The signal passed the prototype quality
                  check. Your measurement can now be reviewed.
                </p>

                {/* Metrics */}
                <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
                  <Metric
                    label="Heart Rate"
                    value={heartRate}
                    unit="BPM"
                  />

                  <Metric
                    label="PPI"
                    value={ppi}
                    unit="ms"
                  />

                  <Metric
                    label="Signal Quality"
                    value={signalQuality}
                    unit="%"
                  />
                </div>

                <button
                  onClick={saveMeasurement}
                  className="mt-8 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Continue to Result
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center text-xs leading-5 text-slate-400">
          VitalAware provides prototype physiological screening
          information and does not provide a medical diagnosis.
        </div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* PROGRESS BAR                                                   */
/* ============================================================= */

function ProgressBar({ progress }) {
  return (
    <div className="mx-auto mt-8 max-w-md">
      <div className="mb-2 flex justify-between text-xs font-medium text-slate-400">
        <span>Processing</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================= */
/* METRIC CARD                                                    */
/* ============================================================= */

function Metric({ label, value, unit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2">
        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>

        <span className="ml-1 text-xs font-medium text-slate-500">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default Measurement;
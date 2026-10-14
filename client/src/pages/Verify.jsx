import API from "../services/api";
import { getCurrentUserId } from "../services/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  HeartPulse,
  Info,
  Moon,
  PersonStanding,
  Sparkles,
  Stethoscope,
  Wind,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Verify() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Required context
  const [symptoms, setSymptoms] = useState([]);
  const [context, setContext] = useState("");

  // Optional additional information
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [activity, setActivity] = useState("");
  const [sleep, setSleep] = useState("");
  const [stress, setStress] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const symptomsList = [
    {
      name: "No unusual symptoms",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      name: "Fatigue",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      name: "Dizziness",
      icon: <PersonStanding className="h-5 w-5" />,
    },
    {
      name: "Palpitations",
      icon: <HeartPulse className="h-5 w-5" />,
    },
    {
      name: "Breathlessness",
      icon: <Wind className="h-5 w-5" />,
    },
    {
      name: "Chest discomfort",
      icon: <Stethoscope className="h-5 w-5" />,
    },
  ];

  const contextList = [
    {
      name: "Resting",
      description: "Sitting or relaxed",
    },
    {
      name: "After walking",
      description: "Light physical activity",
    },
    {
      name: "After exercise",
      description: "Recent physical activity",
    },
    {
      name: "After eating",
      description: "Recently had a meal",
    },
    {
      name: "Just woke up",
      description: "Recently awakened",
    },
    {
      name: "Before sleep",
      description: "Preparing for sleep",
    },
  ];

  const toggleSymptom = (symptom) => {
    setError("");

    if (symptom === "No unusual symptoms") {
      setSymptoms(["No unusual symptoms"]);
      return;
    }

    setSymptoms((current) => {
      const withoutNone = current.filter(
        (item) => item !== "No unusual symptoms"
      );

      if (withoutNone.includes(symptom)) {
        return withoutNone.filter((item) => item !== symptom);
      }

      return [...withoutNone, symptom];
    });
  };

  const canContinue = () => {
    if (step === 1) {
      return symptoms.length > 0;
    }

    if (step === 2) {
      return context !== "";
    }

    return true;
  };

  const nextStep = () => {
    setError("");

    if (canContinue()) {
      setStep((current) => Math.min(3, current + 1));
    } else {
      if (step === 1) {
        setError("Please select at least one symptom option.");
      } else if (step === 2) {
        setError("Please select your current context.");
      }
    }
  };

  const previousStep = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  };

  // Create verification session in MongoDB
  const handleStartMeasurement = async () => {
    try {
      setError("");
      setSubmitting(true);

      const userId = getCurrentUserId();

      if (!userId) {
        setError("Please login before starting a verification.");
        setSubmitting(false);
        return;
      }

      const response = await API.post("/verifications", {
       
        symptoms,
        context,
        additionalDetails,
        activity,
        sleep,
        stress,
      });

      console.log("Verification created:", response.data);

      const sessionId = response.data?.data?._id;

      if (!sessionId) {
        throw new Error(
          "Verification session was created but no session ID was returned."
        );
      }

      // Move to measurement page
      navigate("/measurement", {
        state: {
          verificationSessionId: sessionId,
          userId,
        },
      });
    } catch (error) {
      console.error("Verification creation failed:", error);

      console.error(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create verification session."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
          <div>
            <p className="text-sm text-slate-500">
              Health verification
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              New Verification
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 sm:flex">
            <Activity className="h-4 w-4" />
            Guided session
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">
                Step {step} of 3
              </span>

              <span className="text-slate-400">
                Verification setup
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${(step / 3) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <section>
              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <Stethoscope className="h-6 w-6 text-emerald-600" />
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                  How are you feeling?
                </h2>

                <p className="mt-2 max-w-2xl text-slate-500">
                  Select anything you are currently experiencing.
                  This information provides context for your
                  measurement session.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {symptomsList.map((item) => {
                  const selected = symptoms.includes(item.name);

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleSymptom(item.name)}
                      className={`flex items-center justify-between rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.icon}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {item.name}
                        </span>
                      </div>

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          selected
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Additional details */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Additional details
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Share anything else about how you are feeling.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    Optional
                  </span>
                </div>

                <textarea
                  value={additionalDetails}
                  onChange={(e) =>
                    setAdditionalDetails(
                      e.target.value.slice(0, 300)
                    )
                  }
                  maxLength={300}
                  rows={4}
                  placeholder="For example: Started feeling this after climbing stairs..."
                  className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {additionalDetails.length} / 300
                </div>
              </div>

              {/* Additional context */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Additional context
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    These details are optional and help provide
                    context for the verification session.
                  </p>
                </div>

                {/* Activity */}
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Recent activity
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["None", "Light", "Moderate", "Heavy"].map(
                      (item) => {
                        const selected = activity === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setActivity(item)}
                            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                              selected
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Sleep */}
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Sleep duration
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "< 5 hours",
                      "5–7 hours",
                      "7–9 hours",
                      "> 9 hours",
                    ].map((item) => {
                      const selected = sleep === item;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSleep(item)}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                            selected
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stress */}
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Current stress level
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["Low", "Moderate", "High"].map((item) => {
                      const selected = stress === item;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setStress(item)}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                            selected
                              ? "border-violet-500 bg-violet-50 text-violet-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="mt-6 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <p className="text-sm leading-6 text-blue-800">
                  Your responses provide contextual information for
                  the verification session. They are not used by
                  themselves to diagnose a medical condition.
                </p>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section>
              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Moon className="h-6 w-6 text-blue-600" />
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                  What's your current context?
                </h2>

                <p className="mt-2 max-w-2xl text-slate-500">
                  Tell us what you were doing around the time of
                  the measurement.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {contextList.map((item) => {
                  const selected = context === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setContext(item.name);
                        setError("");
                      }}
                      className={`rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.description}
                          </p>
                        </div>

                        <div
                          className={`h-5 w-5 rounded-full border-4 ${
                            selected
                              ? "border-blue-500"
                              : "border-slate-300"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section>
              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <HeartPulse className="h-6 w-6 text-emerald-600" />
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                  Ready for measurement?
                </h2>

                <p className="mt-2 max-w-2xl text-slate-500">
                  Your context has been recorded. Place your finger
                  on the MAX30102 sensor when the measurement screen
                  appears.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="grid gap-5 sm:grid-cols-3">
                  <ReviewItem
                    label="Symptoms"
                    value={symptoms.join(", ")}
                  />

                  <ReviewItem
                    label="Context"
                    value={context}
                  />

                  <ReviewItem
                    label="Activity"
                    value={activity || "Not specified"}
                  />

                  <ReviewItem
                    label="Sleep"
                    value={sleep || "Not specified"}
                  />

                  <ReviewItem
                    label="Stress"
                    value={stress || "Not specified"}
                  />

                  <ReviewItem
                    label="Additional details"
                    value={
                      additionalDetails || "Not provided"
                    }
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-sm leading-6 text-emerald-800">
                  The measurement is intended for prototype
                  physiological screening and contextual analysis.
                  It does not provide a medical diagnosis.
                </p>
              </div>
            </section>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1 || submitting}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                step === 1 || submitting
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartMeasurement}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Creating session..."
                  : "Start Measurement"}
                {!submitting && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default Verify;
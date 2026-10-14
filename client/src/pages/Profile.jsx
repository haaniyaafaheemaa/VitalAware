import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Cpu,
  Mail,
  Pencil,
  ShieldCheck,
  User,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Profile() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">

          <div>
            <p className="text-sm text-slate-500">
              Account
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              Profile
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 sm:flex">
            <CheckCircle2 size={16} />
            Account active
          </div>

        </header>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">

          {/* Profile Hero */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white">
                  HF
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    VitalAware user
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    Haaniyaa Faheemaa
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Personal health verification account
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil size={16} />
                Edit Profile
              </button>

            </div>

          </section>

          {/* Personal Information */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User size={20} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Personal information
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Information associated with your account
                </p>
              </div>

            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">

              <InfoField
                icon={<User size={17} />}
                label="Full name"
                value="Haaniyaa Faheemaa"
              />

              <InfoField
                icon={<Mail size={17} />}
                label="Email"
                value="haaniyaa@example.com"
              />

              <InfoField
                icon={<CalendarDays size={17} />}
                label="Date of birth"
                value="Not provided"
              />

              <InfoField
                icon={<User size={17} />}
                label="Age"
                value="Not provided"
              />

            </div>

          </section>

          {/* Connected Device */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Cpu size={20} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Connected device
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Device associated with this account
                </p>
              </div>

            </div>

            <div className="mt-7 rounded-2xl bg-slate-50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                    <Activity size={22} />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      VitalAware ESP32
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      VA-ESP32-001
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Connected
                </div>

              </div>

            </div>

          </section>

          {/* Personalization */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ShieldCheck size={20} />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Personalized analysis
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  VitalAware can use historical measurements to establish an
                  individual's usual physiological pattern.
                </p>

              </div>

            </div>

            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-violet-950">
                    Baseline status
                  </p>

                  <p className="mt-1 text-xs text-violet-800">
                    Collecting sufficient historical measurements
                  </p>

                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700">
                  In progress
                </span>

              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">

                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: "45%" }}
                />

              </div>

              <p className="mt-2 text-right text-xs text-violet-700">
                45% established
              </p>

            </div>

          </section>

          {/* Privacy Note */}
          <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex gap-3">

              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-sm font-semibold text-blue-900">
                  Your information
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Profile and measurement information will be stored and
                  managed through the VitalAware backend once database
                  integration is enabled.
                </p>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* ============================================================= */
/* INFO FIELD                                                      */
/* ============================================================= */

function InfoField({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}


export default Profile;
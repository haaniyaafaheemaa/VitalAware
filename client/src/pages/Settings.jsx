import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Cloud,
  Gauge,
  Lock,
  Moon,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Wifi,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [measurementReminders, setMeasurementReminders] = useState(true);
  const [adaptiveMeasurement, setAdaptiveMeasurement] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">

          <div>
            <p className="text-sm text-slate-500">
              Preferences
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              Settings
            </h1>
          </div>

        </header>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">

          {/* Intro */}
          <section className="mb-8">

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Application preferences
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Customize VitalAware
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage measurement behavior, notifications, connectivity, and
              privacy preferences.
            </p>

          </section>

          {/* Measurement */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <SectionHeader
              icon={<Gauge size={20} />}
              title="Measurement"
              description="Control how verification sessions behave."
            />

            <div className="mt-7 divide-y divide-slate-100">

              <SettingRow
                icon={<RefreshCw size={19} />}
                title="Adaptive measurement"
                description="Request another measurement when signal quality is insufficient."
                enabled={adaptiveMeasurement}
                onChange={() =>
                  setAdaptiveMeasurement(!adaptiveMeasurement)
                }
              />

              <SettingRow
                icon={<Gauge size={19} />}
                title="Measurement guidance"
                description="Show positioning and stillness guidance during measurement."
                enabled={true}
                disabled
              />

            </div>

          </section>

          {/* Notifications */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <SectionHeader
              icon={<Bell size={20} />}
              title="Notifications"
              description="Choose when VitalAware can provide reminders."
            />

            <div className="mt-7 divide-y divide-slate-100">

              <SettingRow
                icon={<Bell size={19} />}
                title="Notifications"
                description="Allow VitalAware to display application notifications."
                enabled={notifications}
                onChange={() =>
                  setNotifications(!notifications)
                }
              />

              <SettingRow
                icon={<Smartphone size={19} />}
                title="Measurement reminders"
                description="Receive reminders for planned verification sessions."
                enabled={measurementReminders}
                onChange={() =>
                  setMeasurementReminders(!measurementReminders)
                }
              />

            </div>

          </section>

          {/* Connectivity */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <SectionHeader
              icon={<Wifi size={20} />}
              title="Connectivity"
              description="Manage communication between the device and cloud."
            />

            <div className="mt-7 divide-y divide-slate-100">

              <SettingRow
                icon={<Cloud size={19} />}
                title="Cloud synchronization"
                description="Synchronize accepted device measurements with the connected cloud service."
                enabled={cloudSync}
                onChange={() =>
                  setCloudSync(!cloudSync)
                }
              />

              <SettingRow
                icon={<Wifi size={19} />}
                title="Device connection"
                description="Allow the application to display connected-device status."
                enabled={true}
                disabled
              />

            </div>

          </section>

          {/* Privacy */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <SectionHeader
              icon={<ShieldCheck size={20} />}
              title="Privacy & security"
              description="Information about your account and health data."
            />

            <div className="mt-7 space-y-3">

              <ActionRow
                icon={<Lock size={18} />}
                title="Privacy controls"
                description="Manage how account and measurement information is handled."
              />

              <ActionRow
                icon={<ShieldCheck size={18} />}
                title="Security"
                description="Account authentication and protected API access."
              />

            </div>

          </section>

          {/* Appearance */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <SectionHeader
              icon={<Moon size={20} />}
              title="Appearance"
              description="Application display preferences."
            />

            <div className="mt-7 rounded-2xl bg-slate-50 p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-800">
                    Theme
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Light theme
                  </p>

                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  Current
                </span>

              </div>

            </div>

          </section>

          {/* Prototype note */}
          <section className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">

            <div className="flex gap-3">

              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              />

              <div>

                <p className="text-sm font-semibold text-amber-900">
                  Prototype settings
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  These preferences currently operate within the frontend
                  prototype. They will be persisted to the user's account
                  after backend and database integration.
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
/* SECTION HEADER                                                  */
/* ============================================================= */

function SectionHeader({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
}


/* ============================================================= */
/* SETTING ROW                                                     */
/* ============================================================= */

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">

      <div className="flex items-start gap-4">

        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          {icon}
        </div>

        <div>

          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
            {description}
          </p>

        </div>

      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? "bg-emerald-500"
            : "bg-slate-300"
        } ${
          disabled
            ? "cursor-not-allowed opacity-70"
            : ""
        }`}
      >

        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}


/* ============================================================= */
/* ACTION ROW                                                      */
/* ============================================================= */

function ActionRow({
  icon,
  title,
  description,
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-4 text-left transition hover:bg-slate-50"
    >

      <div className="flex items-center gap-4">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          {icon}
        </div>

        <div>

          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>

        </div>

      </div>

      <ChevronRight
        size={18}
        className="text-slate-300"
      />

    </button>
  );
}


export default Settings;
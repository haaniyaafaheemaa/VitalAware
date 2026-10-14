import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Gauge,
  HardDrive,
  Info,
  Radio,
  RefreshCw,
  Router,
  Signal,
  Wifi,
  WifiOff,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Device() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">

          <div>
            <p className="text-sm text-slate-500">
              Connected hardware
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              Device Center
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            Device online
          </div>

        </header>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

          {/* Intro */}
          <section className="mb-8">

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              IoT device management
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Your VitalAware device
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor the connected ESP32 sensing unit, PPG sensor,
              connectivity, and cloud communication status from one place.
            </p>

          </section>

          {/* Main Device Card */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

              {/* Device Identity */}
              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                  <Cpu size={30} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Primary device
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    VitalAware ESP32
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Device ID: VA-ESP32-001
                  </p>

                </div>

              </div>

              {/* Status */}
              <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 px-5 py-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="text-emerald-600" size={22} />
                </div>

                <div>

                  <p className="text-sm font-semibold text-emerald-900">
                    Connected
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    Last seen just now
                  </p>

                </div>

              </div>

            </div>

            {/* Device Details */}
            <div className="grid border-t border-slate-100 sm:grid-cols-2 lg:grid-cols-4">

              <DeviceDetail
                icon={<Cpu size={18} />}
                label="Controller"
                value="ESP32"
              />

              <DeviceDetail
                icon={<Activity size={18} />}
                label="PPG Sensor"
                value="MAX30102"
              />

              <DeviceDetail
                icon={<Wifi size={18} />}
                label="Network"
                value="Connected"
              />

              <DeviceDetail
                icon={<Database size={18} />}
                label="Cloud"
                value="Connected"
              />

            </div>

          </section>

          {/* Status Grid */}
          <section className="mt-6 grid gap-5 lg:grid-cols-2">

            {/* Sensor Status */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sensor
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    MAX30102 status
                  </h3>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Radio size={20} />
                </div>

              </div>

              <div className="mt-7 space-y-5">

                <StatusRow
                  label="Sensor connection"
                  value="Detected"
                  good
                />

                <StatusRow
                  label="I²C communication"
                  value="Active"
                  good
                />

                <StatusRow
                  label="PPG signal"
                  value="Ready"
                  good
                />

                <StatusRow
                  label="Measurement state"
                  value="Idle"
                  good
                />

              </div>

            </section>

            {/* Connectivity */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Connectivity
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Network & cloud
                  </h3>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Router size={20} />
                </div>

              </div>

              <div className="mt-7 space-y-5">

                <StatusRow
                  label="Wi-Fi"
                  value="Connected"
                  good
                />

                <StatusRow
                  label="Signal strength"
                  value="Good"
                  good
                />

                <StatusRow
                  label="Cloud connection"
                  value="Connected"
                  good
                />

                <StatusRow
                  label="Data synchronization"
                  value="Active"
                  good
                />

              </div>

            </section>

          </section>

          {/* Communication Architecture */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

              <div className="lg:w-1/3">

                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Data pipeline
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Connected measurement flow
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Validated physiological measurements will move from the
                  sensing device through the connected IoT layer before being
                  available to the application.
                </p>

              </div>

              <div className="flex-1">

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">

                  <FlowNode
                    icon={<Cpu size={20} />}
                    title="ESP32"
                    subtitle="Edge device"
                  />

                  <FlowArrow />

                  <FlowNode
                    icon={<Activity size={20} />}
                    title="MAX30102"
                    subtitle="PPG sensing"
                  />

                  <FlowArrow />

                  <FlowNode
                    icon={<Wifi size={20} />}
                    title="Wi-Fi"
                    subtitle="Connectivity"
                  />

                  <FlowArrow />

                  <FlowNode
                    icon={<Database size={20} />}
                    title="Cloud"
                    subtitle="ThingSpeak"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* Device Health */}
          <section className="mt-6 grid gap-5 md:grid-cols-3">

            <HealthCard
              icon={<Gauge size={20} />}
              title="Sampling"
              value="Ready"
              description="Sensor acquisition available"
            />

            <HealthCard
              icon={<Signal size={20} />}
              title="Communication"
              value="Stable"
              description="Connected to network"
            />

            <HealthCard
              icon={<HardDrive size={20} />}
              title="Buffer"
              value="0 pending"
              description="No unsynchronized readings"
            />

          </section>

          {/* Adaptive IoT Feature */}
          <section className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <RefreshCw size={20} />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Adaptive sensing
                </p>

                <h3 className="mt-1 text-lg font-bold text-emerald-950">
                  Quality-aware measurement
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-900/70">
                  The IoT layer is designed to validate signal quality before
                  accepting a measurement. If the signal is insufficient, the
                  device can request another acquisition rather than forwarding
                  an unreliable reading.
                </p>

              </div>

            </div>

          </section>

          {/* Information */}
          <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex gap-3">

              <Info
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-sm font-semibold text-blue-900">
                  Prototype device information
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  The connection states shown here are currently simulated in
                  the frontend. They will be connected to the actual ESP32,
                  MAX30102, Wi-Fi, and cloud pipeline during hardware
                  integration.
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
/* DEVICE DETAIL                                                  */
/* ============================================================= */

function DeviceDetail({
  icon,
  label,
  value,
}) {
  return (
    <div className="border-t border-slate-100 p-5 sm:border-r lg:border-t-0">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}


/* ============================================================= */
/* STATUS ROW                                                     */
/* ============================================================= */

function StatusRow({
  label,
  value,
  good = false,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">

      <div className="flex items-center gap-3">

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            good ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />

        <span className="text-sm text-slate-600">
          {label}
        </span>

      </div>

      <span
        className={`text-sm font-semibold ${
          good ? "text-emerald-700" : "text-slate-700"
        }`}
      >
        {value}
      </span>

    </div>
  );
}


/* ============================================================= */
/* FLOW NODE                                                      */
/* ============================================================= */

function FlowNode({
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex w-full max-w-[150px] flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}


/* ============================================================= */
/* FLOW ARROW                                                     */
/* ============================================================= */

function FlowArrow() {
  return (
    <div className="hidden text-slate-300 sm:block">
      →
    </div>
  );
}


/* ============================================================= */
/* HEALTH CARD                                                     */
/* ============================================================= */

function HealthCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Normal
        </span>

      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}


export default Device;
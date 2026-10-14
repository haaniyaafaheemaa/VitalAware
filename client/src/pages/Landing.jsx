import { ArrowRight, Activity, ShieldCheck, Cpu } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Navbar */}
      <nav className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <Activity className="h-6 w-6 text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              VitalAware
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
            >
              Features
            </a>

            <a
              href="#technology"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
            >
              Technology
            </a>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden text-sm font-semibold text-slate-700 sm:block"
            >
              Log in
            </a>

            <a
              href="/register"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Get Started
            </a>
          </div>

        </div>
      </nav>


      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-100 blur-3xl opacity-60" />
        <div className="absolute -left-40 top-60 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-50" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

          {/* Hero text */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Connected health verification
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Understand your health.
              <span className="text-emerald-500">
                {" "}Stay aware.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              VitalAware connects physiological sensing, user context,
              and intelligent analysis to help you understand meaningful
              changes in your health measurements.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="/register"
                className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-600"
              >
                Start Verification

                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>

              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore
              </a>

            </div>

          </div>


          {/* Hero visual */}
          <div className="relative">

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-2xl shadow-slate-200/60">

              {/* Mock dashboard */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Current verification
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Physiological Overview
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <Activity className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>


                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Heart Rate
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-3xl font-bold">
                        76
                      </span>

                      <span className="mb-1 text-sm text-slate-500">
                        BPM
                      </span>
                    </div>
                  </div>


                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">
                      Signal Quality
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />

                      <span className="text-lg font-bold text-emerald-700">
                        Good
                      </span>
                    </div>
                  </div>

                </div>


                {/* Graph */}
                <div className="mt-5 rounded-2xl bg-slate-950 p-5">

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Heart rate trend
                    </span>

                    <span className="text-sm font-medium text-emerald-400">
                      Live
                    </span>
                  </div>

                  <div className="mt-6 flex h-24 items-end gap-2">

                    {[35, 45, 38, 58, 50, 65, 55, 72, 62, 78, 68, 82].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-emerald-400"
                          style={{ height: `${height}%` }}
                        />
                      )
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-slate-100 bg-slate-50"
      >

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-2xl">
            <p className="font-semibold text-emerald-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              From sensing to understanding.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              VitalAware brings together connected sensing, contextual
              information, and intelligent analysis in one workflow.
            </p>
          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Connect
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Connect the ESP32-based sensing device and acquire
                physiological signals through the MAX30102.
              </p>
            </div>


            <div className="rounded-3xl border border-slate-200 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Verify
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Acquire measurements, evaluate signal quality, and
                repeat the measurement when the signal is unreliable.
              </p>
            </div>


            <div className="rounded-3xl border border-slate-200 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                <ShieldCheck className="h-6 w-6 text-violet-600" />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Understand
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Combine measurements with user context and historical
                information to provide meaningful screening insights.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Features */}
      <section id="features" className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">
            <p className="font-semibold text-emerald-600">
              FEATURES
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              More than a measurement.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              A connected platform designed around reliable sensing,
              context, history, and intelligent health verification.
            </p>
          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {[
              "Adaptive measurement",
              "Signal quality assessment",
              "Connected IoT monitoring",
              "Context-aware analysis",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 h-2 w-10 rounded-full bg-emerald-500" />

                <h3 className="font-bold">
                  {feature}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Designed as part of the VitalAware connected
                  health-verification workflow.
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <Activity className="h-5 w-5 text-white" />
            </div>

            <span className="font-bold text-white">
              VitalAware
            </span>

          </div>

          <p className="text-sm text-slate-400">
            Connected health verification platform.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Landing;
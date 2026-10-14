import {
  Activity,
  LayoutDashboard,
  Stethoscope,
  History,
  Cpu,
  User,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
          <Activity className="h-6 w-6 text-white" />
        </div>

        <span className="text-xl font-bold tracking-tight text-slate-900">
          VitalAware
        </span>

      </div>


      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">

        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          active
          href="/dashboard"
        />

        <SidebarItem
          icon={<Stethoscope className="h-5 w-5" />}
          label="Verify"
          href="/verify"
        />

        <SidebarItem
          icon={<History className="h-5 w-5" />}
          label="History"
          href="/history"
        />

        <SidebarItem
          icon={<Cpu className="h-5 w-5" />}
          label="Device Center"
          href="/device"
        />

        <div className="my-6 border-t border-slate-100" />

        <SidebarItem
          icon={<User className="h-5 w-5" />}
          label="Profile"
          href="/profile"
        />

        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          href="/settings"
        />

      </nav>


      {/* Logout */}
      <div className="border-t border-slate-100 p-4">

        <a
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />

          Log out
        </a>

      </div>

    </aside>
  );
}


function SidebarItem({ icon, label, active = false, href }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}

      {label}
    </a>
  );
}

export default Sidebar;
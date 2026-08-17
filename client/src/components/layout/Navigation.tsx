import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon, ClipboardListIcon } from "@hugeicons/core-free-icons";
import { NavLink } from "react-router";

const navItems = [
  { label: "Dashboard", icon: DashboardSquare01Icon, to: "/" },
  { label: "Tâches", icon: ClipboardListIcon, to: "/tasks" },
];

function Navigation() {
  return (
    <nav className="mt-8 space-y-2">
      {navItems.map(({ label, icon: Icon, to }) => (
        <NavLink to={to} key={label}>
          {({ isActive }) => (
            <div
              className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg text-md font-medium transition-colors hover:cursor-pointer ${
                isActive
                  ? "bg-primary-light"
                  : "text-secondary hover:bg-surface-hover hover:text-primary"
              }`}
            >
              <HugeiconsIcon icon={Icon} size={24} className={isActive ? "text-brand" : ""} />
              {label}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;

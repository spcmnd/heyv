import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { Dropdown } from "antd";
import { NavLink } from "react-router";
import { useAuth } from "../../providers/authContext.ts";
import { navItems } from "./navigationItems.ts";

function BottomNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-10 md:hidden bg-surface border-t border-line px-6 pt-2 pb-4">
      <div className="flex items-center justify-between">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink to={to} key={label} className="flex-1">
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-0.5 py-2 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-tertiary"
                }`}
              >
                <HugeiconsIcon icon={Icon} size={24} />
                <span className="text-xs font-medium">{label}</span>
              </div>
            )}
          </NavLink>
        ))}

        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "name",
                disabled: true,
                label: (
                  <span className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-full bg-beige flex items-center justify-center">
                      <HugeiconsIcon icon={UserIcon} size={16} className="text-primary" />
                    </div>
                    <span className="text-primary font-medium">{user?.firstName}</span>
                  </span>
                ),
              },
              { type: "divider" },
              {
                key: "logout",
                danger: true,
                icon: <HugeiconsIcon icon={Logout01Icon} size={16} />,
                label: "Se déconnecter",
                onClick: logout,
              },
            ],
          }}
        >
          <button className="flex flex-1 flex-col items-center gap-0.5 py-2 text-tertiary cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-beige flex items-center justify-center">
              <HugeiconsIcon icon={UserIcon} size={14} className="text-primary" />
            </div>
            <span className="text-xs font-medium">Profil</span>
          </button>
        </Dropdown>
      </div>
    </nav>
  );
}

export default BottomNav;

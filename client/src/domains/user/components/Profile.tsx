import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, ChevronDownIcon, Logout01Icon } from "@hugeicons/core-free-icons";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useAuth } from "../../../providers/authContext.ts";

function Profile() {
  const { user, logout } = useAuth();

  const menuItems: MenuProps["items"] = [
    {
      key: "logout",
      danger: true,
      icon: <HugeiconsIcon icon={Logout01Icon} size={16} />,
      label: "Se déconnecter",
      onClick: logout,
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="topLeft">
      <button className="flex items-center gap-4 w-full px-4 py-4 rounded-lg border border-line hover:bg-surface hover:cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-beige flex items-center justify-center">
          <HugeiconsIcon icon={UserIcon} size={16} className="text-primary" />
        </div>

        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-primary">{user?.firstName ?? user?.username}</p>
          <p className="text-xs text-tertiary">Voir le profil</p>
        </div>

        <HugeiconsIcon icon={ChevronDownIcon} size={16} className="text-tertiary" />
      </button>
    </Dropdown>
  );
}

export default Profile;

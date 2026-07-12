import { User, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

function Profile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-4 w-full px-4 py-4 rounded-lg border hover:bg-surface hover:cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-beige flex items-center justify-center">
          <User size={16} className="text-primary" />
        </div>

        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-primary">Prénom</p>
          <p className="text-xs text-tertiary">Voir le profil</p>
        </div>

        <ChevronDown
          size={16}
          className={`text-tertiary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface border rounded-lg shadow-sm overflow-hidden">
          <button className="flex items-center gap-4 w-full px-4 py-2 text-sm text-secondary hover:bg-surface text-error transition-colors hover:cursor-pointer">
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;

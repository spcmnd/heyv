import heyvLogo from "../../assets/heyv-logo.png";
import Navigation from "./Navigation";
import Profile from "../../domains/user/components/Profile";

function Sidebar() {
  return (
    <aside className="hidden md:flex h-full py-8 px-4 bg-background w-64 flex-col border-r border-line">
      <img src={heyvLogo} alt="Heyv" className="h-12 self-start pl-4" />
      <div className="flex-1">
        <Navigation />
      </div>
      <Profile />
    </aside>
  );
}

export default Sidebar;

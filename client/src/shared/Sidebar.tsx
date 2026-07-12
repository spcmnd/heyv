import heyvLogo from '../assets/heyv-logo.png';
import Navigation from './Navigation';
import Profile from '../domains/user/components/Profile';

function Sidebar() {
    return (
        <aside className="h-full py-8 px-4 bg-background w-64 flex flex-col">
            <img src={heyvLogo} className="h-12 self-start" />
            <div className="flex-1">
                <Navigation />
            </div>
            <Profile />
        </aside>
    );
}

export default Sidebar;
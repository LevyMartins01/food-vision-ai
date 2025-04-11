
import { Camera, History, Home, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-foodcam-darker px-2 py-3">
      <div className="flex justify-around items-center">
        <NavItem path="/" icon={<Home />} label="Home" active={location.pathname === "/"} />
        <NavItem path="/camera" icon={<Camera />} label="Scan" active={location.pathname === "/camera"} />
        <NavItem path="/history" icon={<History />} label="History" active={location.pathname === "/history"} />
        <NavItem path="/profile" icon={<User />} label="Profile" active={location.pathname === "/profile"} />
      </div>
    </div>
  );
};

interface NavItemProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ path, icon, label, active }: NavItemProps) => (
  <Link to={path} className="flex flex-col items-center">
    <div className={`p-2 rounded-full transition-all duration-300 ${active ? 'blue-gradient blue-glow' : 'text-foodcam-gray hover:text-white'}`}>
      {icon}
    </div>
    <span className={`text-xs mt-1 ${active ? 'text-white' : 'text-foodcam-gray'}`}>
      {label}
    </span>
  </Link>
);

export default Header;

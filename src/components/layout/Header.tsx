
import { Camera, History, Home, User, Scan } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
      <div className="flex justify-around items-center px-4 py-3 max-w-md mx-auto">
        <NavItem 
          path="/" 
          icon={<Home className="w-6 h-6" />} 
          label="Início" 
          active={location.pathname === "/"} 
        />
        <NavItem 
          path="/camera" 
          icon={<div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-foodcam-blue to-purple-600 flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
          </div>} 
          label="Scan" 
          active={location.pathname === "/camera"}
          isMain={true}
        />
        <NavItem 
          path="/history" 
          icon={<History className="w-6 h-6" />} 
          label="Histórico" 
          active={location.pathname === "/history"} 
        />
        <NavItem 
          path="/profile" 
          icon={<User className="w-6 h-6" />} 
          label="Perfil" 
          active={location.pathname === "/profile"} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  isMain?: boolean;
}

const NavItem = ({ path, icon, label, active, isMain }: NavItemProps) => (
  <Link to={path} className="flex flex-col items-center group">
    <div className={`
      relative p-2 rounded-2xl transition-all duration-300
      ${active 
        ? isMain 
          ? 'bg-gradient-to-br from-foodcam-blue to-purple-600 shadow-lg shadow-foodcam-blue/25' 
          : 'bg-white/20 backdrop-blur-sm' 
        : 'hover:bg-white/10'
      }
      ${isMain ? 'transform group-hover:scale-110' : 'group-hover:scale-105'}
    `}>
      <div className={`
        transition-colors duration-300
        ${active 
          ? 'text-white' 
          : 'text-gray-400 group-hover:text-white'
        }
      `}>
        {icon}
      </div>
      {active && !isMain && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-foodcam-blue rounded-full"></div>
      )}
    </div>
    <span className={`
      text-xs mt-1 transition-colors duration-300
      ${active ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}
    `}>
      {label}
    </span>
  </Link>
);

export default Header;

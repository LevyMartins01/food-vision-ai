
import { User, Crown } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  subscription: {
    plan: string;
    isActive: boolean;
  } | null;
}

const ProfileHeader = ({ fullName, email, subscription }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="blue-gradient p-1 rounded-full blue-glow">
        <div className="bg-foodcam-darker p-2 rounded-full">
          <User size={48} className="text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{fullName}</h1>
        <p className="text-foodcam-gray">{email}</p>
        {subscription && subscription.isActive && (
          <div className="flex items-center mt-1 text-amber-400">
            <Crown size={14} className="mr-1" />
            <span className="text-sm font-medium">
              Plano {subscription.plan === "monthly" ? "Mensal" : "Anual"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

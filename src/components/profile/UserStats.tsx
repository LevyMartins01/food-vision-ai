
import { Loader2 } from "lucide-react";

interface UserStatsProps {
  userStats: {
    uploads: number;
    totalCalories: number;
    totalProtein: number;
  };
  statsLoading: boolean;
}

const UserStats = ({ userStats, statsLoading }: UserStatsProps) => {
  return (
    <div className="glass-card p-5 mb-6 min-h-[100px]">
      <h2 className="text-lg font-bold mb-4">Resumo</h2>
      {statsLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-foodcam-blue" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{userStats.uploads}</div>
            <div className="text-foodcam-gray text-sm">Refeições</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{userStats.totalCalories}</div>
            <div className="text-foodcam-gray text-sm">Calorias</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{userStats.totalProtein}g</div>
            <div className="text-foodcam-gray text-sm">Proteína</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;


import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistorySearchProps {
  searchTerm: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const HistorySearch = ({ searchTerm, onChange, onClear }: HistorySearchProps) => {
  return (
    <div className="relative mb-6">
      <Input 
        type="text"
        placeholder="Buscar por nome do alimento..."
        value={searchTerm}
        onChange={onChange}
        className="pl-10 glass-input"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foodcam-gray" />
      {searchTerm && (
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-foodcam-gray hover:bg-foodcam-gray/10"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default HistorySearch;

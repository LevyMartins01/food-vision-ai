
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="blue-gradient text-6xl font-bold mb-6 p-6 rounded-full blue-glow">
        404
      </div>
      <h1 className="text-2xl font-bold mb-2">Página Não Encontrada</h1>
      <p className="text-foodcam-gray mb-8 max-w-xs">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/">
        <Button className="blue-gradient">
          Voltar ao Início
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;

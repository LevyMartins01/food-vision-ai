
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { AuthFormBaseProps } from "./types";

interface ForgotPasswordFormProps extends AuthFormBaseProps {
  setEmail: (email: string) => void;
  email: string;
  switchToLogin: () => void;
}

const ForgotPasswordForm = ({
  isLoading,
  onSubmit,
  setEmail,
  email,
  switchToLogin,
}: ForgotPasswordFormProps) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full blue-gradient mb-4">
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Recuperar senha</h2>
        <p className="text-foodcam-gray">
          Enviaremos as instruções para seu email
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email cadastrado
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-foodcam-gray group-focus-within:text-foodcam-blue transition-colors" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 glass-card border-white/10 focus:border-foodcam-blue focus:ring-2 focus:ring-foodcam-blue/20 transition-all"
              placeholder="seu-email@exemplo.com"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 blue-gradient hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-5 w-5" />
              Enviar instruções
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={switchToLogin}
          className="inline-flex items-center text-sm text-foodcam-blue hover:text-foodcam-blue/80 font-medium transition-colors hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

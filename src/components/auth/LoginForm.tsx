
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { AuthFormBaseProps } from "./types";

interface LoginFormProps extends AuthFormBaseProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  email: string;
  password: string;
  switchToSignup: () => void;
  switchToForgotPassword: () => void;
}

const LoginForm = ({
  isLoading,
  onSubmit,
  setEmail,
  setPassword,
  email,
  password,
  switchToSignup,
  switchToForgotPassword,
}: LoginFormProps) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full blue-gradient mb-4">
          <LogIn className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta</h2>
        <p className="text-foodcam-gray">
          Entre para continuar analisando seus alimentos
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <button
              type="button"
              onClick={switchToForgotPassword}
              className="text-sm text-foodcam-blue hover:text-foodcam-blue/80 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-foodcam-gray group-focus-within:text-foodcam-blue transition-colors" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 h-12 glass-card border-white/10 focus:border-foodcam-blue focus:ring-2 focus:ring-foodcam-blue/20 transition-all"
              placeholder="Sua senha"
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
              Entrando...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Entrar
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-foodcam-gray">
          Não tem uma conta?{" "}
          <button
            onClick={switchToSignup}
            className="text-foodcam-blue hover:text-foodcam-blue/80 font-medium transition-colors hover:underline"
          >
            Cadastre-se gratuitamente
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

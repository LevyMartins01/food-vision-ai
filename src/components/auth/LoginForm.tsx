
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2 } from "lucide-react";
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
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Entre na sua conta</h2>
        <p className="text-foodcam-gray">
          Entre para acessar todos os recursos
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-foodcam-gray" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
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
              className="text-xs text-foodcam-blue hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-foodcam-gray" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="Sua senha"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full blue-gradient"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            <>Entrar</>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-foodcam-gray">
          Não tem uma conta?{" "}
          <button
            onClick={switchToSignup}
            className="text-foodcam-blue hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;

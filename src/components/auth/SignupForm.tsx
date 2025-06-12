
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Loader2, UserPlus } from "lucide-react";
import { AuthFormBaseProps } from "./types";

interface SignupFormProps extends AuthFormBaseProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  switchToLogin: () => void;
}

const SignupForm = ({
  isLoading,
  onSubmit,
  setEmail,
  setPassword,
  setConfirmPassword,
  setFirstName,
  setLastName,
  email,
  password,
  confirmPassword,
  firstName,
  lastName,
  switchToLogin,
}: SignupFormProps) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full blue-gradient mb-4">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Criar conta</h2>
        <p className="text-foodcam-gray">
          Comece sua jornada nutricional hoje mesmo
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium">
              Nome
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-3 h-5 w-5 text-foodcam-gray group-focus-within:text-foodcam-blue transition-colors" />
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-11 h-12 glass-card border-white/10 focus:border-foodcam-blue focus:ring-2 focus:ring-foodcam-blue/20 transition-all"
                placeholder="Seu nome"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium">
              Sobrenome
            </label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12 glass-card border-white/10 focus:border-foodcam-blue focus:ring-2 focus:ring-foodcam-blue/20 transition-all"
              placeholder="Sobrenome"
              required
            />
          </div>
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium">
            Senha
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-foodcam-gray group-focus-within:text-foodcam-blue transition-colors" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 h-12 glass-card border-white/10 focus:border-foodcam-blue focus:ring-2 focus:ring-foodcam-blue/20 transition-all"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirme a senha
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-foodcam-gray group-focus-within:text-foodcam-blue transition-colors" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-11 h-12 glass-card border-white/10 focus:border-foodcam-blue focus:ring-2 focus:ring-foodcam-blue/20 transition-all"
              placeholder="Confirme sua senha"
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
              Criando conta...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5" />
              Criar conta gratuita
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-foodcam-gray">
          Já tem uma conta?{" "}
          <button
            onClick={switchToLogin}
            className="text-foodcam-blue hover:text-foodcam-blue/80 font-medium transition-colors hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

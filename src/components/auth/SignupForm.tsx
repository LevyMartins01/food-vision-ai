
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { AuthFormBaseProps } from "./types";

interface SignupFormProps extends AuthFormBaseProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setName: (name: string) => void;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  switchToLogin: () => void;
}

const SignupForm = ({
  isLoading,
  onSubmit,
  setEmail,
  setPassword,
  setConfirmPassword,
  setName,
  email,
  password,
  confirmPassword,
  name,
  switchToLogin,
}: SignupFormProps) => {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Crie sua conta</h2>
        <p className="text-foodcam-gray">
          Registre-se para começar a usar o FoodCam AI
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-foodcam-gray" />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              placeholder="Seu nome completo"
              required
            />
          </div>
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium">
            Senha
          </label>
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

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirme a senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-foodcam-gray" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              placeholder="Confirme sua senha"
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
              Cadastrando...
            </>
          ) : (
            <>Cadastrar</>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-foodcam-gray">
          Já tem uma conta?{" "}
          <button
            onClick={switchToLogin}
            className="text-foodcam-blue hover:underline"
          >
            Entre
          </button>
        </p>
      </div>
    </>
  );
};

export default SignupForm;

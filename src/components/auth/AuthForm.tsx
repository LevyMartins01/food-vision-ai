
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "login" | "signup" | "forgotPassword";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    // Clear form fields when switching modes
    if (newMode === "forgotPassword") {
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          toast.error("As senhas não coincidem");
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;
        toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Login realizado com sucesso!");
      } else if (mode === "forgotPassword") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        toast.success("Email de recuperação enviado com sucesso!");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Ocorreu um erro durante a autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {mode === "login" 
            ? "Entre na sua conta" 
            : mode === "signup" 
              ? "Crie sua conta" 
              : "Recupere sua senha"}
        </h2>
        <p className="text-foodcam-gray">
          {mode === "login" 
            ? "Entre para acessar todos os recursos" 
            : mode === "signup" 
              ? "Registre-se para começar a usar o FoodCam AI" 
              : "Enviaremos instruções para recuperar sua senha"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
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
                required={mode === "signup"}
              />
            </div>
          </div>
        )}

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

        {mode !== "forgotPassword" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium">
                Senha
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => switchMode("forgotPassword")}
                  className="text-xs text-foodcam-blue hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
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
                required={mode !== "forgotPassword"}
              />
            </div>
          </div>
        )}

        {mode === "signup" && (
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
                required={mode === "signup"}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full blue-gradient"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "login" ? "Entrando..." : mode === "signup" ? "Cadastrando..." : "Enviando..."}
            </>
          ) : (
            <>
              {mode === "login" ? "Entrar" : mode === "signup" ? "Cadastrar" : "Recuperar Senha"}
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        {mode === "login" ? (
          <p className="text-sm text-foodcam-gray">
            Não tem uma conta?{" "}
            <button
              onClick={() => switchMode("signup")}
              className="text-foodcam-blue hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        ) : mode === "signup" ? (
          <p className="text-sm text-foodcam-gray">
            Já tem uma conta?{" "}
            <button
              onClick={() => switchMode("login")}
              className="text-foodcam-blue hover:underline"
            >
              Entre
            </button>
          </p>
        ) : (
          <p className="text-sm text-foodcam-gray">
            Lembrou sua senha?{" "}
            <button
              onClick={() => switchMode("login")}
              className="text-foodcam-blue hover:underline"
            >
              Entre
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;

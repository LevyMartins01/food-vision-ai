
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthMode } from "./types";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mode, setMode] = useState<AuthMode>("login"); // Changed default to login
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
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
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
            },
          },
        });

        if (error) throw error;
        toast.success("Cadastro realizado com sucesso! Verifique seu email.");
        switchMode("login");
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
    <div className="glass-card p-8 w-full max-w-md mx-auto backdrop-blur-lg border border-white/20 shadow-2xl">
      <div className="space-y-6">
        {mode === "login" && (
          <LoginForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            setEmail={setEmail}
            setPassword={setPassword}
            email={email}
            password={password}
            switchToSignup={() => switchMode("signup")}
            switchToForgotPassword={() => switchMode("forgotPassword")}
          />
        )}

        {mode === "signup" && (
          <SignupForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            setEmail={setEmail}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setFirstName={setFirstName}
            setLastName={setLastName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            firstName={firstName}
            lastName={lastName}
            switchToLogin={() => switchMode("login")}
          />
        )}

        {mode === "forgotPassword" && (
          <ForgotPasswordForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            setEmail={setEmail}
            email={email}
            switchToLogin={() => switchMode("login")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthForm;


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
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
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Recupere sua senha</h2>
        <p className="text-foodcam-gray">
          Enviaremos instruções para recuperar sua senha
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

        <Button
          type="submit"
          className="w-full blue-gradient"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>Recuperar Senha</>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-foodcam-gray">
          Lembrou sua senha?{" "}
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

export default ForgotPasswordForm;

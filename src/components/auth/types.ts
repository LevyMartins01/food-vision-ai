
export type AuthMode = "login" | "signup" | "forgotPassword";

export interface AuthFormBaseProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

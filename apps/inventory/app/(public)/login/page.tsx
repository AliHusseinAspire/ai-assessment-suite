import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LoginForm } from './login-form';

export default function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Logo iconClassName="h-10 w-10" className="text-3xl" />
          <p className="mt-2 text-muted-foreground">
            Sign in to manage your inventory
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

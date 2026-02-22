import { Logo } from '@/components/logo';
import { LoginForm } from './login-form';

export default function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen">
      {/* Left gradient panel — desktop only */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary via-teal-600 to-teal-400 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/10" />
          <div className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-white/10" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center text-white">
          <h2 className="text-3xl font-bold">Welcome to EventFlow</h2>
          <p className="mt-3 text-lg text-white/80">
            AI-powered event scheduling with smart conflict detection, natural language input, and team collaboration.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {/* Mobile gradient banner */}
        <div className="mb-8 w-full max-w-md rounded-2xl bg-gradient-to-r from-primary to-teal-400 p-6 text-center text-white lg:hidden">
          <Logo iconClassName="h-10 w-10 mx-auto" className="justify-center text-3xl" />
          <p className="mt-2 text-sm text-white/80">Sign in to manage your events</p>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="hidden flex-col items-center gap-3 lg:flex">
            <Logo iconClassName="h-10 w-10" className="text-3xl" />
            <p className="mt-2 text-muted-foreground">
              Sign in to manage your events
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

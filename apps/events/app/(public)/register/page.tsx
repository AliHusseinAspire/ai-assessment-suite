import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { RegisterForm } from './register-form';

export default function RegisterPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Left gradient panel — desktop only */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-teal-600 via-primary to-emerald-600 dark:from-emerald-950 dark:via-teal-950 dark:to-emerald-900 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10" />
          <div className="absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-white/10" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center text-white">
          <h2 className="text-3xl font-bold">Join EventFlow</h2>
          <p className="mt-3 text-lg text-white/80">
            Create your account and start organizing events with AI-powered scheduling assistance.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {/* Mobile gradient banner */}
        <div className="mb-8 w-full max-w-md rounded-2xl bg-gradient-to-r from-teal-600 to-primary dark:from-emerald-950 dark:to-teal-950 p-6 text-center text-white lg:hidden">
          <Logo iconClassName="h-10 w-10 mx-auto" className="justify-center text-3xl" />
          <p className="mt-2 text-sm text-white/80">Get started with EventFlow</p>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="hidden flex-col items-center gap-3 lg:flex">
            <Logo iconClassName="h-10 w-10" className="text-3xl" />
            <p className="text-muted-foreground">
              Get started with EventFlow event scheduling
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

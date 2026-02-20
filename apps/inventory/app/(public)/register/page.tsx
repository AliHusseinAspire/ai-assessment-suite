import { Logo } from '@/components/logo';
import { RegisterForm } from './register-form';

export default function RegisterPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Logo iconClassName="h-10 w-10" className="text-3xl" />
          <p className="text-muted-foreground">
            Get started with StockSmart inventory management
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

import { LoginForm } from '@/components/auth/login-form';
import Logo from '@/components/shared/logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

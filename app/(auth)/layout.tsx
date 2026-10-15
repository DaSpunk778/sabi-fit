export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-120 flex-col overflow-hidden bg-bg">
      {children}
    </div>
  );
}

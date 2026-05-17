import { AppShell, Dashboard, ToastProvider, ToastViewport, TooltipProvider } from '@craftzbay/ui';

const Brand = () => (
  <span className="flex items-center gap-2 text-sm font-semibold">
    <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-on-accent text-xs">
      ✦
    </span>
    __PROJECT_NAME__
  </span>
);

export function App() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <AppShell brand={<Brand />} active="home">
          <Dashboard
            title="Overview"
            subtitle="Replace this with your own data — every section is a prop."
          />
        </AppShell>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}

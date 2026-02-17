import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Outlet />
      <footer className="border-t border-border mt-12">
        <div className="container py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 FinanceFlow. Smart money management for a better future.
          </p>
        </div>
      </footer>
    </div>
  );
}

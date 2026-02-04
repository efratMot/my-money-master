import { motion } from 'framer-motion';
import { Wallet, Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/budgets', label: 'Budgets' },
  { href: '/reports', label: 'Reports' },
  { href: '/goals', label: 'Goals' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary glow-primary">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FinanceFlow</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Smart Money Management</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}

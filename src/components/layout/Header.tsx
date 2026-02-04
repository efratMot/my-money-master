import { motion } from 'framer-motion';
import { Wallet, Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary glow-primary">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FinanceFlow</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Smart Money Management</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-primary">Dashboard</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Transactions</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Budgets</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Goals</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
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
            <a href="#" className="block py-2 text-sm font-medium text-primary">Dashboard</a>
            <a href="#" className="block py-2 text-sm font-medium text-muted-foreground">Transactions</a>
            <a href="#" className="block py-2 text-sm font-medium text-muted-foreground">Budgets</a>
            <a href="#" className="block py-2 text-sm font-medium text-muted-foreground">Reports</a>
            <a href="#" className="block py-2 text-sm font-medium text-muted-foreground">Goals</a>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}

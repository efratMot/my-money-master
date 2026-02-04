import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { SavingsGoalCard } from '@/components/dashboard/SavingsGoalCard';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { AddTransactionDialog } from '@/components/dashboard/AddTransactionDialog';
import { useFinanceData } from '@/hooks/useFinanceData';

const Index = () => {
  const {
    totalIncome,
    totalExpenses,
    netBalance,
    budgets,
    savingsGoals,
    expensesByCategory,
    recentTransactions,
    addTransaction,
  } = useFinanceData();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const savingsTotal = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Track your finances at a glance</p>
          </div>
          <AddTransactionDialog onAddTransaction={addTransaction} />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Balance"
            value={formatCurrency(netBalance)}
            change="+12.5% from last month"
            changeType="positive"
            icon={DollarSign}
            delay={0}
          />
          <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            change={`${recentTransactions.filter(t => t.type === 'income').length} transactions`}
            changeType="positive"
            icon={TrendingUp}
            delay={0.1}
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            change={`${recentTransactions.filter(t => t.type === 'expense').length} transactions`}
            changeType="negative"
            icon={TrendingDown}
            delay={0.15}
          />
          <StatCard
            title="Total Savings"
            value={formatCurrency(savingsTotal)}
            change="On track for goals"
            changeType="positive"
            icon={PiggyBank}
            delay={0.2}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TransactionList transactions={recentTransactions} />
            <IncomeExpenseChart />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BudgetProgress budgets={budgets} />
            <SpendingChart expensesByCategory={expensesByCategory} />
            <SavingsGoalCard goals={savingsGoals} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 FinanceFlow. Smart money management for a better future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

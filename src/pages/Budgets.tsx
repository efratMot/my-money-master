import { motion } from 'framer-motion';
import { Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useFinanceData } from '@/hooks/useFinanceData';
import { EXPENSE_CATEGORIES } from '@/types/finance';
import { cn } from '@/lib/utils';

const Budgets = () => {
  const { budgets, totalExpenses, totalIncome } = useFinanceData();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getCategoryInfo = (category: string) => {
    return EXPENSE_CATEGORIES.find(c => c.value === category);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCategories = budgets.filter(b => b.spent > b.limit);

  return (
    <main className="container py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
        <p className="text-muted-foreground">Manage your spending limits by category</p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Budget</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-expense/10">
              <AlertTriangle className="w-5 h-5 text-expense" />
            </div>
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget used
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "p-2 rounded-lg",
              overBudgetCategories.length > 0 ? "bg-expense/10" : "bg-income/10"
            )}>
              {overBudgetCategories.length > 0 ? (
                <AlertTriangle className="w-5 h-5 text-expense" />
              ) : (
                <CheckCircle className="w-5 h-5 text-income" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">Budget Status</span>
          </div>
          <p className="text-2xl font-bold">
            {overBudgetCategories.length > 0 
              ? `${overBudgetCategories.length} Over Budget`
              : 'On Track'
            }
          </p>
        </motion.div>
      </div>

      {/* Budget Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="gradient-card rounded-xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold mb-6">Category Budgets</h3>
        <div className="space-y-6">
          {budgets.map((budget, index) => {
            const categoryInfo = getCategoryInfo(budget.category);
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const isOverBudget = budget.spent > budget.limit;
            const remaining = budget.limit - budget.spent;

            return (
              <motion.div
                key={budget.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryInfo?.icon}</span>
                    <div>
                      <p className="font-medium">{categoryInfo?.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-mono font-semibold",
                      isOverBudget ? "text-expense" : "text-income"
                    )}>
                      {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remaining))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isOverBudget ? 'over budget' : 'remaining'}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={percentage} 
                    className={cn(
                      "h-3",
                      isOverBudget && "[&>div]:bg-expense"
                    )}
                  />
                  {isOverBudget && (
                    <div className="absolute -right-1 -top-1">
                      <AlertTriangle className="w-4 h-4 text-expense" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
};

export default Budgets;

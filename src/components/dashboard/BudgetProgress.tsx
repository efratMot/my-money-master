import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Budget, EXPENSE_CATEGORIES } from '@/types/finance';
import { cn } from '@/lib/utils';

interface BudgetProgressProps {
  budgets: Budget[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getPercentage = (spent: number, limit: number) => 
    Math.min((spent / limit) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="gradient-card rounded-xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
      <div className="space-y-4">
        {budgets.slice(0, 5).map((budget, index) => {
          const category = EXPENSE_CATEGORIES.find(c => c.value === budget.category);
          const percentage = getPercentage(budget.spent, budget.limit);
          const isOverBudget = budget.spent > budget.limit;

          return (
            <motion.div
              key={budget.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{category?.icon}</span>
                  <span className="font-medium">{category?.label}</span>
                </div>
                <span className={cn(
                  "font-mono text-xs",
                  isOverBudget ? "text-expense" : "text-muted-foreground"
                )}>
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={percentage} 
                  className={cn(
                    "h-2",
                    isOverBudget && "[&>div]:bg-expense"
                  )} 
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Repeat } from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/finance';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryInfo = (transaction: Transaction) => {
    if (transaction.type === 'expense') {
      return EXPENSE_CATEGORIES.find(c => c.value === transaction.category);
    }
    return INCOME_CATEGORIES.find(c => c.value === transaction.category);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="gradient-card rounded-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction, index) => {
          const categoryInfo = getCategoryInfo(transaction);
          const isIncome = transaction.type === 'income';

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isIncome ? "bg-income/10" : "bg-expense/10"
                )}>
                  {isIncome ? (
                    <ArrowDownLeft className="w-4 h-4 text-income" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-expense" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    {transaction.isRecurring && (
                      <Repeat className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {categoryInfo?.icon} {categoryInfo?.label} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <p className={cn(
                "font-mono font-medium",
                isIncome ? "text-income" : "text-expense"
              )}>
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, Repeat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddTransactionDialog } from '@/components/dashboard/AddTransactionDialog';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/finance';
import { cn } from '@/lib/utils';

const Transactions = () => {
  const { transactions, addTransaction } = useFinanceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryInfo = (transaction: Transaction) => {
    if (transaction.type === 'expense') {
      return EXPENSE_CATEGORIES.find(c => c.value === transaction.category);
    }
    return INCOME_CATEGORIES.find(c => c.value === transaction.category);
  };

  const filteredTransactions = transactions
    .filter(t => {
      if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (typeFilter !== 'all' && t.type !== typeFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  return (
    <main className="container py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>
        <AddTransactionDialog onAddTransaction={addTransaction} />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="gradient-card rounded-xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </h3>
        </div>
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found</p>
          ) : (
            filteredTransactions.map((transaction, index) => {
              const categoryInfo = getCategoryInfo(transaction);
              const isIncome = transaction.type === 'income';

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.03 * index }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isIncome ? "bg-income/10" : "bg-expense/10"
                    )}>
                      {isIncome ? (
                        <ArrowDownLeft className="w-5 h-5 text-income" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-expense" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.isRecurring && (
                          <Repeat className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {categoryInfo?.icon} {categoryInfo?.label} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p className={cn(
                    "font-mono font-semibold text-lg",
                    isIncome ? "text-income" : "text-expense"
                  )}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default Transactions;

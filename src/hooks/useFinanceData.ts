import { useState, useMemo } from 'react';
import { Transaction, Budget, SavingsGoal, ExpenseCategory } from '@/types/finance';

// Mock data for demonstration
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 5200, category: 'salary', description: 'Monthly Salary', date: '2026-02-01', isRecurring: true },
  { id: '2', type: 'expense', amount: 1200, category: 'housing', description: 'Rent Payment', date: '2026-02-01', isRecurring: true },
  { id: '3', type: 'expense', amount: 89, category: 'subscriptions', description: 'Streaming Services', date: '2026-02-02', isRecurring: true },
  { id: '4', type: 'expense', amount: 156, category: 'food', description: 'Grocery Shopping', date: '2026-02-03' },
  { id: '5', type: 'income', amount: 850, category: 'freelance', description: 'Web Design Project', date: '2026-02-03' },
  { id: '6', type: 'expense', amount: 45, category: 'transportation', description: 'Gas', date: '2026-02-04' },
  { id: '7', type: 'expense', amount: 234, category: 'entertainment', description: 'Concert Tickets', date: '2026-02-04' },
  { id: '8', type: 'expense', amount: 78, category: 'utilities', description: 'Internet Bill', date: '2026-02-02', isRecurring: true },
];

const MOCK_BUDGETS: Budget[] = [
  { category: 'food', limit: 600, spent: 420 },
  { category: 'transportation', limit: 300, spent: 180 },
  { category: 'housing', limit: 1500, spent: 1200 },
  { category: 'entertainment', limit: 200, spent: 234 },
  { category: 'utilities', limit: 200, spent: 78 },
  { category: 'subscriptions', limit: 100, spent: 89 },
  { category: 'shopping', limit: 300, spent: 0 },
];

const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500 },
  { id: '2', name: 'Vacation', targetAmount: 3000, currentAmount: 1200 },
  { id: '3', name: 'New Car', targetAmount: 25000, currentAmount: 8000 },
];

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
  const [savingsGoals] = useState<SavingsGoal[]>(MOCK_SAVINGS_GOALS);

  const totalIncome = useMemo(() => 
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const netBalance = totalIncome - totalExpenses;

  const expensesByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return categoryTotals;
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      setBudgets(prev => 
        prev.map(b => 
          b.category === transaction.category 
            ? { ...b, spent: b.spent + transaction.amount }
            : b
        )
      );
    }
  };

  const recentTransactions = useMemo(() => 
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions]
  );

  return {
    transactions,
    budgets,
    savingsGoals,
    totalIncome,
    totalExpenses,
    netBalance,
    expensesByCategory,
    addTransaction,
    recentTransactions,
  };
}

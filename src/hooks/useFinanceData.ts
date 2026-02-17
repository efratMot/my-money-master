import { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, Budget, SavingsGoal } from '@/types/finance';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Fallback mock data used when the backend is unreachable
const FALLBACK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 5200, category: 'salary', description: 'Monthly Salary', date: '2026-02-01', isRecurring: true },
  { id: '2', type: 'expense', amount: 1200, category: 'housing', description: 'Rent Payment', date: '2026-02-01', isRecurring: true },
  { id: '3', type: 'expense', amount: 89, category: 'subscriptions', description: 'Streaming Services', date: '2026-02-02', isRecurring: true },
  { id: '4', type: 'expense', amount: 156, category: 'food', description: 'Grocery Shopping', date: '2026-02-03' },
  { id: '5', type: 'income', amount: 850, category: 'freelance', description: 'Web Design Project', date: '2026-02-03' },
  { id: '6', type: 'expense', amount: 45, category: 'transportation', description: 'Gas', date: '2026-02-04' },
  { id: '7', type: 'expense', amount: 234, category: 'entertainment', description: 'Concert Tickets', date: '2026-02-04' },
  { id: '8', type: 'expense', amount: 78, category: 'utilities', description: 'Internet Bill', date: '2026-02-02', isRecurring: true },
];

const FALLBACK_BUDGETS: Budget[] = [
  { category: 'food', limit: 600, spent: 420 },
  { category: 'transportation', limit: 300, spent: 180 },
  { category: 'housing', limit: 1500, spent: 1200 },
  { category: 'entertainment', limit: 200, spent: 234 },
  { category: 'utilities', limit: 200, spent: 78 },
  { category: 'subscriptions', limit: 100, spent: 89 },
  { category: 'shopping', limit: 300, spent: 0 },
];

const FALLBACK_GOALS: SavingsGoal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500 },
  { id: '2', name: 'Vacation', targetAmount: 3000, currentAmount: 1200 },
  { id: '3', name: 'New Car', targetAmount: 25000, currentAmount: 8000 },
];

export function useFinanceData() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(FALLBACK_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(FALLBACK_GOALS);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  // Try to load data from the backend on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [t, b, g] = await Promise.all([
          api.getTransactions(),
          api.getBudgets(),
          api.getGoals(),
        ]);
        if (!cancelled) {
          setTransactions(t);
          setBudgets(b);
          setSavingsGoals(g);
          setIsBackendAvailable(true);
        }
      } catch {
        // Backend not running — use fallback data silently
        if (!cancelled) setIsBackendAvailable(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

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

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (isBackendAvailable) {
        const newTx = await api.createTransaction(transaction);
        setTransactions(prev => [newTx, ...prev]);
        // Refresh budgets since backend updates spent
        const updatedBudgets = await api.getBudgets();
        setBudgets(updatedBudgets);
      } else {
        const newTransaction: Transaction = { ...transaction, id: Date.now().toString() };
        setTransactions(prev => [newTransaction, ...prev]);
        if (transaction.type === 'expense') {
          setBudgets(prev =>
            prev.map(b =>
              b.category === transaction.category ? { ...b, spent: b.spent + transaction.amount } : b
            )
          );
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to add transaction', variant: 'destructive' });
    }
  }, [isBackendAvailable, toast]);

  const addGoal = useCallback(async (name: string, targetAmount: number) => {
    try {
      if (isBackendAvailable) {
        const newGoal = await api.createGoal({ name, targetAmount });
        setSavingsGoals(prev => [...prev, newGoal]);
      } else {
        const newGoal: SavingsGoal = { id: Date.now().toString(), name, targetAmount, currentAmount: 0 };
        setSavingsGoals(prev => [...prev, newGoal]);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to create goal', variant: 'destructive' });
    }
  }, [isBackendAvailable, toast]);

  const contributeToGoal = useCallback(async (goalId: string, amount: number) => {
    try {
      if (isBackendAvailable) {
        const updated = await api.contributeToGoal(goalId, amount);
        setSavingsGoals(prev => prev.map(g => g.id === goalId ? updated : g));
      } else {
        setSavingsGoals(prev =>
          prev.map(g =>
            g.id === goalId
              ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
              : g
          )
        );
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to contribute to goal', variant: 'destructive' });
    }
  }, [isBackendAvailable, toast]);

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
    addGoal,
    contributeToGoal,
    recentTransactions,
    isBackendAvailable,
  };
}

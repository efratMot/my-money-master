export type TransactionType = 'income' | 'expense';

export type ExpenseCategory = 
  | 'food'
  | 'transportation'
  | 'housing'
  | 'entertainment'
  | 'insurance'
  | 'utilities'
  | 'healthcare'
  | 'shopping'
  | 'subscriptions'
  | 'other';

export type IncomeCategory = 
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'side-project'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: ExpenseCategory | IncomeCategory;
  description: string;
  date: string;
  isRecurring?: boolean;
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'Food & Dining', icon: '🍔' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'housing', label: 'Housing', icon: '🏠' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️' },
  { value: 'utilities', label: 'Utilities', icon: '💡' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'shopping', label: 'Shopping', icon: '🛒' },
  { value: 'subscriptions', label: 'Subscriptions', icon: '📱' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export const INCOME_CATEGORIES: { value: IncomeCategory; label: string; icon: string }[] = [
  { value: 'salary', label: 'Salary', icon: '💼' },
  { value: 'freelance', label: 'Freelance', icon: '💻' },
  { value: 'investments', label: 'Investments', icon: '📈' },
  { value: 'side-project', label: 'Side Project', icon: '🚀' },
  { value: 'other', label: 'Other', icon: '💰' },
];

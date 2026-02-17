const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
}

export const api = {
  // Transactions
  getTransactions: () => request<any[]>('/transactions'),
  createTransaction: (data: any) => request<any>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  deleteTransaction: (id: string) => request<any>(`/transactions/${id}`, { method: 'DELETE' }),

  // Budgets
  getBudgets: () => request<any[]>('/budgets'),
  createBudget: (data: any) => request<any>('/budgets', { method: 'POST', body: JSON.stringify(data) }),
  updateBudget: (category: string, data: any) => request<any>(`/budgets/${category}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBudget: (category: string) => request<any>(`/budgets/${category}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request<any[]>('/goals'),
  createGoal: (data: any) => request<any>('/goals', { method: 'POST', body: JSON.stringify(data) }),
  contributeToGoal: (id: string, amount: number) => request<any>(`/goals/${id}/contribute`, { method: 'POST', body: JSON.stringify({ amount }) }),
  deleteGoal: (id: string) => request<any>(`/goals/${id}`, { method: 'DELETE' }),
};

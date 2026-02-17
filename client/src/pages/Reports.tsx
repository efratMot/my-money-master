import { motion } from 'framer-motion';
import { Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { useFinanceData } from '@/hooks/useFinanceData';
import { EXPENSE_CATEGORIES } from '@/types/finance';

const Reports = () => {
  const { 
    totalIncome, 
    totalExpenses, 
    netBalance, 
    expensesByCategory,
    transactions 
  } = useFinanceData();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Calculate top spending categories
  const topCategories = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      info: EXPENSE_CATEGORIES.find(c => c.value === category)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)
    : 0;

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description,
      t.amount.toString()
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Analyze your financial data and trends</p>
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-income" />
            <span className="text-sm text-muted-foreground">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-income">{formatCurrency(totalIncome)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-expense" />
            <span className="text-sm text-muted-foreground">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-expense">{formatCurrency(totalExpenses)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Net Balance</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(netBalance)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Savings Rate</span>
          </div>
          <p className="text-2xl font-bold">{savingsRate}%</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <IncomeExpenseChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <SpendingChart expensesByCategory={expensesByCategory} />
        </motion.div>
      </div>

      {/* Top Spending Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="gradient-card rounded-xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
        <div className="space-y-4">
          {topCategories.map((cat, index) => (
            <div key={cat.category} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.info?.icon}</span>
                <span className="font-medium">{cat.info?.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(cat.amount / topCategories[0].amount) * 100}%` }}
                  />
                </div>
                <span className="font-mono font-medium w-24 text-right">
                  {formatCurrency(cat.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
};

export default Reports;

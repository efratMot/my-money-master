import { motion } from 'framer-motion';
import { Target, Plus, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFinanceData } from '@/hooks/useFinanceData';

const Goals = () => {
  const { savingsGoals, netBalance } = useFinanceData();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

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
          <h2 className="text-2xl font-bold tracking-tight">Savings Goals</h2>
          <p className="text-muted-foreground">Track progress toward your financial goals</p>
        </div>
        <Button className="gap-2 gradient-primary glow-primary">
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
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
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Target</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-income/10">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
            <span className="text-sm text-muted-foreground">Total Saved</span>
          </div>
          <p className="text-2xl font-bold text-income">{formatCurrency(totalSaved)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="gradient-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Overall Progress</span>
          </div>
          <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
        </motion.div>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="gradient-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(remaining)} remaining
                  </p>
                </div>
                <div className="p-2 rounded-lg gradient-primary">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-income">{formatCurrency(goal.currentAmount)}</span>
                  <span className="font-mono text-muted-foreground">{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full">
                  Add Contribution
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
};

export default Goals;

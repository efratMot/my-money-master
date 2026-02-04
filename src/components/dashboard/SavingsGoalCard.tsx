import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SavingsGoal } from '@/types/finance';

interface SavingsGoalCardProps {
  goals: SavingsGoal[];
}

export function SavingsGoalCard({ goals }: SavingsGoalCardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getPercentage = (current: number, target: number) =>
    Math.min((current / target) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="gradient-card rounded-xl p-6 border border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Savings Goals</h3>
      </div>
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = getPercentage(goal.currentAmount, goal.targetAmount);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="p-4 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{goal.name}</p>
                <p className="text-sm text-primary font-medium">{percentage.toFixed(0)}%</p>
              </div>
              <Progress value={percentage} className="h-2 mb-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{formatCurrency(goal.currentAmount)}</span>
                <span className="font-mono">{formatCurrency(goal.targetAmount)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

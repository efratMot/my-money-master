import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useFinanceData } from '@/hooks/useFinanceData';

const Goals = () => {
  const { savingsGoals, addGoal, contributeToGoal } = useFinanceData();

  // New goal form state
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  // Contribute form state
  const [contributeOpen, setContributeOpen] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    await addGoal(goalName, parseFloat(goalTarget));
    setGoalName('');
    setGoalTarget('');
    setNewGoalOpen(false);
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeOpen || !contributeAmount) return;
    await contributeToGoal(contributeOpen, parseFloat(contributeAmount));
    setContributeAmount('');
    setContributeOpen(null);
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
          <h2 className="text-2xl font-bold tracking-tight">Savings Goals</h2>
          <p className="text-muted-foreground">Track progress toward your financial goals</p>
        </div>
        <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary glow-primary">
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g. Emergency Fund"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="goal-target"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="10000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="pl-7 font-mono"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary">
                Create Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                <Dialog open={contributeOpen === goal.id} onOpenChange={(open) => setContributeOpen(open ? goal.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <DollarSign className="w-4 h-4" />
                      Add Contribution
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Contribute to {goal.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleContribute} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="contribute-amount">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="contribute-amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={remaining}
                            placeholder="100.00"
                            value={contributeAmount}
                            onChange={(e) => setContributeAmount(e.target.value)}
                            className="pl-7 font-mono"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Max: {formatCurrency(remaining)}
                        </p>
                      </div>
                      <Button type="submit" className="w-full gradient-primary">
                        Contribute
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
};

export default Goals;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertTriangle, CheckCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useFinanceData } from '@/hooks/useFinanceData';
import { EXPENSE_CATEGORIES } from '@/types/finance';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Budgets = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useFinanceData();
  const { toast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [limitValue, setLimitValue] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLimit, setEditLimit] = useState('');
  const [deleteCategory, setDeleteCategory] = useState('');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getCategoryInfo = (category: string) =>
    EXPENSE_CATEGORIES.find(c => c.value === category);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCategories = budgets.filter(b => b.spent > b.limit);

  const existingCategories = budgets.map(b => b.category);
  const availableCategories = EXPENSE_CATEGORIES.filter(c => !existingCategories.includes(c.value));

  const handleCreate = async () => {
    if (!selectedCategory || !limitValue) return;
    await addBudget(selectedCategory, Number(limitValue));
    toast({ title: 'Budget created', description: `Budget for ${getCategoryInfo(selectedCategory)?.label} added.` });
    setSelectedCategory('');
    setLimitValue('');
    setCreateOpen(false);
  };

  const openEdit = (category: string, limit: number) => {
    setEditCategory(category);
    setEditLimit(String(limit));
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editLimit) return;
    await updateBudget(editCategory, Number(editLimit));
    toast({ title: 'Budget updated', description: `Limit for ${getCategoryInfo(editCategory)?.label} updated.` });
    setEditOpen(false);
  };

  const openDelete = (category: string) => {
    setDeleteCategory(category);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    await deleteBudget(deleteCategory);
    toast({ title: 'Budget deleted', description: `Budget for ${getCategoryInfo(deleteCategory)?.label} removed.` });
    setDeleteOpen(false);
  };

  return (
    <main className="container py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">Manage your spending limits by category</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} disabled={availableCategories.length === 0}>
          <Plus className="w-4 h-4 mr-2" /> Add Budget
        </Button>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="gradient-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10"><Wallet className="w-5 h-5 text-primary" /></div>
            <span className="text-sm text-muted-foreground">Total Budget</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="gradient-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-expense/10"><AlertTriangle className="w-5 h-5 text-expense" /></div>
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% of budget used
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="gradient-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-lg", overBudgetCategories.length > 0 ? "bg-expense/10" : "bg-income/10")}>
              {overBudgetCategories.length > 0 ? <AlertTriangle className="w-5 h-5 text-expense" /> : <CheckCircle className="w-5 h-5 text-income" />}
            </div>
            <span className="text-sm text-muted-foreground">Budget Status</span>
          </div>
          <p className="text-2xl font-bold">
            {overBudgetCategories.length > 0 ? `${overBudgetCategories.length} Over Budget` : 'On Track'}
          </p>
        </motion.div>
      </div>

      {/* Budget Categories */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="gradient-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-6">Category Budgets</h3>
        <div className="space-y-6">
          {budgets.map((budget, index) => {
            const categoryInfo = getCategoryInfo(budget.category);
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const isOverBudget = budget.spent > budget.limit;
            const remaining = budget.limit - budget.spent;

            return (
              <motion.div
                key={budget.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryInfo?.icon}</span>
                    <div>
                      <p className="font-medium">{categoryInfo?.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={cn("font-mono font-semibold", isOverBudget ? "text-expense" : "text-income")}>
                        {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remaining))}
                      </p>
                      <p className="text-xs text-muted-foreground">{isOverBudget ? 'over budget' : 'remaining'}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(budget.category, budget.limit)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(budget.category)}>
                      <Trash2 className="w-4 h-4 text-expense" />
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={percentage} className={cn("h-3", isOverBudget && "[&>div]:bg-expense")} />
                  {isOverBudget && (
                    <div className="absolute -right-1 -top-1">
                      <AlertTriangle className="w-4 h-4 text-expense" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          {budgets.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No budgets yet. Click "Add Budget" to get started.</p>
          )}
        </div>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
            <DialogDescription>Set a spending limit for a category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {availableCategories.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Monthly limit" value={limitValue} onChange={e => setLimitValue(e.target.value)} min="0" step="50" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!selectedCategory || !limitValue}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>Update the spending limit for {getCategoryInfo(editCategory)?.label}.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input type="number" placeholder="Monthly limit" value={editLimit} onChange={e => setEditLimit(e.target.value)} min="0" step="50" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!editLimit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Budget</DialogTitle>
            <DialogDescription>Are you sure you want to delete the budget for {getCategoryInfo(deleteCategory)?.label}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Budgets;

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MONTHLY_DATA = [
  { month: 'Sep', income: 5200, expenses: 3800 },
  { month: 'Oct', income: 5850, expenses: 4200 },
  { month: 'Nov', income: 5200, expenses: 4500 },
  { month: 'Dec', income: 6100, expenses: 5200 },
  { month: 'Jan', income: 5400, expenses: 3900 },
  { month: 'Feb', income: 6050, expenses: 2002 },
];

export function IncomeExpenseChart() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-income" />
              <span className="text-muted-foreground">Income:</span>
              <span className="font-mono">{formatCurrency(payload[0].value)}</span>
            </p>
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-expense" />
              <span className="text-muted-foreground">Expenses:</span>
              <span className="font-mono">{formatCurrency(payload[1].value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="gradient-card rounded-xl p-6 border border-border col-span-full lg:col-span-2"
    >
      <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_DATA} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(222, 47%, 12%)' }} />
            <Bar 
              dataKey="income" 
              fill="hsl(160, 84%, 39%)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey="expenses" 
              fill="hsl(0, 84%, 60%)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-income" />
          <span className="text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-expense" />
          <span className="text-muted-foreground">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}

const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const goalsRoutes = require('./routes/goals');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`FinanceFlow server running on http://localhost:${PORT}`);
});

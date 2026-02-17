const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fileStore');
const FILE = 'transactions.json';

exports.getAll = (req, res) => {
  try {
    const data = readJSON(FILE);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read transactions' });
  }
};

exports.getById = (req, res) => {
  try {
    const data = readJSON(FILE);
    const item = data.find(t => t.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Transaction not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read transaction' });
  }
};

exports.create = (req, res) => {
  try {
    const { type, amount, category, description, date, isRecurring } = req.body;
    if (!type || !amount || !category || !description || !date) {
      return res.status(400).json({ error: 'Missing required fields: type, amount, category, description, date' });
    }
    const data = readJSON(FILE);
    const newItem = { id: uuidv4(), type, amount: Number(amount), category, description, date, isRecurring: !!isRecurring };
    data.unshift(newItem);
    writeJSON(FILE, data);

    // Update budget spent if expense
    if (type === 'expense') {
      const budgets = readJSON('budgets.json');
      const budget = budgets.find(b => b.category === category);
      if (budget) {
        budget.spent += Number(amount);
        writeJSON('budgets.json', budgets);
      }
    }

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

exports.update = (req, res) => {
  try {
    const data = readJSON(FILE);
    const idx = data.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });
    data[idx] = { ...data[idx], ...req.body, id: req.params.id };
    writeJSON(FILE, data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

exports.remove = (req, res) => {
  try {
    let data = readJSON(FILE);
    const idx = data.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });
    const [removed] = data.splice(idx, 1);
    writeJSON(FILE, data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

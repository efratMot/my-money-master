const { readJSON, writeJSON } = require('../utils/fileStore');
const FILE = 'budgets.json';

exports.getAll = (req, res) => {
  try {
    res.json(readJSON(FILE));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read budgets' });
  }
};

exports.getByCategory = (req, res) => {
  try {
    const data = readJSON(FILE);
    const item = data.find(b => b.category === req.params.category);
    if (!item) return res.status(404).json({ error: 'Budget not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read budget' });
  }
};

exports.create = (req, res) => {
  try {
    const { category, limit } = req.body;
    if (!category || limit == null) return res.status(400).json({ error: 'Missing required fields: category, limit' });
    const data = readJSON(FILE);
    if (data.find(b => b.category === category)) return res.status(409).json({ error: 'Budget for this category already exists' });
    const newItem = { category, limit: Number(limit), spent: 0 };
    data.push(newItem);
    writeJSON(FILE, data);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

exports.update = (req, res) => {
  try {
    const data = readJSON(FILE);
    const idx = data.findIndex(b => b.category === req.params.category);
    if (idx === -1) return res.status(404).json({ error: 'Budget not found' });
    data[idx] = { ...data[idx], ...req.body, category: req.params.category };
    writeJSON(FILE, data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

exports.remove = (req, res) => {
  try {
    let data = readJSON(FILE);
    const idx = data.findIndex(b => b.category === req.params.category);
    if (idx === -1) return res.status(404).json({ error: 'Budget not found' });
    const [removed] = data.splice(idx, 1);
    writeJSON(FILE, data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};

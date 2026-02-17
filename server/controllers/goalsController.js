const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fileStore');
const FILE = 'goals.json';

exports.getAll = (req, res) => {
  try {
    res.json(readJSON(FILE));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read goals' });
  }
};

exports.getById = (req, res) => {
  try {
    const data = readJSON(FILE);
    const item = data.find(g => g.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Goal not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read goal' });
  }
};

exports.create = (req, res) => {
  try {
    const { name, targetAmount } = req.body;
    if (!name || !targetAmount) return res.status(400).json({ error: 'Missing required fields: name, targetAmount' });
    const data = readJSON(FILE);
    const newItem = { id: uuidv4(), name, targetAmount: Number(targetAmount), currentAmount: 0 };
    data.push(newItem);
    writeJSON(FILE, data);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

exports.contribute = (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
    const data = readJSON(FILE);
    const idx = data.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Goal not found' });
    data[idx].currentAmount += Number(amount);
    if (data[idx].currentAmount > data[idx].targetAmount) {
      data[idx].currentAmount = data[idx].targetAmount;
    }
    writeJSON(FILE, data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to contribute to goal' });
  }
};

exports.update = (req, res) => {
  try {
    const data = readJSON(FILE);
    const idx = data.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Goal not found' });
    data[idx] = { ...data[idx], ...req.body, id: req.params.id };
    writeJSON(FILE, data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

exports.remove = (req, res) => {
  try {
    let data = readJSON(FILE);
    const idx = data.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Goal not found' });
    const [removed] = data.splice(idx, 1);
    writeJSON(FILE, data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

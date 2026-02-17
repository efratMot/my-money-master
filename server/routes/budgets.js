const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetsController');

router.get('/', controller.getAll);
router.get('/:category', controller.getByCategory);
router.post('/', controller.create);
router.put('/:category', controller.update);
router.delete('/:category', controller.remove);

module.exports = router;

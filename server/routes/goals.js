const express = require('express');
const router = express.Router();
const controller = require('../controllers/goalsController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/:id/contribute', controller.contribute);
router.delete('/:id', controller.remove);

module.exports = router;

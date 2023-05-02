const express = require('express');
const router = express.Router();

const pilotesController = require('../controllers/pilotes');

// GET /api/pilotes
router.get('/', pilotesController.findAll);

// GET /api/pilotes/:id
router.get('/:id', pilotesController.findOne);

// POST /api/pilotes
router.post('/', pilotesController.create);

// PUT /api/pilotes/:id
router.put('/:id', pilotesController.update);

// DELETE /api/pilotes/:id
router.delete('/:id', pilotesController.delete);

module.exports = router;

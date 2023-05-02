const express = require('express');
const router = express.Router();

const teamController = require('../controllers/teams');

// GET /api/team
router.get('/', teamController.findAll);

// GET /api/team/:id
router.get('/:id', teamController.findOne);

// GET /api/team/:id/pilotes
router.get('/:id/pilotes', teamController.findPilots)

// POST /api/team
router.post('/', teamController.create);

// PUT /api/team/:id
router.put('/:id', teamController.update);

// DELETE /api/team/:id
router.delete('/:id', teamController.delete);

module.exports = router;
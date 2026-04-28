const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route: GET /api/users/agents - Fetch all agents (Admins need this for assignment)
router.get('/agents', protect, authorize('admin'), usersController.getAgents);

module.exports = router;

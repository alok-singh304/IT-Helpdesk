const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All analytics routes require user to be logged in and be an Admin
router.use(protect, authorize('admin'));

// Route: GET /api/analytics/by-status
router.get('/by-status', analyticsController.getTicketsByStatus);

// Route: GET /api/analytics/tickets-per-day
router.get('/tickets-per-day', analyticsController.getTicketsPerDay);

// Route: GET /api/analytics/agent-performance
router.get('/agent-performance', analyticsController.getAgentPerformance);

module.exports = router;

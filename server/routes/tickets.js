const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get breached tickets (Admin only) - Placed before /:id to avoid treating "breached" as an ID
router.get('/breached', protect, authorize('admin'), ticketController.getBreachedTickets);

// Base route: GET all (all roles) and POST create (all authenticated roles)
router.route('/')
    .get(protect, ticketController.getTickets)
    .post(protect, ticketController.createTicket);

// Single ticket routes: GET (all roles) and PUT update status/assign (agent, admin)
router.route('/:id')
    .get(protect, ticketController.getTicketById)
    .put(protect, authorize('agent', 'admin'), ticketController.updateTicket);

// Comments route: Anyone involved can add a comment
router.post('/:id/comment', protect, ticketController.addComment);

// Feedback rating route: User only, when ticket is resolved
router.post('/:id/rate', protect, authorize('user'), ticketController.rateTicket);

module.exports = router;

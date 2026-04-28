const Ticket = require('../models/Ticket');

// Create a new ticket (Users only)
exports.createTicket = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        
        const ticket = new Ticket({
            title,
            description,
            category,
            priority,
            createdBy: req.user.userId
        });

        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Server error while creating ticket' });
    }
};

// Get all tickets with filtering, searching, and sorting
exports.getTickets = async (req, res) => {
    try {
        const { status, priority, category, search, sortBy, assignedTo } = req.query;
        let query = {};

        // Role-based access control
        if (req.user.role === 'user') {
            // Users see ONLY their own tickets
            query.createdBy = req.user.userId;
        } else if (req.user.role === 'agent') {
            // Agents see ONLY tickets assigned to them
            query.assignedTo = req.user.userId;
        }
        // Admins see all tickets, so we leave the query empty

        // Apply Filters
        if (status && status !== 'All') query.status = status;
        if (priority && priority !== 'All') query.priority = priority;
        if (category && category !== 'All') query.category = category;
        if (assignedTo) query.assignedTo = assignedTo;

        // Apply Search (Case insensitive match on title or description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Apply Sorting
        let sortObj = { createdAt: -1 }; // Default: Newest First
        if (sortBy === 'oldest') {
            sortObj = { createdAt: 1 };
        }

        let tickets = await Ticket.find(query)
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort(sortObj);

        // Handle 'highestPriority' sorting in JavaScript since priorities are strings
        if (sortBy === 'highestPriority') {
            const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
            tickets.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Server error while fetching tickets' });
    }
};

// Get single ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name role');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Permissions check
        if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to view this ticket' });
        }
        if (req.user.role === 'agent' && ticket.assignedTo && ticket.assignedTo._id.toString() !== req.user.userId) {
             return res.status(403).json({ message: 'Not authorized to view this ticket' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: 'Server error while fetching ticket' });
    }
};

// Update ticket status or assign agent
exports.updateTicket = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Only admins can assign an agent
        if (assignedTo && req.user.role === 'admin') {
            ticket.assignedTo = assignedTo;
        }

        // Both agents and admins can update the status
        if (status) {
            ticket.status = status;
        }

        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ message: 'Server error while updating ticket' });
    }
};

// Add a comment to a ticket
exports.addComment = async (req, res) => {
    try {
        const { message } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.comments.push({
            user: req.user.userId,
            message
        });

        await ticket.save();
        
        // Return the updated ticket with user info populated
        const updatedTicket = await Ticket.findById(req.params.id).populate('comments.user', 'name role');
        res.status(201).json(updatedTicket);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error while adding comment' });
    }
};

// Rate a resolved ticket (User only)
exports.rateTicket = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (ticket.status !== 'Resolved') {
            return res.status(400).json({ message: 'You can only rate a resolved ticket' });
        }

        if (ticket.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Only the ticket creator can rate it' });
        }

        ticket.feedback = { rating, comment };
        await ticket.save();

        res.status(200).json({ message: 'Feedback submitted successfully', ticket });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ message: 'Server error while submitting rating' });
    }
};

// Get SLA breached tickets (Admin only)
exports.getBreachedTickets = async (req, res) => {
    try {
        const now = new Date();
        const tickets = await Ticket.find({
            status: { $nin: ['Resolved', 'Closed'] },
            slaDeadline: { $lt: now }
        }).populate('createdBy', 'name email').populate('assignedTo', 'name email');

        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching breached tickets:', error);
        res.status(500).json({ message: 'Server error while fetching breached tickets' });
    }
};

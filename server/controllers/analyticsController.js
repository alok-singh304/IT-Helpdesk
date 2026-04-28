const Ticket = require('../models/Ticket');

// Get ticket counts by status for donut chart
exports.getTicketsByStatus = async (req, res) => {
    try {
        // Group tickets by their status and count them
        const stats = await Ticket.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching analytics by status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get tickets raised per day (last 7 days) for line chart
exports.getTicketsPerDay = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Match tickets from the last 7 days, group by date, and count
        const stats = await Ticket.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 } // Sort by date ascending (oldest to newest)
            }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching analytics per day:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get agent performance (how many tickets they resolved) for bar chart
exports.getAgentPerformance = async (req, res) => {
    try {
        // Match resolved tickets assigned to an agent, group by agent, 
        // calculate count and average rating
        const stats = await Ticket.aggregate([
            {
                $match: {
                    status: 'Resolved',
                    assignedTo: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$assignedTo',
                    resolvedCount: { $sum: 1 },
                    avgRating: { $avg: "$feedback.rating" }
                }
            },
            {
                // Join with users collection to get agent names
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'agentInfo'
                }
            },
            {
                $unwind: '$agentInfo'
            },
            {
                // Format the output
                $project: {
                    _id: 1,
                    resolvedCount: 1,
                    avgRating: 1,
                    agentName: '$agentInfo.name'
                }
            }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching agent performance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

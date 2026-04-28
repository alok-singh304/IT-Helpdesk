const User = require('../models/User');

// Get all agents for assignment dropdowns
exports.getAgents = async (req, res) => {
    try {
        // Fetch all users with the role 'agent', exclude passwords from the response
        const agents = await User.find({ role: 'agent' }).select('-password');
        res.status(200).json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ message: 'Server error while fetching agents' });
    }
};

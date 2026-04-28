const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Hardware', 'Software', 'Network', 'Other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    slaDeadline: {
        type: Date
    },
    comments: [commentSchema],
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String
        }
    }
}, { timestamps: true });

// Pre-save hook to calculate SLA deadline upon creation based on priority
ticketSchema.pre('save', async function() {
    if (this.isNew && !this.slaDeadline) {
        const now = new Date();
        if (this.priority === 'High') {
            this.slaDeadline = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
        } else if (this.priority === 'Medium') {
            this.slaDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
        } else if (this.priority === 'Low') {
            this.slaDeadline = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours from now
        }
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);

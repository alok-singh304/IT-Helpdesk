import React, { useState } from 'react';
import axios from 'axios';
import { Star, X } from 'lucide-react';

const FeedbackModal = ({ ticketId, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!rating) return alert('Please select a rating');
        setLoading(true);
        try {
            await axios.post(`/api/tickets/${ticketId}/rate`, { rating, comment });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2 mt-2">Rate Experience</h3>
                <p className="text-center text-sm text-gray-500 font-medium mb-8">How was the support for this ticket?</p>
                
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button 
                            key={star}
                            className="focus:outline-none transition-transform hover:scale-125 duration-200"
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star className={`w-10 h-10 ${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-50'}`} />
                        </button>
                    ))}
                </div>

                <textarea 
                    placeholder="Tell us more about your experience... (optional)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all resize-none mb-6"
                    rows="3"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />

                <button 
                    onClick={submit}
                    disabled={loading || !rating}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;

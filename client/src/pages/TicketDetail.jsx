import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import StatusBadge from '../components/StatusBadge';
import SLATimer from '../components/SLATimer';
import FeedbackModal from '../components/FeedbackModal';
import { ArrowLeft, Send, User, Clock, Star, AlertCircle, LayoutList } from 'lucide-react';

const TicketDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [agents, setAgents] = useState([]);
    const [comment, setComment] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const chatEndRef = useRef(null);
    
    useEffect(() => {
        fetchTicket();
        if (user.role === 'admin') fetchAgents();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket?.comments]);

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`/api/tickets/${id}`);
            setTicket(res.data);
        } catch (error) {
            console.error('Error fetching ticket', error);
        }
    };

    const fetchAgents = async () => {
        try {
            const res = await axios.get('/api/users/agents');
            setAgents(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (e) => {
        try {
            const newStatus = e.target.value;
            await axios.put(`/api/tickets/${id}`, { status: newStatus });
            setTicket({ ...ticket, status: newStatus });
            if (newStatus === 'Resolved' && user.role === 'user') setShowFeedback(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssign = async (e) => {
        try {
            const agentId = e.target.value;
            await axios.put(`/api/tickets/${id}`, { assignedTo: agentId });
            fetchTicket(); // Refresh to get populated user
        } catch (error) {
            console.error(error);
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if(!comment.trim()) return;
        try {
            const res = await axios.post(`/api/tickets/${id}/comment`, { message: comment });
            setTicket(res.data);
            setComment('');
        } catch (error) {
            console.error(error);
        }
    };

    if (!ticket) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-2 mb-6 transition-colors w-max px-3 py-1.5 rounded-xl hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4" /> Back
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Chat */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Details */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{ticket.title}</h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium bg-gray-50 w-max px-4 py-2 rounded-lg border border-gray-100">
                                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-blue-500" /> {ticket.createdBy?.name}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-500" /> {format(new Date(ticket.createdAt), 'MMM d, yyyy - p')}</span>
                                </div>
                            </div>
                            <StatusBadge status={ticket.status} />
                        </div>
                        
                        <div className="prose prose-blue max-w-none text-gray-700 bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2"><LayoutList className="w-4 h-4"/> Description</h4>
                            <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{ticket.description}</p>
                        </div>
                    </div>

                    {/* Chat Thread */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/80">
                            <h3 className="font-bold text-gray-900 text-lg">Activity & Comments</h3>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-slate-50/50">
                            {ticket.comments.map((c, i) => {
                                const isMe = c.user?._id === user.id || c.user === user.id;
                                return (
                                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] ${isMe ? 'bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-600/20' : 'bg-white border border-gray-200 shadow-sm text-gray-800 rounded-bl-sm'}`}>
                                            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{c.message}</p>
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-2 font-bold px-1 flex items-center gap-1.5 tracking-wide">
                                            <span>{isMe ? 'You' : c.user?.name}</span> • <span>{format(new Date(c.createdAt), 'MMM d, p')}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {ticket.comments.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Send className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium">No comments yet. Start the conversation!</p>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <form onSubmit={submitComment} className="relative flex items-center">
                                <input 
                                    type="text" 
                                    placeholder="Type your message..." 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-gray-900"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!comment.trim()}
                                    className="absolute right-2.5 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Properties & Metadata */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 text-lg">Properties</h3>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">Category</p>
                                <p className="font-bold text-gray-900">{ticket.category}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">Priority</p>
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg bg-white border shadow-sm ${ticket.priority === 'High' ? 'text-red-600 border-red-200' : ticket.priority === 'Medium' ? 'text-orange-600 border-orange-200' : 'text-blue-600 border-blue-200'}`}>
                                    {ticket.priority} Priority
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">SLA Deadline</p>
                                <SLATimer deadline={ticket.slaDeadline} status={ticket.status} />
                                <p className="text-xs font-bold text-gray-500 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {ticket.slaDeadline ? format(new Date(ticket.slaDeadline), 'MMM d, yyyy - p') : 'N/A'}
                                </p>
                            </div>
                            
                            {/* Actions for Agent / Admin */}
                            {user.role !== 'user' && (
                                <div className="pt-6 border-t border-gray-100 space-y-5">
                                    <div>
                                        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">Update Status</p>
                                        <select 
                                            className="w-full text-sm px-4 py-3 border border-gray-200 rounded-xl outline-none font-bold text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm appearance-none"
                                            value={ticket.status}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                    
                                    {user.role === 'admin' && (
                                        <div>
                                            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">Assign Agent</p>
                                            <select 
                                                className="w-full text-sm px-4 py-3 border border-gray-200 rounded-xl outline-none font-bold text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm appearance-none"
                                                value={ticket.assignedTo?._id || ''}
                                                onChange={handleAssign}
                                            >
                                                <option value="">Unassigned</option>
                                                {agents.map(a => (
                                                    <option key={a._id} value={a._id}>{a.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions for User */}
                            {user.role === 'user' && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                                <div className="pt-4 border-t border-gray-50">
                                    <button 
                                        onClick={() => handleStatusChange({target: {value: 'Resolved'}})}
                                        className="w-full py-3.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl font-bold transition-colors text-sm shadow-sm"
                                    >
                                        Mark Issue as Resolved
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback Display */}
                    {ticket.feedback?.rating && (
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl p-8 border border-yellow-200 shadow-sm text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-24 h-24 text-yellow-600 fill-yellow-600" /></div>
                            <div className="relative z-10">
                                <div className="flex justify-center mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-8 h-8 ${i < ticket.feedback.rating ? 'fill-yellow-500 text-yellow-500' : 'text-yellow-200'}`} />
                                    ))}
                                </div>
                                <p className="font-bold text-yellow-900 mb-2 text-lg">Customer Rating</p>
                                {ticket.feedback.comment && <p className="text-sm text-yellow-800 font-medium italic">"{ticket.feedback.comment}"</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showFeedback && (
                <FeedbackModal ticketId={ticket._id} onClose={() => { setShowFeedback(false); fetchTicket(); }} />
            )}
        </div>
    );
};

export default TicketDetail;

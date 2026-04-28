import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import SLATimer from './SLATimer';
import { format } from 'date-fns';
import { ArrowRight, Calendar } from 'lucide-react';

const TicketCard = ({ ticket }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <StatusBadge status={ticket.status} />
                    <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-50 border ${ticket.priority === 'High' ? 'text-red-600 border-red-200' : ticket.priority === 'Medium' ? 'text-orange-600 border-orange-200' : 'text-blue-600 border-blue-200'}`}>
                        {ticket.priority}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">{ticket.title}</h3>
                <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">{ticket.description}</p>
            </div>
            
            <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
                <div className="flex flex-col gap-2 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
                    <SLATimer deadline={ticket.slaDeadline} status={ticket.status} />
                </div>
                <Link to={`/tickets/${ticket._id}`} className="bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 p-2.5 rounded-xl transition-all duration-300 flex items-center gap-1 text-sm font-bold shadow-sm">
                    View <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default TicketCard;

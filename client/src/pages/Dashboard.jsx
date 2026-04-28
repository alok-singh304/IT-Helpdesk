import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await axios.get('/api/tickets');
            setTickets(res.data);
        } catch (error) {
            console.error('Error fetching tickets', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 text-sm font-medium mt-0.5">Welcome back, {user.name}</p>
                    </div>
                </div>
                {user.role !== 'agent' && (
                    <Link to="/tickets/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95">
                        <PlusCircle className="w-5 h-5" /> Raise Ticket
                    </Link>
                )}
            </div>

            {tickets.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Tickets Found</h3>
                    <p className="text-gray-500 mb-8 max-w-md font-medium">You don't have any active tickets. When you raise a ticket or get one assigned, it will appear here.</p>
                    {user.role === 'user' && (
                        <Link to="/tickets/new" className="text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl transition-colors">
                            Raise your first ticket
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tickets.map(ticket => (
                        <TicketCard key={ticket._id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;

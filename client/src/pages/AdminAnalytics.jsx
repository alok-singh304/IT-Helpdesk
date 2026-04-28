import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart as PieIcon, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import StatusDonut from '../components/Charts/StatusDonut';
import TicketsLineChart from '../components/Charts/TicketsLineChart';
import AgentBarChart from '../components/Charts/AgentBarChart';
import TicketCard from '../components/TicketCard';

const AdminAnalytics = () => {
    const [breachedTickets, setBreachedTickets] = useState([]);

    useEffect(() => {
        const fetchBreached = async () => {
            try {
                const res = await axios.get('/api/tickets/breached');
                setBreachedTickets(res.data);
            } catch (error) { console.error(error); }
        };
        fetchBreached();
        const interval = setInterval(fetchBreached, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><PieIcon className="w-7 h-7" /></div>
                    Analytics Dashboard
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Real-time overview of the helpdesk performance. Charts auto-refresh every 30 seconds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><PieIcon className="w-5 h-5 text-blue-500"/> Tickets by Status</h3>
                    <StatusDonut />
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500"/> Tickets Raised (Last 7 Days)</h3>
                    <TicketsLineChart />
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500"/> Agent Performance (Resolved Tickets)</h3>
                    <AgentBarChart />
                </div>
            </div>

            {/* Breached Tickets Section */}
            <div className="bg-white rounded-[2rem] p-8 border border-red-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-red-500"/> SLA Breached Tickets</h3>
                <p className="text-gray-500 mb-8 font-medium">These tickets have passed their SLA deadline and require immediate attention.</p>
                
                {breachedTickets.length === 0 ? (
                    <div className="bg-green-50 text-green-700 p-6 rounded-2xl font-bold text-center border border-green-100 shadow-sm">
                        Awesome! There are no SLA breached tickets at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {breachedTickets.map(ticket => (
                            <TicketCard key={ticket._id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnalytics;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketCard from '../components/TicketCard';
import { Search, Filter, Save, Ticket } from 'lucide-react';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [priority, setPriority] = useState('All');
    const [category, setCategory] = useState('All');
    const [assignedTo, setAssignedTo] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    
    const [savedFilters, setSavedFilters] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedFilters') || '[]');
        setSavedFilters(saved);
        fetchAgents();
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [status, priority, category, assignedTo, sortBy]);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTickets();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            let url = `/api/tickets?status=${status}&priority=${priority}&category=${category}&sortBy=${sortBy}`;
            if(search) url += `&search=${search}`;
            if(assignedTo) url += `&assignedTo=${assignedTo}`;
            
            const res = await axios.get(url);
            setTickets(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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

    const saveCurrentFilter = () => {
        const name = prompt('Enter a name for this filter preset:');
        if (!name) return;
        
        const preset = {
            id: Date.now(),
            name,
            filters: { status, priority, category, assignedTo, sortBy, search }
        };
        
        const updated = [...savedFilters, preset];
        setSavedFilters(updated);
        localStorage.setItem('savedFilters', JSON.stringify(updated));
    };

    const applyFilter = (preset) => {
        setStatus(preset.filters.status);
        setPriority(preset.filters.priority);
        setCategory(preset.filters.category);
        setAssignedTo(preset.filters.assignedTo);
        setSortBy(preset.filters.sortBy);
        setSearch(preset.filters.search);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><Ticket className="w-7 h-7" /></div>
                        System Tickets
                    </h1>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-10 space-y-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search tickets by keyword in title or description..."
                        className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium transition-all shadow-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Status</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Priority</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={priority} onChange={e => setPriority(e.target.value)}>
                            <option value="All">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Network">Network</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Assigned Agent</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                            <option value="">Any Agent</option>
                            {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Sort By</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl outline-none font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highestPriority">Highest Priority</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-gray-100 gap-4">
                    <div className="flex gap-2 flex-wrap items-center">
                        <span className="text-sm font-bold text-gray-500 mr-2 flex items-center gap-1.5"><Filter className="w-4 h-4 text-blue-500"/> Saved Filters:</span>
                        {savedFilters.length === 0 && <span className="text-sm text-gray-400 italic font-medium">None</span>}
                        {savedFilters.map(preset => (
                            <button 
                                key={preset.id} 
                                onClick={() => applyFilter(preset)}
                                className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={saveCurrentFilter}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Save className="w-4 h-4" /> Save Current Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div></div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-gray-500 font-bold text-xl">No tickets match your filters.</p>
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

export default AdminTickets;

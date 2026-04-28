import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Tag, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateTicket = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Hardware',
        priority: 'Low'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/tickets', formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating ticket', error);
            alert('Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-2 mb-6 transition-colors w-max px-2 py-1 rounded-lg hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="px-10 pt-10 pb-8 border-b border-gray-50">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Raise New Ticket</h1>
                    <p className="text-gray-500 mt-2 font-medium">Please provide detailed information so our team can assist you quickly.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-slate-50/30">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subject / Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-gray-900 transition-all shadow-sm"
                            placeholder="Briefly describe the issue (e.g. Printer not working)"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                        <textarea
                            required
                            rows="6"
                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-gray-900 resize-none transition-all shadow-sm"
                            placeholder="Provide as much information as possible about the problem, error codes, and steps you've already taken..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-blue-500" /> Category
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 appearance-none shadow-sm cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Hardware">Hardware (Laptops, Printers)</option>
                                    <option value="Software">Software (OS, Apps)</option>
                                    <option value="Network">Network (Wi-Fi, VPN)</option>
                                    <option value="Other">Other Issues</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" /> Priority
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 appearance-none shadow-sm cursor-pointer"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                >
                                    <option value="Low">Low - Not Urgent</option>
                                    <option value="Medium">Medium - Normal</option>
                                    <option value="High">High - Urgent / Blocking Work</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 text-lg"
                        >
                            {loading ? 'Submitting Ticket...' : 'Submit Ticket'} <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicket;

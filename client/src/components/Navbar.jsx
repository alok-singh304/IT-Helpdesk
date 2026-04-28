import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Ticket, PieChart } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    // If there is no user, don't render the navbar (e.g. on Login/Register pages)
    if (!user) return null; 

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Ticket className="text-white w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">
                                IT Helpdesk
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex space-x-6 mr-4">
                            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1.5 transition-colors">
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                            
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin/tickets" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1.5 transition-colors">
                                        <Ticket className="w-4 h-4" /> All Tickets
                                    </Link>
                                    <Link to="/admin/analytics" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1.5 transition-colors">
                                        <PieChart className="w-4 h-4" /> Analytics
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{user.role}</span>
                            </div>
                            <button 
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

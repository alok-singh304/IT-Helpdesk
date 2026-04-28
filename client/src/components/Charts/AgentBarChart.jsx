import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const AgentBarChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/analytics/agent-performance');
                setData(res.data);
            } catch (err) { console.error(err); }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="agentName" tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10}/>
                    <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} allowDecimals={false} dx={-10}/>
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} cursor={{fill: '#f8fafc'}} />
                    <Bar yAxisId="left" dataKey="resolvedCount" name="Resolved Tickets" fill="#10B981" radius={[6, 6, 0, 0]} barSize={45} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
export default AgentBarChart;

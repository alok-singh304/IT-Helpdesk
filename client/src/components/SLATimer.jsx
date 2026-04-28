import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';

const SLATimer = ({ deadline, status }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [breached, setBreached] = useState(false);

    useEffect(() => {
        if (!deadline || status === 'Resolved' || status === 'Closed') return;

        const updateTimer = () => {
            const date = new Date(deadline);
            if (isPast(date)) {
                setBreached(true);
                setTimeLeft('SLA Breached');
            } else {
                setTimeLeft(formatDistanceToNow(date, { addSuffix: true }));
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000); // update every minute
        return () => clearInterval(interval);
    }, [deadline, status]);

    if (!deadline || status === 'Resolved' || status === 'Closed') return null;

    return (
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${breached ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
            {breached ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {breached ? 'SLA Breached' : `Due ${timeLeft}`}
        </div>
    );
};

export default SLATimer;

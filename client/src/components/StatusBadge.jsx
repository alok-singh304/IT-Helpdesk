import React from 'react';

const StatusBadge = ({ status }) => {
    const styles = {
        'Open': 'bg-blue-50 text-blue-700 border-blue-200',
        'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
        'Resolved': 'bg-green-50 text-green-700 border-green-200',
        'Closed': 'bg-gray-100 text-gray-700 border-gray-300'
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${styles[status] || styles['Open']}`}>
            {status}
        </span>
    );
};

export default StatusBadge;

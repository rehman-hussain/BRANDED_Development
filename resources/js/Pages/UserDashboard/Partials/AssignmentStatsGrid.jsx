import React from 'react';

export default function AssignmentStatsGrid({ overdueCount, todayCount, tomorrowCount, dueLaterCount }) {
    const stats = [
        { name: 'Overdue', stat: overdueCount },
        { name: 'Due Today', stat: todayCount },
        { name: 'Due Tomorrow', stat: tomorrowCount },
        { name: 'Due Later', stat: dueLaterCount },
    ];

    return (
        <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">My Tasks Due Dates</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-300">{item.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{item.stat}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

import React from 'react';

const statuses = {
    Artwork: 'text-blue-700 bg-blue-50 ring-blue-600/20 dark:bg-blue-900 dark:text-blue-300',
};

const project = {
    id: 1,
    name: 'Artwork Test One',
    status: 'Artwork',
    customerReference: 'CR12345',
    description: 'This is a test description for the artwork project.',
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function TaskDetailsHeader() {
    return (
        <div className="">
            <div className="flex items-center justify-between gap-x-6 py-5">
                <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                        {/* Ensure task name turns white in dark mode */}
                        <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">{project.name}</p>
                        <p
                            className={classNames(
                                statuses[project.status],
                                'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                            )}
                        >
                            {project.status}
                        </p>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        <p className="whitespace-nowrap">
                            Customer Reference: <span>{project.customerReference}</span>
                        </p>
                        <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                            <circle r={1} cx={1} cy={1} />
                        </svg>
                        <p className="truncate">Description: {project.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

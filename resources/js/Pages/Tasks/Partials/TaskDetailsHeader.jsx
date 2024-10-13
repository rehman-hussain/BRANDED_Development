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
        <div className="py-0">
            <div className="flex items-center gap-x-3 py-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-x-3">
                        {/* Increased text size for the task name */}
                        <p className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">{project.name}</p>
                        <p
                            className={classNames(
                                statuses[project.status],
                                'whitespace-nowrap rounded-lg px-2 py-1 text-sm font-semibold ring-1 ring-inset',  // Increased badge size
                            )}
                        >
                            {project.status}
                        </p>
                    </div>
                    <div className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        <p className="whitespace-nowrap">
                            Customer Reference: <span>{project.customerReference}</span>
                        </p>
                        <p className="mt-1 truncate"> {/* Added margin to create space between customer reference and description */}
                            Description: {project.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

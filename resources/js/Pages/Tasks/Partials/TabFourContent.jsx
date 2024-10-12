import { ArrowDownTrayIcon, XMarkIcon, FolderIcon } from '@heroicons/react/20/solid';
import React from 'react';

// Data representing files and directories
const items = [
    { id: 1, name: 'Design Brief.pdf', type: 'file', size: '2 MB', modified: 'Sep 10, 2023', modifiedTime: new Date('2023-09-10T09:00:00'), isDirectory: false },
    { id: 2, name: 'Final Artwork.png', type: 'file', size: '4.2 MB', modified: 'Sep 11, 2023', modifiedTime: new Date('2023-09-11T09:00:00'), isDirectory: false },
    { id: 3, name: 'Reference Materials', type: 'directory', size: '--', modified: 'Aug 20, 2023', modifiedTime: new Date('2023-08-20T09:00:00'), isDirectory: true },
    { id: 4, name: 'Project Documentation.pdf', type: 'file', size: '1.5 MB', modified: 'Sep 5, 2023', modifiedTime: new Date('2023-09-05T09:00:00'), isDirectory: false },
];

// Function to sort items, directories first and then files by last modified date
const sortedItems = [...items]
    .sort((a, b) => {
        // If both are directories or both are files, sort by last modified date (oldest first)
        if (a.isDirectory === b.isDirectory) {
            return a.modifiedTime - b.modifiedTime;
        }
        // Directories come before files
        return a.isDirectory ? -1 : 1;
    });

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function TabFourContent() {
    return (
        <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Documents</h3>
            <div className="mt-4">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedItems.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-4">
                            <div className="flex items-center">
                                {item.isDirectory ? (
                                    <FolderIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" aria-hidden="true" />
                                ) : (
                                    <div className="h-6 w-6" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.isDirectory ? 'Directory' : `Size: ${item.size} | Last modified: ${item.modified}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                {/* Download Icon */}
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
                                    aria-label="Download"
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                                </a>
                                {/* Remove Icon (only visible for files, not directories) */}
                                {!item.isDirectory && (
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
                                        aria-label="Remove"
                                    >
                                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

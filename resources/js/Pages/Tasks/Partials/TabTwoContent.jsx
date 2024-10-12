import React from 'react';

export default function TabTwoContent() {
    return (
        <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Notes</h3>
            {/* Uneditable text box with lorem ipsum text */}
            <div className="mt-4">
                <div
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 shadow-sm p-4 sm:text-sm"
                    style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac
                    tempor dui sagittis. In condimentum facilisis porta. Sed nec diam eu diam mattis viverra. Nulla
                    fringilla, orci ac euismod semper, magna diam porttitor mauris, quis sollicitudin sapien justo in libero.
                </div>
            </div>
        </div>
    );
}

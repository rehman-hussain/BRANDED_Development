import React from 'react';
import { Link } from '@inertiajs/react';  // Import Inertia's Link component
import { HomeIcon } from '@heroicons/react/20/solid';

export default function Breadcrumb({ pages }) {
    return (
        <nav aria-label="Breadcrumb" className="flex border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
            <ol role="list" className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
                <li className="flex">
                    <div className="flex items-center">
                        <Link href={route('dashboard')} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400">
                            <HomeIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {pages.map((page) => (
                    <li key={page.name} className="flex">
                        <div className="flex items-center">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 24 44"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                                className="h-full w-6 flex-shrink-0 text-gray-200 dark:text-gray-600"
                            >
                                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                            </svg>
                            <Link
                                href={page.href}
                                aria-current={page.current ? 'page' : undefined}
                                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
                            >
                                {page.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

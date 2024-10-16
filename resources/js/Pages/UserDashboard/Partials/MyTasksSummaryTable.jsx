import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const tempData = [
    { item_reference: 'IR001', customer_reference: 'CR001', item_description: 'Item 1 description', studio_status: 'Pending' },
    { item_reference: 'IR002', customer_reference: 'CR002', item_description: 'Item 2 description', studio_status: 'In Progress' },
    { item_reference: 'IR003', customer_reference: 'CR003', item_description: 'Item 3 description', studio_status: 'Completed' },
    { item_reference: 'IR004', customer_reference: 'CR004', item_description: 'Item 4 description', studio_status: 'Pending' },
    { item_reference: 'IR005', customer_reference: 'CR005', item_description: 'Item 5 description', studio_status: 'Completed' },
    { item_reference: 'IR006', customer_reference: 'CR006', item_description: 'Item 6 description', studio_status: 'In Progress' },
    { item_reference: 'IR007', customer_reference: 'CR007', item_description: 'Item 7 description', studio_status: 'Pending' },
    { item_reference: 'IR008', customer_reference: 'CR008', item_description: 'Item 8 description', studio_status: 'Completed' },
    { item_reference: 'IR009', customer_reference: 'CR009', item_description: 'Item 9 description', studio_status: 'In Progress' },
    { item_reference: 'IR010', customer_reference: 'CR010', item_description: 'Item 10 description', studio_status: 'Pending' },
    { item_reference: 'IR011', customer_reference: 'CR011', item_description: 'Item 11 description', studio_status: 'Completed' },
    { item_reference: 'IR012', customer_reference: 'CR012', item_description: 'Item 12 description', studio_status: 'Pending' },
    { item_reference: 'IR013', customer_reference: 'CR013', item_description: 'Item 13 description', studio_status: 'In Progress' },
    { item_reference: 'IR014', customer_reference: 'CR014', item_description: 'Item 14 description', studio_status: 'Completed' },
    { item_reference: 'IR015', customer_reference: 'CR015', item_description: 'Item 15 description', studio_status: 'Pending' },
    { item_reference: 'IR016', customer_reference: 'CR016', item_description: 'Item 16 description', studio_status: 'Completed' },
    { item_reference: 'IR017', customer_reference: 'CR017', item_description: 'Item 17 description', studio_status: 'In Progress' },
    { item_reference: 'IR018', customer_reference: 'CR018', item_description: 'Item 18 description', studio_status: 'Pending' },
    { item_reference: 'IR019', customer_reference: 'CR019', item_description: 'Item 19 description', studio_status: 'Completed' },
    { item_reference: 'IR020', customer_reference: 'CR020', item_description: 'Item 20 description', studio_status: 'In Progress' },
];


export default function MyTasksSummaryTable() {
    const [sortedLines, setSortedLines] = useState(tempData);  // Using tempData instead of workOrderLines
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');  // 'asc' or 'desc'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);  // This will be controlled by the dropdown

    // Define headers
    const headers = [
        { name: 'Item Reference', key: 'item_reference', visible: true },
        { name: 'Customer Reference', key: 'customer_reference', visible: 'sm' },
        { name: 'Item Description', key: 'item_description', visible: 'lg' },
        { name: 'Studio Status', key: 'studio_status', visible: true },
    ];

    // Calculate total pages
    const totalPages = Math.ceil(sortedLines.length / itemsPerPage);

    // Sort the table data
    const handleSort = (key) => {
        const isAsc = sortKey === key && sortOrder === 'asc';
        const newOrder = isAsc ? 'desc' : 'asc';
        setSortOrder(newOrder);
        setSortKey(key);

        const sortedData = [...sortedLines].sort((a, b) => {
            if (a[key] < b[key]) return newOrder === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return newOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setSortedLines(sortedData);
        setCurrentPage(1);  // Reset to the first page after sorting
    };

    // Handle pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1);  // Reset to the first page when items per page change
    };

    const renderChevronIcon = (key) => {
        if (sortKey !== key) return null;
        return (
            <span className="ml-2 flex-none rounded text-gray-400">
                <ChevronDownIcon aria-hidden="true" className={`h-5 w-5 ${sortOrder === 'asc' ? '' : 'transform rotate-180'}`} />
            </span>
        );
    };

    // Paginate the data
    const paginatedData = sortedLines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="mt-4 text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">My Tasks Summary</h1>
                    </div>
                </div>
            </div>

            <div className="mt-4 flow-root overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <table className="w-full text-left">
                        <thead className="bg-white dark:bg-gray-800">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.key}
                                    scope="col"
                                    className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 ${
                                        header.visible === true ? '' : `hidden ${header.visible}:table-cell`
                                    }`}
                                >
                                    <a
                                        href="#"
                                        onClick={() => handleSort(header.key)}
                                        className="group inline-flex"
                                    >
                                        {header.name}
                                        {renderChevronIcon(header.key)}
                                    </a>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                        {paginatedData.map((line, index) => (
                            <tr key={index}>
                                <td
                                    className="px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    {line.item_reference}
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    {line.customer_reference}
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    {line.item_description}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {line.studio_status}
                                </td>
                                <td className="px-3 py-4 text-right text-sm font-medium">
                                    <Link
                                        href={route('task.details')}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900"
                                    >
                                        More Info
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="itemsPerPage" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                                Records per page
                            </label>
                            <select
                                id="itemsPerPage"
                                name="itemsPerPage"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedLines.length)}</span> of{' '}
                                <span className="font-medium">{sortedLines.length}</span> results
                            </p>
                        </div>
                        <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                            {[...Array(totalPages).keys()].map((page) => (
                                <button
                                    key={page + 1}
                                    onClick={() => setCurrentPage(page + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === page + 1
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                    } focus:z-20`}
                                >
                                    {page + 1}
                                </button>
                            ))}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head } from '@inertiajs/react';
import TabOneContent from '@/Pages/Tasks/Partials/TabOneContent.jsx';  // Tab content component for Tab 1
import TabTwoContent from '@/Pages/Tasks/Partials/TabTwoContent.jsx';  // Tab content component for Tab 2
import TabThreeContent from '@/Pages/Tasks/Partials/TabThreeContent.jsx';  // Tab content component for Tab 3
import TabFourContent from '@/Pages/Tasks/Partials/TabFourContent.jsx';  // Tab content component for Tab 4
import TaskDetailsHeader from '@/Pages/Tasks/Partials/TaskDetailsHeader.jsx';  // Import TaskDetailsHeader component

// Define the tab structure
const tabsData = [
    { name: 'Details', component: <TabOneContent />, current: true },
    { name: 'Full Brief', component: <TabTwoContent />, current: false },
    { name: 'History', component: <TabThreeContent />, current: false },
    { name: 'Documents', component: <TabFourContent />, current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function TaskDetails() {
    const [tabs, setTabs] = useState(tabsData);  // Set the initial tab state
    const [selectedTab, setSelectedTab] = useState(tabs[0]);  // Default tab is TabOneContent

    const handleTabClick = (tab) => {
        // Update the selected tab and mark the current tab in the tabs state
        setTabs(tabs.map(t => ({ ...t, current: t.name === tab.name })));
        setSelectedTab(tab);
    };

    return (
        <AuthenticatedLayout
            pages={[
                { name: 'Dashboard', href: route('dashboard'), current: false },
                { name: 'Task Details', href: '#', current: true },
            ]}
        >
            <Head title="Task Details" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Task Details Header */}
                    <TaskDetailsHeader />  {/* This component will render the TaskDetails header */}

                    {/* Tabs for small screens */}
                    <div className="sm:hidden">
                        <label htmlFor="tabs" className="sr-only">Select a tab</label>
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={(e) => handleTabClick(tabs.find(tab => tab.name === e.target.value))}
                            defaultValue={tabs[0].name}
                        >
                            {tabs.map((tab) => (
                                <option key={tab.name}>{tab.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tabs for larger screens */}
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => handleTabClick(tab)}
                                        className={classNames(
                                            tab.current
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                            'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                                        )}
                                        aria-current={tab.current ? 'page' : undefined}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {selectedTab.component}  {/* This dynamically loads the selected tab component */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

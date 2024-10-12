import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head } from '@inertiajs/react';
import MyTasksSummaryTable from '@/Pages/UserDashboard/Partials/MyTasksSummaryTable.jsx';  // Import your table component
import AssignmentStatsGrid from '@/Pages/UserDashboard/Partials/AssignmentStatsGrid.jsx';  // Import the new stats grid component

const pages = [
    { name: 'Dashboard', href: route('dashboard'), current: true },
];

export default function Dashboard() {
    // Test data for the AssignmentStatsGrid
    const overdueCount = 5;
    const todayCount = 2;
    const tomorrowCount = 3;
    const dueLaterCount = 10;

    return (
        <AuthenticatedLayout
            pages={pages}  // Pass the breadcrumb pages
        >
            <Head title="Dashboard" />
            <div className="py-6 min-h-screen bg-white dark:bg-gray-900">  {/* Full-page background support */}
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid Component */}
                    <AssignmentStatsGrid
                        overdueCount={overdueCount}
                        todayCount={todayCount}
                        tomorrowCount={tomorrowCount}
                        dueLaterCount={dueLaterCount}
                    />
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6 mt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"></h3>
                        {/* Table Component */}
                        <MyTasksSummaryTable />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

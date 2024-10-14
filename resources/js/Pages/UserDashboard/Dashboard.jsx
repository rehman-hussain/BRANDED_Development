import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, usePage } from '@inertiajs/react';
import MyTasksSummaryTable from '@/Pages/UserDashboard/Partials/MyTasksSummaryTable.jsx';
import AssignmentStatsGrid from '@/Pages/UserDashboard/Partials/AssignmentStatsGrid.jsx';

const pages = [
    { name: 'Dashboard', href: route('dashboard'), current: true },
];

export default function Dashboard() {
    const { counts, workOrderLines } = usePage().props;  // Pulling the data from props
    const { overdueCount, todayCount, tomorrowCount, dueLaterCount } = counts;  // Destructuring counts

    return (
        <AuthenticatedLayout
            pages={pages}  // Pass the breadcrumb pages
        >
            <Head title="Dashboard" />
            <div className="py-6 bg-white dark:bg-gray-900">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid Component */}
                    <AssignmentStatsGrid
                        overdueCount={overdueCount}
                        todayCount={todayCount}
                        tomorrowCount={tomorrowCount}
                        dueLaterCount={dueLaterCount}
                    />
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6 mt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Task Summary</h3>
                        {/* Table Component */}
                        <MyTasksSummaryTable workOrderLines={workOrderLines} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

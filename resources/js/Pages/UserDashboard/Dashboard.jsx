import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, usePage } from '@inertiajs/react';
import MyTasksSummaryTable from '@/Pages/UserDashboard/Partials/MyTasksSummaryTable.jsx';
import AssignmentStatsGrid from '@/Pages/UserDashboard/Partials/AssignmentStatsGrid.jsx';
import AssignmentStatsSkeleton from '@/Pages/UserDashboard/Partials/AssignmentStatsSkeleton.jsx';
import MyTasksSummaryTableSkeleton from '@/Pages/UserDashboard/Partials/MyTasksSummaryTableSkeleton.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';

const pages = [{ name: 'Dashboard', href: route('dashboard'), current: true }];

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        counts: null,
        workOrderLines: null,
    });

    useEffect(() => {
        // Fetch the dashboard data via AJAX
        axios.get(route('dashboard'))
            .then((response) => {
                setData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
                setIsLoading(false);
            });
    }, []);

    const { counts, workOrderLines } = data;
    const { overdueCount, todayCount, tomorrowCount, dueLaterCount } = counts || {};

    return (
        <AuthenticatedLayout pages={pages}>
            <Head title="Dashboard" />
            <div className="py-6 bg-white dark:bg-gray-900">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid Component or Skeleton */}
                    {isLoading ? (
                        <AssignmentStatsSkeleton />
                    ) : (
                        <AssignmentStatsGrid
                            overdueCount={overdueCount || 0}
                            todayCount={todayCount || 0}
                            tomorrowCount={tomorrowCount || 0}
                            dueLaterCount={dueLaterCount || 0}
                        />
                    )}

                    {/* Task Summary Table or Skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6 mt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Task Summary</h3>
                        {isLoading ? (
                            <MyTasksSummaryTableSkeleton />
                        ) : (
                            <MyTasksSummaryTable workOrderLines={workOrderLines || []} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


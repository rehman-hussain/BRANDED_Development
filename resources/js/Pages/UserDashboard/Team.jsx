import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head } from '@inertiajs/react';

export default function Team() {
    const { users, teamName } = usePage().props;  // Destructure the users and teamName props

    const pages = [
        { name: 'Dashboard', href: route('dashboard'), current: false },
        { name: 'Team', href: route('team.index'), current: true },  // Breadcrumb for the current page
    ];

    return (
        <AuthenticatedLayout pages={pages}>
            <Head title={`Team - ${teamName}`} />  {/* Dynamic title based on team name */}
            <div className="py-6 min-h-screen bg-white dark:bg-gray-900">
                <div className="px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Team: {teamName}</h1>

                    <ul role="list" className="divide-y divide-gray-200 mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                        {users.map((user) => (
                            <li key={user.id} className="flex justify-between gap-x-6 py-5 px-4 sm:px-6">
                                <div className="flex min-w-0 gap-x-4">
                                    {/* Placeholder image for user profile, replace with actual profile image if available */}
                                    <img alt="" src="https://via.placeholder.com/40" className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{user.name}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <p className="text-sm leading-6 text-gray-900 dark:text-gray-100">{user.role ?? 'Member'}</p>
                                    {user.is_online ? (
                                        <div className="mt-1 flex items-center gap-x-1.5">
                                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            </div>
                                            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">Online</p>
                                        </div>
                                    ) : (
                                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                            Last seen <time>{user.last_seen_human}</time>
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

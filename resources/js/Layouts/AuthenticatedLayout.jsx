import { useState, Fragment } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    BellIcon,
    ChevronDownIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Breadcrumb from '@/Components/Breadcrumb';  // Import Breadcrumb component

// Sidebar navigation items
const navigation = [
    { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon, current: route().current('dashboard') },
    { name: 'Team', href: '#', icon: UsersIcon, current: false },
];

// Utility function to handle class names conditionally
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function AuthenticatedLayout({ header, pages, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);  // State for the mobile sidebar
    const { auth } = usePage().props;  // Get authenticated user data from Laravel props
    const { post } = useForm();  // useForm for handling the logout form submission

    // User-specific navigation (profile and logout)
    const userNavigation = [
        { name: 'Your Profile', href: route('profile.edit') },
        { name: 'Sign Out', href: route('logout'), method: 'post' },
    ];

    return (
        <>
            {/* Mobile Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <div className="fixed inset-0 bg-gray-900/80" />
                    <div className="fixed inset-0 flex z-40">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800">
                                <div className="flex items-center justify-between px-4 py-4">
                                    <img src="/images/branded-logo.svg" className="h-8 w-auto" alt="Logo" />  {/* Updated logo path */}
                                    <button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                                <nav className="mt-5 flex-1 px-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current ? 'bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400',
                                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                            )}
                                        >
                                            <item.icon className="h-6 w-6" aria-hidden="true" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white dark:bg-gray-800">
                <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 pt-5 bg-white dark:bg-gray-800 overflow-y-auto">
                    <div className="flex items-center justify-between px-4">
                        <img src="/images/branded-logo.svg" className="h-8 w-auto" alt="Logo" />  {/* Updated logo path */}
                    </div>
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400',
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                )}
                            >
                                <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content area with sidebar padding on large screens */}
            <div className="lg:pl-64 min-h-screen flex flex-col bg-white dark:bg-gray-900">
                {/* Top navigation bar with search bar */}
                <div className="sticky top-0 z-10 flex h-16 bg-white dark:bg-gray-900 shadow items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="px-4 text-gray-500 dark:text-gray-400 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 flex items-center justify-center lg:justify-start">
                        <form action="#" method="GET" className="w-full lg:w-auto lg:flex-1">
                            <div className="relative w-full">
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    id="search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm"
                                    placeholder="Search"
                                    type="search"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="ml-4 flex items-center">
                        {/* Notification Bell with Dropdown */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="rounded-full p-1 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                                <BellIcon className="h-6 w-6" />
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                                    {/* Notifications go here */}
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* User Profile Dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <Menu.Button className="flex items-center text-sm rounded-full">
                                <img className="h-8 w-8 rounded-full" src={auth.user.profile_photo_url || 'https://via.placeholder.com/40'} alt="" />
                                <span className="ml-3 hidden lg:inline-block text-gray-700 dark:text-gray-300 font-medium">{auth.user.name}</span>
                                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-300" />
                            </Menu.Button>
                            <Transition as={Fragment}>
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                        <Menu.Item key={item.name}>
                                            {({ active }) => (
                                                item.method === 'post' ? (
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        post(item.href);  // Post the logout request using Inertia
                                                    }}>
                                                        <button
                                                            type="submit"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 dark:bg-gray-900' : '',
                                                                'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <Link
                                                        href={item.href}
                                                        className={classNames(
                                                            active ? 'bg-gray-100 dark:bg-gray-900' : '',
                                                            'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                )
                                            )}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 bg-white dark:bg-gray-900">
                    {pages && <Breadcrumb pages={pages} />}
                    {header && (
                        <div className="bg-white dark:bg-gray-800 shadow">
                            <div className="py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </div>
                    )}
                    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full flex-shrink-0 h-12 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 shadow">
                    <p>Copyright &copy; 2024 BRANDED Ltd. All Rights Reserved</p>
                    <p>Version 10.0</p>
                </footer>
            </div>
        </>
    );
}

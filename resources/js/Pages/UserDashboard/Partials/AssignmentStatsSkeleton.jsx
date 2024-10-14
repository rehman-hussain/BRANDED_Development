// resources/js/Pages/UserDashboard/Partials/AssignmentStatsSkeleton.jsx
export default function AssignmentStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            ))}
        </div>
    );
}

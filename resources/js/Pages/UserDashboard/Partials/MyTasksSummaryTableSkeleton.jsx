// resources/js/Pages/UserDashboard/Partials/MyTasksSummaryTableSkeleton.jsx
export default function MyTasksSummaryTableSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
            </div>
        </div>
    );
}

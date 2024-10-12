import { CheckCircleIcon } from '@heroicons/react/24/solid'

const activity = [
    {
        id: 1,
        type: 'started',
        person: { name: 'John Doe (Artworker)' },
        task: 'Artwork Task',
        date: '4h ago',
        dateTime: '2023-10-12T09:00',
    },
    {
        id: 2,
        type: 'made a partial time entry for',
        person: { name: 'John Doe (Artworker)' },
        task: 'Artwork Task',
        date: '2h ago',
        dateTime: '2023-10-12T11:00',
    },
    {
        id: 3,
        type: 'completed',
        person: { name: 'John Doe (Artworker)' },
        task: 'Artwork Task',
        date: '1h ago',
        dateTime: '2023-10-12T12:00',
    },
    {
        id: 4,
        type: 'started',
        person: { name: 'Jane Smith (QC)' },
        task: 'QC Artwork Task',
        date: '30m ago',
        dateTime: '2023-10-12T12:30',
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function TabThreeContent() {
    return (
        <div className="flow-root">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Task History</h3>
            <ul role="list" className="space-y-6 mt-4">
                {activity.map((activityItem, activityItemIdx) => (
                    <li key={activityItem.id} className="relative flex gap-x-4">
                        <div
                            className={classNames(
                                activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
                                'absolute left-0 top-0 flex w-6 justify-center',
                            )}
                        >
                            <div className="w-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white dark:bg-gray-900">
                            {activityItem.type === 'completed' ? (
                                <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-500" />
                            ) : (
                                <div className="h-1.5 w-1.5 rounded-full bg-gray-100 dark:bg-gray-700 ring-1 ring-gray-300 dark:ring-gray-600" />
                            )}
                        </div>

                        <p className="flex-auto text-xs leading-5 text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{activityItem.person.name}</span>{' '}
                            {activityItem.type} <span className="font-medium text-gray-900 dark:text-gray-100">{activityItem.task}</span>.
                        </p>
                        <time
                            dateTime={activityItem.dateTime}
                            className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400"
                        >
                            {activityItem.date}
                        </time>
                    </li>
                ))}
            </ul>
        </div>
    )
}

import { ShiftApplication } from '@/features/shiftApplicationActionsSlice';
import { CheckIcon, XMarkIcon, WifiIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import cx from 'classnames';

interface Props {
  applications: ShiftApplication[];
  onDeleteClick: (applicationId: string) => void;
}

export default function ApplicationList({
  applications,
  onDeleteClick,
}: Props) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {applications.map((application, idx) => {
          const statusIcon = {
            bgColor: 'bg-gray-500',
            icon: WifiIcon,
          };
          if (application.status === 'accepted') {
            statusIcon.bgColor = 'bg-green-500';
            statusIcon.icon = CheckIcon;
          } else if (application.status === 'rejected') {
            statusIcon.bgColor = 'bg-red-500';
            statusIcon.icon = XMarkIcon;
          }
          return (
            <li key={application.id}>
              <div className="relative pb-8">
                {idx !== applications.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={cx(
                        'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
                      )}
                    >
                      <statusIcon.icon
                        className={cx(
                          `h-5 w-5 text-white ${statusIcon.bgColor}`
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {application.id}{' '}
                        <a
                          href={application.shiftId}
                          className="font-medium text-gray-900"
                        >
                          {application.description}
                        </a>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time
                        dateTime={new Date(application.createdAtMs).toString()}
                      >
                        {application.createdAtMs}
                      </time>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <button
                        className="flex"
                        onClick={() => onDeleteClick(application.id)}
                      >
                        <TrashIcon className="h-5 w-5 text-red-400" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

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
    <div className="flex flex-row overflow-hidden">
      <ul role="list" className="-mb-8">
        {applications.map((application) => {
          const { status } = application;
          const statusIcon = {
            bgColor: 'bg-gray-500',
            icon: WifiIcon,
          };
          if (status === 'accepted') {
            statusIcon.bgColor = 'bg-green-500';
            statusIcon.icon = CheckIcon;
          } else if (status === 'rejected') {
            statusIcon.bgColor = 'bg-red-500';
            statusIcon.icon = XMarkIcon;
          }
          return (
            <li key={application.id}>
              <div className="pb-8">
                <div className="flex space-x-3">
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
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-500">
                        {application.ownerUrn}{' '}
                      </p>
                      <p className="font-medium text-gray-900">
                        {application.description}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time
                        dateTime={new Date(application.createdAtMs).toString()}
                      >
                        {application.createdAtMs}
                      </time>
                    </div>
                    {status === 'pending' && (
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <button
                          className="flex"
                          onClick={() => onDeleteClick(application.id)}
                        >
                          <TrashIcon className="h-5 w-5 text-red-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
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

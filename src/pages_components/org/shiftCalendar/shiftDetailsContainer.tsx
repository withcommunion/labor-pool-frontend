import { IShift } from '@/features/orgShiftsSlice';
import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns/esm';

import AddShiftFormContainer from './addShiftFormContainer';

interface Props {
  shift?: IShift | null;
  userJwt: string;
  cleanup: () => void;
}
export default function ShiftDetailsContainer({
  shift,
  userJwt,
  cleanup,
}: Props) {
  const [editShift, setEditShift] = useState(false);
  return (
    <>
      <div>
        <button onClick={() => setEditShift(!editShift)}>Edit</button>
        {editShift && (
          <AddShiftFormContainer
            userJwt={userJwt}
            existingShift={shift}
            cleanup={cleanup}
          />
        )}
        {!editShift && shift && <ShiftDetailCard shift={shift} />}
      </div>
    </>
  );
}

function ShiftDetailCard({ shift }: { shift: IShift }) {
  return (
    <div className="overflow-hidden bg-white text-start shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Shift Details
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900">{shift.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Assigned to</dt>
            <dd className="mt-1 text-sm text-gray-900">{shift.assignedTo}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Start Date - End Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {format(shift.startTimeMs, 'M/dd h:mm b')} -{' '}
              {format(shift.endTimeMs, 'M/dd h:mm b')}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{shift.status}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Shift Description
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{shift.description}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Actions</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <button
                className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => console.log('apply')}
              >
                Apply
              </button>
            </dd>
            <dd className="mt-1 text-sm text-gray-900">
              <button
                className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => console.log('apply')}
              >
                Withdraw Application
              </button>
            </dd>
            <dd className="mt-1 text-sm text-gray-900">
              <button
                className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => console.log('apply')}
              >
                Delete Shift
              </button>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Applicants</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <ul
                role="list"
                className="divide-y divide-gray-200 rounded-md border border-gray-200"
              >
                {['Bill Nye', 'Neil Degrasse Tyson', 'Carl Sagan'].map(
                  (user) => {
                    return (
                      <li
                        className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        key={user}
                      >
                        <div className="flex w-0 flex-1 items-center">
                          <UserIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="ml-2 w-0 flex-1 truncate">
                            {user}
                          </span>
                        </div>
                        <div className="ml-4 flex gap-x-2">
                          <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Accept
                          </a>
                          <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Reject
                          </a>
                        </div>
                      </li>
                    );
                  }
                )}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

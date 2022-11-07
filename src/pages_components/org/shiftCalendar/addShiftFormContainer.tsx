import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import { Switch } from '@headlessui/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import cx from 'classnames';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import { IShift } from '@/features/orgShiftsSlice';
import { selectOrg } from '@/features/orgSlice';
import {
  fetchPostOrgShift,
  fetchPatchOrgShift,
  reset,
  selectOrgNewShiftStatus,
} from '@/features/orgNewShiftSlice';

export default function AddShiftFormContainer({
  userJwt,
  cleanup,
  existingShift,
}: {
  userJwt: string;
  cleanup: () => void;
  existingShift?: IShift | null;
}) {
  const dispatch = useAppDispatch();
  const org = useAppSelector(selectOrg);
  const newShiftStatus = useAppSelector(selectOrgNewShiftStatus);
  const [role, setRole] = useState(existingShift?.name || '');
  const [shiftStart, setShiftStart] = useState(
    (existingShift?.startTimeMs &&
      format(existingShift?.startTimeMs, `yyyy-MM-dd'T'HH:mm`)) ||
      format(Date.now(), `yyyy-MM-dd'T'HH:mm`)
  );
  const [shiftEnd, setShiftEnd] = useState(
    (existingShift?.endTimeMs &&
      format(existingShift?.endTimeMs, `yyyy-MM-dd'T'HH:mm`)) ||
      format(addHours(Date.now(), 2), `yyyy-MM-dd'T'HH:mm`)
  );
  const [description, setDescription] = useState(
    existingShift?.description || ''
  );
  const [selectedUser, setSelectedUser] = useState(
    existingShift?.assignedTo || ''
  );
  const [isShiftBroadcasting, setIsShiftBroadcasting] = useState(
    existingShift?.status === 'broadcasting' || false
  );

  useEffect(() => {
    if (newShiftStatus === 'succeeded') {
      cleanup();
    }
  }, [newShiftStatus, cleanup]);

  useEffect(() => {
    return function cleanup() {
      dispatch(reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only want to run on unmount
  }, []);

  useEffect(() => {
    if (isShiftBroadcasting) {
      setSelectedUser('');
    }
  }, [isShiftBroadcasting, setSelectedUser]);

  return (
    <div className="">
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="pt-8 text-start">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Shift information
            </h3>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* <div className="sm:col-span-3">
              <UserSelect
                users={org?.primaryMembers || []}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                disabled={isShiftBroadcasting}
              />
            </div> */}

            <div className="sm:col-span-6">
              <label
                htmlFor="role-info"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="role-info"
                  id="role-info"
                  autoComplete="role-info"
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <Switch.Group
                as="div"
                className="flex h-full items-center md:pt-4"
              >
                <Switch
                  checked={isShiftBroadcasting}
                  onChange={setIsShiftBroadcasting}
                  className={cx(
                    isShiftBroadcasting ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      isShiftBroadcasting ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
                <Switch.Label as="span" className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    Broadcast Shift
                  </span>
                </Switch.Label>
              </Switch.Group>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="shift-start-date-time"
                className="block text-sm font-medium text-gray-700"
              >
                Shift Start
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  name="shift-start-date-time"
                  id="shift-start-date-time"
                  autoComplete="shift-start-date-time"
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="shift-end-date-time"
                className="block text-sm font-medium text-gray-700"
              >
                Shift end
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  name="shift-end-date-time"
                  id="shift-end-date-time"
                  autoComplete="shift-end-date-time"
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="shift-description"
                className="block text-sm font-medium text-gray-700"
              >
                Shift Description
              </label>
              <div className="mt-1">
                <textarea
                  id="shift-description"
                  name="shift-description"
                  autoComplete="shift-description"
                  rows={5}
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            disabled={newShiftStatus === 'loading'}
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-200 sm:col-start-2 sm:text-sm"
            onClick={() => {
              if (org?.id) {
                let status = '';
                if (selectedUser) {
                  status = 'filled';
                } else if (isShiftBroadcasting) {
                  status = 'broadcasting';
                } else {
                  status = 'open';
                }

                const shift = {
                  name: role,
                  orgId: org.id,
                  startDate: shiftStart,
                  endDate: shiftEnd,
                  description: description,
                  status: status,
                };

                if (existingShift) {
                  dispatch(
                    fetchPatchOrgShift({
                      jwtToken: userJwt,
                      shift,
                      shiftId: existingShift.id,
                    })
                  );
                } else {
                  dispatch(
                    fetchPostOrgShift({
                      jwtToken: userJwt,
                      shift,
                    })
                  );
                }
              }
            }}
          >
            {newShiftStatus === 'loading' && (
              <ArrowPathIcon
                className="-ml-1 mr-3 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            )}{' '}
            Submit
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={() => {
              cleanup();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

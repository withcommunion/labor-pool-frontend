import { IShift } from '@/features/orgShiftsSlice';
import { useEffect, useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

import { useAppDispatch, useAppSelector } from '@/reduxHooks';
// import { selectOrg } from '@/features/orgSlice';
import { selectSelf } from '@/features/selfSlice';
import {
  fetchPostShiftApplication,
  fetchGetShiftApplications,
  selectPendingShiftApplications,
  ShiftApplication,
  fetchPatchShiftAcceptRejectApplication,
} from '@/features/shiftApplicationActionsSlice';

import AddShiftFormContainer from './addShiftFormContainer';
import { parseIdFromUrn } from '@/util/walletApiUtil';
import Link from 'next/link';

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
  const dispatch = useAppDispatch();
  const self = useAppSelector(selectSelf);
  const shiftApplications = useAppSelector(selectPendingShiftApplications);

  useEffect(() => {
    dispatch(
      fetchGetShiftApplications({
        jwtToken: userJwt,
        shiftId: shift?.id || '',
      })
    );
  }, []);

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
        {!editShift && shift && (
          <ShiftDetailCard
            shift={shift}
            shiftApplications={shiftApplications}
            rejectApplicant={(application: ShiftApplication) => {
              dispatch(
                fetchPatchShiftAcceptRejectApplication({
                  jwtToken: userJwt,
                  shiftApplicationId: application.id || '',
                  status: 'rejected',
                })
              );
            }}
            acceptApplicant={(application: ShiftApplication) => {
              dispatch(
                fetchPatchShiftAcceptRejectApplication({
                  jwtToken: userJwt,
                  shiftApplicationId: application.id || '',
                  status: 'accepted',
                })
              );
            }}
            applyToShift={async () => {
              if (self) {
                await dispatch(
                  fetchPostShiftApplication({
                    jwtToken: userJwt,
                    shiftApplication: {
                      shiftId: shift.id,
                      orgId: shift.orgId,
                      userId: self.id,
                      /**
                       * TODO: add a message field to the application
                       */
                      description: 'I am a great worker I swear',
                    },
                  })
                );

                dispatch(
                  fetchGetShiftApplications({
                    jwtToken: userJwt,
                    shiftId: shift?.id || '',
                  })
                );
              }
            }}
          />
        )}
      </div>
    </>
  );
}

function ShiftDetailCard({
  shift,
  shiftApplications,
  applyToShift,
  acceptApplicant,
  rejectApplicant,
}: {
  shift: IShift;
  shiftApplications: ShiftApplication[];
  applyToShift: () => void;
  acceptApplicant: (shiftApplication: ShiftApplication) => void;
  rejectApplicant: (shiftApplication: ShiftApplication) => void;
}) {
  const isOwnerUser = shift.ownerUrn.includes('user');
  const ownerPathname = isOwnerUser ? '/user/[userId]' : '/org/[orgId]';
  const ownerId = parseIdFromUrn(shift.ownerUrn);
  const query = isOwnerUser ? { userId: ownerId } : { orgId: ownerId };

  return (
    <div className="overflow-hidden bg-white text-start shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Shift Details
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Shift Owner</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <Link
                href={{
                  pathname: ownerPathname,
                  query,
                }}
              >
                {shift.ownerUrn}
              </Link>
            </dd>
          </div>
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

          {shift.status !== 'filled' && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Actions</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <button
                  className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    applyToShift();
                  }}
                >
                  Apply
                </button>
              </dd>
            </div>
          )}
          {shiftApplications.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Applicants</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 rounded-md border border-gray-200"
                >
                  {shiftApplications
                    .filter((application) => application.status === 'pending')
                    .map((application) => {
                      return (
                        <li
                          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                          key={application.id}
                        >
                          <div className="flex w-0 flex-1 items-center">
                            <UserIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              {application.userId}
                            </span>
                          </div>
                          <div className="ml-4 flex gap-x-2">
                            <a
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => acceptApplicant(application)}
                            >
                              Accept
                            </a>
                            <a
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => rejectApplicant(application)}
                            >
                              Reject
                            </a>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

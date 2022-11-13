import { IShift } from '@/features/orgShiftsSlice';
import { useEffect, useState } from 'react';
import { PencilIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

import { useAppDispatch, useAppSelector } from '@/reduxHooks';
// import { selectOrg } from '@/features/orgSlice';
import { selectIsOnOrgLeadershipTeam, selectSelf } from '@/features/selfSlice';
import {
  fetchGetShiftApplications,
  selectPendingShiftApplications,
  ShiftApplication,
  fetchPatchShiftAcceptRejectApplication,
} from '@/features/shiftApplicationActionsSlice';

import AddShiftFormContainer from './addShiftFormContainer';
import { parseIdFromUrn } from '@/util/walletApiUtil';
import Link from 'next/link';
import ApplyToShiftContainer from '@/shared_components/applyToShift/ApplyToShiftContainer';

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
  const dispatch = useAppDispatch();

  const self = useAppSelector(selectSelf);
  const shiftApplications = useAppSelector(selectPendingShiftApplications);

  const [isEditShift, setIsEditShift] = useState(false);

  const isOnLeadershipTeam = useAppSelector((state) =>
    selectIsOnOrgLeadershipTeam(state, shift?.ownerUrn.split(':')[2] || '')
  );
  const canEditShift =
    Boolean(self?.id && shift?.ownerUrn.includes(self.id)) ||
    isOnLeadershipTeam;

  useEffect(() => {
    if (shift?.id && userJwt) {
      dispatch(
        fetchGetShiftApplications({
          jwtToken: userJwt,
          shiftId: shift.id,
        })
      );
    }
  }, [shift, userJwt, dispatch]);

  return (
    <>
      <div>
        {canEditShift && !isEditShift && (
          <div className="w-fit">
            <button
              onClick={() => setIsEditShift(!isEditShift)}
              type="button"
              className="inline-flex items-start rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Edit
            </button>
          </div>
        )}
        {canEditShift && isEditShift && (
          <AddShiftFormContainer
            userJwt={userJwt}
            existingShift={shift}
            cleanup={cleanup}
          />
        )}

        {!isEditShift && shift && (
          <ShiftDetailCard
            userJwt={userJwt}
            canManageShift={canEditShift}
            shift={shift}
            shiftApplications={shiftApplications}
            rejectApplicant={async (application: ShiftApplication) => {
              await dispatch(
                fetchPatchShiftAcceptRejectApplication({
                  jwtToken: userJwt,
                  shiftApplicationId: application.id || '',
                  status: 'rejected',
                })
              );
              await dispatch(
                fetchGetShiftApplications({
                  jwtToken: userJwt,
                  shiftId: shift?.id || '',
                })
              );
              cleanup();
            }}
            acceptApplicant={async (application: ShiftApplication) => {
              await dispatch(
                fetchPatchShiftAcceptRejectApplication({
                  jwtToken: userJwt,
                  shiftApplicationId: application.id || '',
                  status: 'accepted',
                })
              );
              await dispatch(
                fetchGetShiftApplications({
                  jwtToken: userJwt,
                  shiftId: shift?.id || '',
                })
              );

              cleanup();
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
  canManageShift,
  acceptApplicant,
  rejectApplicant,
  userJwt,
}: {
  shift: IShift;
  canManageShift: boolean;
  shiftApplications: ShiftApplication[];
  userJwt: string;
  acceptApplicant: (shiftApplication: ShiftApplication) => void;
  rejectApplicant: (shiftApplication: ShiftApplication) => void;
}) {
  const isOwnerUser = shift.ownerUrn.includes('user');
  const ownerPathname = isOwnerUser ? '/user/[userId]' : '/org/[orgId]';

  const ownerId = parseIdFromUrn(shift.ownerUrn);
  const query = isOwnerUser ? { userId: ownerId } : { orgId: ownerId };

  return (
    <div className="overflow-hidden bg-white text-start shadow sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Who created this?
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <Link
                href={{
                  pathname: ownerPathname,
                  query,
                }}
              >
                <a className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800">
                  {shift.ownerUrn}
                </a>
              </Link>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              What are you offering or looking for?
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{shift.name}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Who is coming?
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{shift.assignedTo}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Start Date - End Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {format(shift.startTimeMs, 'M/dd h:mm b')} -{' '}
              {format(shift.endTimeMs, 'M/dd h:mm b')}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900">{shift.location}</dd>
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
              <ApplyToShiftContainer shift={shift} userJwt={userJwt} />
            </dd>
          </div>
          {canManageShift && shiftApplications.length > 0 && (
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
                      const applicationOwnerId = parseIdFromUrn(
                        application.ownerUrn
                      );
                      const isApplicantUser =
                        application.ownerUrn.includes('user');
                      const applicantPathname = isApplicantUser
                        ? '/user/[userId]'
                        : '/org/[orgId]';
                      const applicantQuery = isApplicantUser
                        ? { userId: applicationOwnerId }
                        : { orgId: applicationOwnerId };
                      return (
                        <li
                          className="flex-col flex justify-between py-3 pl-3 pr-4 text-sm"
                          key={application.id}
                        >
                          <div className="flex flex-row">
                            <div className="flex w-0 flex-1 items-center">
                              <UserIcon
                                className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              <Link
                                href={{
                                  pathname: applicantPathname,
                                  query: applicantQuery,
                                }}
                              >
                                <a
                                  target="_blank"
                                  className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                                >
                                  {application.ownerUrn}
                                </a>
                              </Link>
                            </div>
                            <div className="ml-4 flex gap-x-4">
                              <button
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => rejectApplicant(application)}
                              >
                                Reject
                              </button>
                              <button
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => acceptApplicant(application)}
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="mt-2">{application.description}</p>
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

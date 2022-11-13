import { IShift } from '@/features/orgShiftsSlice';
import { selectSelf, selectSelfActingAsOrg } from '@/features/selfSlice';
import {
  fetchGetShiftApplications,
  fetchPostShiftApplication,
  selectPendingShiftApplications,
  fetchDeleteShiftApplication,
} from '@/features/shiftApplicationActionsSlice';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
  shift: IShift;
  userJwt: string;
}

export default function ApplyToShiftContainer({ userJwt, shift }: Props) {
  const dispatch = useAppDispatch();
  const self = useAppSelector(selectSelf);
  const selfActingAsOrg = useAppSelector(selectSelfActingAsOrg);
  const shiftApplications = useAppSelector(selectPendingShiftApplications);
  const [isApplying, setIsApplying] = useState(false);
  const [shiftApplicationDescription, setShiftApplicationDescription] =
    useState('');

  const selfUrn = selfActingAsOrg.active
    ? `urn:org:${selfActingAsOrg?.orgId || ''}`
    : `urn:user:${self?.id || ''}`;

  const isUserAlreadyApplied = shiftApplications.some((application) => {
    return application.ownerUrn.includes(selfUrn);
  });
  const isUserAlreadyAccepted = shift.assignedTo.includes(selfUrn);
  const isUserOwner = shift.ownerUrn.includes(selfUrn);

  const showApplyButton =
    shift.status !== 'filled' &&
    !isUserAlreadyAccepted &&
    !isUserAlreadyApplied &&
    !isUserOwner;

  return (
    <>
      {isUserAlreadyApplied && (
        <div className="flex flex-row items-center">
          <ClockIcon className="mr-2 h-5 w-5" />
          <span className="text-sm text-gray-500">
            You have already applied
          </span>
          <div className="flex flex-row">
            <TrashIcon className="ml-2 h-5 w-5 text-red-500" />
            <button
              className="text-sm text-red-500"
              onClick={async () => {
                const usersApplication = shiftApplications.find(
                  (application) => {
                    return application.ownerUrn.includes(selfUrn);
                  }
                );
                if (usersApplication) {
                  await dispatch(
                    fetchDeleteShiftApplication({
                      jwtToken: userJwt,
                      applicationId: usersApplication.id,
                    })
                  );
                  await dispatch(
                    fetchGetShiftApplications({
                      jwtToken: userJwt,
                      shiftId: shift?.id || '',
                    })
                  );
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {isApplying && (
        <div>
          <form>
            <div className="sm:col-span-1">
              <label
                htmlFor="application-description"
                className="text-sm font-medium text-gray-500"
              >
                Application
              </label>
              <div className="mt-1 mb-2">
                <textarea
                  rows={3}
                  placeholder="Tip: Mention your background, why you're interested, and needs, preferences, or questions"
                  name="application-description"
                  id="application-description"
                  autoComplete="application-description"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 p-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={shiftApplicationDescription}
                  onChange={(e) =>
                    setShiftApplicationDescription(e.target.value)
                  }
                />
              </div>
            </div>
          </form>
        </div>
      )}
      {showApplyButton && (
        <div className="flex gap-x-2">
          <button
            className="inline-flex items-start rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              setIsApplying(!isApplying);
            }}
          >
            {isApplying ? 'Cancel' : 'Apply'}
          </button>
          {isApplying && (
            <button
              className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={async () => {
                if (self) {
                  const ownerUrn = selfActingAsOrg.orgId
                    ? `urn:org:${selfActingAsOrg.orgId}`
                    : `urn:user:${self.id}`;
                  await dispatch(
                    fetchPostShiftApplication({
                      jwtToken: userJwt,
                      shiftApplication: {
                        shiftId: shift.id,
                        ownerUrn,
                        description: shiftApplicationDescription,
                      },
                    })
                  );

                  await dispatch(
                    fetchGetShiftApplications({
                      jwtToken: userJwt,
                      shiftId: shift?.id || '',
                    })
                  );

                  setIsApplying(false);
                }
              }}
            >
              Submit
            </button>
          )}
        </div>
      )}
    </>
  );
}

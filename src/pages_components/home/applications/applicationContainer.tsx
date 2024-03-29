import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import {
  fetchGetShiftApplications,
  fetchDeleteShiftApplication,
  selectMyShiftApplicationsStatus,
  selectPendingShiftApplications,
} from '@/features/myShiftApplicationsSlice';
import ApplicationList from './applicationList';
import { useEffect } from 'react';
interface Props {
  userJwt: string;
  userId?: string;
  orgId?: string;
}

export default function ApplicationContainer({
  userJwt,
  userId,
  orgId,
}: Props) {
  const dispatch = useAppDispatch();
  const myShiftApplications = useAppSelector(selectPendingShiftApplications);
  const myShiftApplicationsStatus = useAppSelector(
    selectMyShiftApplicationsStatus
  );

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchGetShiftApplications({ jwtToken: userJwt, userId: userId })
      );
    }
    if (orgId) {
      dispatch(fetchGetShiftApplications({ jwtToken: userJwt, orgId: orgId }));
    }
  }, [dispatch, userJwt, userId, orgId]);

  return (
    <div className="">
      {myShiftApplicationsStatus === 'loading' && <div>Loading...</div>}
      <ApplicationList
        applications={myShiftApplications}
        onDeleteClick={async (applicationId: string) => {
          if (userId) {
            await dispatch(
              fetchDeleteShiftApplication({
                jwtToken: userJwt,
                applicationId: applicationId,
              })
            );

            dispatch(
              fetchGetShiftApplications({ jwtToken: userJwt, userId: userId })
            );
          }
        }}
      />
    </div>
  );
}

import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import {
  fetchGetShiftApplications,
  fetchDeleteShiftApplication,
  selectMyShiftApplicationsOrderedByTime,
  selectMyShiftApplicationsStatus,
} from '@/features/myShiftApplicationsSlice';
import ApplicationList from './applicationList';
import { useEffect } from 'react';

interface Props {
  userJwt: string;
  userId?: string;
}
export default function ApplicationContainer({ userJwt, userId }: Props) {
  const dispatch = useAppDispatch();
  const myShiftApplications = useAppSelector(
    selectMyShiftApplicationsOrderedByTime
  );
  const myShiftApplicationsStatus = useAppSelector(
    selectMyShiftApplicationsStatus
  );

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchGetShiftApplications({ jwtToken: userJwt, userId: userId })
      );
    }
  }, [dispatch, userJwt, userId]);

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

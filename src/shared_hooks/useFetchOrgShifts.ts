import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  fetchOrgShifts,
  selectOrgShiftsStatus,
} from '@/features/orgShiftsSlice';

function useFetchOrgShifts(orgId: string, userJwt: string) {
  const dispatch = useAppDispatch();
  const orgShiftsStatus = useAppSelector((state) =>
    selectOrgShiftsStatus(state)
  );

  const fetchShifts = () => {
    dispatch(fetchOrgShifts({ orgId, jwtToken: userJwt }));
  };

  useEffect(() => {
    if (orgShiftsStatus === 'idle') {
      fetchShifts();
    }
  });

  return [fetchShifts];
}

export default useFetchOrgShifts;

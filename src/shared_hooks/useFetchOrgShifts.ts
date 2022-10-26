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

  useEffect(() => {
    if (orgShiftsStatus === 'idle') {
      dispatch(fetchOrgShifts({ orgId, jwtToken: userJwt }));
    }
  });
}

export default useFetchOrgShifts;

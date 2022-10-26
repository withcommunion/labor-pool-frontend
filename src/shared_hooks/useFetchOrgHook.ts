import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import { fetchOrg, selectOrgStatus } from '@/features/orgSlice';

function useFetchOrg(orgId: string, userJwt: string) {
  const dispatch = useAppDispatch();
  const orgStatus = useAppSelector((state) => selectOrgStatus(state));

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrg({ orgId, jwtToken: userJwt }));
    }
  });
}

export default useFetchOrg;

import { useEffect } from 'react';
import { useAppDispatch } from '@/reduxHooks';

import { fetchOrg } from '@/features/orgSlice';

function useFetchOrg(orgId: string | null, userJwt: string) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (orgId) {
      dispatch(fetchOrg({ orgId, jwtToken: userJwt }));
    }
  }, [orgId, dispatch, userJwt]);
}

export default useFetchOrg;

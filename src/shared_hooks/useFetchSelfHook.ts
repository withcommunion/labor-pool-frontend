import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import { selectSelf, selectSelfStatus, fetchSelf } from '@/features/selfSlice';

function useFetchSelf(userJwt: string) {
  const dispatch = useAppDispatch();
  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  useEffect(() => {
    if (selfStatus === 'idle' && userJwt) {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);
}

export default useFetchSelf;

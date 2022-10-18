import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import { selectSelfUserId, selfUserIdSet } from '@/features/selfSlice';

function useFetchUserJwt() {
  const dispatch = useAppDispatch();
  const [userJwt, setUserJwt] = useState('');
  const { user } = useAuthenticator(({ route, user }) => {
    return [route, user];
  });
  const selfUserId = useAppSelector((state) => selectSelfUserId(state));

  useEffect(() => {
    const jwt = user && user.getSignInUserSession()?.getIdToken().getJwtToken();

    if (!userJwt && jwt) {
      setUserJwt(jwt);
    }
  }, [user, userJwt, dispatch, selfUserId]);

  useEffect(() => {
    if (user && user.username && !selfUserId) {
      dispatch(selfUserIdSet(user.username));
    }
  }, [user, selfUserId, dispatch]);

  return [userJwt];
}

export default useFetchUserJwt;

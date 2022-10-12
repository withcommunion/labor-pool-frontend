import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

function useFetchUserJwt() {
  const [userJwt, setUserJwt] = useState('');
  const { user } = useAuthenticator(({ route, user }) => {
    return [route, user];
  });
  console.log('spamming');
  useEffect(() => {
    const jwt = user && user.getSignInUserSession()?.getIdToken().getJwtToken();

    if (!userJwt && jwt) {
      setUserJwt(jwt);
    }
  }, [user, userJwt]);

  return [userJwt];
}

export default useFetchUserJwt;

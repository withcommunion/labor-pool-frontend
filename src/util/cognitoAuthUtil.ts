import { withSSRContext } from 'aws-amplify';
import type { Auth } from 'aws-amplify';
import type { CognitoUser } from 'amazon-cognito-identity-js';
import { GetServerSidePropsContext } from 'next';

export const USER_POOL_ID_DEV = 'us-east-1_RonOZGam5';
export const USER_POOL_CLIENT_ID_DEV = '7cnfbbjqhiajpqukk83gcu9hr1';

export const USER_POOL_ID_PROD = 'us-east-1_nP11J1qIb';
export const USER_POOL_CLIENT_ID_PROD = '795lg5ui539om7sspm4sej0q99';

const isProd = Boolean(process.env.NEXT_PUBLIC_VERCEL_STAGE === 'prod');
const isDev = Boolean(process.env.NEXT_PUBLIC_VERCEL_STAGE === 'dev');

function getCookieStorage() {
  const cookieStorageBase = {
    domain: undefined,
    secure: undefined,
    path: '/',
    expires: 365,
    sameSite: 'strict',
  };

  if (isProd) {
    return { ...cookieStorageBase, domain: 'withcommunion.com', secure: true };
  }

  if (isDev) {
    /**
     * This is only for the URL linked to PRs'.
     * If manually you go to the Vercel build, the other URL generated won't work
     * <project-name>-git-<branch-name>-<scope-slug>.vercel.app
     * https://communion-frontend-git-testdevdeploy-communion.vercel.app/
     */
    // NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF will be populated
    // eslint-disable-next-line
    return {
      ...cookieStorageBase,
      domain: `.withcommunion.com`,
      secure: true,
    };
  }

  return { ...cookieStorageBase, domain: 'localhost', secure: false };
}

export const AMPLIFY_CONFIG = {
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: isProd ? USER_POOL_ID_PROD : USER_POOL_ID_DEV,
  aws_user_pools_web_client_id: isProd
    ? USER_POOL_CLIENT_ID_PROD
    : USER_POOL_CLIENT_ID_DEV,
  aws_mandatory_sign_in: 'enable',
  cookieStorage: getCookieStorage(),
};

export async function getUserJwtTokenOnServer(
  serverSidePropsContext: GetServerSidePropsContext
) {
  const SSRContext = withSSRContext(serverSidePropsContext);
  const SsrAuth = SSRContext.Auth as typeof Auth;

  let userJwt;
  try {
    const user = (await SsrAuth.currentAuthenticatedUser()) as CognitoUser;
    userJwt = user.getSignInUserSession()?.getIdToken().getJwtToken();
    return userJwt;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

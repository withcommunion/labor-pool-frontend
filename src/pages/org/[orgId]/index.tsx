import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
// import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import { selectSelf } from '@/features/selfSlice';
import {
  fetchPostOrgFriendlyOrgJoin,
  fetchPostOrgMemberJoin,
  selectFriendlyOrgJoinStatus,
  selectMemberJoinStatus,
} from '@/features/orgJoinSlice';

// import { useAppSelector, useAppDispatch } from '@/reduxHooks';
// import { selectSelf, selectSelfStatus } from '@/features/selfSlice';

import Footer from '@/shared_components/footer/footer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const OrgIndex = ({ userJwt }: { userJwt: string }) => {
  console.log('here yea?', userJwt);
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  useFetchSelf(userJwt);
  useHandleJoinOrgs(userJwt);

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh">
        <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
          <div className="flex flex-col items-center justify-center">
            <h2>Hi</h2>
          </div>
        </div>
      </main>
      <div>
        <button
          className="m-5 border p-2"
          onClick={() => {
            signOut();
            setTimeout(() => {
              router.push('/');
            }, 500);
          }}
        >
          Signout
        </button>
        <Footer />
      </div>
    </div>
  );
};

function useHandleJoinOrgs(userJwt: string | null) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const self = useAppSelector((state) => selectSelf(state));
  const friendlyOrgJoinStatus = useAppSelector((state) =>
    selectFriendlyOrgJoinStatus(state)
  );
  const memberJoinStatus = useAppSelector((state) =>
    selectMemberJoinStatus(state)
  );

  /**
   * Users will only have 1 primary org at a time.
   * But to avoid what I had with v1 Communion, lets not fully assume that
   * Who knows what the future holds
   */
  const primarySelfOrg = self && self.orgs[0];

  const {
    orgId: queryOrgId,
    joinCode: queryJoinCode,
    action: queryAction,
    role: queryRole,
  } = router.query;
  const orgId = (queryOrgId as string) || '';
  const joinCode = (queryJoinCode as string) || '';
  const action = (queryAction as string) || '';
  const role = (queryRole as string) || '';

  useEffect(() => {
    if (
      action === 'memberJoin' &&
      self &&
      orgId &&
      joinCode &&
      memberJoinStatus === 'idle'
    ) {
      dispatch(
        fetchPostOrgMemberJoin({
          memberId: self.id,
          orgId,
          jwtToken: userJwt || '',
          role,
        })
      );
    } else if (
      action === 'friendlyOrgJoin' &&
      orgId &&
      joinCode &&
      primarySelfOrg &&
      friendlyOrgJoinStatus === 'idle'
    ) {
      dispatch(
        fetchPostOrgFriendlyOrgJoin({
          orgId,
          friendlyOrgId: primarySelfOrg,
          jwtToken: userJwt || '',
        })
      );
    }
  }, [
    action,
    dispatch,
    friendlyOrgJoinStatus,
    joinCode,
    memberJoinStatus,
    orgId,
    primarySelfOrg,
    self,
    userJwt,
    role,
  ]);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { userJwt, userId } = await getUserOnServer(context);
    return {
      props: { userJwt, userId },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { userJwt: null, user: null },
    };
  }
};

export default OrgIndex;

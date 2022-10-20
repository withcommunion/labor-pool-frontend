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
import { fetchOrg, selectOrg, selectOrgStatus } from '@/features/orgSlice';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const OrgIndex = ({ userJwt }: { userJwt: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signOut } = useAuthenticator((context) => [context.signOut]);

  const org = useAppSelector((state) => selectOrg(state));
  const orgStatus = useAppSelector((state) => selectOrgStatus(state));

  const friendlyOrgJoinStatus = useAppSelector((state) =>
    selectFriendlyOrgJoinStatus(state)
  );
  const memberJoinStatus = useAppSelector((state) =>
    selectMemberJoinStatus(state)
  );

  useFetchSelf(userJwt);
  useHandleJoinOrgs(userJwt);

  useEffect(() => {
    const orgId = router.query.orgId as string;
    if (orgStatus === 'idle' && !org) {
      dispatch(fetchOrg({ orgId, jwtToken: userJwt }));
    }
  });

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

          <div>
            {friendlyOrgJoinStatus !== 'idle' && (
              <JoinInProgress status={friendlyOrgJoinStatus} />
            )}
            {memberJoinStatus !== 'idle' && (
              <JoinInProgress status={memberJoinStatus} />
            )}
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

function useHandleJoinOrgs(userJwt: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const self = useAppSelector((state) => selectSelf(state));
  const friendlyOrgJoinStatus = useAppSelector((state) =>
    selectFriendlyOrgJoinStatus(state)
  );
  const memberJoinStatus = useAppSelector((state) =>
    selectMemberJoinStatus(state)
  );

  const {
    orgId: queryOrgId,
    inviteeOrgId: inviteeQueryOrgId,
    joinCode: queryJoinCode,
    action: queryAction,
    role: queryRole,
  } = router.query;
  const orgId = (queryOrgId as string) || '';
  const inviteeOrgId = (inviteeQueryOrgId as string) || '';
  const joinCode = (queryJoinCode as string) || '';
  const action = (queryAction as string) || '';
  const role = (queryRole as string) || '';

  useEffect(() => {
    const isMemberJoinAction = action === 'memberJoin';
    const hasAllJoinComponents =
      self && orgId && joinCode && memberJoinStatus === 'idle';

    const isFriendlyOrgJoinAction = action === 'friendlyOrgJoin';
    const hasAllFriendlyJoinComponents =
      orgId && joinCode && inviteeOrgId && friendlyOrgJoinStatus === 'idle';

    if (isMemberJoinAction && hasAllJoinComponents) {
      dispatch(
        fetchPostOrgMemberJoin({
          memberId: self.id,
          orgId: inviteeOrgId,
          jwtToken: userJwt,
          role,
        })
      );
    } else if (isFriendlyOrgJoinAction && hasAllFriendlyJoinComponents) {
      dispatch(
        fetchPostOrgFriendlyOrgJoin({
          orgId,
          friendlyOrgId: inviteeOrgId,
          jwtToken: userJwt,
        })
      );
    }
  }, [
    action,
    dispatch,
    friendlyOrgJoinStatus,
    joinCode,
    memberJoinStatus,
    inviteeOrgId,
    orgId,
    self,
    userJwt,
    role,
  ]);
}

function JoinInProgress({
  status,
}: {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}) {
  return (
    <>
      {status === 'loading' && <p>Joining org...</p>}
      {status === 'succeeded' && <p>Joined org! Routing you</p>}
      {status === 'failed' && <p>Something went wrong, please try again</p>}
    </>
  );
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
      props: { userJwt: '', user: null },
      redirect: {
        destination: '/',
      },
    };
  }
};

export default OrgIndex;

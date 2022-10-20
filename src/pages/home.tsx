import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import { selectSelf } from '@/features/selfSlice';
import {
  fetchPostOrgFriendlyOrgJoin,
  fetchPostOrgMemberJoin,
  selectFriendlyOrgJoinStatus,
  selectMemberJoinStatus,
} from '@/features/orgJoinSlice';

import Footer from '@/shared_components/footer/footer';
import Link from 'next/link';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string | null;
}

const Index = ({ userJwt }: Props) => {
  const router = useRouter();
  useFetchSelf(userJwt);
  useHandleJoinOrgs(userJwt);

  const self = useAppSelector((state) => selectSelf(state));
  const friendlyOrgJoinStatus = useAppSelector((state) =>
    selectFriendlyOrgJoinStatus(state)
  );
  const memberJoinStatus = useAppSelector((state) =>
    selectMemberJoinStatus(state)
  );

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (self && self.orgs.length === 0) {
      router.push(`/org/${self.orgs[0]}`);
    }
  }, [self, router]);

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
            <div>
              <h2 className="my-4 text-lg font-semibold text-indigo-600">
                Hey {self?.firstName},
              </h2>

              {self && self.orgs.length === 0 && (
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                      You are not part of any organizations
                    </p>
                    <p>Would you like to make one?</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <Link href="/org/new">
                      <a>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Create new org
                        </button>
                      </a>
                    </Link>
                  </div>
                </div>
              )}

              {self && self.orgs.length > 1 && (
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                      You are part of a few orgs - choose one
                    </p>
                  </div>
                  <div className="flex flex-col px-4 py-5 sm:p-6">
                    {self.orgs.map((orgId) => (
                      <Link href={`/org/${orgId}`} key={orgId}>
                        <a className="my-2">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            {orgId}
                          </button>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              {friendlyOrgJoinStatus !== 'idle' && (
                <JoinInProgress status={friendlyOrgJoinStatus} />
              )}
              {memberJoinStatus !== 'idle' && (
                <JoinInProgress status={memberJoinStatus} />
              )}
            </div>

            <div className="">
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
        </div>
      </main>
    </div>
  );
};

function useHandleJoinOrgs(userJwt: string | null) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useFetchSelf(userJwt);

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
  } = router.query;
  const orgId = (queryOrgId as string) || '';
  const joinCode = (queryJoinCode as string) || '';
  const action = (queryAction as string) || '';

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
    const { userJwt } = await getUserOnServer(context);

    return {
      props: { userJwt },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { userJwt: null, user: null },
      redirect: {
        destination: '/login',
      },
    };
  }
};

export default Index;

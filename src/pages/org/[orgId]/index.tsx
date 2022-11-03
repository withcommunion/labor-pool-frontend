import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
// import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  BuildingOfficeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';

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
import { selectOrg } from '@/features/orgSlice';
import Link from 'next/link';
import useFetchOrg from '@/shared_hooks/useFetchOrgHook';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const OrgIndex = ({ userJwt }: { userJwt: string }) => {
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const [orgId, setOrgId] = useState<string | null>(null);

  const routerOrgId = router.query.orgId as string;

  useEffect(() => {
    setOrgId(routerOrgId);
  }, [routerOrgId]);

  useFetchSelf(userJwt);
  useHandleJoinOrg(userJwt);
  useFetchOrg(orgId, userJwt);

  const org = useAppSelector((state) => selectOrg(state));

  const friendlyOrgJoinStatus = useAppSelector((state) =>
    selectFriendlyOrgJoinStatus(state)
  );
  const memberJoinStatus = useAppSelector((state) =>
    selectMemberJoinStatus(state)
  );

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh">
        <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
          <div>
            {friendlyOrgJoinStatus !== 'idle' && (
              <JoinInProgress status={friendlyOrgJoinStatus} />
            )}
            {memberJoinStatus !== 'idle' && (
              <JoinInProgress status={memberJoinStatus} />
            )}
          </div>

          {org && (
            <div>
              <div>
                <h2 className="mt-4 text-2xl">{org.name}</h2>
              </div>

              <>
                <div className="mt-4">
                  <h3 className="text-lg">Employees</h3>
                  <ul
                    role="list"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {org.primaryMembers.map((person) => (
                      <li
                        key={person}
                        className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                      >
                        <div className="flex w-full items-center justify-between space-x-6 p-6">
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <h3 className="truncate text-sm font-medium text-gray-900">
                                {person}
                              </h3>
                              <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                {person}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-sm text-gray-500">
                              {person}
                            </p>
                          </div>
                          <UserCircleIcon className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
                        </div>
                        <div>
                          <div className="-mt-px flex divide-x divide-gray-200">
                            <div className="flex w-0 flex-1">
                              <a
                                href={`mailto:${person}`}
                                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                              >
                                <EnvelopeIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-3">Email</span>
                              </a>
                            </div>
                            <div className="-ml-px flex w-0 flex-1">
                              <a
                                href={`tel:${person}`}
                                className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                              >
                                <PhoneIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-3">Call</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>

              <>
                <div className="mt-4">
                  <h3 className="text-lg">Your friends</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {org.friends.map((org) => (
                      <div
                        key={org}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                      >
                        <Link
                          href={{ pathname: `[orgId]`, query: { orgId: org } }}
                          passHref
                        >
                          <a className="focus:outline-none">
                            <div className="flex-shrink-0">
                              <BuildingOfficeIcon className="h-10 w-10 rounded-full" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="text-sm font-medium text-gray-900">
                                {org}
                              </p>
                              <p className="truncate text-sm text-gray-500">
                                {org}
                              </p>
                            </div>
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            </div>
          )}

          <>
            {org && (
              <div>
                <Link
                  href={{
                    pathname: `[orgId]/schedule`,
                    query: { orgId: org.id },
                  }}
                >
                  <a className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    View Schedule
                  </a>
                </Link>
              </div>
            )}
          </>

          <>
            {org && (
              <div>
                <Link
                  href={{
                    pathname: `[orgId]/invite`,
                    query: { orgId: org.id },
                  }}
                >
                  <a className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Invite links
                  </a>
                </Link>
              </div>
            )}
          </>
        </div>
      </main>
      <div className="flex flex-col items-center justify-center">
        <button
          className="flex border p-2"
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

function useHandleJoinOrg(userJwt: string) {
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

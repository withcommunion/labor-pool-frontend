import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
// import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import {
  fetchSelf,
  selectIsOnOrgLeadershipTeam,
  selectSelf,
} from '@/features/selfSlice';
import {
  fetchPostOrgMemberJoin,
  selectFriendlyOrgJoinStatus,
  selectMemberJoinStatus,
} from '@/features/orgJoinSlice';

import Footer from '@/shared_components/footer/footer';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import WeekCalendar from '@/pages_components/org/shiftCalendar';
import {
  fetchGetOrgById,
  fetchGetOrgByIdShifts,
  fetchGetOrgByIdSocials,
  selectOrgById,
  selectOrgByIdShifts,
} from '@/features/orgByIdSlice';
import SocialContainer from '@/shared_components/socials/socialContainer';
import FeedContainer from '@/shared_components/feed/feedContainer';
import ShiftListContainer from '@/shared_components/shiftList/shiftListContainer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const fallbackBgImage =
  'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

const OrgIndex = ({ userJwt }: { userJwt: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const org = useAppSelector(selectOrgById);
  const orgShifts = useAppSelector(selectOrgByIdShifts);
  const isOnLeadershipTeam = useAppSelector((state) =>
    selectIsOnOrgLeadershipTeam(state, org?.id || '')
  );

  useFetchSelf(userJwt);
  useHandleJoinOrg(userJwt);

  useEffect(() => {
    if (router.query.orgId) {
      dispatch(
        fetchGetOrgById({
          jwtToken: userJwt,
          orgId: router.query.orgId as string,
        })
      );
    }
  }, [dispatch, router.query.orgId, userJwt]);

  useEffect(() => {
    if (org) {
      dispatch(
        fetchGetOrgByIdShifts({
          jwtToken: userJwt,
          orgId: org.id,
        })
      );
    }
  }, [dispatch, org, userJwt]);

  useEffect(() => {
    if (org) {
      dispatch(
        fetchGetOrgByIdSocials({
          jwtToken: userJwt,
          orgId: org.id,
        })
      );
    }
  }, [dispatch, org, userJwt]);

  // const friendlyOrgJoinStatus = useAppSelector((state) =>
  //   selectFriendlyOrgJoinStatus(state)
  // );
  // const memberJoinStatus = useAppSelector((state) =>
  //   selectMemberJoinStatus(state)
  // );

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full">
        <div className="flex-col flex min-w-0 flex-1 overflow-hidden">
          <div className="relative z-0 flex flex-1 overflow-hidden">
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
              <article>
                {/* Profile header */}
                <div>
                  <div>
                    {/* eslint-disable-next-line */}
                    <img
                      className="h-32 w-full object-cover lg:h-48"
                      src={org?.coverImageUrl || fallbackBgImage}
                      alt=""
                    />
                  </div>
                  <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                      <div className="flex">
                        {org?.imageUrl ? (
                          <Image
                            className="h-24 w-24 rounded-full ring-1 ring-white sm:h-32 sm:w-32"
                            width={84}
                            height={84}
                            src={org?.imageUrl || ''}
                            alt="profile image"
                          />
                        ) : (
                          <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-orange-400 sm:h-32 sm:w-32">
                            <span className="text-3xl font-medium leading-none text-white">
                              {org?.name?.charAt(0)}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                          <h1 className="truncate text-2xl font-bold text-gray-900">
                            {org?.name}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                      <h1 className="truncate text-2xl font-bold text-gray-900">
                        {org?.name}
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 sm:mt-2 2xl:mt-5">
                  <div className="border-b border-gray-200">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <span
                          className={classNames(
                            'whitespace-nowrap border-b-2 border-pink-500 py-4 px-1 text-sm font-medium text-gray-900'
                          )}
                        >
                          Profile
                        </span>
                        {isOnLeadershipTeam && (
                          <>
                            <Link
                              href={{
                                pathname: `[orgId]/schedule`,
                                query: { orgId: org?.id },
                              }}
                            >
                              <a
                                className={classNames(
                                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium text-gray-900'
                                )}
                              >
                                Schedule
                              </a>
                            </Link>
                            <Link
                              href={{
                                pathname: `[orgId]/invite`,
                                query: { orgId: org?.id },
                              }}
                            >
                              <a
                                className={classNames(
                                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium text-gray-900'
                                )}
                              >
                                Invite Links
                              </a>
                            </Link>
                          </>
                        )}
                      </nav>
                    </div>
                  </div>
                </div>

                {/* Description list */}
                <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Phone
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {org?.phoneNumber}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {org?.email}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <div className="flex flex-row gap-x-4">
                        <div className="flex-col flex">
                          <dt className="text-sm font-medium text-gray-500">
                            Instagram
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {org?.instagramHandle}
                          </dd>
                        </div>
                        <div className="flex-col flex">
                          <dt className="text-sm font-medium text-gray-500">
                            Facebook
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {org?.facebookHandle}
                          </dd>
                        </div>
                        <div className="flex-col flex">
                          <dt className="text-sm font-medium text-gray-500">
                            Twitter
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {org?.twitterHandle}
                          </dd>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Location
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {org?.addressLine1}, {org?.city}, {org?.state}
                      </dd>
                    </div>

                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        About
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {org?.description}
                      </dd>
                    </div>
                  </dl>

                  <div className="mx-auto mt-6 max-w-5xl">
                    <div className="mb-10">
                      <SocialContainer
                        userJwt={userJwt}
                        ownerUrn={org?.id ? `urn:org:${org?.id}` : ''}
                      />
                    </div>
                    <div className="mb-10">
                      <FeedContainer
                        userJwt={userJwt}
                        entityUrn={org?.id ? `urn:org:${org?.id}` : ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="mx-5 sm:mx-[12vw]">
                  <ShiftListContainer
                    shifts={orgShifts}
                    userJwt={userJwt}
                    headerText={`${org?.name || ''}'s shifts`}
                    showAddShiftBtn={isOnLeadershipTeam}
                    refreshShifts={() => {
                      if (org) {
                        dispatch(
                          fetchGetOrgByIdShifts({
                            orgId: org.id,
                            jwtToken: userJwt,
                          })
                        );
                      }
                    }}
                  />
                </div>
                {
                  <div className="mx-5 sm:mx-10">
                    <WeekCalendar
                      showAddShiftBtn={isOnLeadershipTeam}
                      orgShifts={orgShifts}
                      userJwt={userJwt}
                      autoScroll={false}
                      refreshShifts={() => {
                        if (org) {
                          dispatch(
                            fetchGetOrgByIdShifts({
                              orgId: org.id,
                              jwtToken: userJwt,
                            })
                          );
                        }
                      }}
                    />
                  </div>
                }
              </article>
            </main>
          </div>
        </div>
      </div>

      <div className="flex-col flex items-center justify-center">
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

    const isMemberAlreadyInOrg = Boolean(
      self?.orgRoles.some((orgRole) => orgRole.orgId === orgId)
    );

    const joinOrg = async () => {
      if (isMemberJoinAction && hasAllJoinComponents && !isMemberAlreadyInOrg) {
        await dispatch(
          fetchPostOrgMemberJoin({
            memberId: self.id || '',
            orgId: inviteeOrgId,
            jwtToken: userJwt,
            role,
          })
        );

        await dispatch(fetchSelf(userJwt));
      }
    };

    joinOrg();
  }, [
    action,
    dispatch,
    friendlyOrgJoinStatus,
    joinCode,
    router,
    memberJoinStatus,
    inviteeOrgId,
    orgId,
    self,
    userJwt,
    role,
  ]);
}

/**
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
 */

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

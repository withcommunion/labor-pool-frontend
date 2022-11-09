import { GetServerSideProps } from 'next';
import { Amplify } from 'aws-amplify';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import {
  fetchGetUserById,
  fetchGetUserByIdShifts,
  fetchGetUserByIdSocials,
  selectUserById,
  selectUserByIdShifts,
  selectUserByIdSocials,
} from '@/features/userByIdSlice';
import { useEffect } from 'react';
import Image from 'next/image';
import useFetchSelf from '@/shared_hooks/useFetchSelfHook';
import WeekCalendar from '@/pages_components/org/shiftCalendar';
import SocialList from '@/shared_components/socialsList/SocialList';

import SimpleModal from '@/shared_components/simpleModal';
import Head from 'next/head';
import { selectSelf } from '@/features/selfSlice';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const fallbackBgImage =
  'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

interface Props {
  userJwt: string;
}
const UserPage = ({ userJwt }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const self = useAppSelector(selectSelf);
  const user = useAppSelector(selectUserById);
  const userShifts = useAppSelector(selectUserByIdShifts);
  const userSocials = useAppSelector(selectUserByIdSocials);

  const [isFollowersListExpanded, setIsFollowersListExpanded] = useState(false);
  const [isFollowingListExpanded, setIsFollowingListExpanded] = useState(false);

  useFetchSelf(userJwt);

  useEffect(() => {
    if (router.query.userId) {
      dispatch(
        fetchGetUserById({
          jwtToken: userJwt,
          userId: router.query.userId as string,
        })
      );
    }
  }, [dispatch, router.query.userId, userJwt]);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchGetUserByIdShifts({
          jwtToken: userJwt,
          userId: user.id,
        })
      );
    }
  }, [dispatch, user, userJwt]);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchGetUserByIdSocials({
          jwtToken: userJwt,
          userId: user.id,
        })
      );
    }
  }, [dispatch, user, userJwt]);

  return (
    <>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="relative z-0 flex flex-1 overflow-hidden">
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
              <article>
                {/* Profile header */}
                <div>
                  <div>
                    {/* eslint-disable-next-line */}
                    <img
                      className="h-32 w-full object-cover lg:h-48"
                      src={user?.coverImageUrl || fallbackBgImage}
                      alt=""
                    />
                  </div>
                  <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                      <div className="flex">
                        {user?.imageUrl ? (
                          <Image
                            className="h-24 w-24 rounded-full ring-1 ring-white sm:h-32 sm:w-32"
                            width={84}
                            height={84}
                            src={user?.imageUrl || ''}
                            alt="profile image"
                          />
                        ) : (
                          <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-orange-400 sm:h-32 sm:w-32">
                            <span className="text-3xl font-medium leading-none text-white">
                              {user?.firstName?.charAt(0)}
                              {user?.lastName?.charAt(0)}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                          <h1 className="truncate text-2xl font-bold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                      <h1 className="truncate text-2xl font-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
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
                          className={cx(
                            'whitespace-nowrap border-b-2 border-pink-500 py-4 px-1 text-sm font-medium text-gray-900'
                          )}
                        >
                          Profile
                        </span>
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
                        {user?.phoneNumber}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.email}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Location
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.location}
                      </dd>
                    </div>

                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        About
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.description}
                      </dd>
                    </div>
                  </dl>

                  <div className="mb-10 flex">
                    {/*  Following */}
                    <div className="mt-8 max-w-5xl ">
                      <button
                        onClick={() => {
                          setIsFollowingListExpanded(!isFollowingListExpanded);
                        }}
                      >
                        <h2 className="text-sm font-medium text-gray-500">
                          <span className="text-black">
                            {userSocials.following.users.length +
                              userSocials.following.orgs.length}{' '}
                          </span>
                          Following
                        </h2>
                      </button>

                      <SimpleModal
                        isOpen={isFollowingListExpanded}
                        toggleIsOpen={() => {
                          setIsFollowingListExpanded(!isFollowingListExpanded);
                        }}
                        title="Following"
                      >
                        <div className="max-h-75vh overflow-y-scroll">
                          <h3 className="text-xs font-medium text-gray-500">
                            Users
                          </h3>
                          <div>
                            <div className="mt-1">
                              <SocialList
                                onClick={() => {
                                  setIsFollowingListExpanded(
                                    !isFollowingListExpanded
                                  );
                                }}
                                users={userSocials.following.users}
                                entityType="user"
                              />
                            </div>

                            <h3 className="text-xs font-medium text-gray-500">
                              Orgs
                            </h3>
                            <div className="mt-1">
                              <SocialList
                                onClick={() => {
                                  setIsFollowingListExpanded(
                                    !isFollowingListExpanded
                                  );
                                }}
                                orgs={userSocials.following.orgs}
                                entityType="org"
                              />
                            </div>
                          </div>
                          <button
                            className="sticky bottom-0 mt-5 w-full bg-white"
                            onClick={() => {
                              setIsFollowingListExpanded(
                                !isFollowingListExpanded
                              );
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </SimpleModal>
                    </div>
                    {/*  /Following */}

                    {/* Followers */}
                    <div className="mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
                      <button
                        onClick={() => {
                          setIsFollowersListExpanded(!isFollowersListExpanded);
                        }}
                      >
                        <h2 className="text-sm font-medium text-gray-500">
                          <span className="text-black">
                            {userSocials.followers.users.length +
                              userSocials.followers.orgs.length}{' '}
                          </span>
                          Followers
                        </h2>
                      </button>
                      <SimpleModal
                        isOpen={isFollowersListExpanded}
                        toggleIsOpen={() => {
                          setIsFollowersListExpanded(!isFollowersListExpanded);
                        }}
                        title="Followers"
                      >
                        <div className="max-h-75vh overflow-y-scroll">
                          <h3 className="text-xs font-medium text-gray-500">
                            Users
                          </h3>
                          <div>
                            <div className="mt-1">
                              <SocialList
                                onClick={() => {
                                  setIsFollowersListExpanded(
                                    !isFollowersListExpanded
                                  );
                                }}
                                users={userSocials.followers.users}
                                entityType="user"
                              />
                            </div>

                            <h3 className="text-xs font-medium text-gray-500">
                              Orgs
                            </h3>
                            <div className="mt-1">
                              <SocialList
                                onClick={() => {
                                  setIsFollowersListExpanded(
                                    !isFollowersListExpanded
                                  );
                                }}
                                orgs={userSocials.followers.orgs}
                                entityType="org"
                              />
                            </div>
                          </div>
                          <button
                            className="sticky bottom-0 mt-5 w-full bg-white"
                            onClick={() => {
                              setIsFollowersListExpanded(
                                !isFollowersListExpanded
                              );
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </SimpleModal>
                    </div>
                  </div>
                </div>

                <div className="mx-auto sm:mx-10">
                  <WeekCalendar
                    showAddShiftBtn={self?.id === user?.id}
                    orgShifts={userShifts}
                    userJwt={userJwt}
                    autoScroll={false}
                    refreshShifts={() => {
                      if (user) {
                        dispatch(
                          fetchGetUserByIdShifts({
                            userId: user.id,
                            jwtToken: userJwt,
                          })
                        );
                      }
                    }}
                  />
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

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

export default UserPage;

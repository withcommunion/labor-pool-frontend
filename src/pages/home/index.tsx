import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import { selectSelf } from '@/features/selfSlice';
import {
  fetchAllShifts,
  selectAllShiftsOrderedByEarliestStartTime,
} from '@/features/allShiftsSlice';

import Footer from '@/shared_components/footer/footer';
import WeekCalendar from '@/pages_components/org/shiftCalendar';
import FeedContainer from '@/shared_components/feed/feedContainer';
import ApplicationContainer from '@/pages_components/home/applications/applicationContainer';
import ShiftListContainer from '@/shared_components/shiftList/shiftListContainer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const Index = ({ userJwt }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useFetchSelf(userJwt);

  const self = useAppSelector((state) => selectSelf(state));
  const allShifts = useAppSelector(selectAllShiftsOrderedByEarliestStartTime);

  useEffect(() => {
    const { inviteeOrgId: queryInviteeOrgId, action: queryAction } =
      router.query;
    const inviteeOrgId = (queryInviteeOrgId as string) || '';
    const action = (queryAction as string) || '';

    const isJoinInvite = Boolean(
      inviteeOrgId && (action === 'memberJoin' || action === 'friendlyOrgJoin')
    );

    if (self && isJoinInvite) {
      router.push({ pathname: `/org/${inviteeOrgId}`, query: router.query });
    }
  }, [router, self]);

  useEffect(() => {
    if (userJwt) {
      dispatch(fetchAllShifts({ jwtToken: userJwt }));
    }
  }, [userJwt, dispatch]);

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh">
        <div className="my-0 w-full px-2 sm:px-6 ">
          <div className="flex flex-col">
            <div>
              <h2 className="my-4 text-lg font-semibold text-indigo-600">
                Hey {self?.firstName},
              </h2>

              <div className="my-10 w-full">
                <WeekCalendar
                  autoScroll={false}
                  showAddShiftBtn={true}
                  orgShifts={allShifts}
                  userJwt={userJwt || ''}
                  refreshShifts={() => {
                    dispatch(fetchAllShifts({ jwtToken: userJwt || '' }));
                  }}
                />
              </div>
              <div className="my-10">
                <p className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                  Shifts in your network
                </p>
                <ShiftListContainer userJwt={userJwt} shifts={allShifts} />
              </div>
              <div className="my-10">
                <p className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                  Your shift applications
                </p>
                <ApplicationContainer userJwt={userJwt} userId={self?.id} />
              </div>

              <>
                <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                  Whats happening
                </p>
                <FeedContainer />
              </>
            </div>

            <div className="">
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </div>
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

export default Index;

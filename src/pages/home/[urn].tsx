import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import {
  fetchAllShifts,
  selectAllShiftsOrderedByEarliestStartTime,
  selectAllShiftsInFuture,
} from '@/features/allShiftsSlice';
import { fetchGetOrgById, selectOrgById } from '@/features/orgByIdSlice';
import {
  selectIsOnOrgLeadershipTeam,
  selectSelf,
  selfActingAsOrgSet,
} from '@/features/selfSlice';

import Footer from '@/shared_components/footer/footer';
import WeekCalendar from '@/pages_components/org/shiftCalendar';
import FeedContainer from '@/shared_components/feed/feedContainer';
import ApplicationContainer from '@/pages_components/home/applications/applicationContainer';

import ShiftListContainer from '@/shared_components/shiftList/shiftListContainer';
import SocialContainer from '@/shared_components/socials/socialContainer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const Index = ({ userJwt }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useFetchSelf(userJwt);
  const self = useAppSelector(selectSelf);

  const allShifts = useAppSelector(selectAllShiftsOrderedByEarliestStartTime);
  const allShiftsInFuture = useAppSelector(selectAllShiftsInFuture);

  const orgId = (router.query.urn as string).split(':')[2];
  const org = useAppSelector(selectOrgById);
  const isOnLeadershipTeam = useAppSelector((state) =>
    selectIsOnOrgLeadershipTeam(state, org?.id || '')
  );

  useEffect(() => {
    if (userJwt) {
      dispatch(fetchAllShifts({ jwtToken: userJwt }));
    }
  }, [userJwt, dispatch]);

  useEffect(() => {
    if (orgId) {
      dispatch(fetchGetOrgById({ jwtToken: userJwt, orgId }));
    }
  }, [userJwt, dispatch, orgId]);

  useEffect(() => {
    const cleanup = () => {
      dispatch(selfActingAsOrgSet({ orgId: null, active: false }));
    };
    if (self?.orgRoles.find((role) => role.orgId.includes(orgId))) {
      dispatch(selfActingAsOrgSet({ orgId, active: true }));
    }

    return cleanup;
  });

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh">
        <div className="my-0 w-full px-2 sm:px-6 ">
          <div className="flex-col flex px-10px">
            <div className="mx-4 sm:mx-auto lg:mx-60">
              <h2 className="my-4 text-lg font-semibold text-indigo-600">
                Hey {org?.name},
              </h2>

              <>
                <div className="my-10">
                  <ShiftListContainer
                    headerText={'Shifts in your network'}
                    showAddShiftBtn={isOnLeadershipTeam}
                    userJwt={userJwt}
                    shifts={allShiftsInFuture}
                    refreshShifts={() => {
                      dispatch(fetchAllShifts({ jwtToken: userJwt || '' }));
                    }}
                  />
                </div>
              </>

              <>
                <FeedContainer
                  userJwt={userJwt}
                  fetchAll={true}
                  subHeader={
                    <SocialContainer
                      userJwt={userJwt}
                      ownerUrn={org?.id ? `urn:org:${org.id}` : ''}
                    />
                  }
                />
              </>

              <>
                <div className="my-10">
                  <p className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                    Your shift applications
                  </p>
                  <ApplicationContainer userJwt={userJwt} orgId={org?.id} />
                </div>
              </>

              <div className="my-10 w-full">
                <WeekCalendar
                  autoScroll={false}
                  showAddShiftBtn={isOnLeadershipTeam}
                  orgShifts={allShifts}
                  userJwt={userJwt || ''}
                  refreshShifts={() => {
                    dispatch(fetchAllShifts({ jwtToken: userJwt || '' }));
                  }}
                />
              </div>
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

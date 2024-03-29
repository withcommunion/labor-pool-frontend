import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';

import { useAppSelector } from '@/reduxHooks';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';

// import { useAppSelector, useAppDispatch } from '@/reduxHooks';
// import { selectSelf, selectSelfStatus } from '@/features/selfSlice';

import Footer from '@/shared_components/footer/footer';
import { selectOrg } from '@/features/orgSlice';
// import Link from 'next/link';
import useFetchOrg from '@/shared_hooks/useFetchOrgHook';

import WeekCalendar from '@/pages_components/org/shiftCalendar';
import useFetchOrgShifts from '@/shared_hooks/useFetchOrgShifts';
import { selectOrgShifts } from '@/features/orgShiftsSlice';
import Link from 'next/link';
import { selectIsOnOrgLeadershipTeam } from '@/features/selfSlice';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const OrgSchedule = ({ userJwt }: { userJwt: string }) => {
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [context.signOut]);

  const org = useAppSelector((state) => selectOrg(state));
  const orgShifts = useAppSelector((state) => selectOrgShifts(state));
  const isOnLeadershipTeam = useAppSelector((state) =>
    selectIsOnOrgLeadershipTeam(state, org?.id || '')
  );

  useFetchSelf(userJwt);
  useFetchOrg(router.query.orgId as string, userJwt);
  const [fetchShifts] = useFetchOrgShifts(
    router.query.orgId as string,
    userJwt
  );

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-h-100vh min-h-100vh ">
        <div className="my-0 w-full px-6 text-start md:max-w-50vw">
          {org && (
            <div className="w-full">
              <div className="mt-4 flex">
                <Link
                  href={{
                    pathname: `/org/[orgId]/`,
                    query: { orgId: org?.id },
                  }}
                >
                  <a>
                    <ArrowLeftCircleIcon className="mr-2 h-8 w-8 text-gray-400 hover:text-gray-500" />
                  </a>
                </Link>
                <h2 className="text-2xl">{org.name}</h2>
              </div>
            </div>
          )}
        </div>

        <WeekCalendar
          showAddShiftBtn={isOnLeadershipTeam}
          autoScroll={true}
          orgShifts={orgShifts}
          userJwt={userJwt}
          refreshShifts={fetchShifts}
        />
        <div className="flex flex-col items-center justify-center py-2">
          <button
            className="mb-4 flex border p-2"
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
      </main>
    </div>
  );
};

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

export default OrgSchedule;

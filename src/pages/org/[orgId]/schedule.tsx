import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { useAppSelector } from '@/reduxHooks';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';

// import { useAppSelector, useAppDispatch } from '@/reduxHooks';
// import { selectSelf, selectSelfStatus } from '@/features/selfSlice';

import Footer from '@/shared_components/footer/footer';
import { selectOrg } from '@/features/orgSlice';
// import Link from 'next/link';
import useFetchOrg from '@/shared_hooks/useFetchOrgHook';

import WeekCalendar from '@/pages_components/org/weekCalendar';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const OrgSchedule = ({ userJwt }: { userJwt: string }) => {
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [context.signOut]);

  const org = useAppSelector((state) => selectOrg(state));

  useFetchSelf(userJwt);
  useFetchOrg(router.query.orgId as string, userJwt);

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh">
        <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
          {org && (
            <div>
              <div>
                <h2 className="mt-4 text-2xl">{org.name}</h2>
              </div>
            </div>
          )}
        </div>

        <>
          <WeekCalendar />
        </>
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

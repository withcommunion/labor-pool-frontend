import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { getUserOnServer } from '@/util/cognitoAuthUtil';
// import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';

// import { useAppSelector, useAppDispatch } from '@/reduxHooks';
// import { selectSelf, selectSelfStatus } from '@/features/selfSlice';

import AuthComponent from '@/pages_components/index/authComponent';
import WelcomeHeader from '@/pages_components/index/welcome/welcome';
import Footer from '@/shared_components/footer/footer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const Index = () => {
  const router = useRouter();

  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      router.push({
        pathname: `/home`,
        query: router.query,
      });
    }
  }, [user, router]);

  /**
   * 
  useEffect(() => {
    const shouldRouteUserToOnlyOrg =
      selfStatus === 'succeeded' &&
      self?.organizations.length === 1 &&
      !queryOrgId;

    const shouldRouteUserToHome = selfStatus === 'succeeded';

    if (shouldRouteUserToOnlyOrg) {
      router.push({
        pathname: `/org/${self.organizations[0].orgId}`,
        query: router.query,
      });
    } else if (shouldRouteUserToHome) {
      router.push({ pathname: '/home', query: router.query });
    }
  }, [dispatch, selfStatus, self, queryOrgId, router, user]);
     */

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
              <WelcomeHeader />
              <AuthComponent />
            </div>
            <div>
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
    const { userJwt, userId } = await getUserOnServer(context);
    if (userJwt) {
      return {
        props: {},
        redirect: {
          destination: '/home',
        },
      };
    }
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

export default Index;

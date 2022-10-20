import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
// import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';

// import { useAppSelector, useAppDispatch } from '@/reduxHooks';
// import { selectSelf, selectSelfStatus } from '@/features/selfSlice';

import Footer from '@/shared_components/footer/footer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const OrgIndex = () => {
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [context.signOut]);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { userJwt, userId } = await getUserOnServer(context);
    if (userJwt) {
      return {
        props: {},
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

export default OrgIndex;

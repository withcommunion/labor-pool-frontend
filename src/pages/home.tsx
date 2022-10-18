import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { getUserOnServer } from '@/util/cognitoAuthUtil';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';

import Footer from '@/shared_components/footer/footer';
import Link from 'next/link';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string | null;
}

const Index = ({ userJwt }: Props) => {
  const router = useRouter();

  const { signOut } = useAuthenticator((context) => [
    context.signOut,
    context.user,
  ]);

  useFetchSelf(userJwt);

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
              <p>
                You are not part of any organizations, would you like to make
                one?
              </p>
              <Link href="/orgs/new">
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

import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import { useAppSelector } from '@/reduxHooks';

import { selectSelf } from '@/features/selfSlice';

import Footer from '@/shared_components/footer/footer';
import Link from 'next/link';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string | null;
}

const Index = ({ userJwt }: Props) => {
  const router = useRouter();
  useFetchSelf(userJwt);
  // useHandleJoinOrgs(userJwt);

  const self = useAppSelector((state) => selectSelf(state));

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (self && self.orgs.length === 0) {
      router.push({ pathname: `/org/${self.orgs[0]}`, query: router.query });
    }
  }, [self, router]);

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
              <h2 className="my-4 text-lg font-semibold text-indigo-600">
                Hey {self?.firstName},
              </h2>

              {self && self.orgs.length === 0 && (
                <>
                  <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:px-6">
                      <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                        You are not part of any organizations
                      </p>
                    </div>
                    <div className="px-4 py-5 text-xl sm:p-6">
                      <p>Would you like to make one?</p>
                      <Link
                        href={{ pathname: '/org/new', query: router.query }}
                      >
                        <a>
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Create new org
                          </button>
                        </a>
                      </Link>
                    </div>

                    <div className="px-4 py-5 sm:p-6">
                      <p className="text-lg">
                        Or are you trying to join an existing organization?
                      </p>
                      <p>
                        If you have a join URL, enter it into your browser you
                        will join that organization.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {self && self.orgs.length >= 1 && (
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                      You are part of a few orgs - choose one
                    </p>
                  </div>
                  <div className="flex flex-col px-4 py-5 sm:p-6">
                    {self.orgs.map((orgId) => (
                      <Link href={`/org/${orgId}`} key={orgId}>
                        <a className="my-2">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            {orgId}
                          </button>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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

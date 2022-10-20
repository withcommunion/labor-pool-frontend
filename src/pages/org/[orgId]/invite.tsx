import { GetServerSideProps } from 'next';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';

import InviteLink, {
  InviteTextArea,
} from '@/pages_components/index/org/inviteLink/inviteLink';
import Footer from '@/shared_components/footer/footer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string | null;
}

const OrgInvite = ({ userJwt }: Props) => {
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [
    context.signOut,
    context.user,
  ]);

  const steps = ['managers', 'employees', 'friendlyOrgs'];
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const { orgId } = router.query;
  const queryOrgId = (orgId as string) || '';

  console.log(currentStepIdx);
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
            {steps[currentStepIdx] === 'managers' && (
              <InviteManagers queryOrgId={queryOrgId} orgJoinCode="1" />
            )}
            {steps[currentStepIdx] === 'employees' && (
              <InviteEmployees queryOrgId={queryOrgId} orgJoinCode="1" />
            )}
            {steps[currentStepIdx] === 'friendlyOrgs' && (
              <InviteFriendlyOrgs queryOrgId={queryOrgId} orgJoinCode="1" />
            )}
            <span className="isolate mt-10 inline-flex place-self-end rounded-md shadow-sm">
              <button
                type="button"
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-200"
                disabled={Boolean(currentStepIdx === 0)}
                onClick={() => {
                  if (currentStepIdx > 0) {
                    setCurrentStepIdx(currentStepIdx - 1);
                  }
                }}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={() => {
                  if (currentStepIdx < steps.length - 1) {
                    setCurrentStepIdx(currentStepIdx + 1);
                  } else {
                    router.push({
                      pathname: `/org/${queryOrgId}`,
                      query: router.query,
                    });
                  }
                }}
              >
                Next
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>

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

function InviteManagers({
  queryOrgId,
  orgJoinCode,
}: {
  queryOrgId: string;
  orgJoinCode: string;
}) {
  return (
    <>
      <div className="border-b border-gray-200 pb-5 pt-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          First, let&apos;s invite your Managers.
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Managers are able to manage the overall schedule for your business.
        </p>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          They will be able to create the schedule for all in house employees,
          broadcast shifts to outside employees from your friends list, and
          manage the overall schedule for all employees.
        </p>
      </div>
      <div>
        <InviteLink
          orgId={queryOrgId}
          orgJoinCode={orgJoinCode}
          role={'manager'}
          action="memberJoin"
        />
      </div>
    </>
  );
}

function InviteEmployees({
  queryOrgId,
  orgJoinCode,
}: {
  queryOrgId: string;
  orgJoinCode: string;
}) {
  return (
    <>
      <div className="border-b border-gray-200 pb-5 pt-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Now, let&apos;s invite your employees.
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          For every employee you add, you will be able to broadcast your open
          shifts to the same number of employees at other businesses
        </p>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          We limit the number of workers that other owners/managers can
          broadcast to, equal to the number of employees they contribute to the
          pool, to keep it fair.
        </p>
      </div>
      <div>
        <InviteLink
          orgId={queryOrgId}
          orgJoinCode={orgJoinCode}
          role="employee"
          action="memberJoin"
        />
      </div>
    </>
  );
}

function InviteFriendlyOrgs({
  queryOrgId,
  orgJoinCode,
}: {
  queryOrgId: string;
  orgJoinCode: string;
}) {
  return (
    <>
      <div className="border-b border-gray-200 pb-5 pt-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          And finally, let&apos;s invite your business owner friends.
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Here&apos;s a simple invite, you can edit it, and then send it below
          (or copy the link and share it elsewhere)
        </p>
      </div>
      <div>
        <InviteTextArea
          orgId={queryOrgId}
          orgJoinCode={orgJoinCode}
          role="employee"
          action="friendlyOrgJoin"
        />
      </div>
    </>
  );
}

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

export default OrgInvite;

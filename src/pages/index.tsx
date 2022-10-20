import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {
  BoltIcon,
  ChatBubbleBottomCenterTextIcon,
  GlobeAltIcon,
  ScaleIcon,
  DocumentChartBarIcon,
  InboxIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import { Amplify } from 'aws-amplify';
import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useAuthenticator } from '@aws-amplify/ui-react';

import {} from '../util/cognitoAuthUtil';

import Footer from '@/shared_components/footer/footer';
import Image from 'next/image';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });
const features = [
  {
    name: `Communion's first feature is a business owner/operator Friends' List and shared worker pool.`,
    description: `As a business operator, you can create a Friends' List and invite nearby business owners who you trust
You and your friends can create a shared worker pool, so that your friends' workers can help cover shifts at your business (and vice-versa)
`,
    icon: GlobeAltIcon,
  },
  {
    name: `Without Communion, you have limited/not-so-good options for covering an open shift:`,
    description: `Ask another employee to cover it and risk burnout and/or pay overtime
Cover it yourself and/or send a bunch of texts asking around your personal network
Use an expensive temp staffing platform like Instawork
`,
    icon: ScaleIcon,
  },
  {
    name: 'Communion gives you a better option:',
    description: `Broadcast the open shift to the shared worker pool, and get one of your friends' workers to cover the shift.`,
    icon: BoltIcon,
  },
  {
    name: `Communion takes fairness and anti-poaching seriously:`,
    description: `Give and get: Businesses can broadcast open shifts to the same number of workers they employ. (This means if your business employs 10 workers, and your friends' business employs 5, then they will only be able to broadcast open shifts to 5 of your workers).
Matching wages: Workers who pick up a shift at a friendly restaurant will earn the same rate as at their primary work
Max limit on shift pickups: Workers can pick up a maximum of 15 hours/week at others restaurants
Zero tolerance for poaching: if another business in the network hires one of your workers after having a shift covered, both the business and the worker will be kicked off the platform`,
    icon: ChatBubbleBottomCenterTextIcon,
  },
];

const howItWorks = [
  {
    description: `Let's say you're the owner at Altman's Pizzeria, and you're short a server tomorrow. So, you open the Communion app and broadcasts the open shift.
`,
    icon: InboxIcon,
  },
  {
    description: `Alice is a server working at Broadway Diner just down the street, making $18/hr. The diner's owner, Bob, is a friend of yours.
`,
    icon: UsersIcon,
  },
  {
    description: `Alice opens the Communion app, and sees that there's an open shift at your pizzeria tomorrow. She's available and looking for more hours, so she clicks the Request button in the app.
`,
    icon: TrashIcon,
  },
  {
    description: `You get a notification that Alice (who makes $18/hr at Bob's diner) wants to pick up the open shift. Even though you pay your servers $20/hr, because of Communion's safeguards you would pay her $18/hr.
`,
    icon: PencilSquareIcon,
  },
  {
    description: `You accept Alice's request, get her contact info from the app, and arranges for her to show up shortly before her new shift.
`,
    icon: DocumentChartBarIcon,
  },
];

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

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto min-h-100vh max-w-7xl ">
        <div className="flex place-content-around content-center px-4 pt-5 pb-2">
          <Image
            src="/images/logo-black.svg"
            alt="Communion"
            width="220px"
            height="62px"
          />
          <Link
            href={{
              pathname: '/login',
              query: router.query,
            }}
          >
            <a>
              <button
                type="button"
                className="mt-5 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </button>
            </a>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          {/** Header */}

          {/** Hero section */}
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 pb-5 lg:px-8">
              <div className="lg:text-center">
                <p className="z-10 mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                  A better way to stay staffed
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  Communion is an operator- and worker-owned staffing network
                  for retail, restaurants, and hospitality.
                  <br />
                  <br />
                  When you use Communion, you&apos;re awarded points that
                  entitle you to a portion of revenue generated by the platform.
                  <br />
                  <br />
                  You can think of Communion like an Indeed or Instawork that
                  pays you for being a user and for helping to build the
                  network. .
                </p>
              </div>
            </div>

            <div className="bg-gray-800">
              <div className="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:flex lg:justify-between lg:px-8">
                <div className="max-w-xl">
                  <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Interested?
                  </h2>
                  <p className="mt-5 text-xl text-gray-400">
                    Have ideas, comments, or feedback?
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <a href="https://ieo7xyuo672.typeform.com/to/dZ9eGcAH">
                      Please fill out the intake form here
                    </a>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white">
              <div className="mt-10">
                <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative">
                      <dt>
                        <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                          <feature.icon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                          {feature.name}
                        </p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          {/** /Hero section */}

          {/** How it works */}
          <div className="bg-indigo-700">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:px-8 lg:pt-24">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                How It Works
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-indigo-200">
                Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.
                Et magna sit morbi lobortis. Blandit aliquam sit nisl euismod
                mattis in.
              </p>
              <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
                {howItWorks.map((feature, idx) => (
                  <div key={idx}>
                    <div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white bg-opacity-10">
                        <p className="text-lg font-bold text-white">
                          {idx + 1}
                        </p>
                      </span>
                    </div>
                    <div className="mt-6">
                      <p className="mt-2 text-base text-indigo-200">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/** /How it works */}
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { userJwt } = await getUserOnServer(context);
    console.log(context.query);
    const hasQueryStrings = Boolean(Object.keys(context.query).length);
    const queryString = hasQueryStrings
      ? // @ts-expect-error its okay - comes in as an object
        `?${new URLSearchParams(context.query).toString()}`
      : undefined;

    if (userJwt) {
      return {
        props: {},
        redirect: {
          destination: queryString ? `/home${queryString}` : `/home`,
        },
      };
    }
    return {
      props: {},
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
};

export default Index;

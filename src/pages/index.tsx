import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { BoltIcon, GlobeAltIcon, UsersIcon } from '@heroicons/react/24/outline';

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
    name: `Find open roles and shifts in the neighborhood`,
    description: `Imagine a Twitter or Instagram built around finding and giving away open shifts at businesses in the neighborhood. Communion makes it easy to post and find openings.`,
    icon: GlobeAltIcon,
  },
  {
    name: `Easily refer friends`,
    description: `Got a shift to fill? Using Communion to easily share the opening (what, when, where, and requirements) with ex-coworkers, family, and trusted friends.`,
    icon: UsersIcon,
  },
  {
    name: 'Share your time, products, or services with the community',
    description: `We know many of you who have been in the industry for a long time have a lot to give. Whether it’s management wisdom, hot neighborhood tips, or supplier/service contacts, you can post it on Communion and give back to the community.`,
    icon: BoltIcon,
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

      <main className="min-h-100vh md:mx-[20vw] ">
        <div className="flex px-4 py-8 pb-2 ">
          <div className="w-full">
            <Image
              className="w-full"
              src="/images/logo-black.svg"
              alt="Communion"
              width="220px"
              height="62px"
            />
          </div>
          <Link
            href={{
              pathname: '/login',
              query: router.query,
            }}
          >
            <a className="inline-flex w-fit items-center rounded-md border border-transparent bg-indigo-600 px-8 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Enter
            </a>
          </Link>
        </div>
        <div className="flex-col flex items-center justify-center">
          {/** Header */}

          {/** Hero section */}
          <div className="w-100vw bg-white py-5">
            <div className="px-4 pb-5 md:mx-[20vw]">
              <p className="z-10 mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                Welcome friends and participants of BK Food & Hospitality
                Industry Week!
              </p>
              <p className="mt-4 max-w-2xl text-start text-xl text-gray-500">
                Communion is a user-owned, social staffing network for people
                who work in food & hospitality.
                <br />
                <br />
                For this week (BK Food & Hospitality Industry Week), we’ll be
                using the app to make it easier for participants to host and
                attend community-run events and openings.
                <br />
                <br />
                Our mission is to break the silos of staffing agencies and
                platforms, to connect industry people in the neighborhood
                directly.
                <br />
                <br />
                We believe the solution to some of the industry&apos;s toughest
                challenges (like understaffing, work culture, or financial
                safety) can be found just around the corner.
              </p>
            </div>

            <div className="w-100vw bg-gray-800">
              <div className="py-8 px-4 sm:py-12 md:mx-[20vw]">
                <div className="">
                  <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Meet your neighbors and discover new opportunities
                  </h2>
                  <Link
                    href={{
                      pathname: '/login',
                      query: router.query,
                    }}
                  >
                    <a className="mt-5 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Sign Up
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-100vw bg-white">
              <div className="mt-10 px-5 py-5 md:mx-[20vw]">
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
          <div>
            <div className="w-100vw bg-indigo-700 py-12">
              <div className="max-w-4xl px-4 md:mx-[20vw]">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Communion is in Beta and launching in Brooklyn.
                  <br />
                  We&apos;re excited you&apos;re here and would love to hear
                  what you think!
                </h2>
                <Link
                  href={{
                    pathname: '/login',
                    query: router.query,
                  }}
                >
                  <a className="mt-5 inline-flex items-center rounded-md border border-indigo-600 bg-white px-6 py-3 text-center text-base font-medium text-indigo-600 shadow-sm hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Sign Up
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="my-10">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { userJwt } = await getUserOnServer(context);
    const hasQueryStrings = Boolean(Object.keys(context.query).length);
    const queryString = hasQueryStrings
      ? // @ts-expect-error its okay - comes in as an object
        `?${new URLSearchParams(context.query).toString()}`
      : undefined;

    if (userJwt) {
      return {
        props: { userJwt },
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

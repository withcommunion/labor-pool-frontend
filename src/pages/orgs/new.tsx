import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';

import { getUserOnServer, AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import Footer from '@/shared_components/footer/footer';
import {
  selectOrgToCreate,
  setOrgToCreateAttributes,
  fetchPostOrg,
  selectCreatedOrgStatus,
  selectCreatedOrgResp,
} from '@/features/createOrgSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const Index = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useFetchSelf(userJwt);
  const orgToCreate = useAppSelector((state) => selectOrgToCreate(state));
  const createdOrgStatus = useAppSelector((state) =>
    selectCreatedOrgStatus(state)
  );
  const createdOrgResp = useAppSelector((state) => selectCreatedOrgResp(state));

  useEffect(() => {
    if (createdOrgStatus === 'succeeded' && createdOrgResp) {
      router.push(`/orgs/${createdOrgResp.id as string}`);
    }
  }, [createdOrgStatus, createdOrgResp, router]);

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh">
        <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
          <form className="mt-5 space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Company Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Use a permanent address where you can receive mail.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="company-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="company-name"
                        id="company-name"
                        autoComplete="company-name"
                        value={orgToCreate?.name}
                        onChange={(e) => {
                          dispatch(
                            setOrgToCreateAttributes({ name: e.target.value })
                          );
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={orgToCreate?.email}
                        onChange={(e) => {
                          console.log('fired');
                          dispatch(
                            setOrgToCreateAttributes({ email: e.target.value })
                          );
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={orgToCreate?.country}
                        onChange={(e) => {
                          dispatch(
                            setOrgToCreateAttributes({
                              country: e.target.value,
                            })
                          );
                        }}
                      >
                        <option value={'US'}>United States</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        value={orgToCreate?.addressLine1}
                        onChange={(e) => {
                          dispatch(
                            setOrgToCreateAttributes({
                              addressLine1: e.target.value,
                            })
                          );
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        value={orgToCreate?.city}
                        onChange={(e) => {
                          dispatch(
                            setOrgToCreateAttributes({ city: e.target.value })
                          );
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        value={orgToCreate?.state}
                        onChange={(e) => {
                          dispatch(
                            setOrgToCreateAttributes({ state: e.target.value })
                          );
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        value={orgToCreate?.zip}
                        onChange={(e) => {
                          dispatch(
                            setOrgToCreateAttributes({ zip: e.target.value })
                          );
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Link href="/home">
                  <a>
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </a>
                </Link>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(fetchPostOrg({ orgToCreate, jwtToken: userJwt }));
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
          <Footer />
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

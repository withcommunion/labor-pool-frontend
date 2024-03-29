import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BuildingStorefrontIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import cx from 'classnames';
import { IUser } from '@/features/selfSlice';
import { useRouter } from 'next/router';

const mainNavigation = [
  { name: 'Home', href: '/home', current: true },
  { name: 'Create Org', href: '/org/new', current: false },
];

interface Props {
  user: IUser | null;
  signOut: () => void;
}
export default function MobileNav({ signOut, user }: Props) {
  const router = useRouter();

  const isProfilePage = router.pathname === '/user/[userId]';
  const isOrgPage = router.pathname === '/org/[orgId]';

  return (
    <div className="absolute sticky top-0 z-10 w-full">
      <Disclosure as="nav" className="w-full bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/home">
                      <a>
                        <Image
                          className="block h-8 w-auto lg:hidden"
                          src="/images/logo-symbol-black.svg"
                          alt="Communion Logo"
                          height={30}
                          width={30}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                    {mainNavigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <a className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* <button
                    type="button"
                    className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-2">
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none">
                      <div className="group block w-full flex-shrink-0">
                        <div className="flex items-center">
                          <div>
                            {user?.imageUrl ? (
                              <Image
                                className="inline-block h-9 w-9 rounded-full"
                                src={user?.imageUrl || ''}
                                alt="profile image"
                                height={40}
                                width={40}
                              />
                            ) : (
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-400">
                                <span className="text-lg font-medium leading-none text-white">
                                  {user?.firstName?.charAt(0)}
                                  {user?.lastName?.charAt(0)}
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <>
                              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                                View profile
                              </p>
                            </>
                          </div>
                        </div>
                      </div>
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 -mr-4 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          <>
                            <Link
                              href={{
                                pathname: `/user/[userId]`,
                                query: { userId: user?.id },
                              }}
                            >
                              <a
                                className={cx(
                                  isProfilePage ? 'bg-gray-100' : '',
                                  'relative inline-flex w-full items-center rounded-md border border-transparent bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2'
                                )}
                              >
                                <UserIcon
                                  className="-ml-2 mr-3 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span>Your Profile</span>
                              </a>
                            </Link>
                          </>
                        </Menu.Item>
                        {user?.orgRoles.map((role) => {
                          return (
                            role.role === 'manager' && (
                              <Menu.Item key={role.orgId}>
                                <>
                                  <Link
                                    href={{
                                      pathname: `/home/[urn]`,
                                      query: { urn: `urn:org:${role?.orgId}` },
                                    }}
                                  >
                                    <a
                                      className={cx(
                                        isOrgPage ? 'bg-gray-100' : '',
                                        'relative inline-flex w-full items-center rounded-md border border-transparent bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2'
                                      )}
                                    >
                                      <BuildingStorefrontIcon
                                        className="-ml-2 mr-3 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                      <span>{role.orgId}</span>
                                    </a>
                                  </Link>
                                </>
                              </Menu.Item>
                            )
                          );
                        })}
                        <Menu.Item>
                          <div className="mt-2">
                            <button
                              type="button"
                              className="relative inline-flex w-full items-center rounded-md border border-transparent px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                              onClick={signOut}
                            >
                              <ArrowLeftOnRectangleIcon
                                className="-ml-2 mr-3 h-5 w-5"
                                aria-hidden="true"
                              />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-4">
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                {mainNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <Link href={item.href}>
                      <a>{item.name}</a>
                    </Link>
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

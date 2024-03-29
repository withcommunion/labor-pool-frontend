import {
  HomeIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import cx from 'classnames';
import { IUser } from '@/features/selfSlice';
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Home', icon: HomeIcon, href: '/home', current: true },
];
interface Props {
  signOut: () => void;
  user: IUser | null;
}
export default function DesktopNav({ signOut, user }: Props) {
  const router = useRouter();
  const isProfilePage = router.pathname === '/user/[userId]';
  const isOrgPage = router.pathname === '/home/[urn]';

  return (
    <div className="flex-col float-left flex min-h-0 flex-1 border-r border-gray-200 bg-white">
      <div className="flex-col flex flex-1 overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <Link href="/home">
            <a>
              <Image
                className="h-8 w-auto"
                height={40}
                width={140}
                src="/images/logo-black.svg"
                alt="Communion"
              />
            </a>
          </Link>
        </div>
        <nav
          className="mt-5 flex-1 space-y-1 bg-white px-2"
          aria-label="Sidebar"
        >
          <div className="border-bottom-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a>
                  <div
                    className={cx(
                      item.current
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={cx(
                        item.current
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <Menu as="div" className="relative">
          <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none ">
            <Link href="/org/new">
              <a
                type="button"
                className="mb-2 inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-2 mr-3 h-5 w-5" aria-hidden="true" />
                <span>Create Org</span>
              </a>
            </Link>
          </Menu.Button>
          <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none ">
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
            <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    <div key={role.orgId}>
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
                    </div>
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
  );
}

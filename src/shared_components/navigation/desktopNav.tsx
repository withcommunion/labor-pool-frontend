import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  Cog6ToothIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import cx from 'classnames';
import { IUser } from '@/features/selfSlice';

const navigation = [
  { name: 'Home', icon: HomeIcon, href: '/home', current: true },
  {
    name: 'Your Schedule',
    icon: CalendarIcon,
    href: '/schedule',
    count: 3,
    current: false,
  },
  {
    name: 'Your Applications',
    icon: FolderIcon,
    href: '/applications',
    count: 4,
    current: false,
  },
  { name: 'Settings', icon: Cog6ToothIcon, href: '/settings', current: false },
];
interface Props {
  signOut: () => void;
  user: IUser | null;
}
export default function DesktopNav({ signOut, user }: Props) {
  return (
    <div className="float-left flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
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
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
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
                {item.count ? (
                  <span
                    className={cx(
                      item.current
                        ? 'bg-white'
                        : 'bg-gray-100 group-hover:bg-gray-200',
                      'ml-3 inline-block rounded-full py-0.5 px-3 text-xs font-medium'
                    )}
                  >
                    {item.count}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
          <button
            type="button"
            className="relative inline-flex  items-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-2 mr-3 h-5 w-5" aria-hidden="true" />
            <span>Create Shift</span>
          </button>
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <Link
          href={user?.id ? `/user/${user?.id}` : '#'}
          className="group block w-full flex-shrink-0"
        >
          <a>
            <div className="flex items-center">
              <div>
                {user?.imageUrl ? (
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={user?.imageUrl || ''}
                    alt="profile image"
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
          </a>
        </Link>
      </div>

      <button
        type="button"
        className="relative ml-2 inline-flex w-2/3 items-center rounded-md border border-transparent bg-white px-4 py-3 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        onClick={signOut}
      >
        <ArrowLeftOnRectangleIcon
          className="-ml-2 mr-3 h-5 w-5"
          aria-hidden="true"
        />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

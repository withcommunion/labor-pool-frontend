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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  signOut: () => void;
}
export default function Example({ signOut }: Props) {
  return (
    <div className="float-left flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <Image
            className="h-8 w-auto"
            height={40}
            width={140}
            src="/images/logo-black.svg"
            alt="Communion"
          />
        </div>
        <nav
          className="mt-5 flex-1 space-y-1 bg-white px-2"
          aria-label="Sidebar"
        >
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={classNames(
                  item.current
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                )}
              >
                <item.icon
                  className={classNames(
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
                    className={classNames(
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
        <a href="#" className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Tom Cook
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                View profile
              </p>
            </div>
          </div>
        </a>
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

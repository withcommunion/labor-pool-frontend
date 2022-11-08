import Image from 'next/image';
import Link from 'next/link';
import { IUser } from '@/features/selfSlice';
import { IOrg } from '@/features/orgSlice';

export default function SocialList({
  onClick,
  users,
  orgs,
  entityType,
}: {
  users?: IUser[];
  orgs?: IOrg[];
  onClick: () => void;
  entityType: 'org' | 'user';
}) {
  return (
    <>
      {users?.length && (
        <ul>
          {users.map((user) => (
            <SocialCard
              key={user.id}
              user={user}
              entityType={entityType}
              onClick={() => onClick()}
            />
          ))}
        </ul>
      )}
      {orgs?.length && (
        <ul>
          {orgs.map((org) => (
            <SocialCard
              key={org.id}
              org={org}
              entityType={entityType}
              onClick={onClick}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function SocialCard({
  user,
  org,
  entityType,
  onClick,
}: {
  user?: IUser;
  org?: IOrg;
  entityType: 'org' | 'user';
  onClick: () => void;
}) {
  const name = user ? `${user.firstName} ${user.lastName}` : org?.name;
  const imageUrl = user?.imageUrl || '';
  const urlPathname = entityType === 'user' ? '/user/[userId]' : '/org/[orgId]';
  const urlQuery = user ? { userId: user?.id } : { orgId: org?.id };

  return (
    <li onClick={() => onClick()}>
      <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2 hover:border-gray-400">
        <div className="flex-shrink-0">
          {imageUrl ? (
            <Image
              className="h-10 w-10"
              width={40}
              height={40}
              src={imageUrl || ''}
              alt="profile image"
            />
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 ">
              <span className="text-xl font-medium leading-none text-white">
                {user
                  ? `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
                  : org?.name.charAt(0)}
              </span>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={{
              pathname: urlPathname,
              query: urlQuery,
            }}
          >
            <a className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="truncate text-sm text-gray-500">
                {user?.description || org?.description}
              </p>
            </a>
          </Link>
        </div>
      </div>
    </li>
  );
}

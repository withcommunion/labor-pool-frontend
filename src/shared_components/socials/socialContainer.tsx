import { useEffect, useState } from 'react';
import {
  fetchGetEntityByIdSocials,
  selectEntityByIdSocials,
} from '@/features/entityByIdSlice';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';

import SimpleModal from '../simpleModal';
import SocialList from './socialList';

interface Props {
  ownerUrn: string;
  userJwt: string;
}

export default function SocialContainer({ ownerUrn, userJwt }: Props) {
  const dispatch = useAppDispatch();

  const entitySocials = useAppSelector(selectEntityByIdSocials);

  const [isFollowersListExpanded, setIsFollowersListExpanded] = useState(false);
  const [isFollowingListExpanded, setIsFollowingListExpanded] = useState(false);

  const userSocials = entitySocials;

  useEffect(() => {
    if (ownerUrn && userJwt) {
      dispatch(
        fetchGetEntityByIdSocials({ entityUrn: ownerUrn, jwtToken: userJwt })
      );
    }
  }, [dispatch, ownerUrn, userJwt]);

  return (
    <div className="flex">
      {/*  Following */}
      <div className="mt-2 max-w-5xl ">
        <button
          onClick={() => {
            setIsFollowingListExpanded(!isFollowingListExpanded);
          }}
        >
          <h2 className="text-sm font-medium text-gray-500">
            <span className="text-black">
              {userSocials.following.users.length +
                userSocials.following.orgs.length}{' '}
            </span>
            Following
          </h2>
        </button>

        <SimpleModal
          isOpen={isFollowingListExpanded}
          toggleIsOpen={() => {
            setIsFollowingListExpanded(!isFollowingListExpanded);
          }}
          title="Following"
        >
          <div className="max-h-75vh overflow-y-scroll">
            <h3 className="text-xs font-medium text-gray-500">Users</h3>
            <div>
              <div className="mt-1">
                <SocialList
                  onClick={() => {
                    setIsFollowingListExpanded(!isFollowingListExpanded);
                  }}
                  users={userSocials.following.users}
                  entityType="user"
                />
              </div>

              <h3 className="text-xs font-medium text-gray-500">Orgs</h3>
              <div className="mt-1">
                <SocialList
                  onClick={() => {
                    setIsFollowingListExpanded(!isFollowingListExpanded);
                  }}
                  orgs={userSocials.following.orgs}
                  entityType="org"
                />
              </div>
            </div>
            <button
              className="sticky bottom-0 mt-5 w-full bg-white"
              onClick={() => {
                setIsFollowingListExpanded(!isFollowingListExpanded);
              }}
            >
              Close
            </button>
          </div>
        </SimpleModal>
      </div>
      {/*  /Following */}

      {/* Followers */}
      <div className="mt-2 max-w-5xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            setIsFollowersListExpanded(!isFollowersListExpanded);
          }}
        >
          <h2 className="text-sm font-medium text-gray-500">
            <span className="text-black">
              {userSocials.followers.users.length +
                userSocials.followers.orgs.length}{' '}
            </span>
            Followers
          </h2>
        </button>
        <SimpleModal
          isOpen={isFollowersListExpanded}
          toggleIsOpen={() => {
            setIsFollowersListExpanded(!isFollowersListExpanded);
          }}
          title="Followers"
        >
          <div className="max-h-75vh overflow-y-scroll">
            <h3 className="text-xs font-medium text-gray-500">Users</h3>
            <div>
              <div className="mt-1">
                <SocialList
                  onClick={() => {
                    setIsFollowersListExpanded(!isFollowersListExpanded);
                  }}
                  users={userSocials.followers.users}
                  entityType="user"
                />
              </div>

              <h3 className="text-xs font-medium text-gray-500">Orgs</h3>
              <div className="mt-1">
                <SocialList
                  onClick={() => {
                    setIsFollowersListExpanded(!isFollowersListExpanded);
                  }}
                  orgs={userSocials.followers.orgs}
                  entityType="org"
                />
              </div>
            </div>
            <button
              className="sticky bottom-0 mt-5 w-full bg-white"
              onClick={() => {
                setIsFollowersListExpanded(!isFollowersListExpanded);
              }}
            >
              Close
            </button>
          </div>
        </SimpleModal>
      </div>
    </div>
  );
}

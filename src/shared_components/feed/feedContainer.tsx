import {
  fetchAllEntitiesFeed,
  fetchFeedByEntityUrn,
  selectAllFeed,
  selectFeedById,
} from '@/features/feedSlice';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import { useEffect } from 'react';
import FeedList from './feedList';

interface Props {
  userJwt: string;
  fetchAll?: boolean;
  entityUrn?: string;
}
export default function FeedContainer({ userJwt, entityUrn, fetchAll }: Props) {
  const dispatch = useAppDispatch();

  const allEvents = useAppSelector(selectAllFeed);
  const entityUrnEvents = useAppSelector(selectFeedById);

  const showAllEventsInNetwork = fetchAll || !entityUrn;
  const areEventsAvailable = showAllEventsInNetwork
    ? Boolean(allEvents.length)
    : Boolean(entityUrnEvents.length);

  useEffect(() => {
    if (!fetchAll && entityUrn && userJwt) {
      dispatch(fetchFeedByEntityUrn({ jwtToken: userJwt, entityUrn }));
    } else if (fetchAll && userJwt) {
      dispatch(fetchAllEntitiesFeed({ jwtToken: userJwt }));
    }
  }, [userJwt, entityUrn, fetchAll, dispatch]);

  return (
    <div>
      <h2 className="mb-4 mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
        Whats happening
      </h2>
      <FeedList events={showAllEventsInNetwork ? allEvents : entityUrnEvents} />
      {!areEventsAvailable && (
        <p className="text-start text-gray-500">
          No events to show at the moment
        </p>
      )}
    </div>
  );
}

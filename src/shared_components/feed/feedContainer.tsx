import {
  fetchAllEntitiesFeed,
  fetchFeedByEntityUrn,
  selectAllFeedSortByLatest,
  selectFeedByIdSortByLatest,
} from '@/features/feedSlice';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import { ReactElement, useEffect } from 'react';
import FeedList from './feedList';

interface Props {
  userJwt: string;
  subHeader?: ReactElement;
  fetchAll?: boolean;
  entityUrn?: string;
}
export default function FeedContainer({
  userJwt,
  entityUrn,
  fetchAll,
  subHeader,
}: Props) {
  const dispatch = useAppDispatch();

  const allEvents = useAppSelector(selectAllFeedSortByLatest);
  const entityUrnEvents = useAppSelector(selectFeedByIdSortByLatest);

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
      <div className="mb-4">
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
          Whats happening
        </h2>
        {subHeader}
      </div>
      <FeedList events={showAllEventsInNetwork ? allEvents : entityUrnEvents} />
      {!areEventsAvailable && (
        <p className="text-start text-gray-500">
          No events to show at the moment
        </p>
      )}
    </div>
  );
}

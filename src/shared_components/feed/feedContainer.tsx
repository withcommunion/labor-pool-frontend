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

  const showAllEvents = fetchAll || !entityUrn;

  useEffect(() => {
    if (!fetchAll && entityUrn && userJwt) {
      dispatch(fetchFeedByEntityUrn({ jwtToken: userJwt, entityUrn }));
    } else if (fetchAll && userJwt) {
      dispatch(fetchAllEntitiesFeed({ jwtToken: userJwt }));
    }
  }, [userJwt, entityUrn, fetchAll, dispatch]);

  return (
    <div>
      <FeedList events={showAllEvents ? allEvents : entityUrnEvents} />
    </div>
  );
}

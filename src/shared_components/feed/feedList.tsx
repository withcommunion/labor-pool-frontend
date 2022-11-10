import { IEvent } from '@/features/feedSlice';
import { format } from 'date-fns';

interface Props {
  events: IEvent[];
}

export default function FeedList({ events }: Props) {
  return (
    <div>
      <ul role="list" className="divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event.id} className="py-4">
            <div className="flex space-x-3">
              {/* <img
                className="h-6 w-6 rounded-full"
                src={''}
                alt=""
              /> */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{event.ownerUrn}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.createdAtMs), 'yyyy-MM-dd hh:mm')}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Transition } from '@headlessui/react';

import { IEvent } from '@/features/feedSlice';
import { format } from 'date-fns';
import { useState } from 'react';

interface Props {
  events: IEvent[];
}

export default function FeedList({ events }: Props) {
  const [showAll, setShowAll] = useState(false);
  const minEventsToShow = 6;
  const eventsToShow = showAll ? events : events.slice(0, minEventsToShow);
  const hasMoreEventsToShow = events.length > minEventsToShow;
  return (
    <div>
      <ul
        role="list"
        className="max-h-80vh divide-y divide-gray-200 overflow-y-scroll"
      >
        <Transition
          appear={true}
          show={true}
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {eventsToShow.map((event) => (
            <li key={event.id} className="py-4">
              <Transition
                appear={true}
                show={true}
                enter="transition-opacity duration-1000"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-1000"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
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
                        {format(
                          new Date(event.createdAtMs),
                          'yyyy-MM-dd hh:mm'
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                </div>
              </Transition>
            </li>
          ))}
        </Transition>
      </ul>
      <div>
        {hasMoreEventsToShow && (
          <button
            type="button"
            onClick={() => {
              setShowAll(!showAll);
            }}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-base font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
}

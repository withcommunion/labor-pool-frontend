interface Person {
  name: string;
  imageUrl: string;
}
interface Event {
  id: number;
  person: Person;
  project: string;
  commit: string;
  environment: string;
  time: string;
}
interface Props {
  events: Event[];
}

/**
 * Created a shift
 * Applied to shift
 * Filled Shift
 * Created an org
 * Joined the network
 *
 * Followed a user
 * Followed an org
 */

export default function FeedList({ events }: Props) {
  return (
    <div>
      <ul role="list" className="divide-y divide-gray-200">
        {events.map((activityItem) => (
          <li key={activityItem.id} className="py-4">
            <div className="flex space-x-3">
              <img
                className="h-6 w-6 rounded-full"
                src={activityItem.person.imageUrl}
                alt=""
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    {activityItem.person.name}
                  </h3>
                  <p className="text-sm text-gray-500">{activityItem.time}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Deployed {activityItem.project} ({activityItem.commit} in
                  master) to {activityItem.environment}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

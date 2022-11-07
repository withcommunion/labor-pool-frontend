import FeedList from './feedList';

const people = [
  {
    name: 'Lindsay Walton',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
  },
  {
    name: 'Bill Miles',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
  },
];
const activityItems = [
  {
    id: 1,
    person: people[0],
    project: 'Workcation',
    commit: '2d89f0c8',
    environment: 'production',
    time: '1h',
  },
  {
    id: 2,
    person: people[1],
    project: 'Kitetail',
    commit: '249df660',
    environment: 'production',
    time: '3h',
  },
  // More items...
  {
    id: 3,
    person: people[0],
    project: 'Workcation',
    commit: '2d89f0c8',
    environment: 'production',
    time: '1h',
  },
  {
    id: 4,
    person: people[1],
    project: 'Kitetail',
    commit: '249df660',
    environment: 'production',
    time: '3h',
  },
  {
    id: 5,
    person: people[0],
    project: 'Workcation',
    commit: '2d89f0c8',
    environment: 'production',
    time: '1h',
  },
];

export default function FeedContainer() {
  return (
    <div>
      <FeedList events={activityItems} />
    </div>
  );
}

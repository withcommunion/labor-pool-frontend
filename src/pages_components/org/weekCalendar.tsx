import { Fragment, useRef, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isToday,
  startOfDay,
  eachHourOfInterval,
  endOfDay,
  addWeeks,
  subWeeks,
  differenceInMinutes,
  addHours,
} from 'date-fns';
import cx from 'classnames';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function WeekCalendar() {
  const [startDay, setStartDay] = useState(new Date(Date.now()));
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  return (
    <div className="flex h-full flex-col px-5">
      <CalendarHeader
        startDate={startDay}
        onTodayClick={() => setStartDay(new Date(Date.now()))}
        onNextWeekClick={() => {
          setStartDay(addWeeks(startDay, 1));
        }}
        onPrevWeekClick={() => {
          setStartDay(subWeeks(startDay, 1));
        }}
      />
      <div
        ref={container}
        className="isolate flex flex-auto flex-col overflow-auto bg-white"
      >
        <DaysOfWeekHeader dayToStartOn={startDay} containerNav={containerNav} />
        <div
          style={{ width: '165%' }}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              <TimesOfDayHeader containerOffset={containerOffset} />
              <VerticalLines />
              <EventsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarTypeSelector() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        type="button"
        className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        Week view
        <ChevronDownIcon
          className="ml-2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Day view
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Week view
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function CalendarHeader({
  startDate,
  onTodayClick,
  onNextWeekClick,
  onPrevWeekClick,
}: {
  startDate: Date;
  onTodayClick: () => void;
  onNextWeekClick: () => void;
  onPrevWeekClick: () => void;
}) {
  return (
    <header className="flex flex-none items-center justify-between border-b border-gray-200 py-4 px-6">
      <h1 className="text-lg font-semibold text-gray-900">
        <time dateTime={format(startDate, 'yyyy-MM')}>
          {format(startDate, 'MMMM yyyy')}
        </time>
      </h1>
      <div className="flex items-center">
        <div className="flex items-center rounded-md shadow-sm md:items-stretch">
          <button
            type="button"
            onClick={onPrevWeekClick}
            className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
          >
            <span className="sr-only">Previous week</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onTodayClick}
            className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
          >
            Today
          </button>
          <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            onClick={onNextWeekClick}
            className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
          >
            <span className="sr-only">Next week</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden md:ml-4 md:flex md:items-center">
          <CalendarTypeSelector />
          <div className="ml-6 h-6 w-px bg-gray-300" />
          <button
            type="button"
            className="ml-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add event
          </button>
        </div>
        <Menu as="div" className="relative ml-6 md:hidden">
          <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Create event
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      onClick={onTodayClick}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Go to today
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Day view
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Week view
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}

function DaysOfWeekHeader({
  dayToStartOn,
  containerNav,
}: {
  containerNav: React.RefObject<HTMLDivElement>;
  dayToStartOn: Date;
}) {
  const thisWeek = eachDayOfInterval({
    start: startOfWeek(dayToStartOn),
    end: endOfWeek(dayToStartOn),
  });

  return (
    <div
      ref={containerNav}
      className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
    >
      <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
        {thisWeek.map((day) => {
          return (
            <button
              key={day.getDay()}
              type="button"
              className="flex flex-col items-center pt-2 pb-3"
            >
              {format(day, 'EEE')}{' '}
              <span
                className={cx(
                  'mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900',
                  {
                    'mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white':
                      isToday(day),
                  }
                )}
              >
                {format(day, 'dd')}
              </span>
            </button>
          );
        })}
      </div>

      <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
        <div className="col-end-1 w-14" />
        {thisWeek.map((day) => {
          return (
            <div
              className="flex items-center justify-center py-3"
              key={day.getDay()}
            >
              <span
                className={cx('', {
                  'flex items-baseline': isToday(day),
                })}
              >
                {format(day, 'EEE')}{' '}
                <span
                  className={cx(
                    'items-center justify-center font-semibold text-gray-900',
                    {
                      'ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white':
                        isToday(day),
                    }
                  )}
                >
                  {format(day, 'dd')}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimesOfDayHeader({
  containerOffset,
}: {
  containerOffset: React.RefObject<HTMLDivElement>;
}) {
  const today = Date.now();
  const eachHourOfDay = eachHourOfInterval({
    start: startOfDay(today),
    end: endOfDay(today),
  });
  return (
    <div
      className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
      style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
    >
      <div ref={containerOffset} className="row-end-1 h-7"></div>
      {eachHourOfDay.map((day) => {
        const time = format(day, 'ha');
        return (
          <div key={time}>
            <div>
              <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                {time}
              </div>
            </div>
            <div />
          </div>
        );
      })}
    </div>
  );
}

function VerticalLines() {
  return (
    <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
      <div className="col-start-1 row-span-full" />
      <div className="col-start-2 row-span-full" />
      <div className="col-start-3 row-span-full" />
      <div className="col-start-4 row-span-full" />
      <div className="col-start-5 row-span-full" />
      <div className="col-start-6 row-span-full" />
      <div className="col-start-7 row-span-full" />
      <div className="col-start-8 row-span-full w-8" />
    </div>
  );
}

function calculateEventPosition(eventStart: Date, eventEnd: Date) {
  /**
   * Total Cells = 48
   * 1 full cell = 6
   * Thiry min = 1 cell
   */
  const thiryMinOnGrid = 6;
  const gridStart = 2;

  const minutesFromMidnight = differenceInMinutes(
    eventStart,
    startOfDay(eventStart)
  );

  const eventDurationInMinutes = differenceInMinutes(eventEnd, eventStart);

  const eventStartInGrid = Math.floor(
    (minutesFromMidnight / 30) * thiryMinOnGrid + gridStart
  );
  const eventEndInGrid = Math.floor(
    (eventDurationInMinutes / 30) * thiryMinOnGrid
  );

  return { eventStartInGrid, eventEndInGrid };
}

function DynamicEvent() {
  const numDayOfWeek = 3;

  const eventStart = new Date(Date.now());
  const eventEnd = addHours(Date.now(), 2);
  const { eventStartInGrid, eventEndInGrid } = calculateEventPosition(
    eventStart,
    eventEnd
  );
  return (
    <li
      className={`relative mt-px flex sm:col-start-${numDayOfWeek}`}
      style={{ gridRow: `${eventStartInGrid} / span ${eventEndInGrid}` }}
    >
      <a className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100">
        <p className="order-1 font-semibold text-blue-700">Breakfast!</p>
        <p className="text-blue-500 group-hover:text-blue-700">
          <time dateTime="2022-01-12T06:00">
            {format(eventStart, 'h:mm b')}
          </time>
        </p>
      </a>
    </li>
  );
}

function EventsList() {
  return (
    <ol
      className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
      style={{
        gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
      }}
    >
      <DynamicEvent />

      <li
        className="relative mt-px flex sm:col-start-3"
        style={{ gridRow: '92 / span 30' }}
      >
        <a className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100">
          <p className="order-1 font-semibold text-pink-700">Flight to Paris</p>
          <p className="text-pink-500 group-hover:text-pink-700">
            <time dateTime="2022-01-12T07:30">7:30 AM</time>
          </p>
        </a>
      </li>
      <li
        className="relative mt-px hidden sm:col-start-6 sm:flex"
        style={{ gridRow: '122 / span 24' }}
      >
        <a className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200">
          <p className="order-1 font-semibold text-gray-700">
            Meeting with design team at Disney
          </p>
          <p className="text-gray-500 group-hover:text-gray-700">
            <time dateTime="2022-01-15T10:00">10:00 AM</time>
          </p>
        </a>
      </li>
    </ol>
  );
}

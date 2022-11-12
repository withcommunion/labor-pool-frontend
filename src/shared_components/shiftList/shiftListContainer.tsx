import { IShift } from '@/features/orgShiftsSlice';
import ShiftDetailsContainer from '@/pages_components/org/shiftCalendar/shiftDetailsContainer';
import { useAppSelector } from '@/reduxHooks';
import { format, getTime, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import cx from 'classnames';
import SimpleModal from '../simpleModal';
import { selectSelf } from '@/features/selfSlice';
import AddShiftFormContainer from '@/pages_components/org/shiftCalendar/addShiftFormContainer';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Props {
  userJwt: string;
  shifts: IShift[];
  refreshShifts: () => void;
  showAddShiftBtn: boolean;
  headerText?: string;
}

export default function ShiftListContainer({
  shifts,
  userJwt,
  showAddShiftBtn,
  headerText,
  refreshShifts,
}: Props) {
  const [dayShiftMap, setDayShiftMap] = useState<Record<string, IShift[]>>({});
  const [selectedShift, setSelectedShift] = useState<IShift | null>(null);
  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false);
  const self = useAppSelector(selectSelf);

  useEffect(() => {
    const shiftsByDay = [...shifts]
      .sort((shiftA, shiftB) => {
        return shiftB.startTimeMs - shiftA.startTimeMs;
      })
      .filter((shift) => Boolean(shift.ownerUrn))
      .reduce((acc, shift) => {
        // const shiftDay = format(shift.startTimeMs, 'yyyy-MM-dd');
        const shiftDay = getTime(startOfDay(shift.startTimeMs));
        if (acc[shiftDay]) {
          acc[shiftDay].push(shift);
        } else {
          acc[shiftDay] = [shift];
        }

        return acc;
      }, {} as Record<string, IShift[]>);

    setDayShiftMap(shiftsByDay);
  }, [shifts]);

  return (
    <>
      <SimpleModal
        isOpen={isNewShiftModalOpen}
        toggleIsOpen={() => setIsNewShiftModalOpen(!isNewShiftModalOpen)}
        title={'Add Shift'}
      >
        <div>
          <AddShiftFormContainer
            userJwt={userJwt}
            cleanup={() => {
              setIsNewShiftModalOpen(false);
              refreshShifts();
            }}
          />
        </div>
      </SimpleModal>

      <SimpleModal
        isOpen={Boolean(selectedShift)}
        toggleIsOpen={() => {
          setSelectedShift(null);
          //   refreshShifts();
        }}
        title={'Shift Details'}
      >
        <div>
          <ShiftDetailsContainer
            shift={selectedShift}
            userJwt={userJwt}
            cleanup={() => {
              setSelectedShift(null);
              //   refreshShifts();
            }}
          />
        </div>
      </SimpleModal>

      <div className="flex flex-row">
        {headerText && (
          <p className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
            {headerText}
          </p>
        )}
        {showAddShiftBtn && (
          <button
            type="button"
            onClick={() => setIsNewShiftModalOpen(true)}
            className="mb-2 ml-4 inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-2 mr-3 h-5 w-5" aria-hidden="true" />
            <span>Add Shift</span>
          </button>
        )}
      </div>

      <ul>
        {Object.keys(dayShiftMap).map((dayInMs) => {
          return (
            <ul key={dayInMs} className="py-2">
              <h3 className="text-2xl font-semibold">
                {format(parseInt(dayInMs), 'E, LLL dd')}
              </h3>
              <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-3">
                {dayShiftMap[dayInMs].map((shift) => {
                  return (
                    shift.ownerUrn && (
                      <li
                        key={shift.id}
                        className="cursor-pointer border-b-2 py-2"
                        onClick={() => setSelectedShift(shift)}
                      >
                        <div className="flex flex-row items-center gap-x-4">
                          <span
                            className={cx(
                              'bg-white-400 inline-flex h-12 w-12 items-center justify-center rounded-full outline',
                              {
                                'bg-orange-300':
                                  self?.id && shift.ownerUrn.includes(self.id),
                                'bg-green-300':
                                  self?.id &&
                                  shift.assignedTo?.includes(self.id),
                                'bg-blue-300': shift.status === 'open',
                                'bg-red-300':
                                  shift.status === 'filled' &&
                                  !(
                                    self?.id &&
                                    shift.assignedTo?.includes(self.id)
                                  ),
                              }
                            )}
                          >
                            <span className="text-xl font-medium leading-none text-black">
                              {shift?.status?.charAt(0).toUpperCase()}
                            </span>
                          </span>
                          <div className="flex-col flex">
                            <p className="text-gray-500">
                              {format(shift.startTimeMs, 'M/dd h:mm b')} -{' '}
                              {format(shift.endTimeMs, 'h:mm b')}
                            </p>
                            <p className="font-medium">{shift.name}</p>

                            <p className="font-light">
                              Created by: {shift.ownerUrn.slice(0, 15)}
                            </p>
                          </div>
                        </div>
                      </li>
                    )
                  );
                })}
              </div>
            </ul>
          );
        })}
      </ul>
    </>
  );
}

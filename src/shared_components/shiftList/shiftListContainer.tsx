import { IShift } from '@/features/orgShiftsSlice';
import ShiftDetailsContainer from '@/pages_components/org/shiftCalendar/shiftDetailsContainer';
import { format, lightFormat } from 'date-fns';
import { useEffect, useState } from 'react';
import SimpleModal from '../simpleModal';

interface Props {
  userJwt: string;
  shifts: IShift[];
}

export default function ShiftListContainer({ shifts, userJwt }: Props) {
  const [dayShiftMap, setDayShiftMap] = useState<Record<string, IShift[]>>({});
  const [selectedShift, setSelectedShift] = useState<IShift | null>(null);

  useEffect(() => {
    const shiftsByDay = [...shifts]
      .sort((shiftA, shiftB) => {
        return shiftB.startTimeMs - shiftA.startTimeMs;
      })
      .filter((shift) => Boolean(shift.ownerUrn))
      .reduce((acc, shift) => {
        const shiftDay = lightFormat(new Date(shift.startTimeMs), 'yyyy-MM-dd');
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
      <ul>
        {Object.keys(dayShiftMap).map((day) => {
          return (
            <ul key={day} className="py-2">
              <h3 className="text-2xl font-semibold">{day}</h3>
              {dayShiftMap[day].map((shift) => {
                return (
                  shift.ownerUrn && (
                    <li
                      key={shift.id}
                      className="cursor-pointer border-b-2 py-2"
                      onClick={() => setSelectedShift(shift)}
                    >
                      <div className="flex flex-row items-center gap-x-4">
                        <span className="bg-white-400 inline-flex h-12 w-12 items-center justify-center rounded-full outline">
                          <span className="text-xl font-medium leading-none text-black">
                            {shift?.status?.charAt(0).toUpperCase()}
                          </span>
                        </span>
                        <div className="flex flex-col">
                          <p className="text-gray-500">
                            {format(shift.startTimeMs, 'M/dd h:mm b')} -{' '}
                            {format(shift.endTimeMs, 'h:mm b')}
                          </p>
                          <p className="font-medium">{shift.name}</p>

                          <p>Created by: {shift.ownerUrn.slice(0, 15)}</p>
                        </div>
                      </div>
                    </li>
                  )
                );
              })}
            </ul>
          );
        })}
      </ul>
    </>
  );
}
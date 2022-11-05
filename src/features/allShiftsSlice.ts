import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { IShift } from '@/features/orgShiftsSlice';
import { API_URL } from '@/util/walletApiUtil';
import { isSameDay, isSameWeek } from 'date-fns';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export interface AllShiftsState {
  shifts: IShift[];
  status: RequestStatus;
  error: string | null | undefined;
}

const initialState: AllShiftsState = {
  shifts: [],
  status: 'idle',
  error: null,
};

export const allShiftsSlice = createSlice({
  name: 'allShifts',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setAllShiftsStatus: (state, action: PayloadAction<RequestStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllShifts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllShifts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shifts = action.payload;
      })
      .addCase(fetchAllShifts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const fetchAllShifts = createAsyncThunk(
  'allShifts/fetchAllShifts',
  async ({ jwtToken }: { jwtToken: string }) => {
    const rawShifts = await axios.get<IShift[]>(`${API_URL}/shift`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const shifts = rawShifts.data;

    return shifts;
  }
);

export const selectRootAllShifts = (state: RootState) => state.allShifts;
export const selectAllShifts = createSelector(
  [selectRootAllShifts],
  (root) => root.shifts
);
export const selectAllShiftsStatus = createSelector(
  [selectRootAllShifts],
  (root) => root.status
);

export const selectAllShiftsOrderedByEarliestStartTime = createSelector(
  [selectAllShifts],
  (shifts) => {
    return [...shifts].sort((a, b) => {
      const aStart = new Date(a.startTimeMs);
      const aHour = aStart.getHours();
      const bStart = new Date(b.startTimeMs);
      const bHour = bStart.getHours();

      return aHour - bHour;
    });
  }
);

export const selectAllShiftsInWeek = createSelector(
  [
    selectAllShiftsOrderedByEarliestStartTime,
    (state, startDay: Date) => startDay,
  ],
  (shifts, startDay) => {
    return shifts.filter((shift) =>
      isSameWeek(new Date(shift.startTimeMs), startDay)
    );
  }
);

export const selectAllShiftsInDay = createSelector(
  [
    selectAllShiftsOrderedByEarliestStartTime,
    (state, startDay: Date) => startDay,
  ],
  (shifts, startDay) => {
    return shifts.filter((shift) =>
      isSameDay(new Date(shift.startTimeMs), startDay)
    );
  }
);

export const { reset, setAllShiftsStatus } = allShiftsSlice.actions;
export default allShiftsSlice.reducer;

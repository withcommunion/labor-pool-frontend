import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';
import { isSameDay, isSameWeek } from 'date-fns';
import { IUser } from './selfSlice';
import { IOrg } from './orgSlice';

export interface IShift {
  id: string;
  name: string;
  orgId: string;
  ownerUrn: string;
  status: 'open' | 'broadcasting' | 'applied' | 'filled' | 'expired';
  location?: string;
  description: string;
  assignedTo: string[];
  assignedToEntities?: {
    user?: IUser;
    org?: IOrg;
  }[];
  ownerEntity?: {
    user?: IUser;
    org?: IOrg;
  };
  startTimeMs: number;
  endTimeMs: number;
  startDateIso: string;
  endDateIso: string;
  createdAtMs: number;
  updatedAtMs: number;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export interface OrgShiftsState {
  shifts: IShift[];
  status: RequestStatus;
  error: string | null | undefined;
}

const initialState: OrgShiftsState = {
  shifts: [],
  status: 'idle',
  error: null,
};

export const orgShiftsSlice = createSlice({
  name: 'orgShifts',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setOrgShiftsStatus: (state, action: PayloadAction<RequestStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrgShifts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrgShifts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shifts = action.payload;
      })
      .addCase(fetchOrgShifts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const fetchOrgShifts = createAsyncThunk(
  'orgShifts/fetchOrgShifts',
  async ({ jwtToken, orgId }: { jwtToken: string; orgId: string }) => {
    const rawShifts = await axios.get<IShift[]>(
      `${API_URL}/org/${orgId}/shifts`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const shifts = rawShifts.data;

    return shifts;
  }
);

export const selectRootOrgShifts = (state: RootState) => state.orgShifts;
export const selectOrgShifts = createSelector(
  [selectRootOrgShifts],
  (root) => root.shifts
);
export const selectOrgShiftsStatus = createSelector(
  [selectRootOrgShifts],
  (root) => root.status
);

export const selectOrgShiftsOrderedByEarliestStartTime = createSelector(
  [selectOrgShifts],
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

export const selectOrgShiftsInWeek = createSelector(
  [
    selectOrgShiftsOrderedByEarliestStartTime,
    (state, startDay: Date) => startDay,
  ],
  (shifts, startDay) => {
    return shifts.filter((shift) =>
      isSameWeek(new Date(shift.startTimeMs), startDay)
    );
  }
);

export const selectOrgShiftsInDay = createSelector(
  [
    selectOrgShiftsOrderedByEarliestStartTime,
    (state, startDay: Date) => startDay,
  ],
  (shifts, startDay) => {
    return shifts.filter((shift) =>
      isSameDay(new Date(shift.startTimeMs), startDay)
    );
  }
);

export const { reset, setOrgShiftsStatus } = orgShiftsSlice.actions;
export default orgShiftsSlice.reducer;

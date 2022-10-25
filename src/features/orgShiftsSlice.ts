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

export interface IShift {
  id: string;
  name: string;
  orgId: string;
  status: 'open' | 'broadcasting' | 'applied' | 'filled' | 'expired';
  description: string;
  assignedTo: string;
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

export const { reset, setOrgShiftsStatus } = orgShiftsSlice.actions;
export default orgShiftsSlice.reducer;

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
import { IShift } from './orgShiftsSlice';
import { formatISO } from 'date-fns';

export interface INewShiftParams {
  name: string;
  orgId: string;
  startDate: string;
  endDate: string;
  ownerUrn?: string;
  location?: string;
  description?: string;
  status?: string;
  assignedTo?: string;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export interface OrgNewShiftState {
  newShift: IShift | null;
  status: RequestStatus;
  error: string | null | undefined;
}

const initialState: OrgNewShiftState = {
  newShift: null,
  status: 'idle',
  error: null,
};

export const orgNewShiftSlice = createSlice({
  name: 'orgNewShift',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setNewOrgShiftStatus: (state, action: PayloadAction<RequestStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostOrgShift.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostOrgShift.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newShift = action.payload;
      })
      .addCase(fetchPostOrgShift.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPatchOrgShift.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatchOrgShift.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newShift = action.payload;
      })
      .addCase(fetchPatchOrgShift.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const fetchPostOrgShift = createAsyncThunk(
  'orgNewShift/fetchPostOrgShift',
  async ({ jwtToken, shift }: { jwtToken: string; shift: INewShiftParams }) => {
    const startDate = formatISO(new Date(shift.startDate));
    const endDate = formatISO(new Date(shift.endDate));

    const rawShift = await axios.post<IShift>(
      `${API_URL}/shift`,
      { ...shift, startDate, endDate },
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const parsedShift = rawShift.data;

    return parsedShift;
  }
);

export const fetchPatchOrgShift = createAsyncThunk(
  'orgNewShift/fetchPatchOrgShift',
  async ({
    jwtToken,
    shift,
    shiftId,
  }: {
    jwtToken: string;
    shift: INewShiftParams;
    shiftId: string;
  }) => {
    const startDate = formatISO(new Date(shift.startDate));
    const endDate = formatISO(new Date(shift.endDate));

    const rawShift = await axios.patch<IShift>(
      `${API_URL}/shift/${shiftId}`,
      { ...shift, startDate, endDate },
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const parsedShift = rawShift.data;

    return parsedShift;
  }
);

export const selectRootOrgShifts = (state: RootState) => state.orgNewShift;
export const selectOrgNewShift = createSelector(
  [selectRootOrgShifts],
  (root) => root.newShift
);
export const selectOrgNewShiftStatus = createSelector(
  [selectRootOrgShifts],
  (root) => root.status
);

export const { reset, setNewOrgShiftStatus } = orgNewShiftSlice.actions;
export default orgNewShiftSlice.reducer;

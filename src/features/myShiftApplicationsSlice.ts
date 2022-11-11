import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';
import { ShiftApplication } from './shiftApplicationActionsSlice';
import { getTime, startOfToday } from 'date-fns';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface MyShiftApplicationsState {
  myShiftApplications: {
    shiftApplications: ShiftApplication[];
    status: RequestStatus;
    error: string | null | undefined;
  };
  deleteShiftApplication: {
    deleteResponse: boolean;
    status: RequestStatus;
    error: string | null | undefined;
  };
}

const initialState: MyShiftApplicationsState = {
  myShiftApplications: {
    shiftApplications: [],
    status: 'idle',
    error: null,
  },
  deleteShiftApplication: {
    deleteResponse: false,
    status: 'idle',
    error: null,
  },
};

export const myShiftApplicationsSlice = createSlice({
  name: 'myShiftApplications',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGetShiftApplications.pending, (state) => {
        state.myShiftApplications.status = 'loading';
      })
      .addCase(fetchGetShiftApplications.fulfilled, (state, action) => {
        state.myShiftApplications.status = 'succeeded';
        state.myShiftApplications.shiftApplications = action.payload;
      })
      .addCase(fetchGetShiftApplications.rejected, (state, action) => {
        state.myShiftApplications.status = 'failed';
        state.myShiftApplications.error = action.error.message;
      })
      .addCase(fetchDeleteShiftApplication.pending, (state) => {
        state.deleteShiftApplication.status = 'loading';
      })
      .addCase(fetchDeleteShiftApplication.fulfilled, (state, action) => {
        state.deleteShiftApplication.status = 'succeeded';
        state.deleteShiftApplication.deleteResponse = action.payload;
      })
      .addCase(fetchDeleteShiftApplication.rejected, (state, action) => {
        state.deleteShiftApplication.status = 'failed';
        state.deleteShiftApplication.error = action.error.message;
      });
  },
});

export const fetchGetShiftApplications = createAsyncThunk(
  'myShiftApplications/fetchGetShiftApplications',
  async ({
    jwtToken,
    userId,
    orgId,
  }: {
    jwtToken: string;
    userId?: string;
    orgId?: string;
  }) => {
    const url = userId
      ? `${API_URL}/user/${userId}/shifts/applications`
      : `${API_URL}/org/${orgId || ''}/shifts/applications`;

    const rawShiftApplication = await axios.get<ShiftApplication[]>(url, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const parsedShiftApplication = rawShiftApplication.data;

    return parsedShiftApplication;
  }
);

export const fetchDeleteShiftApplication = createAsyncThunk(
  'myShiftApplications/fetchDeleteShiftApplication',
  async ({
    jwtToken,
    applicationId,
  }: {
    jwtToken: string;
    applicationId: string;
  }) => {
    const rawRequest = await axios.delete<boolean>(
      `${API_URL}/shift/application/${applicationId}`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const deletedShiftApplication = rawRequest.data;

    return deletedShiftApplication;
  }
);

export const selectRootShiftActions = (state: RootState) =>
  state.myShiftApplications;

export const selectRootMyShiftApplications = createSelector(
  [selectRootShiftActions],
  (root) => root.myShiftApplications
);
export const selectMyShiftApplications = createSelector(
  [selectRootMyShiftApplications],
  (root) => root.shiftApplications
);
export const selectMyShiftApplicationsOrderedByTime = createSelector(
  [selectMyShiftApplications],
  (applications) => {
    return [...applications].sort((a, b) => {
      const aStart = getTime(new Date(a.createdAtMs));
      const bStart = getTime(new Date(b.createdAtMs));

      return bStart - aStart;
    });
  }
);

export const selectMyShiftApplicationsStatus = createSelector(
  [selectRootMyShiftApplications],
  (root) => root.status
);

export const selectPendingShiftApplications = createSelector(
  [selectMyShiftApplications],
  (applications) => applications.filter((app) => app.status === 'pending')
);

export const { reset } = myShiftApplicationsSlice.actions;
export default myShiftApplicationsSlice.reducer;

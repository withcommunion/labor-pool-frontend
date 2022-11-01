import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ShiftApplication {
  id: string;
  shiftId: string;
  orgId: string;
  userId: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ShiftActionsState {
  applyToShift: {
    shiftApplication: ShiftApplication | null;
    status: RequestStatus;
    error: string | null | undefined;
  };
  acceptRejectShiftApplication: {
    shiftApplication: ShiftApplication | null;
    status: RequestStatus;
    error: string | null | undefined;
  };
  shiftApplications: {
    shiftApplications: ShiftApplication[] | [];
    status: RequestStatus;
    error: string | null | undefined;
  };
}

const initialState: ShiftActionsState = {
  applyToShift: {
    shiftApplication: null,
    status: 'idle',
    error: null,
  },
  acceptRejectShiftApplication: {
    shiftApplication: null,
    status: 'idle',
    error: null,
  },
  shiftApplications: {
    shiftApplications: [],
    status: 'idle',
    error: null,
  },
};

export const shiftActionsSlice = createSlice({
  name: 'shiftActions',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostShiftApplication.pending, (state) => {
        state.applyToShift.status = 'loading';
      })
      .addCase(fetchPostShiftApplication.fulfilled, (state, action) => {
        state.applyToShift.status = 'succeeded';
        state.applyToShift.shiftApplication = action.payload;
      })
      .addCase(fetchPostShiftApplication.rejected, (state, action) => {
        state.applyToShift.status = 'failed';
        state.applyToShift.error = action.error.message;
      })
      .addCase(fetchGetShiftApplications.pending, (state) => {
        state.shiftApplications.status = 'loading';
      })
      .addCase(fetchGetShiftApplications.fulfilled, (state, action) => {
        state.shiftApplications.status = 'succeeded';
        state.shiftApplications.shiftApplications = action.payload;
      })
      .addCase(fetchGetShiftApplications.rejected, (state, action) => {
        state.shiftApplications.status = 'failed';
        state.shiftApplications.error = action.error.message;
      });
  },
});

interface IShiftApplicationBody {
  shiftId: string;
  orgId: string;
  userId: string;
  description: string;
}
export const fetchPostShiftApplication = createAsyncThunk(
  'shiftActions/fetchPostShiftApplication',
  async ({
    jwtToken,
    shiftApplication,
  }: {
    jwtToken: string;
    shiftApplication: IShiftApplicationBody;
  }) => {
    const rawShiftApplication = await axios.post<ShiftApplication>(
      `${API_URL}/shift/${shiftApplication.shiftId}/application`,
      shiftApplication,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const parsedShiftApplication = rawShiftApplication.data;

    return parsedShiftApplication;
  }
);

export const fetchPatchShiftAcceptRejectApplication = createAsyncThunk(
  'shiftActions/fetchPatchShiftAcceptRejectApplication',
  async ({
    jwtToken,
    shiftApplicationId,
    status,
  }: {
    jwtToken: string;
    shiftApplicationId: string;
    status: 'accepted' | 'rejected';
  }) => {
    const rawShiftApplication = await axios.patch<ShiftApplication>(
      `${API_URL}/shift/application/${shiftApplicationId}/status`,
      { status },
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const parsedShiftApplication = rawShiftApplication.data;

    return parsedShiftApplication;
  }
);

export const fetchGetShiftApplications = createAsyncThunk(
  'shiftActions/fetchGetShiftApplications',
  async ({ jwtToken, shiftId }: { jwtToken: string; shiftId: string }) => {
    const rawShiftApplication = await axios.get<ShiftApplication[]>(
      `${API_URL}/shift/${shiftId}/applications`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const parsedShiftApplication = rawShiftApplication.data;

    return parsedShiftApplication;
  }
);

export const selectRootShiftActions = (state: RootState) => state.shiftActions;

export const selectRootShiftApplication = createSelector(
  [selectRootShiftActions],
  (root) => root.applyToShift
);
export const selectShiftApplicationResponse = createSelector(
  [selectRootShiftApplication],
  (root) => root.shiftApplication
);
export const selectShiftApplicationStatus = createSelector(
  [selectRootShiftApplication],
  (root) => root.status
);
export const selectShiftApplicationRespError = createSelector(
  [selectRootShiftApplication],
  (root) => root.error
);

export const selectRootShiftApplications = createSelector(
  [selectRootShiftActions],
  (root) => root.shiftApplications
);
export const selectShiftApplications = createSelector(
  [selectRootShiftApplications],
  (root) => root.shiftApplications
);
export const selectShiftApplicationsStatus = createSelector(
  [selectRootShiftApplications],
  (root) => root.status
);
export const selectShiftApplicationsRespError = createSelector(
  [selectRootShiftApplications],
  (root) => root.error
);

export const { reset } = shiftActionsSlice.actions;
export default shiftActionsSlice.reducer;

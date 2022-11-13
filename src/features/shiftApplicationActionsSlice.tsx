import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';
import { IUser } from './selfSlice';
import { IOrg } from './orgSlice';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ShiftApplication {
  id: string;
  shiftId: string;
  orgId: string;
  userId: string;
  ownerUrn: string;
  description: string;
  ownerEntity?: {
    user?: IUser;
    org?: IOrg;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAtMs: number;
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
  deleteShiftApplication: {
    deleteResponse: boolean;
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
  deleteShiftApplication: {
    deleteResponse: false,
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

interface IShiftApplicationBody {
  shiftId: string;
  description: string;
  ownerUrn: string;
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
    console.log(shiftApplication);
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

export const fetchDeleteShiftApplication = createAsyncThunk(
  'shiftActions/fetchDeleteShiftApplication',
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
export const selectPendingShiftApplications = createSelector(
  [selectShiftApplications],
  (applications) => applications.filter((app) => app.status === 'pending')
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

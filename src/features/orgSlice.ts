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

interface IOrg {
  id: string;
  name: string;
  primaryMembers: string[];
  friends: string[];
  schedules: string[];
  joinCode: string;
  createdAtMs: number;
  updatedAtMs: number;
}

// Define a type for the slice state
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export interface OrgState {
  org: IOrg | null;
  status: RequestStatus;
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: OrgState = {
  org: null,
  status: 'idle',
  error: null,
};

export const orgSlice = createSlice({
  name: 'org',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setOrgStatus: (state, action: PayloadAction<RequestStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrg.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrg.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.org = action.payload;
      })
      .addCase(fetchOrg.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const fetchOrg = createAsyncThunk(
  'org/fetchOrg',
  async ({ jwtToken, orgId }: { jwtToken: string; orgId: string }) => {
    const rawOrg = await axios.get<IOrg>(`${API_URL}/org/${orgId}`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const org = rawOrg.data;

    return org;
  }
);

export const selectRootOrg = (state: RootState) => state.org;
export const selectOrg = createSelector([selectRootOrg], (root) => root.org);
export const selectOrgStatus = createSelector(
  [selectRootOrg],
  (root) => root.status
);

export const { reset, setOrgStatus } = orgSlice.actions;
export default orgSlice.reducer;

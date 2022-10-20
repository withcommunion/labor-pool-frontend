import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  orgs: string[];
  orgRoles: { orgId: string; role: string }[];
  shiftHistory: string[];
  phoneNumber: string;
  allowSms: boolean;
  email: string;
  createdAtMs: number;
  updatedAtMs: number;
}

// Define a type for the slice state
export interface SelfState {
  self: IUser | null;
  selfUserId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: SelfState = {
  self: null,
  selfUserId: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'self',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    selfUserIdSet: (state, action: PayloadAction<string>) => {
      state.selfUserId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSelf.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSelf.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.self = action.payload;
      })
      .addCase(fetchSelf.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const fetchSelf = createAsyncThunk(
  'self/fetchSelf',
  async (jwtToken: string) => {
    const rawSelf = await axios.get<IUser>(`${API_URL}/user/`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const self = rawSelf.data;

    return self;
  }
);

export const selectRootSelf = (state: RootState) => state.self;
export const selectSelf = createSelector([selectRootSelf], (root) => root.self);
export const selectSelfStatus = createSelector(
  [selectRootSelf],
  (root) => root.status
);
export const selectSelfUserId = createSelector(
  [selectRootSelf],
  (root) => root.selfUserId
);

export const { reset, selfUserIdSet } = userSlice.actions;
export default userSlice.reducer;

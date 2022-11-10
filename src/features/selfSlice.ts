import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  orgs: string[];
  orgRoles: { orgId: string; role: string }[];
  shiftHistory: string[];
  phoneNumber: string;
  allowSms: boolean;
  email: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface SelfState {
  self: IUser | null;
  selfUserId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
  selfActingAsOrg: {
    orgId: string | null;
    active: boolean;
  };
  patchSelf: {
    updated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
}

// Define the initial state using that type
const initialState: SelfState = {
  self: null,
  selfUserId: null,
  status: 'idle',
  error: null,
  selfActingAsOrg: {
    orgId: null,
    active: false,
  },
  patchSelf: {
    updated: false,
    status: 'idle',
    error: null,
  },
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
    selfActingAsOrgSet: (
      state,
      action: PayloadAction<{ orgId: string | null; active: boolean }>
    ) => {
      state.selfActingAsOrg = action.payload;
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
      })
      .addCase(fetchPatchSelf.pending, (state) => {
        state.patchSelf.status = 'loading';
      })
      .addCase(fetchPatchSelf.fulfilled, (state, action) => {
        state.patchSelf.status = 'succeeded';
        state.patchSelf.updated = action.payload;
      })
      .addCase(fetchPatchSelf.rejected, (state, action) => {
        state.patchSelf.status = 'failed';
        state.patchSelf.error = action.error.message;
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

export const fetchPatchSelf = createAsyncThunk(
  'self/patchSelf',
  async ({ jwtToken, self }: { jwtToken: string; self: Partial<IUser> }) => {
    const rawUpdateSelf = await axios.patch<boolean>(`${API_URL}/user/`, self, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const updateSelf = rawUpdateSelf.data;

    return updateSelf;
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

export const selectIsOnOrgLeadershipTeam = createSelector(
  [selectSelf, (state, orgId: string) => orgId],
  (self, orgId) =>
    Boolean(self?.orgRoles.find((orgRole) => orgRole.orgId === orgId))
);

export const selectSelfActingAsOrg = createSelector(
  [selectRootSelf],
  (root) => root.selfActingAsOrg
);

export const selectRootPatchSelf = createSelector(
  [selectRootSelf],
  (root) => root.patchSelf
);
export const selectPatchSelfStatus = createSelector(
  [selectRootPatchSelf],
  (root) => root.status
);

export const { reset, selfUserIdSet, selfActingAsOrgSet } = userSlice.actions;
export default userSlice.reducer;

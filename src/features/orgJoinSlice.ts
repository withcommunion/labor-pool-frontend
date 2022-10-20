import axios from 'axios';
import type { RootState } from '@/reduxStore';

import {
  createSlice,
  createAsyncThunk,
  createSelector,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';

// Define a type for the slice state
export interface OrgJoinState {
  memberJoin: {
    joinResp: Record<string, unknown> | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
  friendlyOrgJoin: {
    joinResp: Record<string, unknown> | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
}

// Define the initial state using that type
const initialState: OrgJoinState = {
  memberJoin: {
    joinResp: null,
    status: 'idle',
    error: null,
  },
  friendlyOrgJoin: {
    joinResp: null,
    status: 'idle',
    error: null,
  },
};

export const orgJoinSlice = createSlice({
  name: 'orgJoin',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostOrgMemberJoin.pending, (state) => {
        state.memberJoin.status = 'loading';
      })
      .addCase(fetchPostOrgMemberJoin.fulfilled, (state, action) => {
        state.memberJoin.status = 'succeeded';
        state.memberJoin.joinResp = action.payload;
      })
      .addCase(fetchPostOrgMemberJoin.rejected, (state, action) => {
        state.memberJoin.status = 'failed';
        state.memberJoin.error = action.error.message;
      })
      .addCase(fetchPostOrgFriendlyOrgJoin.pending, (state) => {
        state.friendlyOrgJoin.status = 'loading';
      })
      .addCase(fetchPostOrgFriendlyOrgJoin.fulfilled, (state, action) => {
        state.friendlyOrgJoin.status = 'succeeded';
        state.friendlyOrgJoin.joinResp = action.payload;
      })
      .addCase(fetchPostOrgFriendlyOrgJoin.rejected, (state, action) => {
        state.friendlyOrgJoin.status = 'failed';
        state.friendlyOrgJoin.error = action.error.message;
      });
  },
});

export const fetchPostOrgMemberJoin = createAsyncThunk(
  'orgJoin/fetchPostOrgMemberJoin',
  async ({
    orgId,
    memberId,
    role,
    jwtToken,
  }: {
    orgId: string;
    memberId: string;
    role: string;
    jwtToken: string;
  }) => {
    const rawOrgResp = await axios.post<Record<string, unknown>>(
      `${API_URL}/org/${orgId}/member`,
      { memberId, role },
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const joinedOrg = rawOrgResp.data;

    return joinedOrg;
  }
);

export const fetchPostOrgFriendlyOrgJoin = createAsyncThunk(
  'orgJoin/fetchPostOrgFriendlyOrgJoin',
  async ({
    orgId,
    friendlyOrgId,
    jwtToken,
  }: {
    orgId: string;
    friendlyOrgId: string;
    jwtToken: string;
  }) => {
    const rawOrgResp = await axios.post<Record<string, unknown>>(
      `${API_URL}/org/${orgId}/friend`,
      { friendlyOrgId },
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const joinedOrg = rawOrgResp.data;

    return joinedOrg;
  }
);

export const selectRootOrgJoin = (state: RootState) => state.orgJoin;

export const selectRootMemberJoin = createSelector(
  [selectRootOrgJoin],
  (root) => root.memberJoin
);
export const selectMemberJoinStatus = createSelector(
  [selectRootMemberJoin],
  (root) => root.status
);
export const selectMemberJoinResp = createSelector(
  [selectRootMemberJoin],
  (root) => root.joinResp
);
export const selectMemberJoinError = createSelector(
  [selectRootMemberJoin],
  (root) => root.error
);

export const selectRootFriendlyOrgJoin = createSelector(
  [selectRootOrgJoin],
  (root) => root.friendlyOrgJoin
);
export const selectFriendlyOrgJoinStatus = createSelector(
  [selectRootFriendlyOrgJoin],
  (root) => root.status
);
export const selectFriendlyOrgJoinResp = createSelector(
  [selectRootFriendlyOrgJoin],
  (root) => root.joinResp
);
export const selectFriendlyOrgJoinError = createSelector(
  [selectRootFriendlyOrgJoin],
  (root) => root.error
);

export const { reset } = orgJoinSlice.actions;
export default orgJoinSlice.reducer;

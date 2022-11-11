import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';
import { IUser } from '@/features/selfSlice';
import { IOrg } from './orgSlice';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface EntityByIdState {
  entityByIdSocials: {
    following: { users: IUser[]; orgs: IOrg[] };
    followers: { users: IUser[]; orgs: IOrg[] };
    status: RequestStatus;
    error: string | null | undefined;
  };
}

const initialState: EntityByIdState = {
  entityByIdSocials: {
    following: { users: [], orgs: [] },
    followers: { users: [], orgs: [] },
    status: 'idle',
    error: null,
  },
};

export const userByIdSlice = createSlice({
  name: 'entityById',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGetEntityByIdSocials.pending, (state) => {
        state.entityByIdSocials.status = 'loading';
      })
      .addCase(fetchGetEntityByIdSocials.fulfilled, (state, action) => {
        state.entityByIdSocials.status = 'succeeded';
        state.entityByIdSocials.followers = action.payload.followers;
        state.entityByIdSocials.following = action.payload.following;
      })
      .addCase(fetchGetEntityByIdSocials.rejected, (state, action) => {
        state.entityByIdSocials.status = 'failed';
        state.entityByIdSocials.error = action.error.message;
      });
  },
});

export const fetchGetEntityByIdSocials = createAsyncThunk(
  'entityById/fetchGetEntityByIdSocials',
  async ({ jwtToken, entityUrn }: { jwtToken: string; entityUrn: string }) => {
    const rawSocials = await axios.get<{
      following: { users: IUser[]; orgs: IOrg[] };
      followers: { users: IUser[]; orgs: IOrg[] };
    }>(`${API_URL}/entity/${entityUrn}/socials`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const socials = rawSocials.data;

    return socials;
  }
);

const selectRootEntityById = (state: RootState) => state.entityById;

const selectRootEntityByIdSocials = createSelector(
  [selectRootEntityById],
  (root) => root.entityByIdSocials
);
export const selectEntityByIdSocials = createSelector(
  [selectRootEntityByIdSocials],
  (root) => ({ followers: root.followers, following: root.following })
);
export const selectEntityByIdSocialsStatus = createSelector(
  [selectRootEntityByIdSocials],
  (root) => root.status
);
export const selectEntityByIdSocialsError = createSelector(
  [selectRootEntityByIdSocials],
  (root) => root.error
);

export const { reset } = userByIdSlice.actions;
export default userByIdSlice.reducer;

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
import { IShift } from './orgShiftsSlice';
import { IOrg } from './orgSlice';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface OrgByIdState {
  orgById: {
    org: IOrg | null;
    status: RequestStatus;
    error: string | null | undefined;
  };
  orgByIdShifts: {
    shifts: IShift[];
    status: RequestStatus;
    error: string | null | undefined;
  };
  orgByIdSocials: {
    following: { users: IUser[]; orgs: IOrg[] };
    followers: { users: IUser[]; orgs: IOrg[] };
    status: RequestStatus;
    error: string | null | undefined;
  };
}

const initialState: OrgByIdState = {
  orgById: {
    org: null,
    status: 'idle',
    error: null,
  },
  orgByIdShifts: {
    shifts: [],
    status: 'idle',
    error: null,
  },
  orgByIdSocials: {
    following: { users: [], orgs: [] },
    followers: { users: [], orgs: [] },
    status: 'idle',
    error: null,
  },
};

export const orgByIdSlice = createSlice({
  name: 'orgById',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGetOrgById.pending, (state) => {
        state.orgById.status = 'loading';
      })
      .addCase(fetchGetOrgById.fulfilled, (state, action) => {
        state.orgById.status = 'succeeded';
        state.orgById.org = action.payload;
      })
      .addCase(fetchGetOrgById.rejected, (state, action) => {
        state.orgById.status = 'failed';
        state.orgById.error = action.error.message;
      })
      .addCase(fetchGetOrgByIdShifts.pending, (state) => {
        state.orgByIdShifts.status = 'loading';
      })
      .addCase(fetchGetOrgByIdShifts.fulfilled, (state, action) => {
        state.orgByIdShifts.status = 'succeeded';
        state.orgByIdShifts.shifts = action.payload;
      })
      .addCase(fetchGetOrgByIdShifts.rejected, (state, action) => {
        state.orgByIdShifts.status = 'failed';
        state.orgByIdShifts.error = action.error.message;
      })
      .addCase(fetchGetOrgByIdSocials.pending, (state) => {
        state.orgByIdSocials.status = 'loading';
      })
      .addCase(fetchGetOrgByIdSocials.fulfilled, (state, action) => {
        state.orgByIdSocials.status = 'succeeded';
        state.orgByIdSocials.followers = action.payload.followers;
        state.orgByIdSocials.following = action.payload.following;
      })
      .addCase(fetchGetOrgByIdSocials.rejected, (state, action) => {
        state.orgByIdSocials.status = 'failed';
        state.orgByIdSocials.error = action.error.message;
      });
  },
});

export const fetchGetOrgById = createAsyncThunk(
  'orgById/fetchGetOrgById',
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

export const fetchGetOrgByIdShifts = createAsyncThunk(
  'orgById/fetchGetOrgByIdShifts',
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

export const fetchGetOrgByIdSocials = createAsyncThunk(
  'orgById/fetchGetOrgByIdSocials',
  async ({ jwtToken, orgId }: { jwtToken: string; orgId: string }) => {
    const rawOrgSocials = await axios.get<{
      following: { users: IUser[]; orgs: IOrg[] };
      followers: { users: IUser[]; orgs: IOrg[] };
    }>(`${API_URL}/entity/urn:org:${orgId}/socials`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const orgSocial = rawOrgSocials.data;

    return orgSocial;
  }
);

const selectRootOrgById = (state: RootState) => state.orgById;

const selectRootOrg = createSelector(
  [selectRootOrgById],
  (root) => root.orgById
);
export const selectOrgById = createSelector(
  [selectRootOrg],
  (root) => root.org
);
export const selectOrgByIdStatus = createSelector(
  [selectRootOrg],
  (root) => root.status
);
export const selectOrgByIdError = createSelector(
  [selectRootOrg],
  (root) => root.error
);

const selectRootOrgByIdShifts = createSelector(
  [selectRootOrgById],
  (root) => root.orgByIdShifts
);
export const selectOrgByIdShifts = createSelector(
  [selectRootOrgByIdShifts],
  (root) => root.shifts
);
export const selectOrgByIdShiftsStatus = createSelector(
  [selectRootOrgByIdShifts],
  (root) => root.status
);
export const selectOrgByIdShiftsError = createSelector(
  [selectRootOrgByIdShifts],
  (root) => root.error
);

const selectRootOrgByIdSocials = createSelector(
  [selectRootOrgById],
  (root) => root.orgByIdSocials
);
export const selectOrgByIdSocials = createSelector(
  [selectRootOrgByIdSocials],
  (root) => ({ followers: root.followers, following: root.following })
);
export const selectOrgByIdSocialsStatus = createSelector(
  [selectRootOrgByIdSocials],
  (root) => root.status
);
export const selectOrgByIdSocialsError = createSelector(
  [selectRootOrgByIdSocials],
  (root) => root.error
);

export const { reset } = orgByIdSlice.actions;
export default orgByIdSlice.reducer;

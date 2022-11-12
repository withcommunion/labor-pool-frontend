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

export interface IOrgToCreate {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phoneNumber: string;
  email: string;
  facebookHandle?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  website: string;
  logo: string;
  description: string;
}
// Define a type for the slice state
export interface CreatedOrgState {
  createdOrgResp: Record<string, unknown> | null;
  orgToCreate: IOrgToCreate;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: CreatedOrgState = {
  createdOrgResp: null,
  orgToCreate: {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phoneNumber: '',
    facebookHandle: '',
    twitterHandle: '',
    instagramHandle: '',
    email: '',
    website: '',
    logo: '',
    description: '',
  },
  status: 'idle',
  error: null,
};

export const createOrgSlice = createSlice({
  name: 'createOrg',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setOrgToCreateAttributes: (
      state,
      action: PayloadAction<Partial<IOrgToCreate>>
    ) => {
      state.orgToCreate = { ...state.orgToCreate, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostOrg.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostOrg.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.createdOrgResp = action.payload;
      })
      .addCase(fetchPostOrg.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const fetchPostOrg = createAsyncThunk(
  'createOrg/fetchPostOrg',
  async ({
    orgToCreate,
    jwtToken,
  }: {
    orgToCreate: IOrgToCreate;
    jwtToken: string;
  }) => {
    const rawOrgResp = await axios.post<Record<string, unknown>>(
      `${API_URL}/org`,
      { ...orgToCreate },
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const createdOrg = rawOrgResp.data;

    return createdOrg;
  }
);

export const selectRootCreatedOrg = (state: RootState) => state.createdOrg;
export const selectCreatedOrgResp = createSelector(
  [selectRootCreatedOrg],
  (root) => root.createdOrgResp
);
export const selectCreatedOrgStatus = createSelector(
  [selectRootCreatedOrg],
  (root) => root.status
);

export const selectOrgToCreate = createSelector(
  [selectRootCreatedOrg],
  (root) => root.orgToCreate
);

export const { reset, setOrgToCreateAttributes } = createOrgSlice.actions;
export default createOrgSlice.reducer;

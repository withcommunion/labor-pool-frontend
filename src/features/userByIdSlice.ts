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

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface UserByIdState {
  userById: {
    user: IUser | null;
    status: RequestStatus;
    error: string | null | undefined;
  };
  userByIdShifts: {
    shifts: IShift[];
    status: RequestStatus;
    error: string | null | undefined;
  };
}

const initialState: UserByIdState = {
  userById: {
    user: null,
    status: 'idle',
    error: null,
  },
  userByIdShifts: {
    shifts: [],
    status: 'idle',
    error: null,
  },
};

export const userByIdSlice = createSlice({
  name: 'userById',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGetUserById.pending, (state) => {
        state.userById.status = 'loading';
      })
      .addCase(fetchGetUserById.fulfilled, (state, action) => {
        state.userById.status = 'succeeded';
        state.userById.user = action.payload;
      })
      .addCase(fetchGetUserById.rejected, (state, action) => {
        state.userById.status = 'failed';
        state.userById.error = action.error.message;
      });
  },
});

export const fetchGetUserById = createAsyncThunk(
  'userById/fetchGetUserById',
  async ({ jwtToken, userId }: { jwtToken: string; userId: string }) => {
    const rawUser = await axios.get<IUser>(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const user = rawUser.data;

    return user;
  }
);

export const fetchGetUserByIdShifts = createAsyncThunk(
  'userById/fetchGetUserByIdShifts',
  async ({ jwtToken, userId }: { jwtToken: string; userId: string }) => {
    const rawUser = await axios.get<IShift>(
      `${API_URL}/user/${userId}/shifts`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const user = rawUser.data;

    return user;
  }
);

const selectRootUserById = (state: RootState) => state.userById;

const selectRootUser = createSelector(
  [selectRootUserById],
  (root) => root.userById
);
export const selectUserById = createSelector(
  [selectRootUser],
  (root) => root.user
);
export const selectUserByIdStatus = createSelector(
  [selectRootUser],
  (root) => root.status
);
export const selectUserByIdError = createSelector(
  [selectRootUser],
  (root) => root.error
);

const selectRootUserByIdShifts = createSelector(
  [selectRootUserById],
  (root) => root.userByIdShifts
);
export const selectUserByIdShifts = createSelector(
  [selectRootUserByIdShifts],
  (root) => root.shifts
);
export const selectUserByIdShiftsStatus = createSelector(
  [selectRootUserByIdShifts],
  (root) => root.status
);
export const selectUserByIdShiftsError = createSelector(
  [selectRootUserByIdShifts],
  (root) => root.error
);

export const { reset } = userByIdSlice.actions;
export default userByIdSlice.reducer;

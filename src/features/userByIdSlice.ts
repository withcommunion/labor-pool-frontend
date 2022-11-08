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

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface UserByIdState {
  user: IUser | null;
  status: RequestStatus;
  error: string | null | undefined;
}

const initialState: UserByIdState = {
  user: null,
  status: 'idle',
  error: null,
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
        state.status = 'loading';
      })
      .addCase(fetchGetUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchGetUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
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

export const selectRootUserById = (state: RootState) => state.userById;

export const selectUser = createSelector(
  [selectRootUserById],
  (root) => root.user
);
export const selectUserByIdStatus = createSelector(
  [selectRootUserById],
  (root) => root.status
);
export const selectUserByIdError = createSelector(
  [selectRootUserById],
  (root) => root.status
);

export const { reset } = userByIdSlice.actions;
export default userByIdSlice.reducer;

import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  //   PayloadAction,
} from '@reduxjs/toolkit';

import { API_URL } from '@/util/walletApiUtil';

export interface IEvent {
  id: string;
  eventUrn: string;
  ownerUrn: string;
  event: string;
  description: string;
  record: object;
  createdAtMs: number;
  updatedAtMs: number;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface FeedState {
  feedById: {
    events: IEvent[];
    status: RequestStatus;
    error: string | null | undefined;
  };
  allFeed: {
    events: IEvent[];
    status: RequestStatus;
    error: string | null | undefined;
  };
}

const initialState: FeedState = {
  feedById: {
    events: [],
    status: 'idle',
    error: null,
  },
  allFeed: {
    events: [],
    status: 'idle',
    error: null,
  },
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFeedByEntityUrn.pending, (state) => {
        state.feedById.status = 'loading';
      })
      .addCase(fetchFeedByEntityUrn.fulfilled, (state, action) => {
        state.feedById.status = 'succeeded';
        state.feedById.events = action.payload;
      })
      .addCase(fetchFeedByEntityUrn.rejected, (state, action) => {
        state.feedById.status = 'failed';
        state.feedById.error = action.error.message;
      })
      .addCase(fetchAllEntitiesFeed.pending, (state) => {
        state.allFeed.status = 'loading';
      })
      .addCase(fetchAllEntitiesFeed.fulfilled, (state, action) => {
        state.allFeed.status = 'succeeded';
        state.allFeed.events = action.payload;
      })
      .addCase(fetchAllEntitiesFeed.rejected, (state, action) => {
        state.allFeed.status = 'failed';
        state.allFeed.error = action.error.message;
      });
  },
});

export const fetchFeedByEntityUrn = createAsyncThunk(
  'feed/fetchFeedByEntityUrn',
  async ({ jwtToken, entityUrn }: { jwtToken: string; entityUrn: string }) => {
    const rawEntityFeed = await axios.get<IEvent[]>(
      `${API_URL}/entity/${entityUrn}/events`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const entityFeed = rawEntityFeed.data;

    return entityFeed;
  }
);

export const fetchAllEntitiesFeed = createAsyncThunk(
  'feed/fetchAllEntitiesFeed',
  async ({ jwtToken }: { jwtToken: string }) => {
    const rawEntityFeed = await axios.get<IEvent[]>(`${API_URL}/event`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const entityFeed = rawEntityFeed.data;

    return entityFeed;
  }
);

const selectRootFeed = (state: RootState) => state.feed;

const selectRootFeedById = createSelector(
  [selectRootFeed],
  (root) => root.feedById
);
export const selectFeedById = createSelector(
  [selectRootFeedById],
  (root) => root.events
);
export const selectFeedByIdStatus = createSelector(
  [selectRootFeedById],
  (root) => root.status
);
export const selectFeedByIdError = createSelector(
  [selectRootFeedById],
  (root) => root.error
);

const selectRootAllFeed = createSelector(
  [selectRootFeed],
  (root) => root.allFeed
);
export const selectAllFeed = createSelector(
  [selectRootAllFeed],
  (root) => root.events
);
export const selectAllFeedStatus = createSelector(
  [selectRootAllFeed],
  (root) => root.status
);
export const selectAllFeedError = createSelector(
  [selectRootAllFeed],
  (root) => root.error
);

export const { reset } = feedSlice.actions;
export default feedSlice.reducer;

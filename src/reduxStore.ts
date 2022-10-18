import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import selfReducer from '@/features/selfSlice';
import createOrgReducer from '@/features/createOrgSlice';

const store = configureStore({
  reducer: {
    // These are just an example
    counter: counterReducer,
    self: selfReducer,
    createdOrg: createOrgReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

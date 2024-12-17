import { configureStore } from '@reduxjs/toolkit';
import roundReducer from './state/round/reducers';

export const store = configureStore({
  reducer: {
    round: roundReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

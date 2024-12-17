import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoundState {
  rounds: Array<any>;
}

const initialState: RoundState = {
  rounds: [],
};

export const roundSlice = createSlice({
  name: 'round',
  initialState,
  reducers: {
    setRound: (state, action: PayloadAction<any>) => {
      state.rounds = action.payload;
    },
    updateRound: (state, action: PayloadAction<any>) => {
      // Mettre à jour les rounds ici
    },
  },
});

export const { setRound, updateRound } = roundSlice.actions;
export default roundSlice.reducer;

import { RootState } from "../../store";


export const selectRoundState = (state: RootState) => state.round.rounds;

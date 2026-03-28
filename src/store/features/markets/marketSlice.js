import { createSlice } from '@reduxjs/toolkit'

export const marketSlice = createSlice({
  name: 'market',
  initialState: {
    markets: [],
  },
  reducers: {
    setMarkets: (state, action) => {
      state.markets = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMarkets } = marketSlice.actions

export default marketSlice.reducer
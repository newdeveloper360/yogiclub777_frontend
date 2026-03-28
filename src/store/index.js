import { configureStore } from '@reduxjs/toolkit';
import appDataReducer from "./features/appData/appDataSlice";
import marketSlice from "./features/markets/marketSlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    markets: marketSlice
  },
})
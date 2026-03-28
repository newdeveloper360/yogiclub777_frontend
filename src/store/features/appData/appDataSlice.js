import { createSlice } from '@reduxjs/toolkit'

export const appDataSlice = createSlice({
  name: 'appData',
  initialState: {
    appData: {},
    readNotifications: localStorage.getItem("readNotifications") || 0
  },
  reducers: {
    setAppData: (state, action) => {
      state.appData = action.payload;
    },
    setReadNotifications: (state, action) => {
      state.readNotifications = action.payload;
    },
    setAuthDataUsersSingleValue:(state, action)=>{
      state.appData.user[action.payload.key] = action.payload.value
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAppData, setReadNotifications, setAuthDataUsersSingleValue } = appDataSlice.actions

export default appDataSlice.reducer
import { configureStore } from "@reduxjs/toolkit"
import { mainSlice } from "./main.slice"

export const store = configureStore({
    reducer: {
        main: mainSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    })
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
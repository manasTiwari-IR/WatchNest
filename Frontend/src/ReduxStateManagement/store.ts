import { configureStore } from '@reduxjs/toolkit';
import UserDataSlice from './varSlice.ts';

const store = configureStore({
    reducer: {
        userData: UserDataSlice,
    },
});

export default store;
import { configureStore } from '@reduxjs/toolkit';
import UserDataSlice from './varSlice.ts';
import VerifyRefreshTokenSlice from './responseSlice.ts';

const store = configureStore({
    reducer: {
        userData: UserDataSlice,
        verifyRefreshToken: VerifyRefreshTokenSlice
    },
});

export default store;
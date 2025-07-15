import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface VerifyRefreshTokenResponse {
    val: boolean;
}

const VerifyRefreshTokenInitialState: VerifyRefreshTokenResponse = {
    val: false
}

export const VerifyRefreshTokenSlice = createSlice({
    name: "verifyRefreshToken",
    initialState: VerifyRefreshTokenInitialState,
    reducers: {
        setVerifyRefreshToken: (state, action: PayloadAction<VerifyRefreshTokenResponse>) => {
            state.val = action.payload.val;
        },
        clearVerifyRefreshToken: (state) => {
            state.val = false;
        }
    }
});

export const { setVerifyRefreshToken, clearVerifyRefreshToken } = VerifyRefreshTokenSlice.actions;
export default VerifyRefreshTokenSlice.reducer;
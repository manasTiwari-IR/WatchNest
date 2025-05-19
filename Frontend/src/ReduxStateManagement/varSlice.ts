import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserData {
    data?: string;
    key?: string;
}

const initialState: UserData = {
    data: undefined,
    key: undefined
}
export const UserDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserData>) => {
            state.data = action.payload.data;
            state.key = action.payload.key;
        },
        clearUserData: (state) => {
            state.data = undefined;
            state.key = undefined;
        }
    }
});

export const { setUserData, clearUserData } = UserDataSlice.actions;
export default UserDataSlice.reducer;
import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

/*
|--------------------------------------------------------------------------
| LOAD USER FROM STORAGE
|--------------------------------------------------------------------------
*/

const savedUserInfo =
    localStorage.getItem(
        "userInfo"
    );

let userFromStorage = null;

try {
    if (savedUserInfo) {
        const parsedUserInfo =
            JSON.parse(
                savedUserInfo
            );

        userFromStorage =
            parsedUserInfo.user ||
            parsedUserInfo;
    }
} catch (error) {
    console.error(
        "Error reading userInfo from localStorage:",
        error
    );

    localStorage.removeItem(
        "userInfo"
    );
}

/*
|--------------------------------------------------------------------------
| GUEST ID
|--------------------------------------------------------------------------
*/

const storedGuestId =
    localStorage.getItem(
        "guestId"
    );

const initialGuestId =
    storedGuestId ||
    `guest_${Date.now()}`;

localStorage.setItem(
    "guestId",
    initialGuestId
);

/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/

const initialState = {
    user: userFromStorage,

    /*
    |--------------------------------------------------------------------------
    | Logged-in user ID for cart operations.
    | Guest ID always exists, but cart ops must ignore it when user exists.
    |--------------------------------------------------------------------------
    */

    userId: userFromStorage?._id || null,
    guestId: initialGuestId,

    loading: false,
    error: null,
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const loginUser =
    createAsyncThunk(
        "auth/loginUser",
        async (
            userData,
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                        userData
                    );

                console.log(
                    "LOGIN RESPONSE:",
                    response.data
                );

                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(
                        response.data
                    )
                );

                if (
                    response.data
                        .token
                ) {
                    localStorage.setItem(
                        "userToken",
                        response
                            .data
                            .token
                    );
                }

                return response.data.user;
            } catch (error) {
                console.error(
                    "Login error:",
                    error.response
                        ?.data ||
                        error.message
                );

                return rejectWithValue(
                    error.response
                        ?.data || {
                        message:
                            "Login failed",
                    }
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export const registerUser =
    createAsyncThunk(
        "auth/registerUser",
        async (
            userData,
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                        userData
                    );

                console.log(
                    "REGISTER RESPONSE:",
                    response.data
                );

                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(
                        response.data
                    )
                );

                if (
                    response.data
                        .token
                ) {
                    localStorage.setItem(
                        "userToken",
                        response
                            .data
                            .token
                    );
                }

                return response.data.user;
            } catch (error) {
                console.error(
                    "Registration error:",
                    error.response
                        ?.data ||
                        error.message
                );

                return rejectWithValue(
                    error.response
                        ?.data || {
                        message:
                            "Registration failed",
                    }
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| AUTH SLICE
|--------------------------------------------------------------------------
*/

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        logout: (state) => {
            state.user = null;
            state.userId = null;
            state.error = null;

            /*
            |--------------------------------------------------------------------------
            | Generate a NEW guest ID after logout.
            |--------------------------------------------------------------------------
            */

            state.guestId =
                `guest_${Date.now()}`;

            localStorage.removeItem(
                "userInfo"
            );

            localStorage.removeItem(
                "userToken"
            );

            localStorage.setItem(
                "guestId",
                state.guestId
            );
        },

        generateNewGuestId: (
            state
        ) => {
            state.guestId =
                `guest_${Date.now()}`;

            localStorage.setItem(
                "guestId",
                state.guestId
            );
        },
    },

    extraReducers: (
        builder
    ) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | LOGIN
            |--------------------------------------------------------------------------
            */

            .addCase(
                loginUser.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                loginUser.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.error = null;

                    state.user =
                        action.payload;
                    state.userId =
                        action.payload?._id || null;
                }
            )

            .addCase(
                loginUser.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload
                            ?.message ||
                        "Invalid email or password";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | REGISTER
            |--------------------------------------------------------------------------
            */

            .addCase(
                registerUser.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                registerUser.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.error = null;

                    state.user =
                        action.payload;
                    state.userId =
                        action.payload?._id || null;
                }
            )

            .addCase(
                registerUser.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload
                            ?.message ||
                        "Registration failed";
                }
            );
    },
});

export const {
    logout,
    generateNewGuestId,
} = authSlice.actions;

export default authSlice.reducer;